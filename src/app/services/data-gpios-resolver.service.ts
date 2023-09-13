import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataGpiosResolverService {
  
  //url ="http://192.168.50.246:80/mother_base.php";
 //url ="http://localhost:80/mother_base.php";
  url ="http://hTelemetry.atechnik.com.mx/mother_base.php";
//url ="http://192.168.50.246:8080/mother_base.php";
  devId;
  constructor(private http: HttpClient, private activatedR : ActivatedRoute) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any{
    let postCMD ={
      getDevSamples:"sens",
      sampDeviceId: route.queryParams.devId,//THIS IS THE WAY TO ACCESS TO ROUTE PARAMTERS, IN THIS CASE, THE ID PASSED BY DEVLIST COMPONENT...
    };
    let gotValues = this.http.post<any>(this.url,postCMD);
    //IMPORTANT CHECK OBSERVABLE COMPLETED.... 
    return gotValues;
   }

  setNewValues(newRange){
    let start = this.formatDate(newRange.start,1);
    let end = this.formatDate(newRange.end,2);
    this.activatedR.queryParams.subscribe(params => 
      this.devId = params['devId']
      );
      let postCMD ={
        getRangeSamples:"sens",
        sampDeviceId: this.devId,//THIS IS THE WAY TO ACCESS TO ROUTE PARAMESTERS, IN THIS CASE, THE ID PASSED BY DEVLIST COMPONENT...
        startDate:start,
        endDate:end
      };

      let gotValues = this.http.post<any>(this.url,postCMD);
      //console.log('gpios service got new range: '+start+' to '+end+' for device: ',this.devId);
      return gotValues;
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
   }
}
