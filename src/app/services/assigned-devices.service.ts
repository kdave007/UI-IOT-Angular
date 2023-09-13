import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CLOUD_URL } from '../pages/server';

@Injectable({
  providedIn: 'root'
})
export class AssignedDevicesService implements OnInit{
  postCMD;
  //url ="http://localhost:80/mother_base.php";//check the correct url
  url ="http://atechnik.com.mx/hTelemetry/mother_base.php";
 // url="https://ptsv2.com/t/9yqa5-1568232429/post";
 private REST_API_SETTINGS = CLOUD_URL + "mother_base";

  private devices_list = [];
  private DEVICES_LIST_SUBJECT = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient) { }

  ngOnInit(){
  }

  queryDevices(targetUserId){
    let contents = {
      cmd: "getAssignedDevices",
      targetUserId,
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {
      
      if(data!=null){
        this.devices_list = [];
        this.devices_list = data;
        this.DEVICES_LIST_SUBJECT.next(this.devices_list);
      }
    });
  }

  get(){
    return this.DEVICES_LIST_SUBJECT.asObservable();
  }
 
  public getData(userId):Observable<any>{
    this.postCMD ={
      getAssignedDev : userId
    };
    let gotData = this.http.post<any>(this.url,this.postCMD);
    //IMPORTANT CHECK OBSERVABLE COMPLETED.... 
    return gotData;
  }

  set(targetUserId,newList){
    let contents = {
      cmd: "setAssignedDevices",
      targetUserId,
      newList
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {
      let dummy = data;
    });
  }

  clear(){
    this.devices_list = [];
    this.DEVICES_LIST_SUBJECT.next(this.devices_list);
  }

}
