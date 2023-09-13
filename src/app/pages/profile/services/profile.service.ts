import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SERVER_URL,CLOUD_URL } from "../../server";
import 'rxjs/add/operator/map';
import { catchError, tap, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ok } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private REST_API_CREATE_ADMIN = SERVER_URL + "dispatch/user/new_admin.php";
  private REST_API_KEY = SERVER_URL + "dispatch/user/key.php";
  private REST_API_EMAIL = SERVER_URL + "dispatch/user/mail.php";
  private REST_API_USER_LIST = SERVER_URL + "dispatch/user/users.php";
  private REST_API_USERS_TREE = SERVER_URL + "dispatch/user/user_tree.php";
  private REST_API_USER_DEV = SERVER_URL + "dispatch/user/user_devices.php";
  private REST_API_COMPLETE_TREE = SERVER_URL + "dispatch/user/complete_tree.php";
  private REST_API_USER_LEVEL = SERVER_URL + "dispatch/user/get_user_level.php";
  private CLOUD_API = CLOUD_URL+"mother_base";


  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'text/plain'
    })
  };

  constructor( private http: HttpClient ) { }

  /**
   * @brief
   *  Crea un administrador
   * 
   * @param _name 
   *  Nombre
   * 
   * @param _email 
   *  Correo electronico
   */
  public createUser( name: string, email: string, level : number, companyId : number ) {
    let contents = {
      cmd:"setNewUser",
      newUser: {
          name,
          email,
          level,
          companyId
        } 
    }

    this.http.post<any>( this.CLOUD_API, contents,{withCredentials:true}).subscribe(data => {});    
  }

  /**
   * @brief
   *  Actualiza la contraseña del usuario
   * 
   * @param _userId 
   *  ID del usuario
   * 
   * @param _newKey 
   *  Contraseña nueva
   * 
   * @param _oldKey 
   *  Contraseña anterior
   */
  public updateKey( _userId: number, _newKey: string, _oldKey: string, _masterRequest? :boolean ) {
    let contents = {
      cmd:"setNewPassword",
      oldPassword: _oldKey,
      newPassword: _newKey,
      targetUserId: _userId,
      masterRequest : (_masterRequest!=undefined && _masterRequest!=null) ? true : false  
    }

    return this.http.post<any>( this.CLOUD_API, contents,{withCredentials:true});  
  }

  /**
   * @brief
   *  Obtiene la lista de administradores
   */
  public getAdminList() {
    let contents = {
      level: 1
    }

    return this.http.post<any>( this.REST_API_USER_LIST, contents, this.httpOptions);
  }

  /**
   * @brief
   *  Actualiza el correo del usuario
   * 
   * @param _userId 
   *  ID del usuario
   * 
   * @param _email 
   *  Nuevo correo electronico
   */
  public updateEmail( _userId: number, _email: string, _key: string, _masterRequest? :boolean  ) {
    let contents = {
      cmd:"setNewEmail",
      targetUserId: _userId,
      oldPassword: _key,
      newEmail: _email,
      masterRequest : (_masterRequest!=undefined && _masterRequest!=null) ? true : false 
    }
    
    return this.http.post<any>( this.CLOUD_API, contents,{withCredentials:true});
  }

  /**
   * @brief
   *  Actualiza la compañia del usuario
   * 
   * @param userTargetId 
   *  ID del usuario
   * 
   * @param companyId 
   *  Nuevo correo electronico
   */
  public updateUserCompany( targetUserId: any, targetCompanyId: any) {
    let contents = {
      cmd:"setUserToCompany",
      targetUserId,
      targetCompanyId
    }
    
    return this.http.post<any>( this.CLOUD_API, contents,{withCredentials:true}).subscribe(data => data);
  }

  /**
   * @brief
   *  Obtiene la lista de usuarios anidados
   * 
   * @param _userId
   *  ID del usuario actual 
   */
  public getUsersTree( _userId: number ) {
    let contents = {
      User: _userId
    }

    return this.http.post<any>( this.REST_API_USERS_TREE, contents, this.httpOptions);
  }

  /**
   * @brief
   *  Obtiene la lista de usuarios asignados
   * 
   * @param _userId 
   *  ID del usuario actual
   */
  public getUserDevices( _userId: number ) {
    let contents = {
      User: _userId
    }

    return this.http.post<any>( this.REST_API_USER_DEV, contents, this.httpOptions);
  }

  /**
   * @brief
   *  Obtiene el nivel del usuario
   * 
   * @param _userId
   *  ID del usuario 
   */
  public getUserLevel( _userId: number ) {
    let contents = {
      User: _userId
    }

    return this.http.post<any>( this.REST_API_USER_LEVEL, contents, this.httpOptions);
  }

  /**
   * @brief
   *  Obtiene todos los datos de los organigramas
   * 
   * @param _usersId 
   *  Arreglo con los ids de los dueños del organigrama
   */
  public getCompleteTree( _usersId: number[] ) {
    let contents = {
      Users: _usersId
    }

    return this.http.post<any>( this.REST_API_COMPLETE_TREE, contents, this.httpOptions);
  }


  public getUserSeasonInfo(){
    let contents = {
      cmd:"getUser"
    }
    return this.http.post<any>( this.CLOUD_API, contents,{withCredentials: true});
  }
}
