import { Component, OnInit } from "@angular/core";
import {WorldLoadFailedEventData} from "nativescript-wikitude";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    wikitudeConfig = {
        world: "~/wikitude/sample/index.html"
    };

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onWorldLoadFailed($event: WorldLoadFailedEventData) {
        alert('Looks like we failed to load your Wikitude World: ' + $event.data.navigation + ', Error was: ' + $event.data.error);
    }
}
