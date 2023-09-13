import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { Observable, observable } from 'rxjs';
import { CLOUD_URL } from '../../server';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VoltageSamplesResolverService {
  url = CLOUD_URL+'mother_base';
  deviceId;

  constructor(private http: HttpClient,private activatedR : ActivatedRoute) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any{
    this.deviceId = route.queryParams.devId;
    console.log("device id",this.deviceId);
    let s = new Date().getTime() /1000;
    let e = new Date().getTime() /1000;
    let start = this.formatDate(s,1);
    let end = this.formatDate(e,2);
    let pD ={
      cmd:"getTruckVolts",
      deviceId: this.deviceId,
      range: {start,end}
    };
    //console.log("resolver voltage")
    let gotSamp = this.http.post<any>(this.url,pD,{withCredentials: true});
    //IMPORTANT CHECK OBSERVABLE COMPLETED.... 
    return gotSamp;
  }

  setNewValues(newRange,keepTime?){
    this.activatedR.queryParams.subscribe(params => 
      this.deviceId = params['devId']
    );
    
    console.log("device id voltage resolver",this.deviceId);
    let SORT_END = (keepTime) ? 3 : 2;
     let SORT_START = (keepTime) ? 3 : 1;  
     let start = this.formatDate(newRange.start,SORT_START);
     let end = this.formatDate(newRange.end,SORT_END);
    let pD ={
      cmd:"getTruckVolts",
      deviceId: this.deviceId,
      range: {start,end}
    };

    let gotSamp = this.http.post<any>(this.url,pD,{withCredentials: true});  
    console.log('voltageeeeeeeeeeeee service got new range: ',start,' to ',end,' for dev '+this.deviceId);
    
    return gotSamp;
  }

  private formatDate(dt,sort){
   console.log("dt looks like this ",dt)
   var time; 
   if(sort==1){
     time = '00:00:00';//for the start date
   }else if(sort==2){
     time = '23:59:59';//for the end date 
   }else if(sort==3){
    time = this.formatTime(dt);
   }

   let D = new Date(dt);
   let date = D.getDate();
   
   let month = D.getMonth()+1;
   let year = D.getFullYear();
   var datee,mon;
   if(date<10){
     datee='0'+date;
   }else{
     datee=date;
   }
   if(month<10){
     mon='0'+month;
   }else{
     mon=month;
   }
   let timeStamp = year+"-"+mon+"-"+datee+" "+time;
   
   return timeStamp; 
  }

  private formatTime(date){
    let H = (date.getHours()<10) ? "0"+date.getHours() : ""+date.getHours();
    let M = (date.getMinutes()<10) ? "0"+date.getMinutes() : ""+date.getMinutes();
    
    return H+":"+M;
  }

}
