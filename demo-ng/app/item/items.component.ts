import { Component, OnInit, ViewChild } from "@angular/core";

import { JSONReceivedEventData, WorldLoadSuccessEventData, WorldLoadFailedEventData, ScreenCaptureSuccessEventData, ScreenCaptureFailedEventData} from 'nativescript-wikitude';
import { alert } from 'tns-core-modules/ui/dialogs';
import * as imageSource from "tns-core-modules/image-source";

import { saveToAlbum } from '../helpers/saveImage';
import { Wikitude } from "nativescript-wikitude";
import { registerElement } from 'nativescript-angular';

registerElement('WikitudeViewer', () => Wikitude);

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {

    wikitudeInstance: Wikitude;
    wikitudeLicense: string = 'GNgLlbAL8QXtnza9NRmWmtxXSiV4ZoY5aIxzkIuql7jiRmmBkEDadPgoeeesstE9avA8aJbWiaz2pDYvVwYm4yCVYW7MYSQ3v0FFuplSk39HZ3VzHdUOfpGGI2L5PKFr/Rq5pSS6+m/halPlIo07/MzoNBffMFyUtDZDNmS2Oi5TYWx0ZWRfX4JgFh0TnMM3GD8vvixO30nAWNtL1PgWXCwphoqZWLBx44uSDH+0u3dSmwB5Qx17cf0t5Tk+C/6uPx6nb/hoHk3U0VyrEOHD6C3jA5cdT5mJpqdJLupulu0FhT0YTVJUV4HJalqokd/QaS+FP5F7Sk9EJXb9BTLhFGzJeHwXQhdCD/dKEvKnwVKQlpROzHh+MdxNsISJMf6+CVPJpd2rJqLJWP4x96Knrz6Pv8lXbJn7G7pLHqrqy7NpnIJd8A3O/Gyw5FlKYMfwbh5u8w46SsA31w7L7w1PeQFGI/LH1NmbmJkSeZ9SJA7FTkfhgXeQF1hVu0ehnOWQRSwWHDyeC9UhjejFY0w2CjPWbAkOAWyU9dK17M/gLatr2k/BuuTZgNIssH2YpTpof12sCfDhuFj+D7QFLEZDWzTv7kRdgU9gQWQBwOJcVsY8ShYANuiq9uU2zBmVdUbRiIuKeQ9Qrei4fyxDr5vSPxjx47ixg9JuDdWNv1kFSPY=';
    wikitudeUrl: string = "~/wikitude/sample/index.html";

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        console.dir( this.wikitudeInstance );
    }

    onJSONReceived(wikitudeEvent: JSONReceivedEventData) {
        console.log('onJSONReceived Called!');
        console.log('TypeOf wikitudeEvent.data.json: ' + typeof wikitudeEvent.data.json);
        console.dir( wikitudeEvent.data.json );
        alert({ title: wikitudeEvent.data.json.title, message: wikitudeEvent.data.json.message, okButtonText: 'close' });
    }

    onWorldLoaded(wikitudeEvent: WorldLoadSuccessEventData) {
        this.wikitudeInstance = wikitudeEvent.object;
        console.log('Wikitude is Loaded!');
    }

    onWorldFail(wikitudeEvent: WorldLoadFailedEventData) {
        this.onError(wikitudeEvent.data.error.message);
    }

    onScreenCapture(screenCaptureEvent: ScreenCaptureSuccessEventData) {
        console.log(screenCaptureEvent.data ? 'We have Image content!' : 'We don\'t have image data!');

        const img = screenCaptureEvent.data;
        const now = new Date().toISOString();
        let path;
        saveToAlbum(img, 'png');
    }

    onScreenCaptureFail(screenCaptureError: ScreenCaptureFailedEventData) {
        console.log('|| CAPTURED ERROR ||');
        // console.log(screenCaptureError.data.error.message);
        this.onError(screenCaptureError.data.error.message);
    }

    takeScreenShot() {
        if ( this.wikitudeInstance ) {
            this.wikitudeInstance.captureScreen(true);
        }
    }

    switchCamera() {
        if ( this.wikitudeInstance ) {
            this.wikitudeInstance.switchCamera();
        }
    }

    toggleFlashlight() {
        if ( this.wikitudeInstance ) {
            this.wikitudeInstance.toggleFlash();
        }
    }

    private onError(errorMessage: string) {
        alert({
            title: 'Please Report this error!',
            message: `${errorMessage}... Please Submit this issue to https://bitbucket.org/SD-CLIENTPROJ/nativescript-wikitude/issues, Thanks!`,
            okButtonText: 'close'
        });
    }
}