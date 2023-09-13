import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NbGlobalPhysicalPosition, NbComponentStatus, NbToastrService } from '@nebular/theme';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { ConfigsService } from './services/configs.service';
import { CompressorService } from './services/compressor.service';
import * as utils from './services/utils';
import * as CompUtils from './box-prepare/custom-week-calendar/utils';
import { TempCalibrationSamplesService } from './services/temp-calibration-samples.service';
import { InterfaceSetupService } from './services/interface-setup.service';
import { UserPermissonsService } from '../profile/services/user-permissons.service';
import { UserInfoService } from '../../services/user-info.service';

enum ACTIONS_TYPES{
  REVERT,
  SAVE,
  RESTORE
}

@Component({
  selector: 'ngx-device-config',
  templateUrl: './device-config.component.html',
  styleUrls: ['./device-config.component.scss']
})
export class DeviceConfigComponent implements OnInit,OnDestroy {
  devId;
  subscription1 : Subscription;

  private WIFI: utils.WIFI_DATA[] = [
    {ssid: null, key: null, bssid: null, priority: 0},
    {ssid: null, key: null, bssid: null, priority: 0},
    {ssid: null, key: null, bssid: null, priority: 0},
    {ssid: null, key: null, bssid: null, priority: 0},
    {ssid: null, key: null, bssid: null, priority: 0}
  ];

  private SENSOR: utils.SENSORS_LIST[] = []; 
  private THERMISTOR: utils.THERMISTORS[] = []; 
  private REPORT: any = {};
  private SAMPLING: any = {};
  private COMP_SETUP : CompUtils.CompressorSettings[]; 
  private L_MODULES = [];
  private ADVANCED_SETTINGS : any = {};
  

  public questionText: string = null;
  public questionType: ACTIONS_TYPES;
  private dialogRef;
  private userInfo;
  public userPermissions;

  public subscriptions : Subscription[] = [];
  

  public SUPER_ACTIONS: utils.SUPER_USERS_FLAGS = {
    disabledPrice: true, disabledIntervals: true, disableInterfaceSetup: true
  }

  showHelpText = {
    compressor:false,
    samples:false,
    report:false,
    therm:false,
    gpios:false,
    wifi:false,
    lightMod:false,
    advanced:false
  };

  HELP_INDEXES = {
    COMP:"compressor",
    SAMPLES:"samples",
    REPORT:"report",
    THERM:"therm",
    GPIOS:"gpios",
    WIFI:"wifi",
    L_MOD:"lightMod",
    ADVANCE:"advanced",
    INT:"interface"
  }

  helpString = {
    compressor:{
      text_1:"Agrega o quita días de operación del compresor, de esta manera el encendido/apagado será automático; Edite el título de la operación, los horarios, los días de ejecución, etc… Todos estos cambios se verán reflejados en el calendario.",
      text_2:"También, con el cursor se pueden arrastrar los cuadros de operaciones del calendario, ajustar los horarios cambiando el tamaño del cuadro y mover la posición para cambiar la fecha, esto solo es posible para operaciones de un solo día."
    },
    samples:{
      title_1:"Intervalo de muestreo:",body_1:" Cantidad de minutos que deben transcurrir para tomar cada muestra.",
      title_2:"Máximo de muestras a promediar:",body_2:" Cantidad de muestras que se tomaran y promediaran en el intervalo."
    },
    report:"Seleccione el modo en que se enviara el reporte de muestras, mediante una hora especifica en el día o por intervalos de tiempo, también active/desactive el GPS y la opción de enviar el reporte mediante LTE.",
    therm:"Seleccione al menos 6 muestras, previamente debe medir al mismo tiempo la temperatura para contrastar las muestras tomadas por el dispositivo y por el instrumento de calibración. Las muestras seleccionadas se usarán como parámetros para calcular y recalibrar mediante software los termistores del dispositivo. Advertencia: No modificar si desconoce el funcionamiento.",
    gpios:"Calibra el retardo de tiempo para activar los pines de propósito general del dispositivo.",
    wifi:"Configure las credenciales de punto de acceso del dispositivo, se debe tener cuidado de dejar por lo menos una red para conectarse.",
    lightMod:{
      basic:"Configura los parametros de los modulos de sensores de luz.",
      title_1:"Sensor Activo:",body_1:" Activa o desactiva el sensor del módulo en selección",
      title_2:"Límite mínimo considerado como apertura de puerta:",body_2:" Valor adimensional por el cual arriba o abajo de este se decidirá si alguna puerta se abrió o no.",
      title_3:"Filtro en milisegundos:",body_3:" Indica cuanto tiempo en milisegundos tienen que transcurrir para que un estado sea válido.",
      title_4:"Tomar flanco de subida:",body_4:" Tipo de flanco, si esta “activado” y la lectura se pasó del límite mínimo considerado como apertura, entonces la puerta estará abierta, si esta “desactivado” se toma la lógica contraria.",
      title_5:"Dirección numérica de módulo:",body_5:" Dirección de registro lógico del módulo(no modificar sin conocimiento).",
    },
    advanced:"",
    interface:"Configura el porcentaje de suavizado de las gráficas de los sensores de temperatura."
  }

