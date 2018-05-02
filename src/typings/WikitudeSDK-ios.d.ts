
declare class WTArchitectStartupConfiguration extends WTStartupConfiguration {

	static alloc(): WTArchitectStartupConfiguration; // inherited from NSObject

	static new(): WTArchitectStartupConfiguration; // inherited from NSObject

	static transferArchitectStartupConfigurationToArchitectStartupConfiguration(sourceArchitectStartupConfiguration: WTArchitectStartupConfiguration, destinationArchitectStartupConfiguration: WTArchitectStartupConfiguration): void;

	desiredHeadingFilter: number;

	desiredLocationAccuracy: number;

	desiredLocationDistanceFilter: number;

	disableWebViewScrollAndZoom: boolean;

	webViewAllowsInlineMediaPlayback: boolean;

	webViewAllowsLinkPreview: boolean;

	webViewAllowsPictureInPictureMediaPlayback: boolean;

	webViewDataDetectorTypes: UIDataDetectorTypes;

	webViewKeyboardDisplayRequiresUserAction: boolean;

	webViewMediaPlaybackAllowsAirPlay: boolean;

	webViewMediaPlaybackRequiresUserAction: boolean;

	webViewsScrollViewContentInsetAdjustmentBehavior: UIScrollViewContentInsetAdjustmentBehavior;
}

declare class WTArchitectView extends UIView {

	static SDKBuildInformation(): WTSDKBuildInformation;

	static alloc(): WTArchitectView; // inherited from NSObject

	static appearance(): WTArchitectView; // inherited from UIAppearance

	static appearanceForTraitCollection(trait: UITraitCollection): WTArchitectView; // inherited from UIAppearance

	static appearanceForTraitCollectionWhenContainedIn(trait: UITraitCollection, ContainerClass: typeof NSObject): WTArchitectView; // inherited from UIAppearance

	static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(trait: UITraitCollection, containerTypes: NSArray<typeof NSObject>): WTArchitectView; // inherited from UIAppearance

	static appearanceWhenContainedIn(ContainerClass: typeof NSObject): WTArchitectView; // inherited from UIAppearance

	static appearanceWhenContainedInInstancesOfClasses(containerTypes: NSArray<typeof NSObject>): WTArchitectView; // inherited from UIAppearance

	static isDeviceSupportedForRequiredFeaturesError(requiredFeatures: WTFeatures): boolean;

	static new(): WTArchitectView; // inherited from NSObject

	static sdkVersion(): string;

	debugDelegate: WTArchitectViewDebugDelegate;

	delegate: WTArchitectViewDelegate;

	readonly isRunning: boolean;

	requiredFeatures: WTFeatures;

	shouldAuthorizeRestrictedAPIs: boolean;

	shouldWebViewRotate: boolean;

	constructor(o: { frame: CGRect; motionManager: CMMotionManager; });

	callJavaScript(javaScript: string): void;

	captureScreenWithModeUsingSaveModeSaveOptionsContext(captureMode: WTScreenshotCaptureMode, saveMode: WTScreenshotSaveMode, options: WTScreenshotSaveOptions, context: NSDictionary<any, any>): void;

	clearCache(): void;

	cullingDistance(): number;

	initWithFrameMotionManager(frame: CGRect, motionManagerOrNil: CMMotionManager): this;

	injectLocationWithLatitudeLongitudeAccuracy(latitude: number, longitude: number, accuracy: number): void;

	injectLocationWithLatitudeLongitudeAltitudeAccuracy(latitude: number, longitude: number, altitude: number, accuracy: number): void;

	isRotatingToInterfaceOrientation(): boolean;

	isUsingInjectedLocation(): boolean;

	loadArchitectWorldFromURL(architectWorldURL: NSURL): WTNavigation;

	loadArchitectWorldFromURLWithRequiredFeatures(architectWorldURL: NSURL, requiredFeatures: WTFeatures): WTNavigation;

	reloadArchitectWorld(): void;

	setCullingDistance(cullingDistance: number): void;

	setLicenseKey(licenseKey: string): void;

	setShouldRotateToInterfaceOrientation(shouldAutoRotate: boolean, interfaceOrientation: UIInterfaceOrientation): void;

	setUseInjectedLocation(useInjectedLocation: boolean): void;

	startCompletion(startupHandler: (p1: WTArchitectStartupConfiguration) => void, completionHandler: (p1: boolean, p2: NSError) => void): void;

	stop(): void;
}

interface WTArchitectViewDebugDelegate extends NSObjectProtocol {

	architectViewDidEncounterInternalError(architectView: WTArchitectView, error: NSError): void;
}
declare var WTArchitectViewDebugDelegate: {

	prototype: WTArchitectViewDebugDelegate;
};

