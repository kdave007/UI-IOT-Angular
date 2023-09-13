import { Component, OnInit, OnDestroy,HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router,} from '@angular/router';
import { MailAlertsConfigService } from '../../services/mail-alerts-config.service';
import { ToasterConfig } from 'angular2-toaster';
import * as utils from './utils';
import { NbGlobalPhysicalPosition, NbGlobalPosition,NbGlobalLogicalPosition, NbComponentStatus, NbToastrService, NbRowDefDirective } from '@nebular/theme';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { CompressorActivationResolverService } from '../../services/compressor-activation-resolver.service';
import { AlarmsViewComponent } from './alarms-view/alarms-view.component';
import { AlarmsService } from './services/alarms.service';
import { UserPermissonsService } from '../profile/services/user-permissons.service';
import { UserInfoService } from '../../services/user-info.service';

@Component({
  selector: 'ngx-alerts-view',
  templateUrl: './alerts-view.component.html',
  styleUrls: ['./alerts-view.component.scss']
})

export class AlertsViewComponent implements OnInit,OnDestroy {
  
  devList;dropReady=false;emptyDevList=true;allDisabled=true;saveDisabled=true;
  subscription : Subscription;
  subscriptionB : Subscription;
  subscriptionC : Subscription;
  subscriptionD : Subscription;

  settings = [];inputErrors=[];
  conditionText = {
    "<=":" Temperatura Menor a : ",
    ">=":" Temperatura Mayor a : ",
    ">x<":" y menor a : "
  };

  helpText = [null,utils.HELP_A,utils.HELP_B,utils.HELP_C,utils.HELP_D];

  defaultSettings=[
    {conditionParam: null,lowerLim: null,value: null,value2: null,alertType:1,rowId: false,activeStatus: false,status:"empty",showLowLim: true},
    {conditionParam: null,lowerLim: null,value: null,value2: null,alertType:2,rowId: false,activeStatus: false,status:"empty",showLowLim: true},
    {conditionParam: null,lowerLim: null,value: null,value2: null,alertType:3,rowId: false,activeStatus: false,status:"empty",showLowLim: true},
    {conditionParam: null,lowerLim: null,value: null,value2: null,alertType:4,rowId: false,activeStatus: false,status:"empty",showLowLim: true},
    {conditionParam: null,lowerLim: null,value: null,value2: null,alertType:5,rowId: false,activeStatus: false,status:"empty"},
    {conditionParam: null,lowerLim: null,value: null,value2: null,alertType:6,rowId: false,activeStatus: false,status:"empty"},
    {conditionParam: null,lowerLim: null,value: null,value2: null,alertType:7,rowId: false,activeStatus: false,status:"empty"},
    {conditionParam: null,lowerLim: null,value: null,value2: null,alertType:8,rowId: false,activeStatus: false,status:"empty"},
    {conditionParam: null,lowerLim: null,value: null,value2: null,alertType:9,rowId: false,activeStatus: false,status:"empty"},
    {conditionParam: null,lowerLim: null,value: null,value2: null,alertType:10,rowId: false,activeStatus: false,status:"empty"},
    {conditionParam: null,lowerLim: null,value: null,value2: null,alertType:11,rowId: false,activeStatus: false,status:"empty"}
  ];

  tempsDiff:number = 7;//index corresponds to alertType:8
  defrost:number = 4;//index corresponds to alertType:5
  theDoors:number = 5;//index corresponds to alertType:6
  backDoor:number = 6;//index corresponds to alertType:7
  trucksBatt:number = 8;//index corresponds to alertType:9
  backUpSource:number = 9;//index corresponds to alertType:10
  backUpLevel:number = 10;//index corresponds to alertType:11

  deviceId:number;
  saveFlag : boolean = false;
  userPermissions : any = {};
  user : any = {};

  condition=[{symbol:"<=",title: "menor o igual a"},{symbol:">=",title: "mayor o igual a"},{symbol:">x<",title: "entre limites"}];

  constructor(private activatedRoute: ActivatedRoute, private alertsService: MailAlertsConfigService,private toastrService: NbToastrService,
    private alarmsService : AlarmsService, private userPermissionsService : UserPermissonsService,private userInfoService : UserInfoService,
    private router : Router ) { 
      
      //this.userInfoService.request();
      this.subscriptionD = this.userInfoService.get().subscribe(userInfo => {
        console.log("USER INFO HERE .... ",userInfo);
        this.user["info"] = userInfo;
        let id = userInfo.id;
        if(id!=undefined){
          this.userPermissionsService.queryPermissions(id);
        }else{
          console.error("User info not found")
          this.returnToHomeSillyBoy();
        }
        
      });
      
      this.subscriptionC = this.userPermissionsService.getUserPermissions().subscribe( permissions => {
        console.log("PERMISSIONS ",permissions);
        this.userPermissions = permissions;
        this.user["permissions"] = permissions;
      });
    }
  
