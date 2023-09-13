import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CLOUD_URL,LOCAL } from "../pages/server";

@Injectable({
  providedIn: 'root'
})
export class DevListResolverService implements Resolve<any>{
  postCMD;
 //url ="http://192.168.50.246:80/mother_base.php";
 url = CLOUD_URL+"mother_base";
 //url ="http://hTelemetry.atechnik.com.mx/mother_base.php";// DIRECT TO COOL CHAIN!!! TO DO
 //url ="http://coolchain.com.mx:94/mother_base";
 private devices_list = [];
 private DEVICES_LIST_SUBJECT = new BehaviorSubject<any>([]);


  constructor(private http: HttpClient,private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any{
    this.postCMD = {
            cmd:"getDevices"
    };
    
    let gotDev = this.http.post<any>(this.url,this.postCMD,{withCredentials:true})
   return gotDev;
  }

  queryUnresolve(userId){
    this.postCMD = {
      cmd:"getDevices"
    };

    this.http.post<any>(this.url,this.postCMD,{withCredentials:true}).subscribe( data => {
      this.devices_list = [];
      this.devices_list = data;
      this.DEVICES_LIST_SUBJECT.next(this.devices_list); 
    });
  }

  get(){
    return this.DEVICES_LIST_SUBJECT.asObservable();
  }

  clean(){
    this.devices_list = [];
    this.DEVICES_LIST_SUBJECT.next(this.devices_list); 
  }
}