interface WTArchitectViewDelegate extends NSObjectProtocol {

	activityItemsForURLTitleUsedBySafariViewController?(URL: NSURL, title: string, safariViewController: SFSafariViewController): NSArray<UIActivity>;

	architectViewDidCaptureScreenWithContext?(architectView: WTArchitectView, context: NSDictionary<any, any>): void;

	architectViewDidFailCaptureScreenWithError?(architectView: WTArchitectView, error: NSError): void;

	architectViewDidFailToAuthorizeRestrictedAppleiOSSDKAPIs?(architectView: WTArchitectView, error: NSError): void;

	architectViewDidFailToLoadArchitectWorldNavigationWithError?(architectView: WTArchitectView, navigation: WTNavigation, error: NSError): void;

	architectViewDidFinishLoadArchitectWorldNavigation?(architectView: WTArchitectView, navigation: WTNavigation): void;

	architectViewDidPresentViewControllerOnViewController?(architectView: WTArchitectView, presentedViewController: UIViewController, presentingViewController: UIViewController): void;

	architectViewDidSwitchToActiveCaptureDevicePosition?(architectView: WTArchitectView, activeCaptureDevicePosition: AVCaptureDevicePosition): void;

	architectViewFinishedDeviceSensorsCalibration?(architectView: WTArchitectView): void;

	architectViewInvokedURL?(architectView: WTArchitectView, URL: NSURL): void;

	architectViewNeedsDeviceSensorCalibration?(architectView: WTArchitectView): void;

	architectViewReceivedJSONObject?(architectView: WTArchitectView, jsonObject: NSDictionary<any, any>): void;

	architectViewWillPresentViewControllerOnViewController?(architectView: WTArchitectView, presentedViewController: UIViewController, presentingViewController: UIViewController): void;

	presentViewControllerForArchitectView?(viewController: UIViewController, architectView: WTArchitectView): boolean;

	presentingViewControllerForViewControllerPresentationInArchitectView?(architectView: WTArchitectView): UIViewController;

	shouldArchitectViewPresentSafariViewControllerInReaderModeIfAvailable?(architectView: WTArchitectView): boolean;

	shouldArchitectViewPresentViewControllerAnimated?(architectView: WTArchitectView, viewController: UIViewController): boolean;
}
declare var WTArchitectViewDelegate: {

	prototype: WTArchitectViewDelegate;
};

declare class WTAuthorizationRequestManager extends NSObject {

	static alloc(): WTAuthorizationRequestManager; // inherited from NSObject

	static humanReadableDescriptionForUnauthorizedAppleiOSSDKAPI(unauthorizedAppleiOSSDKAPI: string): string;

	static new(): WTAuthorizationRequestManager; // inherited from NSObject

	static restrictedAppleiOSSDKAPIAuthorizationsForRequiredFeatures(requiredFeatures: WTFeatures): NSOrderedSet<number>;

	static stringFromAVFoundationAuthenticationStatus(authorizationStatus: AVAuthorizationStatus): string;

	static stringFromAuthorizationStatusForUnauthorizedAppleiOSSDKAPI(authorizationStatus: number, unauthorizedAppleiOSSDKAPI: string): string;

	static stringFromCoreLocationAuthenticationStatus(authorizationStatus: CLAuthorizationStatus): string;

	static stringFromPhotosAuthenticationStatus(authorizationStatus: PHAuthorizationStatus): string;

	isRequestingRestrictedAppleiOSSDKAPIAuthorization: boolean;

	requestRestrictedAppleiOSSDKAPIAuthorizationCompletion(requiredAppleiOSSDKAPIAuthorizations: NSOrderedSet<number>, completionHandler: (p1: boolean, p2: NSError) => void): void;
}

declare const enum WTCaptureDeviceResolution {

	SD_640x480 = 1,

	HD_1280x720 = 2,

	FULL_HD_1920x1080 = 3,

	AUTO = 4
}

declare class WTExternalCMMotionManagerDataAccessMode extends NSObject {

	static alloc(): WTExternalCMMotionManagerDataAccessMode; // inherited from NSObject

	static new(): WTExternalCMMotionManagerDataAccessMode; // inherited from NSObject

	static requiredAttitudeReferenceFrameForFeatures(requiredFeatures: WTFeatures): CMAttitudeReferenceFrame;
}

declare class WTExternalCMMotionManagerDataAccessModePull extends WTExternalCMMotionManagerDataAccessMode {

	static alloc(): WTExternalCMMotionManagerDataAccessModePull; // inherited from NSObject

