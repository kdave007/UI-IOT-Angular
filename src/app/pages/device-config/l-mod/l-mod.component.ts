import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ConfigsService } from '../services/configs.service';
import * as utils from '../services/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-l-mod',
  templateUrl: './l-mod.component.html',
  styleUrls: ['./l-mod.component.scss']
})
export class LModComponent implements OnInit,OnDestroy {
  @Input('deviceId') devId : any;

  public subscriptionA = new Subscription();

  public LIGHT_MODULES = [];

  public LIGHT_SENSORS = [];
  public selectedSensor = 0;

  constructor(private configService : ConfigsService) {
    this.fillDefaultModules();
  }

  ngOnDestroy(): void {
    
  }

  ngOnInit() {

    this.subscriptionA = this.configService.getLightModules().subscribe(newData => {
      
      console.log("THERMISTOR newData:",newData);
      this.LIGHT_MODULES = newData;
    });

    this.configService.queryLightModules(this.devId);
  }

  private fillDefaultModules(){
    for(let i = 0; i < utils.L_SENS.MAX; i++){
      this.LIGHT_SENSORS.push(i);
    }

    for(let i = 0; i < utils.L_MODULE.MAX; i++){


      this.LIGHT_MODULES.push({
        sensor:[
          {edge:true,status:true,treshold:0,filter:1000},
          {edge:true,status:false,treshold:0,filter:0},
          {edge:true,status:false,treshold:0,filter:0}
        ],
        address: null
      });
    }
  }

  public updateModules(newData?){

  }

}
