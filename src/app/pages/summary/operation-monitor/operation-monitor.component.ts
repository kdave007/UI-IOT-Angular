import { Component, OnInit, Input, OnChanges, NgModule, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NbDateService } from '@nebular/theme';

import { DataSamplesResolverService } from '../../../services/data-samples-resolver.service';
import { Subscription } from 'rxjs';
import { DataGpiosResolverService } from '../../../services/data-gpios-resolver.service';
import { CompressorActivationResolverService } from '../../../services/compressor-activation-resolver.service';
import { SheetService } from '../local-service/sheet.service';
import { LocalDataSource } from 'ng2-smart-table';
import { THERM_TITLES } from '../utils'
import { TEMPS_FILTER } from '../../temp.commands';

@Component({
  selector: 'ngx-operation-monitor',
  templateUrl: './operation-monitor.component.html',
  styleUrls: ['./operation-monitor.component.scss'],
})
export class OperationMonitorComponent implements OnInit,OnChanges,OnDestroy {
  @Input('deviceId') devId : any;
  opMonUpdateActive: boolean; 
  myRange;plateAverage='0'; boxAverage='0';totalSamplesPlate ='0';totalSamplesBox='0'; 
  subscription : Subscription;averageDoorsTime;
  subscriptionB : Subscription;
  gpiosData;
  tempsData;filtFlagA = false;activateAlerts=true;showAlertsTbl=false;tbl2 = false;
  maxPlate;maxBox;limit;boxAlerts;plateAlerts;activateDoorAlerts=false;dataCompleted=false;
  timeLimit;out:any;outKey="out1";showAverageDoors=false;
  showDoorsA=false;options; alldoors = true;

  option: any; indexKey=[1,2,3,4,5,6];
  totalTimeperDoor = [];defaultDate={start:"",end:""};
  kinetic : any = {mkt3:0,mkt4:0};

  subscriptionPatchFlag = false;

  THERM_TITLES = THERM_TITLES;

  public timeRange = {
    start:{min:0,hour:0},
    end:{min:59,hour:23}
  }

