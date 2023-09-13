import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as utils from './utils';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_URL,CLOUD_URL } from "../../server";
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class ConfigsService implements OnInit {
  private REST_API_SETTINGS = CLOUD_URL + "config";
  //private REST_API_SETTINGS =  "http://localhost:94" + "/config";

  private WIFI: utils.WIFI_DATA[] = [
    {ssid: null, key: null, bssid: null, priority: 0},
    {ssid: null, key: null, bssid: null, priority: 0},
    {ssid: null, key: null, bssid: null, priority: 0},
    {ssid: null, key: null, bssid: null, priority: 0},
    {ssid: null, key: null, bssid: null, priority: 0}
  ]

  private SENSOR: utils.SENSORS_LIST[] = new Array(utils.SENSORS_LIST.max); 
  private THERMISTOR: utils.THERMISTORS[] = new Array(utils.THERMISTORS.max); 
  
  private REPORT: utils.REPORT_DATA = {
    type: utils.REPORTS_LIST.interval, intervalTime: 0, scheduleTime: 0
  }

  private SAMPLING: utils.TEMP_SAMP_DATA = {
    interval: 0, samples: 0
  }

  private L_MODULES = [];
  private ADVANCED_SETTINGS: utils.ADVANCED_CONFIG = {
    keep_alive: 0,
    ka_GPS:false,
    log_GPS:0
  };

  private WIFI_S = new Subject< utils.WIFI_DATA[] >();
  private SENSOR_S = new Subject< utils.SENSORS_LIST[] >();
  private THERMISTOR_S = new Subject< utils.THERMISTORS[] >();
  private REPORT_S = new Subject< utils.REPORT_DATA >();
  private SAMPLING_S = new Subject< utils.TEMP_SAMP_DATA >();
  private L_MODULES_S = new Subject<any>();
  private ADVANCED_SETTINGS_S = new Subject< utils.ADVANCED_CONFIG >();

  private httpOptions = {
    headers: new HttpHeaders({
      // 'Content-Type':  'text/plain',
    }),
  };

  constructor( private http: HttpClient ) { }

  ngOnInit(){
    for(let i = 0; i < utils.L_MODULE.MAX; i++){
      this.L_MODULES.push({
        sensor:[
          {edge:true,status:true,treshold:0,filter:1000},
          {edge:true,status:false,treshold:0,filter:0},
          {edge:true,status:false,treshold:0,filter:0}
        ],
        address: null,
        enable:0,
        moduleCode : null
      });
    }
   
  }

  ///*** DATABASE UPDATE ***///

  /**
   * @brief 
   *  Actualiza los datos wifi en la base de datos
   * 
   * @param newData 
   *  Nuevos datos
   */
  public setWifi( newData: utils.WIFI_DATA[], id: number ) {
    let contents = {
      Write: true,
      Data: newData,
      Device: id,
      dataType:"Ap"
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {});    

   // this.queryWifi(id);
    console.log("wifi",contents);
    this.WIFI = newData;
    this.WIFI_S.next(this.WIFI);
  }

  /**
   * @brief
   *  Actualiza los datos de los sensores en la base de datos
   * 
   * @param newData 
   *  Nuevos datos
   */
  public setSensors( newData: utils.SENSORS_LIST[], id: number ) {
    let contents = {
      Write: true,
      Data: newData,
      Device: id,
      dataType:"Sensors"
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {});
    console.log("sensors",contents);
    this.SENSOR = newData;
    this.SENSOR_S.next(this.SENSOR);
  }

  /**
   * @brief
   *  Actualiza los datos de los termistores en la base de datos
   * 
   * @param newData 
   *  Nuevos datos
   */
  public setThermistors( newData: utils.THERMISTORS[], id: number ) {
    let contents = {
      Write: true,
      Data: newData,
      Device: id,
      dataType:"Thermistor"
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {});
    console.log("thermistors",contents);
    this.THERMISTOR = newData;
    this.THERMISTOR_S.next(this.THERMISTOR);
  }

  /**
   * @brief
   *  Actualiza los datos de reporte en la base de datos
   * 
   * @param newData 
   *  Nuevos datos
   */
  public setReport( newData: utils.REPORT_DATA, id: number ) {
    let contents = {
      Write: true,      
      Device: id,
      dataType:"Report",
      Data: {
        mode: newData.type,
        interval: newData.intervalTime,
        scheduled: ( newData.scheduleTime == 24) ? 0 : newData.scheduleTime,// if we get a 24, save it as a 0... 
        lte_en: newData.lte_en,
        gps_en: newData.gps_en
      }
    }

    console.log("offset : ",contents.Data.scheduled);

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {});
      console.log("report",contents);
      this.REPORT = newData;
      this.REPORT_S.next(this.REPORT);
  }

  /**
   * @brief
   *  Actualiza los datos de muestreo en la base de datos
   * 
   * @param newData 
   *  Nuevos datos
   */
  public setSampling( newData: utils.TEMP_SAMP_DATA, id: number ) {
    let contents = {
      Write: true,
      Data: newData,
      Device: id,
      dataType:"Sampling"
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {});
    console.log("sampling",contents);
    this.SAMPLING = newData;
    this.SAMPLING_S.next(this.SAMPLING);
  }

  /**
   * @brief
   *  Actualiza los datos de muestreo en la base de datos
   * 
   * @param newData 
   *  Nuevos datos
   */
  public setLightModules( newData: any, id: number ) {
    let contents = {
      Write: true,
      Data: newData,
      Device: id,
      dataType:"Lmod"
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {});
      console.log("Lmod",contents);
      this.L_MODULES = newData;
      this.L_MODULES_S.next(this.L_MODULES);
  }

  /**
   * @brief
   *  Actualiza los datos de muestreo en la base de datos
   * 
   * @param newData 
   *  Nuevos datos
   */
  public setAdvancedSettings( newData: any, id: number ) {
    let contents = {
      Write: true,
      Data: newData,
      Device: id,
      dataType:"advancedSettings"
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {});
      console.log("sampling",contents);
      this.ADVANCED_SETTINGS = newData;
      this.ADVANCED_SETTINGS_S.next(this.ADVANCED_SETTINGS);
  }


  


  ///*** LOCAL UPDATE ***///

  /**
   * @brief
   *  Actualiza localmente los datos WIFI
   * 
   * @param newData 
   *  Nuevos datos
   */
  public updateWifi( newData: utils.WIFI_DATA[] ){
    this.WIFI = newData;

    this.WIFI_S.next(this.WIFI);
  }

  /**
   * @brief
   *  Actualiza localmente los datos de los sensores
   * 
   * @param newData 
   *  Nuevos datos
   */
  public updateSensors( newData: utils.SENSORS_LIST[] ){
    this.SENSOR = newData;

    this.SENSOR_S.next(this.SENSOR);
  }

  /**
   * @brief
   *  Actualiza localmente los datos de los termistores
   *  
   * @param newData 
   *  Nuevos datos
   */
  public updateThermistors( newData: utils.THERMISTORS[] ){
    this.THERMISTOR = newData;

    this.THERMISTOR_S.next(this.THERMISTOR);
  }

  /**
   * @brief
   *  Actualiza localmente los datos de reporte
   * 
   * @param newData 
   *  Nuevos datos
   */
  public updateReport( newData: utils.REPORT_DATA ){
    this.REPORT = newData;

    this.REPORT_S.next(this.REPORT);
  }

  /**
   * @brief
   *  Actualiza los datos a muestreo
   * 
   * @param newData 
   *  Nuevos datos
   */
  public updateSampling( newData: utils.TEMP_SAMP_DATA ){
    this.SAMPLING = newData;

    this.SAMPLING_S.next(this.SAMPLING);
  }

  /**
   * @brief
   *  Actualiza los modulos de sensores de luz
   * 
   * @param newData 
   *  Nuevos datos
   */
  public updateLightModules( newData: any){
    this.L_MODULES = newData;

    this.L_MODULES_S.next(this.L_MODULES);
  }

  /**
   * @brief
   *  Actualiza las congiruaciones avanzadas
   * 
   * @param newData 
   *  Nuevos datos
   */
  public updateAdvancedSettings( newData: any ){
    this.ADVANCED_SETTINGS = newData;

    this.ADVANCED_SETTINGS_S.next(this.ADVANCED_SETTINGS);
  }

  ///*** LOCAL GET ***//

  public localGetWifi(){
    return this.WIFI;
  }

  public localGetSensors(){
    return this.SENSOR;
  }

  public localGetThermistors(){
    return this.THERMISTOR;
  }

  public localGetReport(){
    return this.REPORT;
  }

  public localGetSampling(){
    return this.SAMPLING;
  }

  ///*** DATABASE GET ***///

  /**
   * @brief
   *  Obtiene todos los datos disponibles de la base de datos
   */
  public queryAll( id: number ) {
    this.queryWifi(id);
    this.querySensors(id);
    this.queryThermistors(id);
    this.queryReport(id);
    this.querySampling(id);
    this.queryAdvancedConfig(id);
    this.queryLightModules(id);
  }

  /**
   * @brief
   *  Obtiene los datos wifi de la base de datos
   */
  public queryWifi( id: number ) {
    let contents = {
      Write: false,
      Device: id,
      dataType:"Ap"
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {
      if(data!=null){
        for (let index = 0 ; index < data.length ; index++) {
          this.WIFI[index].ssid = data[index].ssid;
          this.WIFI[index].key = data[index].key;
          this.WIFI[index].bssid = data[index].bssid;
          this.WIFI[index].priority = data[index].priority;  
        }
        
        this.WIFI_S.next(this.WIFI);
      }
    });    
  }

  /**
   * @brief
   *  Obtiene los datos de los sensores de la base de datos
   */
  public querySensors( id: number ) {
    let contents = {
      Write: false,
      Device: id,
      dataType:"Sensors"
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {
      if(data!=null){
        for (let index = 0 ; index < data.length ; index++) {
          this.SENSOR[index] = data[index];
        }

        this.SENSOR_S.next(this.SENSOR);
      }
    })
  }

  /**
   * @brief
   *  Obtiene los datos de los termistores de la base de datos
   */
  public queryThermistors( id: number ) {
    let contents = {
      Write: false,
      Device: id,
      dataType:"Thermistor"
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {
      console.log("data thermistor :: ",data)
      if(data!=null){
        for (let index = 0 ; index < data.length ; index++) {
          this.THERMISTOR[index] = data[index];
        }
        console.log("therm ",this.THERMISTOR)
        this.THERMISTOR_S.next(this.THERMISTOR);
      }
    });
  }

  /**
   * @brief
   *  Obtiene los datos del reporte de la base de datos
   */
  public queryReport( id: number ) {
    let contents = {
      Write: false,
      Device: id,
      dataType:"Report"
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {
      if(data!=null){
        this.REPORT.intervalTime = data.interval;
        this.REPORT.scheduleTime = (data.scheduled == 0) ? 24 : data.scheduled;//If we find a 0, show it as a 24 ....
        this.REPORT.type = data.mode;
        this.REPORT.lte_en = data.lte_en;
        this.REPORT.gps_en = data.gps_en;

        this.REPORT_S.next(this.REPORT);
        }
    })
  }

  /**
   * @brief
   *  Obtiene los datos de los sensores de luz
   */
  public querySampling( id: number ) {
    let contents = {
      Write: false,
      Device: id,
      dataType:"Sampling"
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {
      console.log("data received in sampling",data)

      if(data!=null){
        this.SAMPLING.interval = data.interval;
        this.SAMPLING.samples = data.samples
        
        this.SAMPLING_S.next(this.SAMPLING);
      }
      
    })
  }

  /**
   * @brief
   *  Obtiene los datos de los modulos de sensores de luz
   */
  public queryLightModules( id: number ) {
    let contents = {
      Write: false,
      Device: id,
      dataType:"Lmod"
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {
      console.log("data received in lightModules",data)

      if(data!=null){
        this.L_MODULES = data;
        
        this.L_MODULES_S.next(this.L_MODULES);
      }
      
    })
  }

  /**
   * @brief
   *  Obtiene los datos de las configuraciones avanzadas
   */
  public queryAdvancedConfig( id: number ) {
    let contents = {
      Write: false,
      Device: id,
      dataType:"advancedSettings"
    }

    this.http.post<any>( this.REST_API_SETTINGS, contents, {withCredentials: true}).subscribe(data => {
      console.log("data received in advanced",data)

      if(data!=null){
        this.ADVANCED_SETTINGS.keep_alive = data.keep_alive;
        this.ADVANCED_SETTINGS.ka_GPS = data.ka_GPS
        this.ADVANCED_SETTINGS.log_GPS = data.log_GPS
        
        this.ADVANCED_SETTINGS_S.next(this.ADVANCED_SETTINGS);
      }
      
    })
  }


  ///*** OBSERVABLES ***///

  /**
   * @brief
   *  Observable para los datos WIFI
   */
  public getWifi(): Observable < utils.WIFI_DATA[] > {
    return this.WIFI_S.asObservable();
  }

  /**
   * @brief
   *  Observable para los sensores
   */
  public getSensors(): Observable < utils.SENSORS_LIST[] > {
    return this.SENSOR_S.asObservable();
  }

  /**
   * @brief
   *  Observable para los termistores
   */
  public getThermistors(): Observable < utils.THERMISTORS[] > {
    return this.THERMISTOR_S.asObservable();
  }

  /**
   * @brief
   *  Observable para los contenidos del reporte
   */
  public getReport(): Observable < utils.REPORT_DATA > {
    return this.REPORT_S.asObservable();
  }

  /**
   * @brief
   *  Observable para las configuraciones del muestreo
   */
  public getSampling(): Observable < utils.TEMP_SAMP_DATA > {
    return this.SAMPLING_S.asObservable();
  }
  /**
   * @brief
   *  Observable para los contenidos modulos de sensores de luz
   */
  public getLightModules(): Observable < any > {
    return this.L_MODULES_S.asObservable();
  }

  /**
   * @brief
   *  Observable para las configuraciones avanzadas
   */
  public getAdvancedSettings(): Observable < any > {
    return this.ADVANCED_SETTINGS_S.asObservable();
  }
}



