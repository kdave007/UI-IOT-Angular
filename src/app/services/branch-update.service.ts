import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchUpdateService {
  //url ="http://localhost:80/mother_base.php";//check the correct url
  url ="http://atechnik.com.mx/hTelemetry/mother_base.php";
  // url="https://ptsv2.com/t/9yqa5-1568232429/post";
  postCMD;
  constructor(private http: HttpClient) { }

  public postNewBranch(name,nodeId,toId):Observable<any>{
    this.postCMD ={
      updateBranch : name,
      nodeId: nodeId,
      gotoId: toId
    };
    console.log("moving id: ",nodeId," below id: ",toId," by user: ",name);
    let gotData = this.http.post<any>(this.url,this.postCMD);
    return gotData;
  }

}
