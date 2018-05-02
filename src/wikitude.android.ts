declare const com;

import {
    Common,
    IWikitudeFunctions,
    IWikitudeEventListener,
    LicenseProperty,
    UrlProperty,
    FeaturesProperty
} from './wikitude.common';

import * as app from 'tns-core-modules/application';
import { lowMemoryEvent, suspendEvent, resumeEvent, exitEvent, on as AddEventListener, off as RemoveEventListener } from 'tns-core-modules/application';
import { knownFolders } from 'tns-core-modules/file-system';
import { fromNativeSource, ImageSource } from 'tns-core-modules/image-source';
import { ContentView } from 'tns-core-modules/ui/content-view/content-view';


let wikitudeJsonListener,
    wikitudeWorldLoadedListener,
    wikitudeCameraLifecycleListener,
    wikitudeSensorAccuracyChangeListener,
    wikitudeCaptureScreenListener;

export const registerJsonListener = (owner: Wikitude) => {

    @Interfaces([ com.wikitude.architect.ArchitectJavaScriptInterfaceListener ])
    class JsonObjectListener extends java.lang.Object {
        constructor( public owner: Wikitude ) {
            super();

            return global.__native(this);
        }

        onJSONObjectReceived(JsonObject: org.json.JSONObject) {
            if ( this.owner ) {
                this.owner.onJSONObjectReceived(JSON.parse(JsonObject as any));
            }
        }

    }

    wikitudeJsonListener = new JsonObjectListener(owner);
};

export const registerWorldLoadedListener = (owner: Wikitude) => {

    if ( wikitudeWorldLoadedListener ) {
        return;
    }

    @Interfaces([ com.wikitude.architect.ArchitectView.ArchitectWorldLoadedListener ])
    class WorldLoadedListener extends java.lang.Object {

        constructor(private owner: Wikitude) {
            super();

            return global.__native(this);
        }

        worldLoadFailed( errorCode: number, description: string, failingUrl: string ) {
            if ( this.owner ) {
                this.owner.log(`Error ${errorCode} while Loading URL: ${failingUrl}`);
                this.owner.log(`Error Description is ${description}`);

                this.owner.onWorldLoadFailed(failingUrl, errorCode);
            }
        }

        worldWasLoaded(url: string) {
            if ( this.owner ) {
                this.owner.onWorldLoadSuccess(url);
            }
        }

    }

    wikitudeWorldLoadedListener = new WorldLoadedListener(owner);

};

export const registerCameraLifecycleListener = (owner: Wikitude) => {

    @Interfaces([ com.wikitude.architect.services.camera.CameraLifecycleListener ])
    class CameraLifecycleListener extends java.lang.Object {

        constructor(public owner: Wikitude) {
            super();

            return global.__native(this);
        }

        onCameraOpen(): void {
            if ( this.owner ) {
                this.owner.onCameraOpen();
            }
        }

        onCameraOpenAbort(): void {
            if ( this.owner ) {
                this.owner.onCameraAborted();
            }
        }

        onCameraReleased(): void {
            if ( this.owner ) {
                this.owner.onCameraClose();
            }
        }

    }

    wikitudeCameraLifecycleListener = new CameraLifecycleListener(owner);
};

export const registerSensorAccuracyChangeListener = (owner: Wikitude) => {

    if ( wikitudeSensorAccuracyChangeListener ) {
        return;
    }

    @Interfaces([com.wikitude.architect.ArchitectView.SensorAccuracyChangeListener])
    class SensorAccuracyChangeListener extends java.lang.Object {

        constructor(private owner: Wikitude) {
            super();

            return global.__native(this);
        }

        onCompassAccuracyChanged(accuracy: number) {
            if ( this.owner ) {
                this.owner.onCompassAccuracyChanged(accuracy);
            }
        }

    }

    wikitudeSensorAccuracyChangeListener = new SensorAccuracyChangeListener(owner);

};

export const registerCaptureScreenListener = (owner: Wikitude) => {

    if ( wikitudeCaptureScreenListener ) {
        return;
    }

    @Interfaces([ com.wikitude.architect.ArchitectView.CaptureScreenCallback ])
    class CaptureScreenCallback extends java.lang.Object {

        constructor(private owner: Wikitude) {
            super();

            return global.__native(this);
        }

        onScreenCaptured(bitmap: android.graphics.Bitmap) {
            if ( this.owner ) {
                this.owner.onScreenCaptured(bitmap);
            }
        }

    }

    wikitudeCaptureScreenListener = new CaptureScreenCallback(owner);

};

export class Wikitude extends Common implements IWikitudeFunctions {

