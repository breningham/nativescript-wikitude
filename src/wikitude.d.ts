import { EventData } from 'tns-core-modules/ui/page/page';
import { ImageSource } from 'tns-core-modules/image-source';
import { ContentView, Property } from 'tns-core-modules/ui/content-view';

declare class Common extends ContentView implements IWikitudeEventListener {
    static EVENTS: IWikitudeEventNames;
    _android: any;
    _ios: any;
    readonly nativeView: any;
    constructor();
    onUnloaded(): void;
    onWorldLoadSuccess(nav: any): void;
    onWorldLoadFailed(nav: any, error: any): void;
    onJSONObjectReceived(data: any): void;
    onCameraOpen(): void;
    onCameraClose(): void;
    onCameraAborted(): void;
    onScreenCaptured(bitmap: any): void;
    onScreenCaptureFailed(error: any): void;
    onCompassAccuracyChanged(accuracy: number): void;
    onSensorServiceStarted(): void;
    onSensorServiceStopped(): void;
    log(...args: any[]): void;
}

export declare enum FeaturesIOS {
    ImageTracking = 1,
    InstantTracking = 4,
    ObjectTracking = 8,
    GeoTracking = 64,
}

export declare enum FeaturesAndroid {
    ImageTracking = 2,
    InstantTracking = 4,
    ObjectTracking = 8,
    GeoTracking = 1
}

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

export class Wikitude extends Common implements IWikitudeFunctions {

  static EVENTS: IWikitudeEventNames;

  start(): void;
  stop(): void;
  isRunning(): boolean;
  restart(): void;

  hasFeature(feature: FeaturesIOS);
  hasFeature(feature: FeaturesAndroid);
  // Wikitude Feature Functions 

  setLocation(latitude: number, longitude: number, accuracy: number);
  setLocation(latitude: number, longitude: number, altitude: number, accuracy: number);
  
  captureScreen(captureWebViewContent: boolean): void;

  loadUrl(urlString: string, features?: FeaturesIOS): void;
  loadUrl(urlString: string, features?: FeaturesAndroid): void;
  loadUrl(urlString: string, requiredFeatures?: number): void;
  reload()
  runJavascript(js: string): void;
  clearCache(): void;
  toggleFlash(): void;
  switchCamera(): void;

  disableLocationProvider (): void;
  enableLocationProvider(): void;

}

export class ScreenCaptureSuccessEventData implements EventData {
  eventName: string;
  object: Wikitude;
  data: ImageSource;
}

export class ScreenCaptureFailedEventData implements EventData {
  eventName: string;
  object: Wikitude;
  data: {
    error: Error
  }
}

export class JSONReceivedEventData implements EventData {
  eventName: string;
  object: Wikitude;
  data: {
    json: any
  }
}

export class WorldLoadSuccessEventData implements EventData {
  eventName: string;
  object: Wikitude;
  data: {
    navigation: any
  }
}

export class WorldLoadFailedEventData implements EventData {
  eventName: string;
  object: Wikitude;
  data: {
    navigation: any;
    error: Error;
  }
}

export declare class Features {
  
  static ImageTracking: number;
  static InstantTracking: number;
  static ObjectTracking: number;
  static GeoTracking: number;
}
