import { Component, OnInit, Input, OnChanges,SimpleChanges,OnDestroy } from '@angular/core';
import { Alarms,AlarmParameters,ALARM_INDEX,CONV,TOOLTIPS } from '../utils';
import { AlarmsService } from '../services/alarms.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-alarms-view',
  templateUrl: './alarms-view.component.html',
  styleUrls: ['./alarms-view.component.scss']
})
export class AlarmsViewComponent implements OnInit,OnChanges,OnDestroy {
  @Input('deviceId') device : any;
  @Input('saveFlag') save : any;
  @Input('user') user : any;

  alarmSettings = new Alarms() ;
  settings = this.alarmSettings.settings;
  INPUTS = new AlarmParameters().DEFAULT;
  INPUT_INDEX = ALARM_INDEX;
  public CONVERSION = CONV;
  public _TOOLTIPS = TOOLTIPS;
  public userId : number;
  public subscription : Subscription;
  public subscription2 : Subscription;
  public limits = { 
    temp : { max: 80, min:-40 },
    timeoutTemp : { max: 30, min:1 },
    timeoutSec : { max: 60, min:1 },
    timeoutHours : { max: 72, min:1 },
    difference : { max:5, min:1 },
    voltageStep : {max:5.0, min:0.5},
    voltagePB : {max:6, min:1}
  }
  showHelpText = false;

  public userLevel = undefined;

  private ALARMS_PERMISSIONS = {
    DISABLED:0,
    BASIC:1,
    CONFIGURABLE:2
  }

  constructor(private alarmsService : AlarmsService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
  //30 MIN 
  ngOnInit() {
    this.userId =  this.user.info.id;

    this.subscription2 = this.alarmsService.queryUser( this.userId).subscribe( user => {
      this.userLevel = (user.empty || user== undefined || user==null) ? false : user.level;
    });
    
    this.subscription = this.alarmsService.getSettings().subscribe((data) =>{
      let alarms = new Alarms() ;
      let alarmSettings = alarms.settings;
      this.settings=(data == null || data == false) ? alarmSettings : data;
    
      this.timeConversion(this.settings,"backward");
      //console.log(this.settings);
    });
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.save){//save button activated
      this.timeConversion(this.settings,"forward");
      
      this.alarmsService.setAlarms(this.device,this.settings).subscribe( data => {
        //console.log("retrieving updated data")
        this.alarmsService.querySettings(this.device,this.userId);
      });
      this.save=false;
    }else{
      if(this.device!=undefined){
        this.alarmsService.querySettings(this.device,this.userId);
      }
    }

  }

