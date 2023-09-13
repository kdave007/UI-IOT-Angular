import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_URL } from "../server";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertsNotificationsService implements OnInit{
  postCMD;
  url ="http://coolchain.com.mx:3300/server";
  //url ="http://atechnik.com.mx/hTelemetry/FOB.php";
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'text/plain'
    })
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

  }

  public getAlertsNotifications(user,device):Observable<any>{
    this.postCMD ={
      user:user,
      device:device,
      CMDReq:"alertNotifications"
    };
    console.log("posting to",this.url);
    let gotData = this.http.post<any>(this.url,this.postCMD,this.httpOptions);
    return gotData;
  }
}
