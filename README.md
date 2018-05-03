# nativescript-wikitude

[![npm version](https://badge.fury.io/js/nativescript-wikitude.svg)](http://badge.fury.io/js/nativescript-wikitude)

[![NPM](https://nodei.co/npm/nativescript-wikitude.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nativescript-wikitude/)

Provides nativescript access to Wikitude AR.

Versioning is as follows ${wikitude-version}-${plugin-version}
example : `7.2.1-1.1.0`  is Wikitude Version 7.2.1, Plugin version 1.1.0. 

Screenshots coming soon!
## Prerequisites / Requirements

### Permissions
before you can use this plugin you should ensure your application has permissions for Camera and Location, for an easy way to do this on both android and ios, you can make use of this plugin [@spartadigital/nativescript-permissions](https://bitbucket.org/SD-CLIENTPROJ/nativescript-permissions)

### Running the Demo

WE include a very basic AR Sample in the Demo app,

but if you want to check something a bit more advanced from  [wikitude examples](https://github.com/Wikitude/wikitude-sdk-samples) and place them in [`demo/app/wikitude`](demo/app/WikitudeExamples)... Then update the URL Reference in either the `items.component.ts` for Nativescript-angular or the `main-view-model.ts` in Regular Nativescript. 

and then go and grab a Trial License from [Wikitude's Website](http://www.wikitude.com/developer/licenses) and place it in [`demo/app/main-view-model.ts`](demo/app/main-view-model.ts) on line 13

## Installation

to install for your project you can use :

```javascript
tns plugin add nativescript-wikitude
```

for Nativescript Angular Projects you will need to import the Element in your `app.component.ts`
```javascript
    import { Wikitude } from 'nativescript-wikitude';
    // ...snip....
    registerElement('Wikitude', () => Wikitude);
```

and then in your `ar.component.html` :
```html
    <Wikitude [url]="WikitudeURL" 
              (WorldLoaded)="onWorldLoaded($event)" 
              (JSONReceived)="onJSON($event)">
    </Wikitude>
```
and in your `ar.component.ts`: 
```javascript
    import { Wikitude } from 'nativescript-wikitude';

    // ...snip...

    WikitudeInstance: Wikitude;
    WikitudeURL: string = "~/wikitude_world/index.html";

    onWorldLoaded($event) {
        this.WikitudeInstance = $event.owner; // or you can use Angular's ViewChild
    }

    onJSON($event) {
        console.log(JSON.stringify($event.data));
    }

    // ...snip...
```
and somewhere in your application you will need to define the wikitude license, you can get one from wikitude (free trial license)

```javascript
    (global as any).wikitudeLicense: string = "YOUR_LICENSE_KEY_HERE"
```

And Voila! you have Wikitude AR working in your Nativescript Application!

## Usage 
 
### using your own location provider

by default this plugin has a basic Location Provider, if this does not suit your purpose, you can disable it once it is fully loaded, with the following code :

```javascript

    onWorldLoaded($event) {
        this.WikitudeInstance = $event.owner; // or you can use Angular's ViewChild
        this.WikitudeInstance.disableLocationProvider();
    }

```
Once Disabled, Geo-location based AR will not work unless you provide your own location, this can be achieved with the following
```javascript
    this.WikitudeInstance.setLocation({ latitude, longitude, altitude, accuracy });
```
this is useful if you want a single location state.

once you have disabled it you can re-enable it with the following :
```javascript
    this.WikitudeInstance.enableLocationProvider();
```

## TODO

 - Plugins API Exposure, not sure how to go about this, Wikitude allows Plugins, built in CPP to be used, and linked using their Plugin's API (an Example of a plugin would be face recognition). I'm unsure how to go about allowing users to do this. any advice would be appreciated... 
 - Detecting if Device needs Calibration: Currently being held back by Android causing a crash when i try to listen to this event.
 - Camera Events: Could be useful for the Developer to check for the Camera Open, Closed, and any Crashes.
 - a better way to set the Wikitude LicenseKey and Required Features. 
## API

### Properties 
| Property | Default value | Description |
| --- | --- | ---|
| url | `""` | the URL of the Wikitude "ARWorld" |
| features | ` Features.ImageTracking | Features.InstantTracking | ObjectTracking | GeoTracking ` | The Required Features you need, this is *experimental* and may not work |

### Functions
| Function | Arguments | Description |
| --- | --- | --- |
| setLocation() | `{ latitude: number, longitude: number, altitude: number, accuracy: number }` | sets the location in the ARWorld |
| hasFeature() | `feature : number`| checks if your device can support said features (or if your license supports it) |
| loadUrl() | `url: string` |loads the URL in the Wikitude WebView |
| reload() |  | reloads the current Wikitude WebView |
| clearCache() | | clears the wikitude Cache |
| toggleFlash() | | Toggles the Devices Flash-light |
| switchCamera() | | switches the Camera that wikitude uses |
| captureScreen() | `captureWebViewContent: boolean` | captures the current view, can also capture the webview content |
| disableLocationProvider() | | disables the location Provider (you will need to provide your own for GEO/POI's to work) |
| enableLocationProvider() | |  enables the location Provider |

### Events
| Event | Description | Type |
| --- | --- | ---|
| WorldLoadSuccess | Fires when the ARWorld Loads Successfully | `WorldLoadSuccessEventData` |
| WorldLoadFail | Fires if an Error Occurs while loading the AR World | `WorldLoadFailedEventData` |
| JSONReceived | Fires when the ARWorld sends a JSON Object | `JSONReceivedEventData` |
| ScreenCaptureSuccess | fires when the screen is captured | `ScreenCaptureSuccessEventData` |
| ScreenCaptureFail | fires when wikitude fails to capture the screen | `ScreenCaptureFailedEventData` |

all can be imported from the index.d.ts.
## License

Wikitude is (c) Wikitude GmbH Before using see their [End-User License Agreement](http://www.wikitude.com/doc/EULA_Wikitude_1.1.pdf)

Apache License Version 2.0, January 2004
