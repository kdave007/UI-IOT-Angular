import { Injectable } from '@angular/core';
import { CLOUD_URL } from "../../server";
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as utils from '../box-prepare/custom-week-calendar/utils';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { stringify } from 'querystring';
const inspector = require('../services/comp.settings.validation');


@Injectable({
  providedIn: 'root'
})
export class CompressorService {
  private SETTINGS_REST_API = CLOUD_URL+'mother_base';
  
  //private SETTINGS_REST_API =  "http://localhost:94" + "/mother_base";
 
  private COMP_SETTINGS = new Subject< utils.CompressorSettings[] >();
  private COMP_EVENTS = [];
  private SLOTS_DELETE = [];

  constructor(private http : HttpClient) { }

  ///*** SETTINGS VALIDATION ***//
  public send( newData: utils.CompressorSettings[], id: number ) {
    let conflict = inspector.validate(this.COMP_EVENTS);
    if(!conflict.error){
      this.setComp(newData,id);
    }
    return conflict;
  }

  ///***POST QUERY DATA ***//
  public setComp( newData: utils.CompressorSettings[], id: number ) {
    let contents = {
      cmd: "setCompSetup",
      slots: {
        set:newData,
        delete: this.SLOTS_DELETE,
      },
      deviceId: id,
    }
     console.log("SEND HTTP ",this.SETTINGS_REST_API)
   
    this.http.post<any>( this.SETTINGS_REST_API, contents, {withCredentials: true}).subscribe(data => {});
    this.COMP_SETTINGS.next(newData);
  }

  public queryComp( id: number ) {
    console.log("SEND HTTP ",this.SETTINGS_REST_API)
    let contents = {
      cmd: "getCompSetup",
      deviceId: id,
    }
  
    this.http.post<any>( this.SETTINGS_REST_API, contents, {withCredentials: true}).subscribe(data => {
      this.COMP_SETTINGS.next(data);
    });
    
  }

  ///*** LOCAL ACTIONS ***//
  public update( newData: utils.CompressorSettings[]){
    this.COMP_SETTINGS.next(newData);
  }

  public localGet(){
    return this.COMP_SETTINGS;
  }

  //***Return this Observable **///
  public getCompSettings(): Observable < utils.CompressorSettings[] > {
    return this.COMP_SETTINGS.asObservable();
  }
//***EVENTS EVALUTATION FUNCTIONS**//
public updateEVENTS( newData: any[]){
  console.log("UPDATING EVENTS")
  this.COMP_EVENTS=newData;
}

//***UPDATE SLOTS TO DELETE *//
public updateDELETE( newData: any[]){
  console.log("DELETE SLOTS")
  this.SLOTS_DELETE=newData;
}

}
