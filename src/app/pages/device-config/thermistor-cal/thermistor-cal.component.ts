import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IDropdownSettings,MultiSelectComponent } from 'ng-multiselect-dropdown';
import { ConfigsService } from '../services/configs.service';
import * as utils from '../services/utils';
import { Subscription } from 'rxjs';
import { TempCalibrationSamplesService } from '../services/temp-calibration-samples.service';
import { CommonModule } from '@angular/common';

/**
 * @brief
 *  Thermistor list
 */
enum THERMISTOR_LIST{
  _1,
  _2,
  _3,
  _4,
  _max
}

@Component({
  selector: 'ngx-thermistor-cal',
  templateUrl: './thermistor-cal.component.html',
  styleUrls: ['./thermistor-cal.component.scss']
})
export class ThermistorCalComponent implements OnInit, OnDestroy {
  @Input('deviceId') devId : any;

  public subscriptionA = new Subscription();
  public subscriptionB = new Subscription();
  public subscriptionC = new Subscription();
  public subscriptionD = new Subscription();

  public thermistors = [
    { id: THERMISTOR_LIST._1, label: 'Termistor 1: ', defaultValue: 1, value: 0, references:[]},
    { id: THERMISTOR_LIST._2, label: 'Termistor 2: ', defaultValue: 2, value: 0, references:[]},
    { id: THERMISTOR_LIST._3, label: 'Termistor 3: ', defaultValue: 3, value: 0, references:[]},
    { id: THERMISTOR_LIST._4, label: 'Termistor 4: ', defaultValue: 4, value: 0, references:[]},
  ];

  public selectedSamples = [
    { id: THERMISTOR_LIST._1, samples: [] },
    { id: THERMISTOR_LIST._2, samples: [] },
    { id: THERMISTOR_LIST._3, samples: [] },
    { id: THERMISTOR_LIST._4, samples: [] }
  ]

  private THERMISTOR: utils.THERMISTORS[] = new Array(utils.THERMISTORS.max); 

  public myRange = {};
  public  updateRange = false;

  constructor(private configService : ConfigsService,private tempSamplesService : TempCalibrationSamplesService) { }

  ngOnDestroy(): void {
    this.subscriptionA.unsubscribe();
    this.subscriptionB.unsubscribe();
    this.subscriptionC.unsubscribe();
    this.subscriptionD.unsubscribe();
  }

  ngOnInit() {
    this.subscriptionA = this.configService.getThermistors().subscribe(newData => {
      this.THERMISTOR = newData;
      console.log("THERMISTOR newData:",newData)
      if(newData!=null){
        for (let index = 0; index < this.thermistors.length; index++) {
          this.thermistors[index].value = this.THERMISTOR[index];
        }
      }
    });

    // this.subscriptionA = this.tempSamplesService.getLatest(this.devId).subscribe(newData => {
    //   console.log("thermistors samples found ",newData)
    //   try {
    //     if(newData.length!=undefined){
    //       let samples = (newData.empty) ? [] : newData;
          
    //       for (let index = 0; index < this.thermistors.length; index++) {
    //         this.thermistors[index].references = this.sortSamples(index,samples);
    //       }
    //       console.log("THERMISTORS _____ ",this.thermistors)
    //     }
    //   }catch(e){
    //     console.error("no data found in samples")
    //   }
      
    // });

    this.subscriptionC = this.tempSamplesService.getSelected().subscribe( newData => {
      console.log("thermistors selected range samples found ",newData)
      try {
        if(newData.length!=undefined){
          let samples = (newData.empty) ? [] : newData;
          
          for (let index = 0; index < this.thermistors.length; index++) {
            this.thermistors[index].references = this.sortSamples(index,samples);
          }
          console.log("THERMISTORS _____ ",this.thermistors)
        }
      }catch(e){
        console.error("no data found in samples")
      }
    });

    this.subscriptionD = this.tempSamplesService.getPoints().subscribe( newData => {
     console.log("got new data from server",newData);
     if(newData!=null && newData.length){
       
      this.selectedSamples = newData;
       
     }

    });

    this.configService.queryThermistors(this.devId);
  }
  
