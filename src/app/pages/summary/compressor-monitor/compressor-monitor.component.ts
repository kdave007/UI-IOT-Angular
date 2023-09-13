import { Component, OnInit, OnDestroy,Input, ɵConsole } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { CompressorMonitorService } from '../../../services/compressor-monitor.service';
import { CompressorGpioService } from '../local-service/compressor-gpio.service';
import { last } from 'rxjs/operators';


@Component({
  selector: 'ngx-compressor-monitor',
  templateUrl: './compressor-monitor.component.html',
  styleUrls: ['./compressor-monitor.component.scss']
})
export class CompressorMonitorComponent implements OnInit,OnDestroy {
  @Input('compData') fixedCompActivationData : any;
  @Input('deviceId') devId : number;
  myRange;
  opMonUpdateActive=false;
  //compressTreshold=43;
  subscription : Subscription;defaultDate={start:"",end:""};
  //samples;
  //weekendAverage;noLoadDays=0;weekAverage;powerConsumption;dynamicPowerCon;powconReady=false;powDynConReady=false;
  chosenPeriods=[];
  showIntervalsTable=false;
  weekReady=false;
  compWeekTimes = { weekend : { days:0 , hours:0, min:0, sec: 0 } , weekday :{ days:0 , hours:0, min:0, sec: 0 } ,comp_off:{ days:0 }};
  //weekendReady=false;allPeriods;
  INTERVAL_TASKS = {
    CLOSE : 0,
    START : 1,
    INTERSECTION : 2
  }

  defaultDateHidden = false;

  constructor(public compressorService : CompressorMonitorService, public compGpioService : CompressorGpioService) { }

  ngOnInit() {
    
    this.initialRange();
    //this.fixedPowerConsumption();

    //NEW VERSION STARTS FROM HERE :
                                        
    this.updateData(false);

  }

  public initialRange(){
    let today = new Date();
    let minusaWeek = today.getTime()-(604800*1000);
    let weekAgoDate = new Date(minusaWeek);
    let fixedStartDate = (weekAgoDate.getDate()>9)? weekAgoDate.getDate() : "0"+weekAgoDate.getDate();
    let fixedStartMonth = (weekAgoDate.getMonth()>8)? (weekAgoDate.getMonth()+1) : "0"+(weekAgoDate.getMonth()+1);
    let fixedEndDate = (today.getDate()>9)? today.getDate() : "0"+today.getDate();
    let fixedEndMonth = (today.getMonth()>8)? (today.getMonth()+1) : "0"+(today.getMonth()+1);

    this.defaultDate["start"]= fixedStartDate+"-"+fixedStartMonth+"-"+weekAgoDate.getFullYear();
    this.defaultDate["end"]= fixedEndDate+"-"+fixedEndMonth+"-"+today.getFullYear();
    this.myRange = {start:weekAgoDate,end:today};
  }

  opMonRangeChange($event){
    if($event.end){
     this.myRange = $event;
     this.opMonUpdateActive=true;
    }
    
  }

  updateData(hide){
    if(hide){
      this.defaultDateHidden = hide;
    }

    this.compGpioService.getRawData(this.myRange,this.devId).subscribe( data => {
      //console.log("NEW SERVICE DATA RETRIEVED",data);
      if(data!=null){
       // let periods = this.getPeriods(data);
       let periods = this.sortPeriods(data);
        if(periods!=null && periods.length){
          this.chosenPeriods = periods;
          this.showIntervalsTable=true;
        }
        
      }
    });

    this.compGpioService.getMeanTimes(this.myRange,this.devId).subscribe( data => {
      //console.log("NEW SERVICE MEAN TIMES DATA RETRIEVED",data);
      if(data!=null && data!=undefined && data!=""){
        this.weekReady = true;
        this.compWeekTimes = data;
      }else{
        this.weekReady = false;
      }        
      
    });

  //   this.subscription = this.compressorService.getSamples(this.myRange).subscribe( data  => {
  //   this.samples=data;
  //   this.sortWeekendSamples(data);
  //  });
  //  this.loadActivatedCompTable(this.allPeriods);
  //  this.dynamicPowerConsumption(this.allPeriods,this.myRange);
  }

