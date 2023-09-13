import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FreezeMonitorResolverService implements Resolve<any>{
  devId;
  url ="http://hTelemetry.atechnik.com.mx/FOB.php";
  constructor(private http: HttpClient, private activatedR : ActivatedRoute) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any{
    let pD ={
      freezeMonitor: route.queryParams.devId,//THIS IS THE WAY TO ACCESS TO ROUTE PARAMESTERS, IN THIS CASE, THE ID PASSED BY DEVLIST COMPONENT...
    };
    let gotDefrost = this.http.post<any>(this.url,pD);
    //IMPORTANT CHECK OBSERVABLE COMPLETED.... 
    return gotDefrost;
   }

}
