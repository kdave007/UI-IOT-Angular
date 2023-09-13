import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CLOUD_URL } from "../pages/server";

@Injectable({
  providedIn: 'root'
})
export class MailAlertsConfigService {
  postCMD;
 //url ="http://192.168.50.246:80/mother_base.php";
 //url ="http://localhost:80/mother_base.php";
 url ="http://hTelemetry.atechnik.com.mx/FOB.php"
 private REST_API_UI = CLOUD_URL+`mother_base`;
 //private REST_API_UI="http://localhost:94/mother_base";
  constructor(private http: HttpClient) { }

 getAlerts(device): Observable<any>{
  //console.log("query user id ",profileInfo['id']);
    let uI=localStorage.getItem('userInfo');
    var profileInfo = JSON.parse(uI);
    this.postCMD ={
      cmd:"getMailAlerts",
      deviceId:device,
      getMailAlerts: device,
      userId:profileInfo['userId']
    };
    let gotDev = this.http.post<any>(this.REST_API_UI,this.postCMD,{withCredentials: true});
   //IMPORTANT CHECK OBSERVABLE COMPLETED.... 
   return gotDev;
 }

 public setAlerts(device,settingsArray){
  let uI=localStorage.getItem('userInfo');
    var profileInfo = JSON.parse(uI);
    this.postCMD ={
      cmd:"setMailAlerts",
      deviceId:device,
      setMailAlerts: device,
      userId:profileInfo['userId'],
      settings : settingsArray
    };
    let flag = this.http.post<any>(this.REST_API_UI,this.postCMD,{withCredentials: true});
    return flag;
  }

 public setGlobalConfig(references){
    var postGlobal;
    let uI=localStorage.getItem('userInfo');
    var profileInfo = JSON.parse(uI);
    postGlobal = {
      setMailAlerts: "setGlobalAlerts",
      status:references.active,
      deviceIdReference:references.deviceIdReference,
      userId:profileInfo['userId']
    }
    let flag = this.http.post<any>(this.url,postGlobal);
    return flag;
 } 
    
   
}