  ngOnDestroy(){
    //this.subscription.unsubscribe();
  }

  private sortPeriods(rows){
    let lastIndex = (rows.length!=undefined && rows.length) ? rows.length-1 : -1;

    let references = {
      pastState : -1,
      currentIndex : -1,
      lastIndex,
      previousInterval : null,
      sortedPeriods : [],
      recentSortedIndex : -1,
      periodToStart : null,
      firstLowState: true
    };
    //console.log("last index value ",lastIndex);

    for(let i = 0; i < rows.length; i++){ 
      references.currentIndex = i;
     // console.log(i)

      if(this.checkLastIndex(i,references.lastIndex)){
       // console.log("WE ARE IN THE LAST ROW")
        this.lastIndexScenario(rows[i],references);
      }
      
      
      if(this.stateChange(rows[i].gpio12,references.pastState)){
       // console.log("WE ARE IN THE first ROW",i)
        this.setInterval(rows[i],i,references);
        
        references.previousInterval = rows[i].timestamp;
       // console.log("previous interval",references.previousInterval);
        references.pastState = rows[i].gpio12;
        
      }
     // console.log(rows[i]);
    }
   // console.log("the new function result",references.sortedPeriods)
    return references.sortedPeriods;
  }

  private stateChange(current,past){
    if(current!=past){
      return true;
    }
    return false;
  }

  private checkLastIndex(i,lastIndex){
    if(i==lastIndex){
      return true;
    }
    return false;
  }

  private lastIndexScenario(currentRow,references){
    if(currentRow.gpio12){
      let endWithOffset = this.endOffsetDate(currentRow.timestamp);
      if(references.previousInterval==null){
        //if is the only row, set the interval period with a 23:59:59 end time offset
        
        this.endPeriod(currentRow.timestamp,this.sortDateFormat(endWithOffset),references);
      }else{
        //should i take only to where i have , or is it implicit?
        let start = (references.periodToStart==null) ? currentRow.timestamp : references.periodToStart;
        this.endPeriod(start,this.sortDateFormat(endWithOffset),references);
        //this.endPeriod(references.periodToStart,currentRow.timestamp,references);
      }
    }
  }

  private implicitPeriod(currentRow,references){
    if(!currentRow.gpio12){
      references.firstLowState = false;
      let startWithOff = this.startOffsetDate(currentRow.timestamp);
      let start = this.sortDateFormat(startWithOff);
      this.endPeriod(start,currentRow.timestamp,references);
      references.previousInterval = currentRow.timestamp;
      return true;
    }
    return false;
  }

  private setInterval(row,index,references){
    let taskToDo = undefined;
    if(row.gpio12){
      //start an interval
      taskToDo = this.INTERVAL_TASKS.START;
    }else{
      if(references.firstLowState){
        if(this.implicitPeriod(row,references)){
          references.firstLowState = false;
        }
      }else{
        taskToDo = this.INTERVAL_TASKS.CLOSE;
      }
      //end interval but first, check the final date, maybe we have to create an extra interval
      // if(this.sameDate(row.timestamp,references.previousInterval)){
      //  taskToDo = this.INTERVAL_TASKS.CLOSE;
      // }else{
      //   taskToDo = this.INTERVAL_TASKS.INTERSECTION;
      // }
    }
    //console.log("task to do",taskToDo)
    this.intervalTask(taskToDo,references,row);
  }

  private intervalTask(task,references,currentRow){
    switch (task){
      case this.INTERVAL_TASKS.CLOSE:
        currentRow["END"]=true;
        this.endPeriod(references.periodToStart,currentRow.timestamp,references);
      break;
      case this.INTERVAL_TASKS.START:
        currentRow["START"]=true;
        this.startPeriod(currentRow.timestamp,references);
      break;
      case this.INTERVAL_TASKS.INTERSECTION:
        currentRow["INTERSECTION"]=true;
        this.extraPeriod(references.periodToStart,currentRow.timestamp,references);
      break;
    }
  }

  private startPeriod(startTimestamp,references){
    references.periodToStart = startTimestamp;
  }

