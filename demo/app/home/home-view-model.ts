import { Observable } from "tns-core-modules/data/observable";
import {WorldLoadFailedEventData, WorldLoadSuccessEventData} from "nativescript-wikitude";

export class HomeViewModel extends Observable {

    constructor() {
        super();
        this.set('wikitude', {
            world: '~/wikitude/sample/index.html'
        })
    }


}
