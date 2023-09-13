import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HTTP_INTERCEPTORS, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CLOUD_URL,LOCAL } from "../pages/server";

@Injectable()
export class UnauthorizedService implements HttpInterceptor{
  public isLogin : Boolean = false;
  public cloneTrooper;
  public urlLog = {
    in: CLOUD_URL+"login",
    out: CLOUD_URL+"logout"
  }
 
  constructor(public router : Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
    this.cloneTrooper = req.clone();
    this.isLogin = this.isALogPost(this.cloneTrooper.url);

    /**
     * Debug
     * this is only used for debugging, and also server host ip must be changed
     * 
     * 
     */
    this.cloneTrooper.body["keyPass"] = 'DrdcKMKicTtEsCeV7wX9uLg8rDakIt7m'; 
    this.cloneTrooper.body["userId"] = 2;
    this.cloneTrooper.body["name"] = "Kevin";
    this.cloneTrooper.body["debug"] = true;
    this.cloneTrooper.body["level"] = 1;
    this.cloneTrooper.body["companyId"] = 1;
    // this.cloneTrooper.body["keyPass"] = 'DrdcKMKicTtEsCeV7wX9uLg8rDakIt7m'; 
    // this.cloneTrooper.body["userId"] = 108;
    // this.cloneTrooper.body["name"] = "Luis Quevedo"; 
    // this.cloneTrooper.body["debug"] = true;
    // this.cloneTrooper.body["level"] = 3;
    // this.cloneTrooper.body["companyId"] = 1;
    
    


    console.log("request params ",this.cloneTrooper);

    return next.handle(this.cloneTrooper).pipe(
      catchError(this.handleErrorResp.bind(this))
    );
  }

  public handleErrorResp(ERROR : HttpErrorResponse): Observable<HttpEvent<any>>  {
    if(ERROR.status==401 && !this.isLogin){
      this.router.navigateByUrl('/auth/login');
    }
    throw new Error(ERROR.error);
    
  }

  private isALogPost(urlParam){
    if(urlParam == this.urlLog.in || urlParam == this.urlLog.out){
      return true;
    }
    return false;
  }

  
}
