import { Injectable } from '@angular/core';
import { CLOUD_URL } from "../../server";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Alarms } from '../utils';


@Injectable({
  providedIn: 'root'
})
export class AlarmsService {
  public SETTINGS = new Subject< any >();
  private REST_API_UI = CLOUD_URL+`mother_base`;
  public alreadyPosted = new BehaviorSubject<boolean>(false);

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'text/plain'
    })
  };

  constructor(private http : HttpClient) { 
    
  }

  /**
   * @brief
   *  get alarms inputs parameters
   */
  public querySettings( deviceId: number, userId: number ){
    let contents = {
      cmd:"getAlarmsParams",
      deviceId,
      userId
    }
   
    this.http.post<any>(this.REST_API_UI, contents, {withCredentials: true}).subscribe(data => {
      if(data.empty){
        data=false;
      }
      this.SETTINGS.next(data);
    });
  }

  public setAlarms(device,settingsArray){
    let uI=localStorage.getItem('userInfo');
    var profileInfo = JSON.parse(uI);
    let postCMD ={
      cmd:"SetAlarmsParams",
      deviceId:device,
      userId:profileInfo['userId'],
      settings : settingsArray
    };
    let flag = this.http.post<any>(this.REST_API_UI,postCMD, {withCredentials: true});
    this.alreadyPosted.next(true);
    return flag;
  }

  public postedFlag(): Observable <any>{
    return this.alreadyPosted.asObservable();
  }

  public getSettings(): Observable <any> {
    return this.SETTINGS.asObservable();
  }

  public queryUser( userId: number ):Observable<any>{
    let contents = {
      cmd:"getUser",
      userId
    }
    let data = this.http.post<any>(this.REST_API_UI, contents, {withCredentials: true});
    return data;
  }

}
