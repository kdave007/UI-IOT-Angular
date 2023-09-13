import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_URL,CLOUD_URL } from "../../server";
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/map';

export interface REG_DATA {
  id: number; ///< Device ID
  alias: string; ///< Device alias
  route: string; ///< Device route
  bssid: string; ///< Device BSSID
  time: string; ///< Registration time
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private REST_API_DEVICES = CLOUD_URL + "mother_base";

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'text/plain'
    })
  };

  private devices: REG_DATA[] = [];
  private DEVICES_S = new Subject< REG_DATA[] >();

  constructor( private http: HttpClient ) { }

  /**
   * @brief
   *   Obtiene la lista de dispositivos pendientes
   * 
   * @param ownerId
   *  Id del dueño de los dispositivos 
   */
  public queryDevices() {
    let contents = {
      cmd:"devicesWaitingLine"
    }

    this.http.post<any>( this.REST_API_DEVICES, contents,{withCredentials:true}).subscribe(data => {

      for (let index = 0 ; index < data.length ; index++) {
        let device: REG_DATA = {
          id: data[index].deviceId,
          alias: data[index].alias,
          route: data[index].route,
          bssid: data[index].bssidCreated,
          time: data[index].createdOn
        };

        this.devices[index] = device;
      }

     this.DEVICES_S.next(this.devices);
    });
  }

  /**
   * @brief 
   *  Crea un nuevo dispositivo
   * 
   * @param _alias 
   *  Alias del dispositivo
   * 
   * @param _route 
   *  Ruta del dispositivo
   * 
   * @param _bssid 
   *  BSSID del dispositivo
   * 
   * @param _owner 
   *  Dueño del dispositivo
   */
  public createDevice(_alias: string, _route: string, _bssid: string) {
    let contents = {
      cmd:"createDevice",
      newDevice: {
        alias: _alias,
        route: _route,
        bssid: _bssid
      }
    }

    this.http.post<any>( this.REST_API_DEVICES, contents,{withCredentials:true}).subscribe(data => {});
  }

    /**
   * @brief 
   *  Elimina un dispositivo
   * 
   * @param _id
   *  ID del dispositivo
   */
  public deleteDevice( _id: number ) {
    let contents = {
      cmd:"deleteNewDevice",
      Device: _id
    }

    this.http.post<any>( this.REST_API_DEVICES, contents,{withCredentials:true}).subscribe(data => {});
  }

  ///*** OBSERVABLES ***///

  /**
   * @brief
   *  Observable para la lista de mensajes
   */
  public getDevices(): Observable < REG_DATA[] > {
    return this.DEVICES_S.asObservable();
  }
}
