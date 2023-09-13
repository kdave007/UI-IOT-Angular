import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs'
import { CLOUD_URL } from '../pages/server';

@Injectable({
  providedIn: 'root'
})
export class CompressorMonitorService {
  url ="http://hTelemetry.atechnik.com.mx/FOB.php";
  devId;
  constructor(private http: HttpClient, private activatedR : ActivatedRoute) { }

  public getSamples(newRange){
    let start = this.formatDate(newRange.start,1);
     let end = this.formatDate(newRange.end,2);
     this.activatedR.queryParams.subscribe(params => 
      this.devId = params['devId']
      );
      let pD ={
        compressorMonitor:this.devId,
        startDate:start,
        endDate:end
      };

      let gotSamp = this.http.post<any>(this.url,pD);  
      //console.log('termistor service got new range: '+start+' to '+end+' for dev '+this.devId);
      return gotSamp;
  }

  private formatDate(dt,sort){
    var time; 
    if(sort==1){
      time = '00:00:00';//for the start date
    }else if(sort==2){
      time = '23:59:59';//for the end date
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
    let finalDate = new Date(timeStamp);
    //return finalDate.getTime()/1000;
   }
}
