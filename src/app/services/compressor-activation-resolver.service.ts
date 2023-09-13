import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CompressorActivationResolverService {

  url ="http://hTelemetry.atechnik.com.mx/FOB.php";

  constructor(private http: HttpClient, private activatedR : ActivatedRoute) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any{
    let postCMD ={
      getCompActivation:"getCompActivation",
      deviceId: route.queryParams.devId,//THIS IS THE WAY TO ACCESS TO ROUTE PARAMTERS, IN THIS CASE, THE ID PASSED BY DEVLIST COMPONENT...
      startDate:null,
      endDate:null
    };
    console.log("post params are:",postCMD);
    let gotValues = this.http.post<any>(this.url,postCMD);
    //IMPORTANT CHECK OBSERVABLE COMPLETED.... 
    return gotValues;
   }

}
