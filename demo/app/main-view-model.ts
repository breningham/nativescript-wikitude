import { Observable } from 'tns-core-modules/data/observable';
import { Wikitude } from 'nativescript-wikitude';

export class HelloWorldModel extends Observable {
  public message: string;
  private wikitude: Wikitude;

  constructor() {
    super();

    this.wikitude = new Wikitude();
    this.message = this.wikitude.message;
  }
}
