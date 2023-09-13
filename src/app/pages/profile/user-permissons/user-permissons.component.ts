import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Role } from './role'
import { UserPermissonsService } from '../services/user-permissons.service';
import { Subscription } from 'rxjs';
import { FilterUserService } from '../services/filter-user.service';
import { MatDialog } from '@angular/material';

enum ACTIONS_TYPES{
  SAVE,
  UNDO,
  RESTORE,
}

@Component({
  selector: 'ngx-user-permissons',
  templateUrl: './user-permissons.component.html',
  styleUrls: ['./user-permissons.component.scss']
})
export class UserPermissonsComponent implements OnInit,OnDestroy {
  @Input('userSeasonInfo') userSeasonInfo : any;
  
  private dialogRef;
  public questionText: string = null;
  public questionType: ACTIONS_TYPES;

  DEFAULT_VALUES: Role = {
    id:null,
    name:null,
    companyName: null,
    role: null,
    level: null,
    compressor: false,
    sampling: false,
    report: false,
    thermistors: false,
    gpios: false,
    ap: false,
    lightModule: false,
    advanced: false,
    alarmsAccessId: 0
  }

  RESTORE_PERMISSIONS : Role;

  Users = [];//this array contains only the basic info of the user, but not the user permissions flags (booleans)
  companiesList = [];
  currentCompanyList = 0;
  superUser = false;companiesReady=false;

  selectionReady = false;
  subscriptionA : Subscription;
  subscriptionB : Subscription;
  subscriptionC : Subscription;
 
  DEVICE_PERMISSIONS_LIST = 
  [
    {indexKey:"compressor",text:"Acceso a activación de la unidad de enfriamiento"},
    {indexKey:"sampling",text:"Acceso a frecuencia de muestreo de temperatura"},
    {indexKey:"report",text:"Acceso a opciones del reporte del dispositivo"},
    {indexKey:"thermistors",text:"Acceso a calibración de termistores"},
    {indexKey:"gpios",text:"Acceso a calibración de GPIOS"},
    {indexKey:"ap",text:"Acceso a credenciales de redes WIFI"},
    {indexKey:"lightModule",text:"Acceso a sensores de luz"},
    {indexKey:"advanced",text:"Acceso a configuraciones avanzadas"},
  ];

  NOTIFICATIONS_P_LIST = 
  [
    {accessId:0,text:"Deshabilitado"},
    {accessId:1,text:"Configuración solo para recibir alarmas por correo"},
    {accessId:2,text:"Configuración de parámetros de alarmas permitida"}
  ];

  ALARMS_ACCESS_TEXT = "Asigna el tipo de acceso a las alarmas, deshabilitar el acceso, solo permitir recibir notificaciones o recibir notificaciones y ajustar parámetros.";

  currentUser = null;//current selected user permissions merged with user info
  backupUserPermissions = null
  disabledSaveBtn = true;
  disabledUndoBtn = true;
  disabledRestBtn = true;
  showHelpText = false;
  
  constructor(private userPermissionsService : UserPermissonsService,private filterUserService : FilterUserService, public dialog: MatDialog) { }

  ngOnDestroy(){
    if(this.selectionReady){
      this.userPermissionsService.cleanAllObjects();
      this.subscriptionA.unsubscribe();
    }
  }

  ngOnInit() {
    this.currentUser = {...this.DEFAULT_VALUES};
    this.backupUserPermissions = {...this.DEFAULT_VALUES};
    this.RESTORE_PERMISSIONS = {...this.DEFAULT_VALUES};

    this.subscriptionA = this.filterUserService.getSelection().subscribe( data => {  
      if(data!=undefined){
        //clean user object first
        this.currentUser = {...this.DEFAULT_VALUES};
        this.backupUserPermissions = {...this.DEFAULT_VALUES};
        this.RESTORE_PERMISSIONS = {...this.DEFAULT_VALUES};

        //now fill the values received
        this.currentUser.companyName = data.companyName;
        this.currentUser.name = data.name;
        this.currentUser.id = data.id;
        this.currentUser.level = data.level;
        this.isEditable(data);
        this.disabledSaveBtn = true;
        this.disabledUndoBtn = true;
        this.disabledRestBtn = false;
        this.userPermissionsService.queryPermissions(this.currentUser.id);
      }
    
      console.log("selected user in permissions component is ::  ",data,"and default values",this.DEFAULT_VALUES)
    });
    
    this.subscriptionC = this.userPermissionsService.getUserPermissions().subscribe( data => {
      //here we received the current selected user permissions, add them to the currentUser object
      this.currentUser.compressor = data.compressorControl;
      this.currentUser.sampling = data.samplingSetup;
      this.currentUser.report = data.reportSetup;
      this.currentUser.thermistors = data.thermistorsCalibration;
      this.currentUser.gpios = data.gpiosOffsets;
      this.currentUser.ap = data.apSetup;
      this.currentUser.lightModule = data.lmodulesSetup;
      this.currentUser.advanced = data.advancedSetup;
      this.currentUser.alarmsAccessId = data.alarmsAccessId;
      this.backupUserPermissions = {...this.currentUser}
      console.log("selected user permissions are ",data);
    });
  }


