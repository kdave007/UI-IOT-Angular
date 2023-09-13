import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { SERVER_URL } from '../server';

@Injectable({
  providedIn: 'root'
})
export class MsgService {

  private REST_API_SERVER = SERVER_URL+"dispatch/user/messages.php";

  constructor(private httpClient: HttpClient) { }

  public msgReq(){
    //return this.httpClient.get(this.REST_API_SERVER);
    return this.httpClient.post(this.REST_API_SERVER, "hello world");
/*
    return this.httpClient.get(this.REST_API_SERVER)
            .map((result: Response) => result.json())
              .map((data: any) => {
                let location: string = '';
                if(data) {
                  console.log(data.description);
                  //this.location = data.description; // <== 
                }
                return "hello";
              });/*
    getCurrentLocation(): Observable<string> {
      return this.http.get('service-method-here')
       .map((result: Response) => result.json())
         .map((data: any) => {
           let location: string = '';
           if(data) {
             console.log(data.description);
             this.location = data.description; // <== 
           }
           return this.location;
          });
      }*/
  }
}