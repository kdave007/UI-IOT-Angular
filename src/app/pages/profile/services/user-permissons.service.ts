import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CLOUD_URL } from "../../server";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserPermissonsService {
  private REST_API_SETTINGS = CLOUD_URL + "mother_base";

  private user_permissions = [];
  private USER_P_SUBJECT = new BehaviorSubject<any>([]);
  private users_list = [];
  private USERS_LIST_SUBJECT = new BehaviorSubject<any>([]);
  private companies = [];
  private COMPANIES_SUBJECT = new BehaviorSubject<any>([]);

  constructor( private http: HttpClient ) { }

  public queryPermissions(targetUserId){
    let contents = {
      cmd: "getUserPermissions",
      targetUserId,
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {
      
      if(data.empty!=true){
        this.user_permissions = [];
        this.user_permissions = data;
        this.USER_P_SUBJECT.next(this.user_permissions);
      }
    }); 
  }

  public queryByCompany(targetCompanyId){
    let contents = {
      cmd: "getUsersByCompany",
      targetCompanyId
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {
      if(data.empty!=true){
        this.users_list = [];
        this.users_list = data;
        this.USERS_LIST_SUBJECT.next(this.users_list);
      }
    }); 
  }

  public queryAllUsers(){
    let contents = {
      cmd: "getAllUsers",
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {
      if(data.empty!=true){
        this.users_list = [];
        this.users_list = data;
        this.USERS_LIST_SUBJECT.next(this.users_list);
      }
    }); 
  }

  public queryAllCompanies(){
    let contents = {
      cmd: "getCompanies"
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {
      
      if(data.empty!=true){
        this.companies = [];
        this.companies = data;
        this.COMPANIES_SUBJECT.next(this.companies);
      }
    }); 
  }

  public savePermissions(targetUsers){
    let contents = {
      cmd: "setUserPermissions",
      targetUsers:[targetUsers]
    }
    console.log("save POSTING",contents)
    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {});
  }

  public getCompanies(){
    return this.COMPANIES_SUBJECT.asObservable();
  }

  public getUsersList(){
    return this.USERS_LIST_SUBJECT.asObservable();
  }

  public getUserPermissions(){
    return this.USER_P_SUBJECT.asObservable();
  }

  public cleanAllObjects(){
    this.users_list = [];
    this.user_permissions = [];
    this.companies = [];
    this.USERS_LIST_SUBJECT.next(this.users_list);
    this.USER_P_SUBJECT.next(this.user_permissions);
    this.COMPANIES_SUBJECT.next(this.companies);
  }

  public cleanUserPermissionsObject(){
    this.user_permissions = [];
    this.USER_P_SUBJECT.next(this.user_permissions);
  }

}