  public updateStatus(){
    this.disabledSaveBtn = false;
  } 
 
  public confirmChanges(opt: boolean){

    if(!opt){
      this.dialogRef.close();
      return;
    }

    this.dialogRef.close();

    if(this.currentUser.id!=null){
      
      let result
      switch (this.questionType) {

        case ACTIONS_TYPES.SAVE:
          this.disabledSaveBtn = true;
          this.disabledUndoBtn = false;
          console.log("save this ",this.currentUser);
          result = this.parseUserData(this.currentUser);
          console.log("PARSE RESULT!! ",result)
          this.userPermissionsService.savePermissions(result);
          break;
          
        case ACTIONS_TYPES.UNDO:
          this.disabledUndoBtn = true;
          this.currentUser = {...this.backupUserPermissions};
          result = this.parseUserData(this.currentUser);
          console.log("PARSE RESULT!! ",result)
          this.userPermissionsService.savePermissions(result);
          break;
        
        case ACTIONS_TYPES.RESTORE:
          this.userType(this.currentUser);
          this.currentUser = {...this.RESTORE_PERMISSIONS};
          result = this.parseUserData(this.currentUser);
          console.log("PARSE RESULT!! ",result)
          this.userPermissionsService.savePermissions(result);
          break;

      }
    }
    
  }

  public saveChanges(templateRef){
    this.questionType = ACTIONS_TYPES.SAVE;
    this.questionText = "¿Está seguro de guardar los cambios?"
    this.dialogRef = this.dialog.open(templateRef, {
    });
  }

  public undoChanges(templateRef){
    this.questionType = ACTIONS_TYPES.UNDO;
    this.questionText = "¿Está seguro de deshacer los cambios?"
    this.dialogRef = this.dialog.open(templateRef, {
    });
  }
  public restChanges(templateRef){
    this.questionType = ACTIONS_TYPES.RESTORE;
    this.questionText = "¿Está seguro de restablecer valores por default?"
    this.dialogRef = this.dialog.open(templateRef, {
    });
  }

  private parseUserData(userData){
    let values = {}
    values["compressor"] = userData.compressor;
    values["sampling"] = userData.sampling;
    values["report"] = userData.report;
    values["thermistors"] = userData.thermistors;
    values["gpios"] = userData.gpios;
    values["ap"] = userData.ap;
    values["lightModule"] = userData.lightModule;
    values["advanced"] = userData.advanced;
    values["alarms"] = userData.alarmsAccessId;
    return {userId:userData.id,values};
  }

  private isEditable(userInfo){
    if(userInfo.editableStatus){
      this.selectionReady = true;
      return
    }
    this.selectionReady = false;
  }

  public alarmOptionSelection(accessId){
    this.disabledSaveBtn = false;
    console.log("accessId for alarms selected is ",accessId,"current user object is",this.currentUser);
  }

  private userType(userData) {

    this.RESTORE_PERMISSIONS.companyName = userData.companyName;
    this.RESTORE_PERMISSIONS.name = userData.name;
    this.RESTORE_PERMISSIONS.id = userData.id;
    this.RESTORE_PERMISSIONS.level = userData.level;

    if(userData.level == 2){
      this.RESTORE_PERMISSIONS.compressor = true;
      this.RESTORE_PERMISSIONS.sampling = true;
      this.RESTORE_PERMISSIONS.report = true;
      this.RESTORE_PERMISSIONS.ap = true;
      this.RESTORE_PERMISSIONS.alarmsAccessId = 2;
    }
  }

  public showHelp(){
    this.showHelpText = (this.showHelpText) ? false : true;
  }

}