  public addToUpdates(row,indexKey?,limits?){
    row["update"]=true;
    if(limits!=undefined){
      row.params[indexKey] = (row.params[indexKey]>limits.max) ? limits.max : row.params[indexKey];
      row.params[indexKey] = (row.params[indexKey]<limits.min) ? limits.min : row.params[indexKey];
    }
    //console.log("updated value",row);
  }

 
  public timeConversion(settings,direction){
    let wanted = [ 
      {eventId:this.INPUT_INDEX.DEFROST, config:"CONFIG_ID_2",convert: this.CONVERSION._MIN_TO_MS},
      {eventId:this.INPUT_INDEX.BOX_STABLE, config:"CONFIG_ID_3",convert: this.CONVERSION._MIN_TO_MS},
      {eventId:this.INPUT_INDEX.HIGH_TEMP_D, config:"CONFIG_ID_6",convert: this.CONVERSION._MIN_TO_MS},
      {eventId:this.INPUT_INDEX.LOW_TEMP_D, config:"CONFIG_ID_7",convert: this.CONVERSION._MIN_TO_MS},
      {eventId:this.INPUT_INDEX.DOWNLOAD_STABLE, config:"CONFIG_ID_8",convert: this.CONVERSION._MIN_TO_MS},
      {eventId:this.INPUT_INDEX.HIGH_TEMP_S, config:"CONFIG_ID_13",convert: this.CONVERSION._MIN_TO_MS},
      {eventId:this.INPUT_INDEX.LOW_TEMP_S, config:"CONFIG_ID_14",convert: this.CONVERSION._MIN_TO_MS},
      {eventId:this.INPUT_INDEX.SUCTION_STABLE, config:"CONFIG_ID_15",convert: this.CONVERSION._MIN_TO_MS},
      {eventId:this.INPUT_INDEX.TEMP_DIFF, config:"CONFIG_ID_25",convert: this.CONVERSION._MIN_TO_SEC},
      {eventId:this.INPUT_INDEX.COMP_OFF, config:"CONFIG_ID_34",convert: this.CONVERSION._HRS_TO_SEC}, 
      {eventId:this.INPUT_INDEX.OPEN_BDOOR, config:"CONFIG_ID_18",convert: this.CONVERSION._MIN_TO_MS},
      {eventId:this.INPUT_INDEX.CLOSED_BDOOR, config:"CONFIG_ID_19",convert: this.CONVERSION._MIN_TO_MS},
      {eventId:this.INPUT_INDEX.T_BAT_NC, config:"CONFIG_ID_21",convert: this.CONVERSION._SEC_TO_MS},
      {eventId:this.INPUT_INDEX.T_BAT_C, config:"CONFIG_ID_20",convert: this.CONVERSION._SEC_TO_MS},
      {eventId:this.INPUT_INDEX.CEDIS_NC, config:"CONFIG_ID_23",convert: this.CONVERSION._SEC_TO_MS},
      {eventId:this.INPUT_INDEX.CEDIS_C, config:"CONFIG_ID_22",convert: this.CONVERSION._SEC_TO_MS}
    ];
    for(let i = 0; i < settings.length; i++){
      
      settings[i].editable = this.configPermission(this.user.permissions);
      settings[i].enabled = this.accessPermission(this.user.permissions);
      
      for(let c = 0; c < wanted.length; c++){
        if(i==wanted[c].eventId){
          let target = wanted[c].config;
          settings[i].params[target]=this.forwardConversion(settings[i].params[target],wanted[c].convert,direction);
          
        }
      }
    }
  }

  public forwardConversion(value,convCase,direction){
    let reversed = (direction=="forward") ? false : true;
    switch (convCase){
      case this.CONVERSION._MIN_TO_MS :
      //console.log(value,"min to millis",this.min2Millis(value,reversed),direction);
      return this.min2Millis(value,reversed);

      case this.CONVERSION._SEC_TO_MS :
        // console.log(value,"sec to millis",this.sec2Millis(value,reversed),direction);
      return this.sec2Millis(value,reversed);

      case this.CONVERSION._HRS_TO_SEC :
        // console.log(value,"hours to sec",this.hours2Sec(value,reversed),direction);
      return this.hours2Sec(value,reversed);

      case this.CONVERSION._MIN_TO_SEC :
        // console.log(value,"hours to sec",this.hours2Sec(value,reversed),direction);
      return this.min2Sec(value,reversed);

      default:

      return value;
    }
  }

  public min2Millis(value,reversed){
    return (reversed) ? (value/60)/1000 : (value*60)*1000;
  }

  public sec2Millis(value,reversed){
    return (reversed) ? value/1000 : value*1000;
  }

  public hours2Sec(value,reversed){
    return (reversed) ? value/3600 : value*3600;
  }

  public min2Sec(value,reversed){
    return (reversed) ? value/60 : value*60;
  }

  private configPermission(userPermissions){
    if(userPermissions.alarmsAccessId == this.ALARMS_PERMISSIONS.CONFIGURABLE){
      return true;
    }
    return false;
  }
  
  private accessPermission(userPermissions){
    if(userPermissions.alarmsAccessId == this.ALARMS_PERMISSIONS.BASIC || userPermissions.alarmsAccessId == this.ALARMS_PERMISSIONS.CONFIGURABLE){
      return true;
    }
    return false
  }

  public showHelp(){
    this.showHelpText = (this.showHelpText) ? false : true;
  }
}
