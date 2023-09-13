import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateUserInfoService {
  postCMD;
  constructor(private http: HttpClient) { }
 //url ="http://localhost:80/mother_base.php";//check the correct url
 url ="http://atechnik.com.mx/hTelemetry/mother_base.php";
 // url="https://ptsv2.com/t/9yqa5-1568232429/post";

  postUserInfo(id,name,email):Observable<any>{
    this.postCMD ={
      updateUserInfo : id,
      newName:name,
      newEmail:email
    };
    let gotData = this.http.post<any>(this.url,this.postCMD);
    return gotData;
  }
  
}
