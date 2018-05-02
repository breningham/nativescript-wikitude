/// <reference path="./references.d.ts"/>

import { Common, LicenseProperty, UrlProperty, FeaturesProperty, IWikitudeFunctions } from './wikitude.common';
import { on as AddEventListener, off as RemoveEventListener, suspendEvent, resumeEvent, lowMemoryEvent } from 'tns-core-modules/application';
import { knownFolders } from 'tns-core-modules/file-system/file-system';
import { Property } from 'tns-core-modules/ui/core/view';

export class WikitudeDelegate extends NSObject {

    public static ObjCProtocols = [ WTArchitectViewDelegate ];
    private owner: WeakRef<Wikitude> = null;

    public get Owner(): Wikitude {
        return this.owner.get();
    }

    public initWithOwner(owner: Wikitude) {
        const delegate = new WikitudeDelegate();
        delegate.owner = new WeakRef(owner);
        return delegate;
    }

    architectViewDidFinishLoadArchitectWorldNavigation(architectView, navigation) {
        this.Owner.log('[DELEGATE]', 'didFinishLoading');
        if (this.Owner) {
            this.Owner.onWorldLoadSuccess(navigation);
        }
    }

    architectViewDidFailToLoadArchitectWorldNavigationWithError(architectView, navigation, error: NSError) {
        this.Owner.log('[DELEGATE]', 'didFinishLoadingWithErrors', error.description);
        if (this.Owner) {
            this.Owner.onWorldLoadFailed(navigation, error);
        }
    }

    architectViewReceivedJSONObject(architectView: any, data: NSDictionary<string, any>) {
        const dictionaryToJson = (dict: NSDictionary<any, any>) => {
            const result = {};
            if (dict instanceof NSDictionary) {
                for (let i = 0, n = dict.allKeys.count; i < n; i++) {
                    const key = dict.allKeys.objectAtIndex(i);
                    const item = dict.objectForKey(key);

                    if (item instanceof NSDictionary) {
                        result[key] = dictionaryToJson(item);
                    } else {
                        result[key] = item;
                    }
                }
            }

            return result;
        };

        const json = dictionaryToJson(data);

        if (this.Owner) {
            this.Owner.onJSONObjectReceived(json);
        }
    }

    architectViewDidCaptureScreenWithContext(architectView: any, context: NSDictionary<string, any>) {
        const imageData = context.objectForKey('kWTScreenshotImageKey');

        if (this.Owner) {
            this.Owner.onScreenCaptured(imageData);
        }
    }

    architectViewdidFailCaptureScreenWithError(error: any) {
        if (this.Owner) {
            this.Owner.onScreenCaptureFailed(error);
        }
    }

}

export class Wikitude extends Common implements IWikitudeFunctions {

    public hasStarted: boolean = false;

    public Delegate: WikitudeDelegate;
    public MotionManager: CMMotionManager;

    ios: WTArchitectView;

    private licenseKey: string = (global as any).wikitudeLicense || '';
    private url: string;
    private features: number;
    private defaultFeatures: number = Features.GeoTracking | Features.ImageTracking | Features.InstantTracking | Features.ObjectTracking;
    private hasLoaded: boolean;
    private isLicensed: boolean;
    private config: any;
    private isFlashEnabled: boolean = false;
    private wikitudeConfig: any;

    private boundStart = this.start.bind(this);
    private boundStop = this.stop.bind(this);

    createNativeView() {
        this.hasLoaded = false;
        this.isLicensed = false;

        this.Delegate = (WikitudeDelegate.alloc() as WikitudeDelegate).initWithOwner(this);
        this.MotionManager = new CMMotionManager();
        this._ios = new WTArchitectView({ frame: CGRectZero, motionManager: this.MotionManager});
        this._ios.delegate = this.Delegate;

        if (this.licenseKey) {
            this._ios.setLicenseKey(this.licenseKey);
            this.isLicensed = true;
        }

        return this._ios;
    }

    initNativeView() {
        this.log('initNativeView');
        this.start();
        AddEventListener(resumeEvent, this.boundStart);
        AddEventListener(suspendEvent, this.boundStop);
    }

    disposeNativeView() {
        this.log('disposeNativeView');
        RemoveEventListener(resumeEvent, this.boundStart);
        RemoveEventListener(suspendEvent, this.boundStop);

        this.clearCache();
        this.stop();
    }

    start() {
        this.log('starting wikitude', Date.now());
        if (this.isRunning()) {
            this.log('wikitude is running, skipping start()');
            return;
        }
        this._ios.startCompletion((config) => {
            this.wikitudeConfig = config;
        }, (isRunning, error) => {
            this.hasStarted = isRunning;

            if (error) {
                this.log('[ERROR]', error);
            }
        });
    }

    stop() {
        this.log('stopping wikitude', Date.now());
        if (!this.isRunning()) {
            this.log('wikitude is not running, skipping stop()');
            return;
        }
        this._ios.stop();
    }

    restart() {
        this.log ('restarting...');
        if ( this.isRunning() ) {
            this.stop();
        }

        this.start();
    }

    onUnloaded() {
        super.onUnloaded();
        this.stop();
    }

    //#region Wikitude Functions

    hasFeature(feature) {
        return !!WTArchitectView.isDeviceSupportedForRequiredFeaturesError(feature);
    }

    runJavascript(jsString: string) {
        this._ios.callJavaScript(jsString);
    }