	static new(): WTExternalCMMotionManagerDataAccessModePull; // inherited from NSObject

	internalDelegateUpdateInterval: number;

	constructor(o: { dataAccessDelegate: WTExternalCMMotionManagerDataAccessModePullDelegate; });

	initWithDataAccessDelegate(dataAccessDelegate: WTExternalCMMotionManagerDataAccessModePullDelegate): this;
}

interface WTExternalCMMotionManagerDataAccessModePullDelegate extends NSObjectProtocol {

	currentAccelerometerData?(): CMAccelerometerData;

	currentDeviceMotion?(): CMDeviceMotion;

	currentHeading?(): CLHeading;
}
declare var WTExternalCMMotionManagerDataAccessModePullDelegate: {

	prototype: WTExternalCMMotionManagerDataAccessModePullDelegate;
};

declare class WTExternalCMMotionManagerDataAccessModePush extends WTExternalCMMotionManagerDataAccessMode {

	static alloc(): WTExternalCMMotionManagerDataAccessModePush; // inherited from NSObject

	static new(): WTExternalCMMotionManagerDataAccessModePush; // inherited from NSObject

	accelerometerDataUpdateAvailable(accelerometerData: CMAccelerometerData): void;

	deviceMotionUpdateAvailable(deviceMotion: CMDeviceMotion): void;

	headingUpdateAvailable(heading: CLHeading): void;
}

declare const enum WTFeatures {

	Feature_ImageTracking = 1,

	Feature_InstantTracking = 4,

	Feature_ObjectTracking = 8,

	Feature_2DTracking = 1,

	Feature_3DTracking = 8,

	Feature_Geo = 64,

	Feature_PhotoLibraryScreenshotImport = 128
}

declare class WTNavigation extends NSObject implements NSCopying {

	static alloc(): WTNavigation; // inherited from NSObject

	static new(): WTNavigation; // inherited from NSObject

	readonly finalURL: NSURL;

	readonly isLoading: boolean;

	readonly originalURL: NSURL;

	readonly wasInterrupted: boolean;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;
}

declare var WTRenderingAPI_Metal: string;

declare var WTRenderingAPI_OpenGL_ES_2: string;

declare var WTRenderingAPI_OpenGL_ES_3: string;

declare const enum WTRestrictedAppleiOSSDKAPI {

	Camera = 0,

	Location = 1,

	PhotoLibrary = 2
}

declare class WTSDKBuildInformation extends NSObject {

	static alloc(): WTSDKBuildInformation; // inherited from NSObject

	static new(): WTSDKBuildInformation; // inherited from NSObject

	readonly buildConfiguration: string;

	readonly buildDate: string;

	readonly buildNumber: string;

	toJSONString(): string;
}

declare const enum WTScreenshotCaptureMode {

	Cam = 0,

	CamAndWebView = 1
}

declare const enum WTScreenshotSaveMode {

	PhotoLibrary = 1,

	BundleDirectory = 2,

	Delegate = 3
}

declare const enum WTScreenshotSaveOptions {

	Option_CallDelegateOnSuccess = 1,

	Option_SavingWithoutOverwriting = 2,

	Option_None = 0
}

declare class WTStartupConfiguration extends NSObject implements NSCopying {

	static alloc(): WTStartupConfiguration; // inherited from NSObject

	static new(): WTStartupConfiguration; // inherited from NSObject

	static transferStartupConfigurationToStartupConfiguration(sourceStartupConfiguration: WTStartupConfiguration, destinationStartupConfiguration: WTStartupConfiguration): void;

	captureDeviceFocusDistance: number;

	captureDeviceFocusMode: AVCaptureFocusMode;

	captureDeviceFocusRangeRestriction: AVCaptureAutoFocusRangeRestriction;

	captureDevicePosition: AVCaptureDevicePosition;

	captureDevicePreset: string;

	captureDeviceResolution: WTCaptureDeviceResolution;

	externalCMMotionManagerDataAccessMode: WTExternalCMMotionManagerDataAccessMode;

	shouldExcludeBinnedVideoFormats: boolean;

	shouldUseSystemDeviceSensorCalibrationDisplay: boolean;

	targetFrameRate: CMTime;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;
}

declare var WikitudeSDKVersionNumber: number;

declare var WikitudeSDKVersionString: interop.Reference<number>;

declare var kWTScreenshotBundleDirectoryKey: string;

declare var kWTScreenshotCaptureModeKey: string;

declare var kWTScreenshotImageKey: string;

declare var kWTScreenshotSaveModeKey: string;

declare var kWTUnauthorizedAppleiOSSDKAPIsKey: string;
