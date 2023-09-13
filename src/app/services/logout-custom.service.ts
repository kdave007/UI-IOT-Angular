import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutCustomService {
  postCMD;
  //url="http://hTelemetry.atechnik.com.mx/mother_base.php";
  //url="http://localhost:94/logout";
  url="http://coolchain.com.mx:94/logout";
  //url ="http://192.168.50.246:80/mother_base.php";
  //url ="http://192.168.50.246:8080/mother_base.php";
  constructor(private http: HttpClient) { }
  
  postOUT():Observable<any>{
    //let uI=localStorage.getItem('userInfo');
    //var profileInfo = JSON.parse(uI);
    this.postCMD ={
      logOut:"logout"
    };
    let postOut = this.http.post<any>(this.url,this.postCMD,{withCredentials:true});
    return postOut;
  }
}
 