    public hasStarted: boolean = false;
    public LocationProvider: LocationProvider<Wikitude>;

    public _android: any;

    private licenseKey: string = (global as any).wikitudeLicense || '';
    private url: string;
    private features: any;
    private defaultFeatures: number = Features.GeoTracking | Features.ImageTracking | Features.InstantTracking | Features.ObjectTracking;
    private hasLoaded: boolean;
    private isLicensed: boolean;
    private isDummy: boolean = false;
    private config: any;
    private isFlashEnabled: boolean = false;

    public boundStart: () => void = this.start.bind(this);
    public boundStop: () => void = this.stop.bind(this);
    public boundLowMemory: () => void = this.onLowMemory.bind(this);

    private get currentActivity() {
        return app.android.foregroundActivity || app.android.startActivity;
    }

    private get context() {
        return app.android.context;
    }

    createNativeView() {
        this.log('creating native view');
        this.hasLoaded = false;
        this.isLicensed = false;

        this.config = new com.wikitude.architect.ArchitectStartupConfiguration();
        this.config.setOrigin('ORIGIN_NATIVESCRIPT');

        if ( this.features ) {
            this.config.setFeatures( this.features );
        } else {
            this.config.setFeatures(
                com.wikitude.architect.ArchitectStartupConfiguration.Features.Geo
                | com.wikitude.architect.ArchitectStartupConfiguration.Features.ImageTracking
                | com.wikitude.architect.ArchitectStartupConfiguration.Features.InstantTracking
                | com.wikitude.architect.ArchitectStartupConfiguration.Features.ObjectTracking
            );
        }


        if (this.licenseKey) {
            this.log( 'License key is being set: ' + this.licenseKey );
            this.config.setLicenseKey(this.licenseKey);
            this.isLicensed = true;
        }

        // const delegate =  new WikitudeDelegate(this);
        this.LocationProvider = new LocationProvider<Wikitude>(this, 0, 0);

        registerJsonListener(this);
        registerWorldLoadedListener(this);
        registerCameraLifecycleListener(this);
        registerCaptureScreenListener(this);
        registerSensorAccuracyChangeListener(this);

        this._android = new com.wikitude.architect.ArchitectView(this.currentActivity);

        return this._android;
    }

    initNativeView() {
        this.log('Initialing Native View... ');

        try {
            this._android.onCreate(this.config);

            this._android.registerWorldLoadedListener(wikitudeWorldLoadedListener);
            this._android.addArchitectJavaScriptInterfaceListener(wikitudeJsonListener);
            // this._android.setCameraLifecycleListener(wikitudeCameraLifecycleListener); // Issues ATM with CameraRelease...
            // this._android.registerSensorAccuracyChangeListener(wikitudeSensorAccuracyChangeListener); // Throws Errors atm...
            this._android.onPostCreate();

        } catch (e) {
            this.log('Error while Inititating Wikitude', e.message);
            // this.createDummy();
            return;
        }

        AddEventListener(resumeEvent, this.boundStart);
        AddEventListener(suspendEvent, this.boundStop);
        AddEventListener(lowMemoryEvent, this.boundLowMemory);

        if (this.url && !this.hasLoaded) {
            this.log('finished initNativeView, launching url ' + this.url);
            this.loadUrl(this.url, this.features);
        }

        setTimeout(() => this.start());
    }

    disposeNativeView() {
        this.log('Disposing Native View');

        RemoveEventListener(resumeEvent, this.boundStart);
        RemoveEventListener(suspendEvent, this.boundStop);
        RemoveEventListener(lowMemoryEvent, this.boundLowMemory);

        if (this._android) {
            this.log('onDestroy()');
            this.clearCache();
            this._android.onDestroy();
        }
    }

    onLocationChanged(location: android.location.Location) {
        this.log('Location Changed', location);
        if (location && this._android) {
            this.log('sending location', `${location.getLatitude()}, ${location.getLongitude()}`);
            if (location.hasAltitude() && location.hasAccuracy() && location.getAccuracy() < 7) {
                this.setLocation(location.getLatitude(), location.getLongitude(), location.getAltitude(), location.getAccuracy());
            } else {
                this.setLocation(location.getLatitude(), location.getLongitude(), location.hasAccuracy ? location.getAccuracy() : 1000);
            }
        }
    }

    onLowMemory() {
        this.log('[EVENT]', 'Low Memory event called');
        this._android.onLowMemory();
    }

    onUnloaded() {
        super.onUnloaded();
        this.stop();
    }

    start() {
        this.log('Starting Wikitude Plugin', Date.now());
        if (!this.hasStarted) {
            this.hasStarted = true;
            this._android.onResume();
        }

        if (!this.LocationProvider) {
            this.LocationProvider.resume();
        }
    }

