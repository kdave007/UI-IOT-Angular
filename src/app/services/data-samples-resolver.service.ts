import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CLOUD_URL } from '../pages/server';
import { TEMPS_FILTER } from '../pages/temp.commands';


@Injectable({
  providedIn: 'root'
})
export class DataSamplesResolverService implements Resolve<any> {

  //url ="http://192.168.50.246:80/mother_base.php";
  //url ="http://localhost:80/mother_base.php";
  //url ="http://hTelemetry.atechnik.com.mx/mother_base.php";
  //url ="http://192.168.50.246:8080/mother_base.php";
  
  
  url = CLOUD_URL+'thermistor';
  devId;
  constructor(private http: HttpClient, private activatedR : ActivatedRoute) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any{
    let startToday = new Date().getTime() /1000;
    let endToday = new Date().getTime() /1000;
    let pD ={
      getDevSamples:"temp",
      sampDeviceId: route.queryParams.devId,//THIS IS THE WAY TO ACCESS TO ROUTE PARAMESTERS, IN THIS CASE, THE ID PASSED BY DEVLIST COMPONENT...
      device: route.queryParams.devId,
      range: [startToday,endToday],
      cmd_op:"low_pass",
      extra: null
    };
    let gotSamp = this.http.post<any>(this.url,pD,{withCredentials: true});
    //IMPORTANT CHECK OBSERVABLE COMPLETED.... 
    return gotSamp;
   }

   setNewValues(newRange,chartFilter?,keepTime?){
     let SORT_END = (keepTime) ? 3 : 2;
     let SORT_START = (keepTime) ? 3 : 1;  
     console.log("PRE NEW RANGE ",newRange)
     let start = this.formatDate(newRange.start,SORT_START);
     let end = this.formatDate(newRange.end,SORT_END);

     console.log("AFTER FORMAT DATE START",start,end)

    // console.log("date formatted",dateTest," epoch test",epochRaw);
     

     this.activatedR.queryParams.subscribe(params => 
      this.devId = params['devId']
      );

      let cmd_op = (chartFilter==undefined) ? TEMPS_FILTER.RAW : chartFilter;

      let pD ={
        getRangeSamples:"temp",
        sampDeviceId: this.devId,//THIS IS THE WAY TO ACCESS TO ROUTE PARAMESTERS, IN THIS CASE, THE ID PASSED BY DEVLIST COMPONENT...
        startDate:start,
        endDate:end,
        device: this.devId,
        range: [start,end],
        cmd_op,
        extra: null
      };

      console.log("temp post : ",pD)

      let gotSamp = this.http.post<any>(this.url,pD,{withCredentials: true});  
     console.log('termistor service got new range: '+start+' to '+end+' for dev '+this.devId);
      return gotSamp;
   }

   private formatDate(dt,sort){
     //console.log("dt looks like this ",dt)
    var time; 
    if(sort==1){
      time = '00:00:00';//for the start date
    }else if(sort==2){
      time = '23:59:59';//for the end date
    }else if(sort==3){
      console.log("FLAG CHECKPOINT")
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

    let finalDate = new Date(timeStamp);
    return finalDate.getTime()/1000; 
   }

   private formatTime(date){
     let H = (date.getHours()<10) ? "0"+date.getHours() : ""+date.getHours();
     let M = (date.getMinutes()<10) ? "0"+date.getMinutes() : ""+date.getMinutes();
     console.log("formatTime return :: ",H+":"+M);
     return H+":"+M;
   }
}