  constructor(private activatedRoute : ActivatedRoute, private toastrService: NbToastrService, public dialog: MatDialog, 
              private configService : ConfigsService, private compressorService : CompressorService,
              private tempSamplesService : TempCalibrationSamplesService,private interfaceSetupService : InterfaceSetupService,
              private userPermissionsService : UserPermissonsService,private userInfoService : UserInfoService,
              private router : Router
  ) {
    this.subscription1= this.activatedRoute.queryParams.subscribe(params => {
      this.devId = params['devId'];
      console.log("//// ---------------- ",this.devId);
    });
    this.userInfoService.request();
    this.subscriptions[9] = this.userInfoService.get().subscribe(data => {
      this.userInfo = data;
    });
   }

   ngOnDestroy(): void {
    this.userPermissionsService.cleanUserPermissionsObject();
    for(let i = 0; i < this.subscriptions.length; i++){
      this.subscriptions[i].unsubscribe();
    }
  } 

  ngOnInit() {
    this.settingsToDefault();
    console.log("SENSOR IS INIT ",this.SENSOR)
    this.initServices();
  }

  /**
   * @brief
   *  Inicializa los servicios
   */
  public initServices(){
    
   // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    this.configPermissions(this.userInfo);


    this.subscriptions[0] = this.configService.getWifi().subscribe(newData => {

      for (let index = 0 ; index < newData.length ; index++) {
        this.WIFI[index].ssid = newData[index].ssid;
        this.WIFI[index].key = newData[index].key;
        this.WIFI[index].bssid = newData[index].bssid;
        this.WIFI[index].priority = newData[index].priority;  
      }
      
      console.log("DEVICE CONFIG COMPONENT WIFI");
      console.log(this.WIFI);
    });

    this.subscriptions[1] = this.configService.getSensors().subscribe(newData => {
      if(newData!=null) this.SENSOR = newData;

      console.log("DEVICE CONFIG COMPONENT SENSOR");
      console.log(this.SENSOR);
    });

    this.subscriptions[2] = this.configService.getThermistors().subscribe(newData => {
      if(newData!=null) this.THERMISTOR = newData;

      console.log("DEVICE CONFIG COMPONENT THERMISTOR");
      console.log(this.THERMISTOR);
    });

    this.subscriptions[3] = this.configService.getReport().subscribe(newData => {
      if(newData!=null) this.REPORT = newData;

      console.log("DEVICE CONFIG COMPONENT REPORT");
      console.log(this.REPORT);
    });

    this.subscriptions[4] = this.configService.getSampling().subscribe(newData => {
      if(newData!=null) this.SAMPLING = newData;

      console.log("DEVICE CONFIG COMPONENT SAMPLING");
      console.log(this.SAMPLING);
    });

    this.subscriptions[5] = this.compressorService.getCompSettings().subscribe( newData => {
      if(newData!=null) this.COMP_SETUP = newData;
      
      console.log("DEVICE CONFIG COMPONENT COMP_SETUP");
      console.log(this.COMP_SETUP);
    });

    this.subscriptions[6] = this.configService.getLightModules().subscribe(newData => {
      if(newData!=null) this.L_MODULES = newData;

      console.log("DEVICE CONFIG COMPONENT L_MODULES");
      console.log(this.L_MODULES);
    });

    this.subscriptions[7] = this.configService.getAdvancedSettings().subscribe(newData => {
      if(newData!=null) this.ADVANCED_SETTINGS = newData;

      console.log("DEVICE CONFIG COMPONENT ADVANCED_SETTINGS");
      console.log(this.ADVANCED_SETTINGS);
    });


    this.subscriptions[8] = this.userPermissionsService.getUserPermissions().subscribe(permissions => {
      console.log("---- .... ----- got current user permissions",permissions);
      this.userPermissions = permissions;
      this.comprobePermissions(permissions);
    });

    
    //thermistors calibration points query
    this.tempSamplesService.queryPoints(this.devId);
    this.userPermissionsService.queryPermissions(this.userInfo.id);
  }

