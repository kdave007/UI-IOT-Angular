import { Injectable } from '@angular/core';
import { Observable,Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceSelectionService {

  public device = {
    id: null,
    alias: null,
    route: null,
    gen: null,
    lastSeen : null,
    macFlag : undefined
  }

  public deviceSubject = new BehaviorSubject<any>({});

  constructor() { }

  public set(id,alias,route,gen,lastSeen,macFlag){
    this.device = {
      id,alias,route,gen,lastSeen,macFlag
    }

    console.log("SETING DEVICE")

    this.deviceSubject.next(this.device);
  }

  public get(){
    return this.deviceSubject.asObservable();
  }
}


