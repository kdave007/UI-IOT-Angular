import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL,CLOUD_URL } from "../pages/server";

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  userInfo = {
    name : undefined,
    email: undefined,
    level : undefined
  }

  userSubject = new BehaviorSubject<any>({});

  REST_API = CLOUD_URL+'mother_base';

  constructor(private http : HttpClient) { }

  //command to use to get user info : getUser
  public request(){
    let contents = {
      cmd:"getUser"
    }

    this.http.post<any>(this.REST_API,contents,{withCredentials: true}).subscribe( data => {
      console.log("USER INFO ",data)
      this.userInfo = data;
      this.userSubject.next(this.userInfo);
    });
  }

  public get(){
    return this.userSubject.asObservable();
  }
}
