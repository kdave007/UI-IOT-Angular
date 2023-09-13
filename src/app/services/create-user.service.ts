import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CreateUserService {
  //url ="http://localhost:80/mother_base.php";//check the correct url
  url ="http://atechnik.com.mx/hTelemetry/mother_base.php";
  // url="https://ptsv2.com/t/9yqa5-1568232429/post";
  postCMD;
  constructor(private http: HttpClient) { }

  public postCreateUser(name,level,email,parentId,parentBranch,uPass):Observable<any>{
    this.postCMD ={
      createUser:"createUser",
      newName : name,
      levelUser: level,
      emailUser: email,
      setParent: parentId,
      branch: parentBranch,
      UserPass: uPass
    };
    //console.log("posting: ",this.postCMD)
    let gotData = this.http.post<any>(this.url,this.postCMD);
    return gotData;
  }

}