  private endPeriod(startTimestamp,endTimestamp,references){
    let startTime = this.convertToEPOCH(startTimestamp);
    let endTime = this.convertToEPOCH(endTimestamp);
    let totalTime = endTime - startTime; 

    references.recentSortedIndex = references.sortedPeriods.push({
      start : startTimestamp,
      end : endTimestamp,
      totalTime,
      sortedTotal : this.convertToHours(totalTime)
    });

    //references.periodToStart = null;
  
  }

  private extraPeriod(startTimestamp,endTimestamp,references){
    let nextEndTimestamp = endTimestamp;

    let startTime = this.convertToEPOCH(startTimestamp);
    let endWithOffset = this.endOffsetDate(startTimestamp);
    let endTime = this.convertToEPOCH(endWithOffset);
    let totalTime = endTime - startTime;

    references.recentSortedIndex = references.sortedPeriods.push({
      start : startTimestamp,
      end : this.sortDateFormat(endWithOffset),
      totalTime,
      sortedTotal : this.convertToHours(totalTime)
    });

    startTimestamp = this.startOffsetDate(endTimestamp);
    startTime = this.convertToEPOCH(startTimestamp);
    endTime = this.convertToEPOCH(nextEndTimestamp);
    totalTime = endTime - startTime;

    references.recentSortedIndex = references.sortedPeriods.push({
      start : this.sortDateFormat(startTimestamp),
      end : nextEndTimestamp,
      totalTime,
      sortedTotal : this.convertToHours(totalTime)
    });

    references.periodToStart = null;
   
  }

  /////////////////////////// new update above 

  // private getPeriods(rows){
  //   let references = {
  //     pastState : 0,
  //     pastTimestamp : undefined,
  //     settingPeriod : false,
  //     lastIndex : (rows.length - 1),
  //     closed: true
  //   };

  //   let workingPeriods = [];

  //   let startTime = 0;
  //   let endTime = 0;

  //   let timestamp = {
  //     start:null,
  //     end:null
  //   }

  //   for(let i = 0; i < rows.length; i++){  
  //     let intervalPosition = this.sortPeriodIntervals(references,rows[i],i);
      
  //     if(intervalPosition != -1){
  //       let totalTime = 0;

  //       switch (intervalPosition){
          
  //         case 0:

  //           rows[i]["START"]=true;
  //           startTime = this.convertToEPOCH(rows[i].timestamp);
  //           timestamp.start = rows[i].timestamp;
  //           references.pastTimestamp = rows[i].timestamp;
  //           references.closed = false;
  //         break;
  //         case 1:

  //           rows[i]["END"]=true;
  //           endTime = this.convertToEPOCH(rows[i].timestamp);
  //           timestamp.end = rows[i].timestamp;
  //           totalTime = endTime - startTime; 
  //           rows[i]["total_time"] = this.convertToHours(totalTime);
  //           references.closed = true;

  //           workingPeriods.push({
  //             start: timestamp.start,
  //             end : timestamp.end,
  //             totalTime,
  //             sortedTotal : this.convertToHours(totalTime)
  //           });
  //         break;
  //         case 2:

  //           rows[i]["END"]=true;
  //           let endWithOffsetc2 = this.endOffsetDate(rows[i-1].timestamp);
  //           endTime = this.convertToEPOCH(endWithOffsetc2);
  //           timestamp.end =this.sortDateFormat(endWithOffsetc2);
  //           totalTime = endTime - startTime; 
  //           rows[i]["total_time"] = this.convertToHours(totalTime);

  //           workingPeriods.push({
  //             start: timestamp.start,
  //             end : timestamp.end,
  //             totalTime,
  //             sortedTotal : this.convertToHours(totalTime)
  //           });

  //           rows[i]["START"]=true;
  //           let startWithOffset = this.startOffsetDate(rows[i].timestamp);
  //           startTime = this.convertToEPOCH(startWithOffset);
  //           timestamp.start = rows[i].timestamp;
  //           references.pastTimestamp = rows[i].timestamp;
  //           references.closed = false;

  //           endTime = this.convertToEPOCH(rows[i-1].timestamp);
  //           timestamp.end =this.sortDateFormat(endTime);