  public settings = {
    actions: {
      add: false,
      delete: false,
      edit: false,
      custom: false
    },
    columns: {
      dateTime: {
        title: 'Fecha',
        type: 'any',
      },
      temp3: {
        title: 'Termistor 3 ('+this.THERM_TITLES.T3_short+')',
        type: 'any',
      },
      temp4: {
        title: 'Termistor 4 ('+this.THERM_TITLES.T4_short+')',
        type: 'any',
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  limits : any = {
    upper: 0,
    lower : 0
  }

  thermistor_3 = {off:[],in:[],peak:null};
  thermistor_4 = {off:[],in:[],peak:null};

  subscriptionC : Subscription;

  constructor(public getDatasamplesService : DataSamplesResolverService, public getDataGpiosService: DataGpiosResolverService,
    public sheetService : SheetService
    ) { }

  ngOnDestroy(){
    if(this.subscriptionPatchFlag){
      this.subscription.unsubscribe();
    }
  
    this.subscriptionC.unsubscribe();
  }  

  ngOnInit() {
    this.subscriptionC = this.sheetService.getKinetic().subscribe( data => {
      if(data['mkt1'] != undefined || data['mkt1'] != null) {
        this.kinetic = data;
        console.log("kinetic",this.kinetic);
      }
    });
    // this.options = [
    //   { value: '100', label: 'Todas', default:true },
    //   { value: '0', label: 'Puerta 1', default:false },
    //   { value: '1', label: 'Puerta 2', default:false },
    //   { value: '2', label: 'Puerta 3', default:false },
    //   { value: '3', label: 'Puerta 4', default:false },
    //   { value: '4', label: 'Puerta 5', default:false },
    //   { value: '5', label: 'Puerta 6', default:false },
    // ];
    this.option;
    var self = this;
    document.getElementById("inputLimitFilter").addEventListener('input', function (){
      if($("#inputLimitFilter").val()!="" && self.filtFlagA ){
        self.activateAlerts=true;
      }else if($("#inputLimitFilter").val()=="" || self.filtFlagA==false){
        self.activateAlerts=false;
      }
    });
    
    // document.getElementById("inputLimitHrs").addEventListener('input', function (){
    //   if($("#inputLimitHrs").val()!="" && self.filtFlagA ){
    //     self.activateDoorAlerts=true;
    //   }else if($("#inputLimitFilter").val()=="" || self.filtFlagA==false){
    //     self.activateDoorAlerts=false;
    //   }
    // });
    // document.getElementById("inputLimitMin").addEventListener('input', function (){
    //   if($("#inputLimitMin").val()!="" && self.filtFlagA ){
    //     self.activateDoorAlerts=true;
    //   }else if($("#inputLimitFilter").val()=="" || self.filtFlagA==false){
    //     self.activateDoorAlerts=false;
    //   }
    // });
    // document.getElementById("inputLimitSeg").addEventListener('input', function (){
    //   if($("#inputLimitSeg").val()!="" && self.filtFlagA ){
    //     self.activateDoorAlerts=true;
    //   }else if($("#inputLimitFilter").val()=="" || self.filtFlagA==false){
    //     self.activateDoorAlerts=false;
    //   }
    // });

    this.myRange=this.defaultDates();
    //we set a default value as -5 to show freezing table
    $("#inputLimitFilter").val(-5);
    //we analyse the default samples when init
    this.updateData(false);
    
  }

  opMonRangeChange($event){
    if($event.end){
     this.myRange = $event;
     this.opMonUpdateActive=true;
    }
  }
  
  //new functions update -------------------------------------------

  public cleanRangeHour(event,position){
    if(event.target.value=="" || event.target.value==undefined || event.target.value==null) event.target.value=0;
    this.timeRange[position].hour = parseInt(event.target.value);
    if(event.target.value>23)this.timeRange[position].hour=23;
    if(event.target.value<0)this.timeRange[position].hour=0;
 
  }

  public cleanRangeMin(event,position){
    if(event.target.value=="" || event.target.value==undefined || event.target.value==null) event.target.value=0;
    this.timeRange[position].min = parseInt(event.target.value);
    if(event.target.value>59)this.timeRange[position].min=59; 
    if(event.target.value<0)this.timeRange[position].min=0;
 
  }

  private dateTimeMerge(){
    //console.log("merge",this.myRange," with this ",this.timeRange)
    this.myRange.start.setHours(this.timeRange.start.hour);
    this.myRange.start.setMinutes(this.timeRange.start.min);
    this.myRange.end.setHours(this.timeRange.end.hour);
    this.myRange.end.setMinutes(this.timeRange.end.min);
    console.log(this.myRange);
  }

  public filterTemps(){
    if(this.limits.upper == "" || this.limits.upper == null || this.limits.upper == undefined){
      return;
    }

    if(this.limits.lower == "" || this.limits.lower == null || this.limits.lower == undefined){
      return;
    }

    let references_thermistor_3 = {
      pendingPeriod : {off:false,in:false},
      pastPeriodType : undefined,
      currentPeriod : {off: [], in: []},
      currentPeriodIndex : {off:null,in:null},
      pastRow : undefined
    }

    let references_thermistor_4 = {
      pendingPeriod : {off:false,in:false},
      pastPeriodType : undefined,
      currentPeriod : {off: [], in: []},
      currentPeriodIndex : {off:null,in:null},
      pastRow : undefined
    }

    let KEY_INDEX = {
      TEMP_1 : "temp1",
      TEMP_2 : "temp2",
      TEMP_3 : "temp3",
      TEMP_4 : "temp4"
    }
    console.log("upper limit:",this.limits.upper);
    console.log("lower limit:",this.limits.lower);
    console.log("current temperature values ",this.tempsData);

    this.tempsData.forEach((element,index) => {

      let lastIteration = (index === this.tempsData.length - 1) ? true : false; 
      this.tempProcessData(element,lastIteration,references_thermistor_4,KEY_INDEX.TEMP_4);
      this.tempProcessData(element,lastIteration,references_thermistor_3,KEY_INDEX.TEMP_3);
      references_thermistor_3.pastRow = element;
      references_thermistor_4.pastRow = element;

      this.thermistor_4.off = references_thermistor_4.currentPeriod.off;
      this.thermistor_4.in = references_thermistor_4.currentPeriod.in;
      this.thermistor_3.off = references_thermistor_3.currentPeriod.off;
      this.thermistor_3.in = references_thermistor_3.currentPeriod.in;
    });

    let peak = this.getPeakValues(this.tempsData,KEY_INDEX); 
    this.thermistor_4.peak = peak[KEY_INDEX.TEMP_4];
    this.thermistor_3.peak = peak[KEY_INDEX.TEMP_3];

    this.intervalsSubjectUpdate();
  }

  private intervalsSubjectUpdate() {
    this.sheetService.setTempIntervals(this.thermistor_3,this.thermistor_4,this.limits);
  }

  private tempsSubjectUpdate() {
    this.sheetService.setTemps(this.tempsData,this.myRange);
  }

  private tempsMeansUpdate(){
    let plate = (this.plateAverage== "Sin datos") ? null : this.plateAverage;
    let box = (this.boxAverage == "Sin datos") ? null : this.boxAverage;
    this.sheetService.setMeanTemps({plate,box});
  }

  private updateKinetic() {
    this.sheetService.postRequestKinetic(this.devId,this.myRange);
  }

  private getPeakValues(rows,KEY_INDEX){
    let temp3 = null,temp4 = null;
    
    for(let i = 0; i < rows.length; i++){
      let currentTemp3 = rows[i][KEY_INDEX.TEMP_3];
      let currentTemp4 = rows[i][KEY_INDEX.TEMP_4];

      if(!i){
        temp3 = currentTemp3;
        temp4 = currentTemp4;
      }else{
        temp3 = (currentTemp3>temp3) ? currentTemp3 : temp3;
        temp4 = (currentTemp4>temp4) ? currentTemp4 : temp4;
      }
    }
    return {temp3,temp4};
  }

  private tempProcessData(row,lastIteration,references,TEMP_KEY){//plate temp
    let result = this.isOffLimits(row[TEMP_KEY],this.limits);
    //let KEY_PENDING = this.getPendingKey(result.offLimits);
   

    if(!references.pendingPeriod["in"] && !references.pendingPeriod["off"]){
      //start new period
      references.currentPeriodIndex[result.type] = this.newPeriod(row,references,result.type,TEMP_KEY);
      //console.log(result.type,"first new period",row);
    }else{
      //we got an open period, so either close it or just push to it
      //console.log("ref",references.pastPeriodType,"current type",result.type)
      if(this.switchPeriodType(references,result.type)){
        //console.log(references.pastPeriodType,"close period",references.pastRow);
        //console.log(result.type,"*** new period",row);
        //close type a and open a new type b
        this.closePeriod(references.pastRow,references.currentPeriodIndex[references.pastPeriodType],references,references.pastPeriodType,TEMP_KEY);
        
        if(!lastIteration){
          references.currentPeriodIndex[result.type] = this.newPeriod(row,references,result.type,TEMP_KEY);
        }
      }else{
        //just push value
        if(!lastIteration){
          //console.log(result.type,"push period",row);
          this.pushToPeriod(row,references.currentPeriodIndex[result.type],references,result.type,TEMP_KEY);
        }else{
          //cause is the closing one, we give the current row data
          this.closePeriod(row,references.currentPeriodIndex[result.type],references,result.type,TEMP_KEY);
        }

      }
    }

    references.pastPeriodType = result.type;
  }


  private isOffLimits(value,limits){
    if( value >= limits.upper && value > limits.lower){
      return {type: "off", offLimits : true, above: true};
    }
    if( value < limits.upper && value <= limits.lower){
      return {type: "off", offLimits : true, above: false};
    }
    return {type: "in", offLimits : false};
  }

  private newPeriod(currentRow,references,key_type,TEMP_KEY){
    references.pendingPeriod[key_type] = true;

    let newIndex = references.currentPeriod[key_type].push({
      init : {temp : currentRow[TEMP_KEY], dateTime : currentRow.dateTime },
      values : [currentRow[TEMP_KEY]],
      end : null,
      totalTime : null
    });

    return newIndex-1;
  }

  private pushToPeriod(currentRow,targetIndex,references,key_type,TEMP_KEY){
    //just push interval to period
    //console.log(targetIndex,"push to ",key_type,"ref",references)
    references.currentPeriod[key_type][targetIndex]["values"].push(currentRow[TEMP_KEY]);
  }

  private closePeriod(currentRow,targetIndex,references,key_type,TEMP_KEY){
    references.pendingPeriod[key_type] = false;
    //close period
    references.currentPeriod[key_type][targetIndex].end = {
      temp : currentRow[TEMP_KEY], dateTime : currentRow.dateTime 
    }

    let startTime = this.convertToEPOCH(references.currentPeriod[key_type][targetIndex].init.dateTime);
    let endTime = this.convertToEPOCH(currentRow.dateTime);
    let difference = endTime - startTime;

    references.currentPeriod[key_type][targetIndex].totalTime = this.convertToHours(difference);
    references.currentPeriod[key_type][targetIndex]["values"].push(currentRow[TEMP_KEY]);
    references.currentPeriod[key_type][targetIndex].peak = Math.max(...references.currentPeriod[key_type][targetIndex]["values"]);
  }

  private getPendingKey(isOffLimits){
    let KEY_INDEX = ["in","off"];// 1 = off (limits) and 0 = in (limits)
    return KEY_INDEX[isOffLimits];
  }

  private switchPeriodType(references,currentType){
    if(references.pastPeriodType != undefined && references.pastPeriodType != currentType){
      return true;
    }
    return false;
  }

  private getTargetPeriod(references){
    let pastType = references.pastPeriodType;
    return references.currentPeriod[pastType][references.currentPeriodIndex[pastType]];
  }

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


  //-----------------------------------------------------------------

  defaultDates(){
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
    
    return {start:weekAgoDate,end:today}
  }


  updateData(hide){
    this.dateTimeMerge();
    if(hide){
      $("#defaultDates").hide();
    }
   //Temperature data subscription 
   this.subscriptionPatchFlag = true;
   this.subscription = this.getDatasamplesService.setNewValues(this.myRange,TEMPS_FILTER.RAW,true).subscribe( data  => {
      //console.log("got temp samples: ",data);
      data = (data==null || data==undefined) ? [] : data; 
      this.tempsData = this.cleanNulls(data,"temp3","temp4");
      this.plateAverage = this.getAveragePlate();
      this.boxAverage = this.getAverageBox();

      if (Number.isNaN(parseFloat(this.plateAverage))){
        this.plateAverage="Sin datos";
        this.boxAverage ="Sin datos";
        this.filtFlagA=false;
        this.activateAlerts=false;
      }else{
        this.filtFlagA=true;
      }
      this.showAlerts();
      this.tempsSubjectUpdate();
      this.tempsMeansUpdate();
      this.updateKinetic();
      this.source.load(this.tempsData);
   });

  //  this.subscriptionB = this.getDataGpiosService.setNewValues(this.myRange).subscribe( data =>{
  //   //console.log("got gpios samples: ",data);
  //   this.gpiosData=this.sortGpiosData(data);
  //   this.averageDoorCalculate(this.gpiosData);
  //   // create table 
  //   this.averageAllDoors(this.gpiosData,this.myRange);
  //  });

  }
  
  getAveragePlate(){
   var totalTemp=0;
   var nullValue = -43;
   for(var c=0;c<this.tempsData.length;c++){
    if(this.tempsData[c].temp3==-200){//DETECTING NULL DATA
     // console.log("null found",this.tempsData[c]);
      this.tempsData[c].temp3=nullValue;
    } 
    totalTemp += parseFloat(this.tempsData[c].temp3);
   }
   var tempAv = totalTemp/this.tempsData.length;
   this.totalSamplesPlate = this.tempsData.length;

   return tempAv.toFixed(2);
  }

  getAverageBox(){
    var totalTemp=0;
    for(var c=0;c<this.tempsData.length;c++){
     if(this.tempsData[c].temp4==-200){//DETECTING NULL DATA
       //console.log("null found",this.tempsData[c]);
       //console.log("tdata length",this.tempsData.length," c",);
       this.tempsData[c].temp4=this.tempsData[c-1].temp4;
     } 
     totalTemp += parseFloat(this.tempsData[c].temp4);
    }
    var tempAv = totalTemp/this.tempsData.length;
    this.totalSamplesBox = this.tempsData.length;
    return tempAv.toFixed(2);
   }

 
  showAlerts(){
    this.showAlertsTbl=true;
    // var pAL;
    // var bAL;
    // pAL= this.getPlateAlerts();
    // bAL= this.getBoxAlerts(); 

    // this.boxAlerts=this.sortAlertsTime(bAL,"temp4");
    // this.plateAlerts=this.sortAlertsTime(pAL,"temp3");
  } 

 getPlateAlerts(){
   var alertList=[];
   var findMax = [];
   this.limit = $("#inputLimitFilter").val();

   for(var c=0;c<this.tempsData.length;c++){
    if(parseFloat(this.tempsData[c].temp3)>this.limit){
      findMax.push(parseFloat(this.tempsData[c].temp3));
      alertList.push({
        plateTemp: parseFloat(this.tempsData[c].temp3),
        date:this.tempsData[c].dateTime
      });

    }
   }
   if(findMax.length<=0){
    this.maxPlate = "NA";
  }else{
    this.maxPlate = Math.max.apply(null,findMax ).toFixed(2);
   }
   
   return alertList;
 }

 getBoxAlerts(){
  var alertList=[];
  var findMax = [];
  this.limit = $("#inputLimitFilter").val();
  for(var c=0;c<this.tempsData.length;c++){
   if(parseFloat(this.tempsData[c].temp4)>this.limit){
     findMax.push(parseFloat(this.tempsData[c].temp4));
     alertList.push({
       boxTemp:parseFloat(this.tempsData[c].temp4),
       date:this.tempsData[c].dateTime
     });
   }
  }
  if(findMax.length<=0){
    this.maxBox = "NA";
   }else{
    this.maxBox = Math.max.apply(null,findMax ).toFixed(2);
   }
  return alertList;
}

sortAlertsTime(alertList,key){
  
  var offCount =0;
  var totalAmount =0;
  var lastRowIndex =this.tempsData.length-1;
  var alerts = [];var aGroup=[];
  var startDate;var endDate;var tempA;var lapsedTime;var tempB;
  for(var c=0;c<this.tempsData.length;c++){

    if(parseFloat(this.tempsData[c][key])>this.limit){//find off limit temps
      offCount++;
      aGroup[offCount-1]=parseFloat(this.tempsData[c][key]);
      //console.log("agroup ",aGroup);
      if(offCount==1){
        var date1 = new Date(this.tempsData[c].dateTime);
        startDate = this.tempsData[c].dateTime;
        tempA = this.tempsData[c][key];
      }
      //console.warn("off limit: ",this.tempsData[c][key], "date: ",this.tempsData[c].dateTime);
      if(c==lastRowIndex){//if last index temp didnt change, close off-limit group here.
       // console.log("off limit rows: ",offCount);
        totalAmount++;
        var date2 = new Date(this.tempsData[c].dateTime);
        endDate =this.tempsData[c].dateTime;
        lapsedTime = this.datesDifference(date2,date1);
        tempB = Math.max.apply(null,aGroup ).toFixed(2);

        alerts.push({
          tempInit:parseFloat(tempA).toFixed(2),
          tempPeak:tempB,
          start:this.sortDateFormat(startDate),
          end:this.sortDateFormat(endDate),
          durationHours:lapsedTime.hours,
          durationMin:lapsedTime.min
        });
        aGroup.splice(0, aGroup.length);
       //console.log("off limit rows: ",key," - ",offCount,"- ",alerts);
      }
    }

    if(parseFloat(this.tempsData[c][key])<=this.limit){
      
      if(offCount!=0){//if we are back below the limit, close the off-limit group here
        //console.log("off limit rows: ",offCount);
        totalAmount++;
        if(offCount==1){
          //console.log("off limit rows: ",offCount);
          var date2 = new Date(this.tempsData[c].dateTime);// c cause we got only 1 row group off-limit
          endDate =this.tempsData[c].dateTime;
          lapsedTime = this.linealInterpol(date2,date1,this.tempsData[c][key],tempA);
         // console.log("lapsed ", lapsedTime);
        }else{
          var date2 = new Date(this.tempsData[c-1].dateTime);// -1 cause we the last row was off-limit
          endDate =this.tempsData[c-1].dateTime;
          lapsedTime = this.datesDifference(date2,date1);
        }
        
        tempB = Math.max.apply(null,aGroup ).toFixed(2);

        alerts.push({
          tempInit:parseFloat(tempA).toFixed(2),
          tempPeak:tempB,
          start:this.sortDateFormat(startDate),
          end:this.sortDateFormat(endDate),
          durationHours:lapsedTime.hours,
          durationMin:lapsedTime.min
        });
        aGroup.splice(0, aGroup.length);
        //console.log("off limit rows: ",key," - ",offCount,"- ",alerts);
      }

      //console.log(this.tempsData[c][key]);  
      offCount=0;
    }
  }
 //console.log("total alert",key," rows groups: ",totalAmount);
 //console.log("total alertS ",key," alerts");
 return alerts; 
}

datesDifference(dt2,dt1){
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  /*var seconds = diff;
  diff = diff/60;
  var totalMinutes= Math.abs(Math.round(diff));
  var hours = Math.floor(totalMinutes / 60);          
  var minutes = totalMinutes % 60;*/
  var seconds = diff // don't forget the second param
  var hours   = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds - (hours * 3600)) / 60);
  seconds = seconds - (hours * 3600) - (minutes * 60);
  return {hours:hours,min:minutes,seconds:seconds};
}

linealInterpol(dt2,dt1,Tb,Ta){
  var Bt = dt2.getTime(); 
  var At = dt1.getTime();
  Ta = parseFloat(Ta);
  Tb = parseFloat(Tb);
  var timeDiff = Bt-At;
  timeDiff = timeDiff/1000;
  var m = (Tb-Ta)/timeDiff;
  var dy = this.limit-Ta;
  var result = dy/m; 
  result = result/60;
  result = Math.round(result);
  var hours = Math.floor(result / 60);          
  var minutes = result % 60;
  //console.log("interpolate  duration ",hours,":",minutes);
  return {hours:hours,min:minutes};
}

ngOnChanges(){
  this.tbl2 = true;
}

cleanNulls(array,key1,key2){
  var indexFailure=[];
  for(var c = 0; c<array.length;c++){
    if(array[c][key1]=="null"){
      array[c][key1]=-200;
      indexFailure.push({index:c,sensor:key1});
    }
    if(array[c][key2]=="null"){
      array[c][key2]=-200;  
      indexFailure.push({index:c,sensor:key2});
    }

  }
  if(indexFailure.length!=0){
    //console.log("List of index null data: ",indexFailure)
  }
  return array;
}

getLengthLargestA(arrayToCheck){
  let largestValue = 0;let valToCheck=0;
  Object.getOwnPropertyNames(arrayToCheck).forEach(key => {
    valToCheck=arrayToCheck[key].length;
    largestValue = (valToCheck > largestValue)? valToCheck : largestValue;
  });
  return largestValue;
}

sortDateFormat(date){
  //console.log("date to format: ",date);
  let d = new Date(date);
  //console.log(d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()+"  "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
  let fixedSec =(d.getSeconds()<10) ? ("0"+d.getSeconds()) : d.getSeconds();
  let fixedMon =((d.getMonth()+1)<10) ? ("0"+(d.getMonth()+1)) : (d.getMonth()+1);
  let fixedDay =(d.getDate()<10) ? ("0"+d.getDate()) : d.getDate();
  let fixedMin=(d.getMinutes()<10) ? ("0"+d.getMinutes()) : d.getMinutes();
  let fixedHour=(d.getHours()<10) ? ("0"+d.getHours()) : d.getHours();

  return fixedDay+"/"+fixedMon+"/"+d.getFullYear()+"  "+fixedHour+":"+fixedMin+":"+fixedSec;
}



}