  ngOnDestroy(): void {
    this.userPermissionsService.cleanAllObjects();
    this.subscriptionC.unsubscribe();
    this.subscriptionD.unsubscribe();
  }  

  ngOnInit() {
    this.subscription = this.activatedRoute.data.subscribe( data  => this.devList = data);
    if(this.devList.devList[0].id!=null){//if there is no data, can't enable dropList and config inputs
      this.dropReady=true;
      let emptyDefault = []
      this.syncSettings(emptyDefault);
    }
  }

  onSelectChange($event){//on selected device in dropList 
    this.allDisabled=false;
    this.deviceId=$event;
    this.saveDisabled = false;
    this.queryData();
    this.alarmsService.postedFlag().subscribe( data => {
      console.log("A service data : ",data);
      this.saveFlag = false;
    });
  }

  queryData(){
    this.subscriptionB = this.alertsService.getAlerts(this.deviceId).subscribe(newData =>{
          //console.log("raw query ",newData);
          newData = (newData==null || newData==undefined || newData==false) ? [] : newData;
          this.syncSettings(newData);
          
    });
  }

  syncSettings(newData){

    for(let i = 0; i<this.defaultSettings.length; i++){
      const alertT = (i+1);
      let setup = {...this.defaultSettings[i]};//this way, we clone this object and not just give the same reference or pointer
  
      for(let index = 0; index<newData.length; index++){
        if(newData[index].alertType == alertT){
          setup = {...newData[index]};
          setup.activeStatus = true;
          setup.status = "loaded";
          if(newData[index].alertType<5){
              setup.showLowLim = this.disableFirstInput(newData[index].conditionParam);
          }
          
        }
      }
      this.settings[i]=setup;
    }
  }

  getSetupIndex(aType){
    aType = Number(aType);
    return aType-1;
  }

  disableFirstInput(condition){
    let disabled = true;
    
    switch (condition){
        case '>x<':
          disabled = false;
        break;
    }
    
    return disabled
  }

  sensorPosition(alertType){
    alertType = Number(alertType);
    let sensorPos = [
          "sensor de pared de caja",
          "sensor de placa eutéctica",
          "sensor de descarga de compresor",
          "sensor de succión de compresor"
    ];

    return sensorPos[alertType-1]
  }

  changeUpdate(alertType){
    this.saveDisabled = false;
    let indexSetup = this.getSetupIndex(alertType);
    this.settings[indexSetup].status = "update";
    if(alertType==10){
      //alert type 10 is just a check box, so it doesn't set a value, it must be set manually...
      this.settings[indexSetup].value = 1;
    }
    this.validateScenario(this.settings[indexSetup]);
  }

  sortInputs(alertType,section){
    //this helps to sort the inputs with the correct object in settings for the box and compressor only
    let sections = {
      "box":{min:0,max:3},
      "compressor":{min:3,max:5},
      }
    let show = (alertType<sections[section].max && alertType>=sections[section].min) ? true : false;
    return show;
  }

  conditionChange(aType,condition){
    this.saveDisabled = false;
    let setupIndex = this.getSetupIndex(aType);
    const unset = this.disableFirstInput(condition);
    this.settings[setupIndex].showLowLim = unset
    this.settings[setupIndex].lowerLim = (unset) ? this.settings[setupIndex].lowerLim : null;
    this.changeUpdate(aType);
  }

  validateScenario(setup){
    this.cleanERR(setup);
  
    if(setup.activeStatus){
      
      let inputERR = this.sortCheck(setup);
      if(inputERR){
        //add error
        this.addERR(inputERR);
      }
    }
    console.log(this.inputErrors);

  }

  sortCheck(setup){
    let result = {error:false,details:null}
    if(setup.alertType<5){
      //compressor conditional settings inputs
      result = this.evaluateCompCondition(setup);

    }else if(setup.alertType>5){

        if(setup.alertType==8){
          //compressor temp difference inputs
          result = this.evaluateCompDiff(setup);
        }else if(setup.alertType!=10){
          //all the other settings inputs
          result = this.evaluateSimple(setup);
        }
    }
    if(result.error){
      return result;
    }

    return false;
  }
  