    stop() {
        if (this.LocationProvider) {
            this.log('Pausing Location Provider');
            this.LocationProvider.pause();
        }

        if (this.hasStarted) {
            this.log('onPause()');
            this._android.onPause();
            this.hasStarted = false;
        }

        if (!this.isRunning()) {
            return;
        }
    }

    isRunning(): boolean {
        return (this.hasStarted && this.hasLoaded && this._android !== null) && !this.isDummy;
    }

    restart() {
        this.log('restarting wikitude ', Date.now());
        if (this.isRunning()) {
            this.stop();
        }
        this.start();
    }

    // #region wikitude functions
    setLocation(latitude: number, longitude: number, altitude?: number, accuracy?: number) {
        this._android.setLocation(latitude, longitude, altitude, accuracy);
    }

    hasFeature(feature: number): boolean {
        if (feature === null) {
            return com.wikitude.architect.ArchitectView.isDeviceSupported(this.currentActivity);
        }

        const missingFeatures: any = com.wikitude.architect.ArchitectView.isDeviceSupported(this.currentActivity, feature);
        return !missingFeatures.areFeaturesMissing();
    }

    loadUrl(urlString: string, features?: number) {
        this.log('setting url to ', urlString);
        this.hasLoaded = false;
        this.url = urlString;

        this.features = features;
        if (!this._android || this.isDummy) {
            return;
        }
        if (urlString.indexOf("~/") === 0) {
            urlString = urlString.replace("~/", `file://${knownFolders.currentApp().path}/`);
        }
        this.log('Loading Url :', urlString);
        this._android.load(urlString);
        this.hasLoaded = true;
    }

    reload() {
        if (!this.url) {
            throw new Error("URL is null");
        }
        this.loadUrl(this.url, this.features);
    }

    runJavascript(jsString: string) {
        this._android.callJavascript(jsString);
    }

    clearCache() {
        this._android.clearCache();
    }

    toggleFlash() {
        this.isFlashEnabled = !this.isFlashEnabled;
        this._android.setFlashEnabled(this.isFlashEnabled);
    }

    captureScreen(captureWebViewContent: boolean = false) {
        let captureMode;

        if ( captureWebViewContent ) {
            captureMode = com.wikitude.architect.ArchitectView.CaptureScreenCallback.CAPTURE_MODE_CAM_AND_WEBVIEW;
        } else {
            captureMode = com.wikitude.architect.ArchitectView.CaptureScreenCallback.CAPTURE_MODE_CAM;
        }

        try {
            this._android.captureScreen(captureMode, wikitudeCaptureScreenListener);
        } catch (e) {
            this.onScreenCaptureFailed(e);
        }
    }

    switchCamera() {
        let newCameraPosition = null;
        let currentCameraPosition = this._android.getCurrentCamera();

        if (currentCameraPosition === com.wikitude.common.camera.CameraSettings.CameraPosition.FRONT) {
            newCameraPosition = com.wikitude.common.camera.CameraSettings.CameraPosition.BACK;
        } else if (currentCameraPosition === com.wikitude.common.camera.CameraSettings.CameraPosition.BACK) {
            newCameraPosition = com.wikitude.common.camera.CameraSettings.CameraPosition.FRONT;
        } else {
            newCameraPosition = com.wikitude.common.camera.CameraSettings.CameraPosition.DEFAULT;
        }

        this._android.setCameraPositionSimple(newCameraPosition);
    }
    // #endregion

    disableLocationProvider() {
        this.log('Disabling Default Location Provider');
        if (this.isRunning()) {
            this.LocationProvider.pause();
        }
    }

    enableLocationProvider() {
        this.log('Enabling Default Location Provider');
        if (this.isRunning()) {
            this.LocationProvider.resume();
        }
    }

    [LicenseProperty.getDefault]() {
        return "";
    }

    [LicenseProperty.setNative](license: string) {
        this.log('LicenseKey Updated!');
        this.log( this.isLicensed ? 'But we are already licensed so we are ignoring it!' : 'We are setting the license now!' );

        if (!this.isLicensed && this._android) {
            this.licenseKey = license;
            this.config.setLicenseKey(this.licenseKey);
            this.isLicensed = true;
        }
    }

    [UrlProperty.getDefault]() {
        return "";
    }

    [UrlProperty.setNative](url) {
        this.log('URL Property Changed', url);
        this.loadUrl(url, this.features);
    }

    [FeaturesProperty.getDefault]() {
        return this.features;
    }