  /**
   * @brief
   *  Reestablece los cambios
   */
  public revertChanges(templateRef){
    console.log("rever changes");

    this.questionType = ACTIONS_TYPES.REVERT;
    this.questionText = "¿Está seguro de revertir los cambios?";

    this.dialogRef = this.dialog.open(templateRef, {

    });
  }

  /**
   * @brief
   *  Guarda los cambios
   */
  public saveChanges(templateRef){
    console.log("save changes");

    this.questionType = ACTIONS_TYPES.SAVE;
    this.questionText = "¿Está seguro de guardar los cambios?"

    this.dialogRef = this.dialog.open(templateRef, {

    });
  }

  /**
   * @brief
   *  Coloca los valores por default
   */
  public setDefault(templateRef){    
    console.log("Set default");

    this.questionType = ACTIONS_TYPES.RESTORE;
    this.questionText = "¿Está seguro de restablecer todo?"

    this.dialogRef = this.dialog.open(templateRef, {

    });
  }

  public confirmChanges(opt: boolean){
    if(!opt){
      this.dialogRef.close();
      return;
    }

    this.dialogRef.close();

    let toastTitle: string;
    let toastBody: string;
    let duration: number = 5000;
    let advice: NbComponentStatus = "success";
    
    switch (this.questionType) {
      case ACTIONS_TYPES.REVERT:
        console.log("Rever confirm");

        toastTitle = "Cambios restablecidos";
        toastBody = "Los cambios fueron restablecidos correctamente";

        this.configService.queryAll(this.devId);
        break;

      case ACTIONS_TYPES.SAVE:
        console.log("Save confirm");

        toastTitle = "Guardando cambios...";
        toastBody = "configuraciones enviadas al servidor";

        console.log("WIFI",this.WIFI)
        console.log("SENSOR",this.SENSOR)
        console.log("THERMISTOR",this.THERMISTOR)
        console.log("SAMPLING",this.SAMPLING)
        console.log("REPORT",this.REPORT)

        this.configService.setWifi(this.WIFI, this.devId);
        this.configService.setSensors(this.SENSOR, this.devId);
        this.configService.setThermistors(this.THERMISTOR, this.devId);
        this.tempSamplesService.savePoints(this.devId);
        this.interfaceSetupService.saveValues(this.devId);

        if(this.REPORT!=null && this.REPORT!=undefined){
          this.configService.setReport(this.REPORT, this.devId);
        }
        if(this.SAMPLING!=null && this.SAMPLING!=undefined){
          this.configService.setSampling(this.SAMPLING, this.devId);
        }

        this.configService.setLightModules(this.L_MODULES, this.devId);

        this.configService.setAdvancedSettings(this.ADVANCED_SETTINGS, this.devId);

        let conflict = this.compressorService.send(this.COMP_SETUP,this.devId);
        console.log(conflict);
        if(conflict.error){
          toastTitle= "Error al guardar operaciones de compresor.";
          toastBody= conflict.msg;
          duration = 10000;
          advice = "danger";
          this.showToast(advice, toastTitle, toastBody, true, duration);
        }
        break;

      case ACTIONS_TYPES.RESTORE:
        console.log("Restore confirm");

        this.restoreAll();
        duration = 10000;
        advice = "warning";

        toastTitle = "Valores restablecidos";
        toastBody = "Los valores fueron restablecidos, confirme y guarde los cambios para hacerlos permanentes";
        break;
    }

    this.showToast(advice, toastTitle, toastBody, true, duration);
  }

