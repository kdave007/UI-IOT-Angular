import { Component, OnInit, Input } from '@angular/core';

import { ConfigsService } from '../services/configs.service';
import * as utils from '../services/utils';

@Component({
  selector: 'ngx-sampling',
  templateUrl: './sampling.component.html',
  styleUrls: ['./sampling.component.scss']
})
export class SamplingComponent implements OnInit {
  @Input('deviceId') devId : any;

  public defaultSampleTime: number = 10;
  public defaultSamplePromNum: number = 2;

  private SAMPLING: utils.TEMP_SAMP_DATA = {
    interval: 0, samples: 0
  }
  
  constructor(private configService : ConfigsService) { }

  ngOnInit() {
    this.configService.getSampling().subscribe(newData => {
      console.log("request report data received:",newData)
      this.SAMPLING = newData;
      this.defaultSampleTime = this.SAMPLING.interval;
      this.defaultSamplePromNum = this.SAMPLING.samples;
    });

    this.configService.querySampling(this.devId);
  }

  /**
   * @brief
   *  Update the samples interval time
   * 
   * @param newSampleTime 
   *  New samples interval time
   */
  public updateSamplesTime(newSampleTime: any){
    console.log("Samples number:" + String(newSampleTime.target.value));

    this.SAMPLING.interval = Number(newSampleTime.target.value);

    this.configService.updateSampling(this.SAMPLING);
  }
  
  /**
   * @brief
   *  Update the samples number
   * 
   * @param newSampleNum 
   *  New samples number
   */
  public updateSamplesNum(newSampleNum: any){
    console.log("Samples number:" + String(newSampleNum.target.value));

    this.SAMPLING.samples = Number(newSampleNum.target.value);

    this.configService.updateSampling(this.SAMPLING);
  }

}
