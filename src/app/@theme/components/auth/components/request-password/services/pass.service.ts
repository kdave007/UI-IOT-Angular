import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SERVER_URL } from "../../../../../../pages/server";

@Injectable({
  providedIn: 'root'
})
export class PassService {
  private REST_API_KEY_RECOVER = SERVER_URL + "dispatch/user/key_recover.php";

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'text/plain'
    })
  };

  constructor( private http: HttpClient ) {  }

  /**
   * @brief
   *  Envia la contraseña al correo electronico si existe
   * 
   * @param _email 
   *  Correo electronico de usuario
   */
  public requestPassword( _email: string ) {
    let contents = {
      Email: _email
    }

    this.http.post<any>( this.REST_API_KEY_RECOVER, contents, this.httpOptions ).subscribe( data => {});  
  }
}
