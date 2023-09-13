import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserBranchResolverService implements Resolve<any>{
  profileInfo;
  url ="http://hTelemetry.atechnik.com.mx/mother_base.php";
  constructor(private http: HttpClient, private activatedR : ActivatedRoute) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any{
    let uI=localStorage.getItem('userInfo');
    this.profileInfo = JSON.parse(uI);
    
    let pD ={
      getBranch:this.profileInfo['userId'],
    };
    let gotData = this.http.post<any>(this.url,pD);
    //IMPORTANT CHECK OBSERVABLE COMPLETED.... 
    return gotData;
  } 
}
