/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData, NavigatedData, Page} from "tns-core-modules/ui/page";

import { HomeViewModel } from "./home-view-model";
import * as Permissions from 'nativescript-permissions';
import {WorldLoadFailedEventData, WorldLoadSuccessEventData} from "nativescript-wikitude";
declare const android: any;

export function getPermissions() {
    if ( Permissions.hasPermission(android.Manifest.permission.ACCESS_FINE_LOCATION) && Permissions.hasPermission(android.Manifest.permission.CAMERA) ) {
        console.log('We already have permission');
        return true;
    } else {
        return Permissions.requestPermissions([
            android.Manifest.permission.CAMERA,
            android.Manifest.permission.ACCESS_FINE_LOCATION
        ])
            .then((results) => {
                console.log('Successfully got permissions', results);
                return true
            })
            .catch((e) => {
                console.log('Unable to get Permissions:', e);
                return true;
            })
    }
}

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new HomeViewModel();
}

export function onPageLoaded(args: EventData) {
    getPermissions();
}

export function onWorldLoadSuccess(e: WorldLoadSuccessEventData) {
    const wikitude = e.object;
    const page = wikitude.page;
    page.bindingContext.set('wikitudeInstance', e.object);
}

export function onWorldLoadFailed(e: WorldLoadFailedEventData) {
    console.log('World Load Failed');
}
