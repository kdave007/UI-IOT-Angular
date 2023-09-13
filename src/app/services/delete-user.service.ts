import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteUserService {
  //url ="http://localhost:80/mother_base.php";//check the correct url
  url ="http://atechnik.com.mx/hTelemetry/mother_base.php";
  // url="https://ptsv2.com/t/9yqa5-1568232429/post";
  postCMD;
  constructor(private http: HttpClient) { }

  public postDeleteUser(id2delete,sessulevel,sessuname,lvl2delete):Observable<any>{
    this.postCMD ={
      deleteUbyID: sessuname,
      IDtoDelete : id2delete,
      leveltoDelete: lvl2delete,
      sessionUserLvl: sessulevel
    };
    console.log("posting: ",this.postCMD)
    let gotData = this.http.post<any>(this.url,this.postCMD);
    return gotData; 
  }

}
