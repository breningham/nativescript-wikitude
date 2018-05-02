import { ContentView, Property } from 'tns-core-modules/ui/content-view';
import { fromNativeSource } from 'tns-core-modules/image-source';
import { isIOS, isAndroid } from 'tns-core-modules/platform/platform';
import * as app from 'tns-core-modules/application';

import { ScreenCaptureSuccessEventData, ScreenCaptureFailedEventData, JSONReceivedEventData, WorldLoadFailedEventData, WorldLoadSuccessEventData } from '.';

export class Common extends ContentView implements IWikitudeEventListener {

  static EVENTS: IWikitudeEventNames = {
    WORLD_LOAD_FAIL: 'WorldLoadFail',
    WORLD_LOAD_SUCCESS: 'WorldLoadSuccess',
    JSON_OBJECT_RECEIVED: 'JSONReceived',
    SCREEN_CAPTURED: 'ScreenCaptureSuccess',
    SCREEN_CAPTURE_FAIL: 'ScreenCaptureFail',
    CAMERA_OPENED: 'CameraOpened',
    CAMERA_CLOSED: 'CameraClosed',
    CAMERA_ABORTED: 'CameraAborted',
    COMPASS_ACCURACY_CHANGE: 'CompassAccuracyChanged',
    SENSOR_SERVICE_STARTED: 'SensorServiceStarted',
    SENSOR_SERVICE_STOPPED: 'SensorServiceStopped'
  };

  _android: any;
  _ios: any;

  public get nativeView() {
    if (isIOS) {
      return this.ios;
    } else {
      return this.android;
    }
  }

  constructor() {
    super();
  }

  onUnloaded() {
    this.log('OnUnloaded');
    ContentView.prototype.onUnloaded.call(this);
  }

  onWorldLoadSuccess(nav) {
    this.log("[EVENT]", Common.EVENTS.WORLD_LOAD_SUCCESS, 'Loaded : ', nav);

    this.notify<WorldLoadSuccessEventData>({
      eventName: Common.EVENTS.WORLD_LOAD_SUCCESS,
      object: this as any,
      data: {
        navigation: nav,
      }
    });
  }

  onWorldLoadFailed(nav, error) {
    this.log("[EVENT]", Common.EVENTS.WORLD_LOAD_FAIL, 'Fired : ', nav);
    this.log("[EVENT]", Common.EVENTS.WORLD_LOAD_FAIL, error);

    this.notify<WorldLoadFailedEventData>({
      eventName: Common.EVENTS.WORLD_LOAD_FAIL,
      object: this as any,
      data: {
        navigation: nav,
        error: error
      }
    });
  }

  onJSONObjectReceived(data: any) {
    this.log('JSON Received', data);
    this.notify<JSONReceivedEventData>({
      eventName: Common.EVENTS.JSON_OBJECT_RECEIVED,
      object: this as any,
      data: {
        json: data
      }
    });
  }

  onCameraOpen() {
    // this._android.onCameraOpen();
    this.log('Camera Open');
    this.notify({
      eventName: Common.EVENTS.CAMERA_OPENED,
      object: this,
    });
  }

  onCameraClose() {
    // this._android.onCameraReleased();
    this.log('Camera Closed');
    this.notify({
      eventName: Common.EVENTS.CAMERA_CLOSED,
      object: this,
      data: {}
    });
  }

  onCameraAborted() {
    // this._android.onCameraOpenAbort();
    this.log('[EVENT]', 'Camera Aborted');
    this.notify({
      eventName: Common.EVENTS.CAMERA_ABORTED,
      object: this,
      data: {}
    });
  }

  onScreenCaptured(bitmap: android.graphics.Bitmap|UIImage) {
    this.log('[EVENT]', Common.EVENTS.SCREEN_CAPTURED);
    this.notify<ScreenCaptureSuccessEventData>({
      eventName: Common.EVENTS.SCREEN_CAPTURED,
      object: this as any,
      data: fromNativeSource(bitmap)
    });
  }

  onScreenCaptureFailed(error) {
    this.log('[EVENT]', Common.EVENTS.SCREEN_CAPTURE_FAIL);
    this.notify<ScreenCaptureFailedEventData>({
      eventName: Common.EVENTS.SCREEN_CAPTURE_FAIL,
      object: this as any,
      data: {
        error
      }
    });
  }

  onCompassAccuracyChanged(accuracy: number) {
    this.log('[EVENT]', Common.EVENTS.COMPASS_ACCURACY_CHANGE);
    this.notify({
      eventName: Common.EVENTS.COMPASS_ACCURACY_CHANGE,
      object: this,
      data: {
        accuracy
      }
    });
  }

  onSensorServiceStarted() {
    this.log('[EVENT]', Common.EVENTS.SENSOR_SERVICE_STARTED);
    this.notify({
      eventName: Common.EVENTS.SENSOR_SERVICE_STARTED,
      object: this
    });
  }

  onSensorServiceStopped() {
    this.log('[EVENT]', Common.EVENTS.SENSOR_SERVICE_STOPPED);
    this.notify({
      eventName: Common.EVENTS.SENSOR_SERVICE_STOPPED,
      object: this,
    });
  }

  public log(...args: any[]) {
    console.log('[nativescript-wikitude]', args.join(' '));
  }
}

/** @deprecated Not Needed, will be removed in future updates! */
export const LicenseProperty = new Property<Common, string>({
  name: 'license'
});

LicenseProperty.register(Common);

export const UrlProperty = new Property<Common, string>({
  name: 'url'
});

UrlProperty.register(Common);

/** TODO: Implement ability to change the required Features... */
export const FeaturesProperty = new Property<Common, number>({
  name: 'features'
});

FeaturesProperty.register(Common);

export interface IWikitudeEventNames {
  WORLD_LOAD_SUCCESS: string;
  WORLD_LOAD_FAIL: string;
  JSON_OBJECT_RECEIVED: string;
  SCREEN_CAPTURED: string;
  SCREEN_CAPTURE_FAIL: string;
  CAMERA_OPENED: string;
  CAMERA_CLOSED: string;
  CAMERA_ABORTED: string;
  COMPASS_ACCURACY_CHANGE: string;
  SENSOR_SERVICE_STOPPED: string;
  SENSOR_SERVICE_STARTED: string;
}

export interface IWikitudeFunctions {
  setLocation(latitude: number, longitude: number, altitude?: number, accuracy?: number): void;
  loadUrl(urlString: string, requiredFeatures?: number): void;
  captureScreen(captureWebViewContent: boolean): void;
  disableLocationProvider(): void;
  runJavascript(js: string): void;
  enableLocationProvider(): void;
  switchCamera(): void;
  toggleFlash(): void;
  clearCache(): void;
  reload(): void;
}

export interface IWikitudeEventListener {
  onWorldLoadSuccess(url: string): void;
  onWorldLoadFailed(url: string, reason: any): void;
  onJSONObjectReceived(json: any): void;
  onScreenCaptured(image: any): void;
  onScreenCaptureFailed(reason: any): void;
  onCameraOpen(): void;
  onCameraClose(): void;
  onCameraAborted(): void;
  onCompassAccuracyChanged(currentAccuracy: number): void;
  onSensorServiceStart?: () => void;
  onSensorServiceStopped?: () => void;
}

