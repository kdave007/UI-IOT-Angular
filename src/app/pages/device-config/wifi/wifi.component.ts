import { Component, OnInit, Input, AfterViewInit, NgZone, OnDestroy } from '@angular/core';

import { ConfigsService } from '../services/configs.service';
import * as utils from '../services/utils';
import { Subscription } from 'rxjs';

/**
 * @brief
 *  WIFI profiles list
 */
enum WIFI_PROFILES{
  _1 = 0,
  _2,
  _3,
  _4,
  _5
}

/**
 * @brief
 *  Wifi priority list
 */
enum WIFI_PRIORITY{
  _1 = 1,
  _2,
  _3,
  _4,
  _5
} 

@Component({
  selector: 'ngx-wifi',
  templateUrl: './wifi.component.html',
  styleUrls: ['./wifi.component.scss']
})
export class WifiComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @Input('deviceId') devId : any;  

  public showSsid: boolean = false;
  public showKey: boolean = false;
  public showMac: boolean = false;

  public subscriptionA = new Subscription();

  private WIFI: utils.WIFI_DATA[] = [
    {ssid: null, key: null, bssid: null, priority: 0},
    {ssid: null, key: null, bssid: null, priority: 0},
    {ssid: null, key: null, bssid: null, priority: 0},
    {ssid: null, key: null, bssid: null, priority: 0},
    {ssid: null, key: null, bssid: null, priority: 0}
  ];

  public profiles = [
    { id: WIFI_PROFILES._1, label: 'Red 1', ssid: "ssd1", key: "key1", bssid: "aa:aa:aa:aa:aa:aa", pry: String(WIFI_PRIORITY._1), defaultValue: 1},
    { id: WIFI_PROFILES._2, label: 'Red 2', ssid: "ssd2", key: "key2", bssid: "aa:aa:aa:aa:aa:aa", pry: String(WIFI_PRIORITY._2), defaultValue: 2},
    { id: WIFI_PROFILES._3, label: 'Red 3', ssid: "ssd3", key: "key3", bssid: "aa:aa:aa:aa:aa:aa", pry: String(WIFI_PRIORITY._3), defaultValue: 3},
    { id: WIFI_PROFILES._4, label: 'Red 4', ssid: "ssd4", key: "key4", bssid: "aa:aa:aa:aa:aa:aa", pry: String(WIFI_PRIORITY._4), defaultValue: 4},
    { id: WIFI_PROFILES._5, label: 'Red 5', ssid: "ssd5", key: "key5", bssid: "aa:aa:aa:aa:aa:aa", pry: String(WIFI_PRIORITY._5), defaultValue: 5}
  ];  

  public priorities = [
    { id: String(WIFI_PRIORITY._1), value: WIFI_PRIORITY._1, name: "Prioridad 1" },
    { id: String(WIFI_PRIORITY._2), value: WIFI_PRIORITY._2, name: "Prioridad 2" },
    { id: String(WIFI_PRIORITY._3), value: WIFI_PRIORITY._3, name: "Prioridad 3" },
    { id: String(WIFI_PRIORITY._4), value: WIFI_PRIORITY._4, name: "Prioridad 4" },
    { id: String(WIFI_PRIORITY._5), value: WIFI_PRIORITY._5, name: "Prioridad 5" },
  ]

  constructor(private configService : ConfigsService, private zone:NgZone) { }

  ngOnInit() {
    let subscriptionA = this.configService.getWifi().subscribe(newData => {
      for (let index = 0; index < utils.WIFI_PROFILES_LIST.max; index++) {
        this.WIFI[index].ssid = newData[index].ssid;
        this.WIFI[index].bssid = newData[index].bssid;
        this.WIFI[index].key = newData[index].key;
        this.WIFI[index].priority = newData[index].priority;
        
        this.profiles[index].ssid = this.WIFI[index].ssid;
        this.profiles[index].bssid = this.WIFI[index].bssid;
        this.profiles[index].key = this.WIFI[index].key;
        this.profiles[index].pry = String( this.WIFI[index].priority );
      }
    });
    
    this.configService.queryWifi(this.devId);
  }

  ngOnDestroy(): void {
    this.subscriptionA.unsubscribe();
  }

  ngAfterViewInit(){
  }


  /**
   * @brief
   *  Eliminar una red 
   * 
   * @param profileId 
   *  ID de la red
   */
  public delete(profileId: WIFI_PROFILES){
    console.log("Delete: " + String(profileId));

    this.WIFI[profileId].ssid = null;
    this.WIFI[profileId].bssid = null;
    this.WIFI[profileId].key = null;
    this.WIFI[profileId].priority = 0;

    this.profiles[profileId].ssid = this.WIFI[profileId].ssid;
    this.profiles[profileId].bssid = this.WIFI[profileId].bssid;
    this.profiles[profileId].key = this.WIFI[profileId].key;
    this.profiles[profileId].pry = String( this.WIFI[profileId].priority );

    this.configService.updateWifi(this.WIFI);
  }

  /**
   * @brief
   *  Actualiza la prioridad de red
   * 
   * @param profileId 
   *  ID de la red
   * 
   * @param profilePry 
   *  Nueva prioridad
   */
  public setPriority(profileId: WIFI_PROFILES, profilePry: WIFI_PRIORITY){
    console.log("Set profile " + String(profileId) + " priority:" + String(profilePry));

    this.WIFI[profileId].priority = profilePry;
    
    this.configService.updateWifi(this.WIFI);
  }
  
  /**
   * @brief
   *  Estructura el BSSID
   * 
   * @param e 
   *  BSSID
   */
  public formatMAC(e, profileId: WIFI_PROFILES) {
    let r = /([a-f0-9]{2})([a-f0-9]{2})/i,
        str = e.target.value.replace(/[^a-f0-9]/ig, "");

    while (r.test(str)) {
        str = str.replace(r, '$1' + ':' + '$2');
    }

    e.target.value = str.slice(0, 17);

    this.WIFI[profileId].bssid = e.target.value;
    
    this.configService.updateWifi(this.WIFI);
  }

  /**
   * @brief
   *  Actualiza el SSID
   * @param e 
   * @param profileId 
   */
  public updateSsid(e, profileId: WIFI_PROFILES){
    this.WIFI[profileId].ssid = e.target.value;
    
    this.configService.updateWifi(this.WIFI);
  }

  /**
   * @brief
   *  Actualiza la clave
   * 
   * @param e 
   * @param profileId 
   */
  public updateKey(e, profileId: WIFI_PROFILES){
    this.WIFI[profileId].key = e.target.value;
    
    this.configService.updateWifi(this.WIFI);
  }
}