  private sortSamples(index: number, samples: any[]): any[] {
    let INDEX_KEY = ["temp1","temp2","temp3","temp4"];
    let currentKey = INDEX_KEY[index];
    let sorted = [];

    samples.forEach((element,i) => {
      sorted.push({temp: element[currentKey],timestamp : this.sortDateFormat(element.dateTime),disabledAdd:false})
    });

    return sorted;
  }

  /**
   * @brief
   *  Actualiza la calibración del sensor
   * 
   * @param newCal 
   *  Nueva calibración en grados centigrados
   * 
   * @param id 
   *  ID del termistor
   */
  public updateCalibration(){
    console.log("set",this.selectedSamples);
    this.tempSamplesService.setPoints(this.selectedSamples);
    //UPDATE SUBJECT RIGHT HERE <-----------------------------------------------------------------------------
  }

  public rangeChange($event){
    if($event.end){
      this.myRange = $event;
      this.updateRange = true;
      
    }
  }
  
  public selectSample(thermistorId,item,sampleIndex){
    this.setDisableAddButton(thermistorId,sampleIndex,true);
    this.onItemSelectAdd(thermistorId,item,sampleIndex);
    console.log("samples selected",this.selectedSamples[thermistorId]);
    this.updateCalibration();
  }

  public removeSelected(item,thermistorId){
    this.onSelectRemove(item,thermistorId);
    if(this.isTheRightSample(item,thermistorId)){
      this.setDisableAddButton(thermistorId,item.sampleIndex,false);
    }
    this.updateCalibration();
    console.log("samples selected",this.selectedSamples[thermistorId]);
  }

  private setDisableAddButton(thermistorId,sampleIndex,disable){
      this.thermistors[thermistorId].references[sampleIndex].disabledAdd = disable;
  }

  private isTheRightSample(item,thermistorId){  
    let target = this.thermistors[thermistorId].references[item.sampleIndex];
    let current = item;
    console.log("compare ",target,"vs",item);
    if(target.temp == current.temp && target.timestamp == current.timestamp){
      return true;
    }
    return false;
  }

  public updateData(){
    this.tempSamplesService.setNewValues(this.devId,this.myRange);
    
  }

  private sortDateFormat(date,noTime?){
    let d = new Date(date);
    
    let fixedSec =(d.getSeconds()<10) ? ("0"+d.getSeconds()) : d.getSeconds();
    let fixedMon =((d.getMonth()+1)<10) ? ("0"+(d.getMonth()+1)) : (d.getMonth()+1);
    let fixedDay =(d.getDate()<10) ? ("0"+d.getDate()) : d.getDate();
    let fixedMin=(d.getMinutes()<10) ? ("0"+d.getMinutes()) : d.getMinutes();
    let fixedHour=(d.getHours()<10) ? ("0"+d.getHours()) : d.getHours();

    if(noTime){
      return d.getFullYear()+"-"+fixedMon+"-"+fixedDay;
    }

    return d.getFullYear()+"-"+fixedMon+"-"+fixedDay+" "+fixedHour+":"+fixedMin+":"+fixedSec;
  }

  //add list handlers
  onItemSelectAdd(thermistorId : any , item : any ,sampleIndex : number) {
    this.selectedSamples[thermistorId].samples.push({temp:item.temp,timestamp:item.timestamp,sampleIndex,value:0});
  }
  
  onSelectRemove(item: any,thermistorIndex : number){
    var index2RemoveB = this.selectedSamples[thermistorIndex].samples.findIndex(obj => obj.temp==item.temp && obj.timestamp==item.timestamp);
    this.selectedSamples[thermistorIndex].samples.splice(index2RemoveB,1);
  }
  

}
