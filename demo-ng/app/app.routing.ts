import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { ItemsComponent } from "./item/items.component";
import { PermissionsComponent } from './item/permissions.component';

const routes: Routes = [
    { path: "", redirectTo: "/permissions", pathMatch: "full" },
    { path: "permissions", component: PermissionsComponent },
    { path: "wikitude", component: ItemsComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }