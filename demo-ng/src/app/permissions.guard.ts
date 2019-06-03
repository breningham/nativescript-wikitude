import {CanActivate} from "@angular/router"
import {Injectable} from '@angular/core';
import * as Permissions from "nativescript-permissions";
declare const android: any;

@Injectable({
    providedIn: 'root'
})
export class PermissionsGuard {

    public canActivate():  Promise<boolean> | boolean {
        console.group('[LocationPermissionGuard] canActivate()');

        if ( Permissions.hasPermission(android.Manifest.permission.ACCESS_FINE_LOCATION) && Permissions.hasPermission(android.Manifest.permission.CAMERA) ) {
            console.log('We already have permission');
            console.groupEnd();
            return true;
        } else {
            return Permissions.requestPermissions([
                android.Manifest.permission.CAMERA,
                android.Manifest.permission.ACCESS_FINE_LOCATION
            ])
                .then((results) => {
                    console.log('Successfully got permissions', results);
                    console.groupEnd();
                    return true
                })
                .catch((e) => {
                    console.log('Unable to get Permissions:', e);
                    console.groupEnd();
                    return true;
                })
        }
    }

}
