import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ConfigsService } from '../services/configs.service';
import * as utils from '../services/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.scss']
})
export class AdvancedComponent implements OnInit,OnDestroy {
  @Input('deviceId') devId : any;
  public subscriptionA = new Subscription();

  public ADVANCED_SETTINGS : utils.ADVANCED_CONFIG = {
    keep_alive: 0,
    ka_GPS:false,
    log_GPS:0
  }

  constructor(private configService : ConfigsService) { }

  ngOnDestroy(): void {
    
  }

  ngOnInit() {
    this.subscriptionA = this.configService.getAdvancedSettings().subscribe(newData => {
      
      console.log("THERMISTOR newData:",newData)
      this.ADVANCED_SETTINGS = newData;
    });

    this.configService.queryAdvancedConfig(this.devId);
  }

}