    loadUrl(urlString, features: number = this.features) {
        this.hasLoaded = false;
        this.url = urlString;

        if (!this._ios) {
            return;
        }

        let realUrl: NSURL;

        if (urlString.indexOf('~/') === 0) {
            urlString = urlString.replace('~/', `${knownFolders.currentApp().path}/`);
            realUrl = NSURL.fileURLWithPath(urlString.trim());
        } else {
            realUrl = NSURL.URLWithString(urlString.trim());
        }

        if (typeof features === 'undefined') {
            features = this.defaultFeatures;
        }

        this._ios.loadArchitectWorldFromURLWithRequiredFeatures(realUrl, features);
    }

    reload() {
        if (!this.url) {
            throw new Error('URL is invalid');
        }
        this.loadUrl(this.url, this.features);
    }

    setLocation(latitude: number, longitude: number, accuracy: number);
    setLocation(latitude: number, longitude: number, altitude?: number, accuracy?: number) {
        if (!this._ios) {
            return;
        }

        if (altitude && accuracy && this._ios.injectLocationWithLatitudeLongitudeAltitudeAccuracy) {
            this._ios.injectLocationWithLatitudeLongitudeAltitudeAccuracy(latitude, longitude, altitude, accuracy);
            return;
        }

        if (!altitude && this._ios.injectLocationWithLatitudeLongitudeAccuracy) {
            this._ios.injectLocationWithLatitudeLongitudeAccuracy(latitude, longitude, accuracy);
            return;
        }

        this.log('[ERROR]', 'Wikitude SDK is not loaded');
    }

    disableLocationProvider() {
        this._ios.setUseInjectedLocation(true);
    }

    enableLocationProvider() {
        this._ios.setUseInjectedLocation(false);
    }

    captureScreen(captureWebViewContent: boolean = false, justSave: boolean = false ): void {
        const captureMode = captureWebViewContent ? WTScreenshotCaptureMode.CamAndWebView : WTScreenshotCaptureMode.Cam;
        const saveMode = justSave ? WTScreenshotSaveMode.PhotoLibrary : WTScreenshotSaveMode.Delegate;
        const options = justSave ? WTScreenshotSaveOptions.Option_CallDelegateOnSuccess : WTScreenshotSaveOptions.Option_None;
        console.log( ' using CaptureMode ' + ( captureMode ===  WTScreenshotCaptureMode.CamAndWebView ? ' WTScreenshotCaptureMode.WTScreenshotCaptureMode_CamAndWebView' : 'WTScreenshotCaptureMode.WTScreenshotCaptureMode_Cam' ) );
        this._ios.captureScreenWithModeUsingSaveModeSaveOptionsContext(captureMode, saveMode, options, null);
    }

    isRunning() {
        return !!this._ios && !!this._ios.isRunning;
    }

    clearCache() {
        this._ios.clearCache();
    }

    toggleFlash() {
        // Does not have a native method to enabled flashlight, so we need to send js to the WikitudeWorld
        this.runJavascript(`
            if ( AR.hardware.camera.flashlightAvailable ) {
                AR.hardware.camera.flashlight = !AR.hardware.camera.flashlight;
            }
        `);
    }

    switchCamera() {

        // Doesnt have a native method to switch camera's on the fly, so again, we need to send some js
        // TODO: Check if Device Supports Other Camera Positions...
        this.runJavascript(`
            console.dir(AR.hardware.camera.features);

            if ( AR.hardware.camera.position === AR.CONST.CAMERA_POSITION.BACK ) {
                AR.hardware.camera.position = AR.CONST.CAMERA_POSITION.FRONT;
            } else {
                AR.hardware.camera.position = AR.CONST.CAMERA_POSITION.BACK;
            }
        `);
    }

    registerPlugin(plugin: any): boolean {
        return this._ios.registerPluginError(plugin, NSError.alloc());
    }

    removePlugin(plugin: any): boolean {
        return this._ios.removePlugin(plugin);
    }

    removeNamedPlugin(pluginName: string): boolean {
        return this._ios.removeNamedPlugin(pluginName);
    }

    //#endregion


    [LicenseProperty.getDefault]() {
        return "";
    }

    [LicenseProperty.setNative](license: string) {
        this.licenseKey = license;

        if (!this.isLicensed && this._ios) {
            this._ios.setLicenseKey(this.licenseKey);
            this.isLicensed = true;
        }
    }

    [UrlProperty.getDefault]() {
        return "";
    }

    [UrlProperty.setNative](url: string) {
        if ( this._ios ) {
            if ( this.features ) {
                return this.loadUrl(url, this.features);
            } else {
                this.loadUrl(url);
            }
        }
    }

    [FeaturesProperty.getDefault]() {
        return this.defaultFeatures;
    }

    [FeaturesProperty.setNative]( requiredFeatures: number ) {

        this.log( 'Required Features :', requiredFeatures );

        if ( requiredFeatures && Array.isArray(requiredFeatures) ) {
           this.features = requiredFeatures;
        }
    }

}

export enum WikitudeFeatures {
    ImageTracking = 1 << 0,
    InstantTracking = 1 << 2,
    ObjectTracking = 1 << 3,
    GeoTracking = 1 << 6
}

export class Features {
    static ImageTracking: number = 1 << 0;
    static InstantTracking: number =  1 << 2;
    static ObjectTracking: number = 1 << 3;
    static GeoTracking: number = 1 << 6;
}