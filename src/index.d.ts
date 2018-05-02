import { Common, IWikitudeEventNames, IWikitudeEventListener, IWikitudeFunctions } from './wikitude.common';

import { WikitudeFeatures as FeaturesIOS } from './wikitude.ios';
import { WikitudeFeatures as FeaturesAndroid} from './wikitude.android';
import { EventData } from 'tns-core-modules/ui/page/page';
import { ImageSource } from 'tns-core-modules/image-source';

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
