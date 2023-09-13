import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserTokenService {
  private userInfo = new Subject<string>();
  info;
  constructor(private cookieService : CookieService) { }

  getInfo(): Observable<any>{
    return this.userInfo.asObservable();
  }
  
  setInfo(uT){
    this.userInfo.next(uT);
    console.log("SETTING USER INFO HERE  ---<<<<<<<<<",uT)
    //this.cookieService.set("coolchain_cloud_1",uT.sessid);
    localStorage.setItem('userInfo',JSON.stringify( uT));
  }

}
