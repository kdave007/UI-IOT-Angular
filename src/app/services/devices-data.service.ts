import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevicesDataService {
  data;
  postCMD ={
    getDevicesData:"kevin"
  };
  //url ="http://localhost:80/mother_base.php";//check the correct url
  url ="http://hTelemetry.atechnik.com.mx/mother_base.php";
 // url="https://ptsv2.com/t/9yqa5-1568232429/post";
 
  
  getData():Observable<any> {
    return this.http.post<any>(this.url,this.postCMD);
  }
  constructor(private http: HttpClient) { }
}