  public restoreAll(){
    this.settingsToDefault();

    this.configService.updateWifi(this.WIFI);
    this.configService.updateSensors(this.SENSOR);
    this.configService.updateThermistors(this.THERMISTOR);
    this.configService.updateReport(this.REPORT);
    this.configService.updateSampling(this.SAMPLING);
    this.configService.updateLightModules(this.L_MODULES);
    this.configService.updateAdvancedSettings(this.ADVANCED_SETTINGS);
  }

    /**
   * @brief
   *  Muestra mensajes
   * 
   * @param type 
   *  Tipo de mensaje
   * 
   * @param title 
   *  Titulo del mensaje
   * 
   * @param body 
   *  Contenido del mensaje
   * 
   * @param destroyByClick 
   *  true -> Se quita con click
   * 
   * @param duration 
   *  Duración del mensaje en ms
   */
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


  /**
   * @brief
   *  give permissions of restricted configurations to only super users
   * 
   * @param id 
   *  actual user id
   */

  public configPermissions(user : any){
      
      if(user.level==1){
        this.SUPER_ACTIONS.disabledPrice = false;
        this.SUPER_ACTIONS.disabledIntervals = false;
        this.SUPER_ACTIONS.disableInterfaceSetup = false;
        console.log("dev config ",false);
        
        return;
      }
  }

  public settingsToDefault(){
    const MAX = {
      WIFI : 5,
      SENSOR: 16,
      THERMISTORS : 4,
      L_MOD:4
    };

    for (let index = 0; index < MAX.WIFI; index++) {
      this.WIFI[index].ssid = "";
      this.WIFI[index].key = "";
      this.WIFI[index].bssid = "";
      this.WIFI[index].priority = index + 1;
    }

    for (let index = 0; index < MAX.SENSOR ; index++) {
      this.SENSOR[index]=0;
    }

    for (let index = 0; index < MAX.THERMISTORS; index++) {
      this.THERMISTOR[index] = 0;      
    }

    for(let i = 0; i < MAX.L_MOD ; i++){
      this.L_MODULES[i] = {
        sensor:[
          {edge:true,status:true,treshold:0,filter:1000},
          {edge:true,status:false,treshold:0,filter:0},
          {edge:true,status:false,treshold:0,filter:0}
        ]
      };
    }

    this.REPORT.type = 0;
    this.REPORT.intervalTime = 60;
    this.REPORT.scheduleTime = 21;
    this.REPORT.lte_en = false;
    this.REPORT.gps_en = false;

    this.SAMPLING.samples = 10;
    this.SAMPLING.interval = 10;

    this.ADVANCED_SETTINGS.keep_alive = 0;
    this.ADVANCED_SETTINGS.ka_GPS = false;
    this.ADVANCED_SETTINGS.log_GPS = 0;

  }

  private comprobePermissions(permissions){
    let permissionsKeys = Object.keys(permissions);
    let count = 0;
    let TOTAL_COMPROBATIONS = 8;
    
    for(let i = 0; i<permissionsKeys.length; i++){
      console.log("keys -----",permissions[permissionsKeys[i]]);
      if(permissionsKeys[i]!="id"){//skip id key
        if(permissions[permissionsKeys[i]]==0){
          count++;
        }
      }
      
    }
    if(count==TOTAL_COMPROBATIONS){
      this.returnToHomeSillyBoy();
    }

    console.log("FINAL VIEW ",permissions)
  }

  private returnToHomeSillyBoy(){
    //return to home view if service didnt load properly 
    console.log("BACK TO HOME!!!!") ;
    this.router.navigateByUrl('/devices-list');
  }

  public showHelp(section){
    console.log("selection",section," state before",this.showHelpText[section]);
    this.showHelpText[section] = (this.showHelpText[section]) ? false : true;
    console.log("state after",this.showHelpText[section]);
  }

  

}
