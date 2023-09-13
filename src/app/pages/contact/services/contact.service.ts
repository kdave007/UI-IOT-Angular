import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SERVER_URL } from "../../server";

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private REST_API_MSG = SERVER_URL + "dispatch/user/contact.php";

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'text/plain'
    })
  };

  constructor( private http: HttpClient ) {  }

  /**
   * @brief
   *  Envia un mensaje al soporte
   * 
   * @param _user 
   *  Usuario
   * 
   * @param _subject 
   *  Asunto
   * 
   * @param _description 
   *  Descripcion
   */
  public sendMessage( _user: number, _subject: string, _description: string ) {
    let contents = {
      User: _user,
      Subject: _subject,
      Description: _description
    }

    this.http.post<any>( this.REST_API_MSG, contents, this.httpOptions ).subscribe( data => {});  
  }
}
