import { Injectable } from '@angular/core';
import { Observable,Subject, BehaviorSubject } from 'rxjs'
import { SERVER_URL,CLOUD_URL, LOCAL } from "../../server";
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class InterfaceSetupService {

  private THERMISTOR_REST_API = CLOUD_URL+'mother_base';// >> set CLOUD_URL IN FINAL VERSION
  public filterConstantsSubject = new BehaviorSubject<any>([]);
  public filterValues = [];

  constructor(private http : HttpClient) { }

  /**
   * queryValues
   */
  public queryValues(deviceId) {
    let contents = {
      deviceId,
      cmd:"getTempFilter"
    }

    this.http.post<any>(this.THERMISTOR_REST_API,contents,{withCredentials: true}).subscribe( data => {
      console.log("filter constants data",data)
      this.filterValues = data;
      this.filterConstantsSubject.next(this.filterValues);
    });
  }

  /**
   * saveValues
   */
  public saveValues(deviceId) {
    let contents = {
      deviceId,
      cmd:"setTempFilter",
      extra:[
        this.filterValues[0].value,
        this.filterValues[1].value,
        this.filterValues[2].value,
        this.filterValues[3].value
      ]
    }
    console.log("/////////////////////// save values",this.filterValues)

    this.http.post<any>(this.THERMISTOR_REST_API,contents,{withCredentials: true}).subscribe( data => {
      return data;
    });
  }

  /**
   * setValues
   */
  public setValues(newValues) {
    this.filterValues = newValues;
    this.filterConstantsSubject.next(this.filterValues);
  }

  /**
   * getValues
   */
  public getValues() {
    return this.filterConstantsSubject.asObservable();
  }

  public emptyValues(){
    this.filterValues = [];
    this.filterConstantsSubject.next(this.filterValues);
  }
  
}

