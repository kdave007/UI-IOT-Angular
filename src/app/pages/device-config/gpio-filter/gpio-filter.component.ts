import { Component, OnInit, Input, NgZone, OnDestroy } from '@angular/core';

import { ConfigsService } from '../services/configs.service';
import * as utils from '../services/utils';
import { Subscription } from 'rxjs';

/**
 * @brief
 *  GPIO list
 */
enum GPIO_LIST{
  _1,
  _2,
  _3,
  _4,
  _5,
  _6,
  _7,
  _8,
  _9,
  _10,
  _11,
  _12,
  _13,
  _14,
  _15,
  _16
}

@Component({
  selector: 'ngx-gpio-filter',
  templateUrl: './gpio-filter.component.html',
  styleUrls: ['./gpio-filter.component.scss']
})
export class GpioFilterComponent implements OnInit, OnDestroy {
  @Input('deviceId') devId : any;

  public SENSOR: utils.SENSORS_LIST[] = new Array(utils.SENSORS_LIST.max); 

  public GPIOS = [
    { id: GPIO_LIST._1, label: 'Sensor 1', defaultValue: 1, value: 0},
    { id: GPIO_LIST._2, label: 'Sensor 2', defaultValue: 2, value: 0},
    { id: GPIO_LIST._3, label: 'Sensor 3', defaultValue: 3, value: 0},
    { id: GPIO_LIST._4, label: 'Sensor 4', defaultValue: 4, value: 0},
    { id: GPIO_LIST._5, label: 'Sensor 5', defaultValue: 5, value: 0},
    { id: GPIO_LIST._6, label: 'Sensor 6', defaultValue: 6, value: 0},
    { id: GPIO_LIST._7, label: 'Sensor 7', defaultValue: 7, value: 0},
    { id: GPIO_LIST._8, label: 'Sensor 8', defaultValue: 8, value: 0},
    { id: GPIO_LIST._9, label: 'Sensor 9', defaultValue: 9, value: 0},
    { id: GPIO_LIST._10, label: 'Sensor 10', defaultValue: 10, value: 0},
    { id: GPIO_LIST._11, label: 'Sensor 11', defaultValue: 11, value: 0},
    { id: GPIO_LIST._12, label: 'Sensor 12', defaultValue: 12, value: 0},
    { id: GPIO_LIST._13, label: 'Sensor 13', defaultValue: 13, value: 0},
    { id: GPIO_LIST._14, label: 'Sensor 14', defaultValue: 14, value: 0},
    { id: GPIO_LIST._15, label: 'Sensor 15', defaultValue: 15, value: 0},
    { id: GPIO_LIST._16, label: 'Sensor 16', defaultValue: 16, value: 0},
  ];

  public subscriptionA = new Subscription();

  constructor(private configService : ConfigsService, private zone: NgZone) { }

  ngOnDestroy(): void {
    this.subscriptionA.unsubscribe();
  }

  ngOnInit() {
    this.subscriptionA = this.configService.getSensors().subscribe(newData => {
      this.SENSOR = newData;
      if(newData!=null){
        for (let index = 0; index < this.GPIOS.length; index++) {
          console.log("sensors loop values:",this.SENSOR[index])
          this.GPIOS[index].value = this.SENSOR[index];
        }
      }
    });

    this.configService.querySensors(this.devId);
  }

  /**
   * @brief
   *  Actualiza el filtro del GPIO especificado
   * 
   * @param newFilter 
   *  Nuevo filtro en ms
   * 
   * @param id 
   * ID del GPIO
   */
  public updateFilter(newFilter: any, id: GPIO_LIST){
    console.log("Calibration " + String(id) + ": " + String(newFilter.target.value) + "ms");

    this.SENSOR[id] =  Number(newFilter.target.value);

    this.configService.updateSensors(this.SENSOR);
  }
}