    [FeaturesProperty.setNative](requiredFeatures: number[]) {
        let features: number = 0;
        for (let feature of requiredFeatures) {
            features += feature;
        }
        this.config.setFeatures(features);
        this.features = features;
    }
}

export class LocationProvider<Owner> {

    private owner: WeakRef<Owner>;

    public get Owner(): Owner {
        return this.owner.get();
    }

    private get context(): android.content.Context {
        return app.android.context;
    }

    private currentLocation: android.location.Location;
    private running: boolean = false;

    // #region Time definitions
    private time: number = 0;
    public get Time() {
        return this.time;
    }
    public set Time(time: number) {
        if (this.time === time) {
            return;
        }

        this.time = time;
        if (this.running) {
            this.restart();
        }
    }
    // #endregion

    // #region Distance definitions

    private distance: number = 0;
    public get Distance() {
        return this.distance;
    }
    public set Distance(distance: number) {
        if (this.distance === distance) {
            return;
        }

        this.distance = distance;

        if (this.running) {
            this.restart();
        }
    }

    // #endregion

    public LocationManager: android.location.LocationManager = this.context.getSystemService(android.content.Context.LOCATION_SERVICE);
    public Listener: android.location.ILocationListener = {
        onLocationChanged: function (location: any) {
            if (!this.isBetterLocation(location)) {
                return;
            }
            if (this.Owner) {
                this.Owner.onLocationChanged(location);
            }
        }.bind(this),
        onProviderDisabled: () => { },
        onProviderEnabled: () => { },
        onStatusChanged: () => { }
    };
    public LocationListener: android.location.LocationListener = new android.location.LocationListener(this.Listener);


    constructor(owner: Owner, time: number, distance: number) {

        this.owner = new WeakRef(owner);

        if (time !== 0) {
            this.Time = time || 1000;
        }

        if (distance !== 0) {
            this.Distance = distance || 1000;
        }
    }

    isBetterLocation(location: android.location.Location): boolean {
        if (this.currentLocation === null) {
            return true;
        }

        const timeDelta = location.getTime() - this.currentLocation.getTime();
        const isSignificantlyNewer = timeDelta < 60000;
        const isSignificantlyOlder = timeDelta < -60000;
        const isNewer = timeDelta > 0;

        if (isSignificantlyNewer) {
            return true;
        } else if (isSignificantlyOlder) {
            return false;
        }

        const accuracyDelta = location.getAccuracy() - this.currentLocation.getAccuracy();
        const isMoreAccurate = accuracyDelta < 0;
        const isLessAccurate = accuracyDelta > 0;
        const isSignificantlyLessAccurate = accuracyDelta > 200;
        const isFromSameProvider = this.isSameProvider(location.getProvider(), this.currentLocation.getProvider());

        if (isMoreAccurate) {
            return true;
        } else if (isLessAccurate) {
            return false;
        }

        return isNewer && isFromSameProvider && !isSignificantlyLessAccurate;
    }

    isSameProvider(currentLocation: string, oldLocation: string): boolean {
        if (currentLocation === null) {
            return oldLocation === null;
        }

        const CurrentLocation = new java.lang.String(currentLocation);
        const OldLocation = new java.lang.String(oldLocation);
        return CurrentLocation.equals(OldLocation);
    }

    setOwner(owner: any) {
        (this.Listener as any).owner = new WeakRef(owner);
    }

    private restart() {
        if (!this.running) {
            return;
        }

        this.pause();
        this.resume();
    }

    public pause() {
        if (!this.running) {
            return;
        }
        this.running = false;
        this.LocationManager.removeUpdates(this.LocationListener);
    }

    public resume() {
        if (this.running) {
            return;
        }
        this.running = true;

        this.setupEventListener(android.location.LocationManager.GPS_PROVIDER);
        this.setupEventListener(android.location.LocationManager.NETWORK_PROVIDER);
    }

    private setupEventListener(provider: string) {
        if (!this.LocationManager.isProviderEnabled(provider)) {
            return;
        }

        const lastKnownPosition = this.LocationManager.getLastKnownLocation(provider);
        if (lastKnownPosition !== null) {
            this.LocationListener.onLocationChanged(lastKnownPosition);
        }

        if (this.LocationManager.getProvider(provider) !== null) {
            this.LocationManager.requestLocationUpdates(provider, this.Time, this.Distance, this.LocationListener);
        }
    }

}

export enum WikitudeFeatures {
    ImageTracking = 2,
    InstantTracking = 4,
    ObjectTracking = 8,
    GeoTracking = 1
}

export class Features {
    static ImageTracking: number = 2;
    static InstantTracking: number = 4;
    static ObjectTracking: number = 8;
    static GeoTracking: number = 8;
}