  //           workingPeriods.push({
  //             start: timestamp.start,
  //             end : timestamp.end,
  //             totalTime,
  //             sortedTotal : this.convertToHours(totalTime)
  //           });

  //         break;
  //         case 3:

  //           rows[i]["END"]=true;
  //           let endWithOffset = this.endOffsetDate(rows[i-1].timestamp);
  //           endTime = this.convertToEPOCH(endWithOffset);
  //           timestamp.end = this.sortDateFormat(endWithOffset);
  //           totalTime = endTime - startTime; 
  //           rows[i]["total_time"] = this.convertToHours(totalTime);

  //           workingPeriods.push({
  //             start: timestamp.start,
  //             end : timestamp.end,
  //             totalTime,
  //             sortedTotal : this.convertToHours(totalTime)
  //           });
  //           references.closed = true;
  //         break;
  //       }
  //     }

  //     console.log("this row in case",intervalPosition,"ROW ",rows[i]);
  //     references.pastState = rows[i].gpio12;
  //   }

  //   console.log("working periods",workingPeriods);
  //   return workingPeriods;
  // }

  // private periodSetpoint(references,currentState,currentIndex){
  //   if(currentState){// 1 was found
  //     if(currentState != references.pastState){
  //       //starting period found 
  //       return 0;
  //     }else if(currentState == references.pastState && references.lastIndex == currentIndex){// no state change but is the last Index
  //       return 1;
  //     }
  //   }else{// 0 was found
  //     if(currentState != references.pastState){
  //       //ending period
  //       return 1;
  //     }
  //   }
  //   return -1;
  // }

  private convertToEPOCH(timestamp){
    try{
      let date = new Date(timestamp);
      return date.getTime()/1000;
    }catch(e){
      console.error("timestamp conversion ERROR",e);
      return 0;
    }
  }

  private convertToHours(diff){
    var seconds = parseInt(diff, 10);
    var days = Math.floor(seconds / (3600*24));
    seconds  -= days*3600*24;
    var hours   = Math.floor(seconds / 3600);
    seconds  -= hours*3600;
    var minutes = Math.floor(seconds / 60);
    seconds  -= minutes*60;
    return {days:days,hours:hours,min:minutes,seconds:seconds};
  }

  private sameDate(currentDate,previousDate){
    //console.log("***current ",currentDate," previous ",previousDate)
    let current = new Date(currentDate).setHours(0, 0, 0, 0);
    let previous = new Date(previousDate).setHours(0, 0, 0, 0);

    if(current === previous){
     // console.log("*** Same day *** current ",current," previous ",previous);
      return true;
    }
   // console.log("*** different day *** current ",current," previous ",previous)
    return false;
  }

  // private sortPeriodIntervals(references,row,i){
  //   if(!references.closed){// if we already have a start period waiting to be closed
  //     if(!this.sameDate(references.pastTimestamp,row.timestamp)){
  //       if(this.periodSetpoint(references,row.gpio12,i)){
  //         return 2;//close current period with last row, but current row is the start of a different day period
  //       }
  //       return 3;// close the period with the last row, ignore current row
  //     }
  //   }
  //   return this.periodSetpoint(references,row.gpio12,i);
  // }

  private endOffsetDate(timestamp){
    return new Date(timestamp).setHours(23,59,59,0);
     
  }

  private startOffsetDate(timestamp){
    return new Date(timestamp).setHours(0,0,0,0);
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

  private sortTimesByDay(periods){
    let sumList = [];
    for(let i = 0; i < periods.length; i++){
      let dateKey = this.sortDateFormat(periods[i].start,true);
      // console.log("INDEX ",i,"KEY DATE:",dateKey);
      let indexFound = sumList.findIndex(element => element.dateKey === dateKey);
      if(indexFound!=-1){
        sumList[indexFound].totalTimeRaw+= periods[i].totalTime;
        sumList[indexFound].totalTime = this.convertToHours(sumList[indexFound].totalTimeRaw),
        sumList[indexFound].updates++;
      }else{
        sumList.push({
          dateKey:dateKey,
          totalTimeRaw: periods[i].totalTime,
          totalTime : this.convertToHours(periods[i].totalTime),
          updates:1
        });
      }

    }

    //console.table(sumList)
    return sumList;
  }






}