  evaluateCompCondition(setup){
    let error = false; 
    let details = null;
    if(setup.conditionParam==='>x<'){

      if(setup.lowerLim>=setup.value){
        //limits size incongruence
        error = true;
        details = {
          eType:"valor de límite inferior es mayor o igual que el límite superior.",
          setup
        };
      }else{
        if((typeof setup.value) !== 'number' || (typeof setup.value2) !== 'number' || (typeof setup.lowerLim) !== 'number'){
          error = true;
          details = {
            eType:"valor indefinido.",
            setup
          };
        }
      }

    }else{
      if((typeof setup.value) !== 'number' || (typeof setup.value2) !== 'number' || setup.conditionParam==null){
        error = true;
        details = {
          eType:"valor indefinido.",
          setup
        };
      }
    }

    return {error,details}
  }
  
  evaluateCompDiff(setup){
    let error = false; 
    let details = null;
    if((typeof setup.value) !== 'number' || (typeof setup.value2) !== 'number'){
      error = true;
      details = {
        eType:"valor indefinido.",
        setup
      };
    }

    return {error,details}
  }
  
  evaluateSimple(setup){
    let error = false; 
    let details = null;
    if((typeof setup.value) !== 'number'){
      error = true;
      details = {
        eType:"valor indefinido",
        setup
      };
    }
    
    return {error,details}
  }

  cleanERR(setup){
    this.inputErrors = this.inputErrors.filter((element)=>
      element.setup.alertType!=setup.alertType
    );
  }

  addERR(error){
    this.inputErrors.push(error.details);
  }

  saveSettings(){
    this.saveFlag = true;
    if(this.inputErrors.length){
      let toastTitle: string = "Error";
      let toastBody: string = this.inputErrors[0].eType+"\nen "+this.inputName(this.inputErrors[0].setup.alertType);
      let duration: number = 5000;
      let advice: NbComponentStatus = "danger";

      this.showToast(advice, toastTitle, toastBody, true, duration);
      //show toast error
      return;
    }

    let settingsReady = this.prepareSave();
    //send settingsReady
    if(settingsReady){
      console.table(settingsReady.save);
      console.table(settingsReady.delete);
      this.postSave(settingsReady);// <--------- TESTING, UNCOMMENT LATER!!!!! ------------------------------
    }
  }

 prepareSave(){
   let toUpdate = [];
   let toDelete = [];
   //console.table(this.settings);
   for(let i = 0; i<this.settings.length; i++){
    if(this.settings[i].status=="update"){
  
      if(this.settings[i].activeStatus){
        toUpdate = [...toUpdate,this.settings[i]];
        //console.log("update ",this.settings[i].alertType);
      }else{
        if(this.settings[i].rowId){
          toDelete = [...toDelete,this.settings[i]];
          //console.log("delete ",this.settings[i].alertType);
        }
        
      }

    }
  }

  if(toUpdate.length || toDelete.length){
    return {save: (toUpdate.length) ? toUpdate : false, delete: (toDelete.length)? toDelete : false};
  }

   return false;
 }


 postSave(dataToSend){
  let toastTitle: string = "Éxito";
  let toastBody: string = "Configuración guardada"
  let duration: number = 5000;
  let advice: NbComponentStatus = "success";

  this.showToast(advice, toastTitle, toastBody, true, duration);

  this.alertsService.setAlerts(this.deviceId,dataToSend).subscribe( () => {
    this.queryData();
  });

 }

 private showToast(type: NbComponentStatus, title: string, body: string, destroyByClick: boolean, duration: number) {
  const config = {
    status: type,
    destroyByClick: destroyByClick,
    duration: duration,
    hasIcon: true,
    position: NbGlobalPhysicalPosition.TOP_RIGHT,
    preventDuplicates: true,
  };
  const titleContent = title ? `${title}` : '';

  this.toastrService.show(
    body,
    `${titleContent}`,
    config);
  }

  private inputName(id){
    let inputNames = [
      undefined,
      "Temperatura de la caja congelada : 'sensor de pared de caja'",
      "Temperatura de la caja congelada : 'sensor de placa eutéctica'",
      "Compresor : 'sensor de descarga de compresor'",
      "Compresor : 'sensor de succión de compresor'",
      "Compresor : 'diferencia de temperaturas en compresor'",
      "Deshielado : 'límite antes de deshielar'",
      "Apertura de puertas : 'puerta trasera'",
      "Apertura de puertas : 'puertas laterales'",
      "Alimentación eléctrica : 'bateria del camión'",
      "Alimentación eléctrica : 'alimentación por bateria propia del dispositivo'",
      "Alimentación eléctrica : 'nivel de carga de bateria del dispositivo'",
    ]

    return inputNames[id];
  }

  private returnToHomeSillyBoy(){
    //return to home view if service didnt load properly 
    console.log("BACK TO HOME!!!!") ;
    this.router.navigateByUrl('/devices-list');
  }


}
