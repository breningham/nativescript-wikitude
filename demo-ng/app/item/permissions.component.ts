import { NgZone,Component, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { requestCameraPermissions, hasCameraPermissions } from "nativescript-advanced-permissions/camera";
import { requestLocationPermissions, hasLocationPermissions, isLocationEnabled } from "nativescript-advanced-permissions/location";
import { requestFilePermissions, hasFilePermissions } from 'nativescript-advanced-permissions/files';

@Component({
  moduleId: module.id,
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionsComponent implements AfterViewInit {

  hasCameraPermissions: boolean = false;
  hasLocationPermissions: boolean = false;
  hasStoragePermissions: boolean = false;

  get hasPermissions(): boolean {
    return this.hasCameraPermissions && this.hasLocationPermissions;
  };

  requestingLocationPermissions: boolean = false;
  requestingCameraPermissions: boolean = false;
  requestingStoragePermissions: boolean = false;

  constructor(private zone: NgZone, private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.zone.run(() => {
      this.hasCameraPermissions = hasCameraPermissions();
      this.hasLocationPermissions = hasLocationPermissions();
      this.hasStoragePermissions = hasFilePermissions();
      this.cd.detectChanges();
    });
  }

  requestCameraPermissions() {
    this.requestingCameraPermissions = true;
    this.cd.detectChanges();

    requestCameraPermissions().then((hasPermission: boolean) => {
      console.dir(hasPermission);
      this.zone.run(() => {
        this.requestingCameraPermissions = false;
        this.hasCameraPermissions = !!hasPermission;
        this.cd.detectChanges();
      });
    });
  }

  requestLocationPermissions() {
    this.requestingLocationPermissions = true;
    this.cd.detectChanges();
    
    requestLocationPermissions().then((hasPermission: boolean) => {
      console.log('*** received location permissions');
      console.dir(hasPermission);
      this.zone.run(() => { 
        this.requestingLocationPermissions = false;
        this.hasLocationPermissions = !!hasPermission;
        this.cd.detectChanges();
      });
    });
  }

  requestStoragePermissions() {
    this.requestingStoragePermissions = true;
    this.cd.detectChanges();

    requestFilePermissions().then((hasPermission: boolean) => {
      this.zone.run(() => { 
        this.requestingStoragePermissions = false;
        this.hasStoragePermissions = !!hasPermission;
        this.cd.detectChanges();
      });
    });

  }

}