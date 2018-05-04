import { NgZone,Component, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Permissions } from "@spartadigital/nativescript-permissions";

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
      this.hasCameraPermissions = Permissions.hasCameraPermission();
      this.hasLocationPermissions = Permissions.hasLocationPermission();
      this.hasStoragePermissions = Permissions.hasFilePermission();
      this.cd.detectChanges();
    });
  }

  requestCameraPermissions() {
    this.requestingCameraPermissions = true;
    this.cd.detectChanges();

    Permissions.requestCameraPermission().then((hasPermission: boolean) => {
      this.zone.run(() => {
        this.requestingCameraPermissions = false;
        this.hasCameraPermissions = hasPermission;
        this.cd.detectChanges();
      });
    });
  }

  requestLocationPermissions() {
    this.requestingLocationPermissions = true;
    this.cd.detectChanges();
    
    Permissions.requestLocationPermission().then((hasPermission: boolean) => {
      this.zone.run(() => { 
        this.requestingLocationPermissions = false;
        this.hasLocationPermissions = hasPermission;
        this.cd.detectChanges();
      });
    });
  }

  requestStoragePermissions() {
    this.requestingStoragePermissions = true;
    this.cd.detectChanges();

    Permissions.requestFilePermission().then((hasPermission: boolean) => {
      this.zone.run(() => { 
        this.requestingStoragePermissions = false;
        this.hasStoragePermissions = hasPermission;
        this.cd.detectChanges();
      });
    });

  }

}