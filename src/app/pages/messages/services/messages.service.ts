import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_URL } from "../../server";
import 'rxjs/add/operator/map';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private REST_API_SERVER = SERVER_URL + "dispatch/user/messages.php";

  constructor( private http: HttpClient ) { }

  /**
   * @brief
   *  Regresa el objeto HTTP GET de la peticion de lista de mensajes
   *  por dispositivo.
   * 
   * @param id 
   *  ID del dispositivo
   */
  public getMessages( id: number ) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'text/plain'
      })
    };

    let contents = {
      Device: String(id),
    }

    return this.http.post<any>( this.REST_API_SERVER, contents, httpOptions);
  }
}

