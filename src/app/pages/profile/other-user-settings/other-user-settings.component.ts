import { Component, OnInit, OnDestroy } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UpdateUserInfoService } from '../../../services/update-user-info.service';
import { UpdateDevicesListService } from '../../../services/update-devices-list.service';
import { AssignedDevicesService } from '../../../services/assigned-devices.service';
import { FilterUserService } from '../services/filter-user.service';
import { Subscription } from 'rxjs';
import { DevListResolverService } from '../../../services/dev-list-resolver.service';
import { NbToastrService, NbGlobalPosition, NbGlobalPhysicalPosition, NbComponentStatus } from '@nebular/theme';
import { ProfileService } from '../services/profile.service';
import { ToasterConfig } from 'angular2-toaster';
import { tap, finalize } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { UserPermissonsService } from '../services/user-permissons.service';

enum ACTIONS_TYPES{
  SAVE,
  UNDO,
}

@Component({
  selector: 'ngx-other-user-settings',
  templateUrl: './other-user-settings.component.html',
  styleUrls: ['./other-user-settings.component.scss']
})
export class OtherUserSettingsComponent implements OnInit,OnDestroy {
  availableList = [];
  targetList=[];
  companiesList = [];
  userSeasonInfo = undefined;
  userCompany = null;

  private dialogRef;
  public questionText: string = null;
  public questionType: ACTIONS_TYPES;

  subscriptionA : Subscription;
  subscriptionB : Subscription;
  subscriptionC : Subscription;
  subscriptionZ : Subscription;

  LIST_STAT = {
    AVAILABLE:false,
    TAKEN:true
  }

  public showNewKeyRep: boolean = false;
  public showNewKey: boolean = false;
  public showPrevKey: boolean = false;

  public newMail: string = null;
  public newMailConfirm: string = null;
  public newMailKeyCheck: string = null;

  public oldKey: string = null;
  public newKey: string = null;
  public newKeyConfirm: string = null;

  public showPrevKeyMail: boolean = false;

  config: ToasterConfig;
  index = 1;
  destroyByClick = true;
  duration = 5000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = true;
  companiesReady=false;
  nonEditableList = true;
  showHelpText = false;

  private selectedUser;
  public disabledButton = {undo:true,saveList:true};

  constructor(public updateUser : UpdateUserInfoService,
    private filterUserService : FilterUserService, 
    public assignedDevicesService : AssignedDevicesService,
    public devListResolverService : DevListResolverService,
    private toastrService: NbToastrService, private profileService: ProfileService,
    public dialog: MatDialog, private userPermissionsService : UserPermissonsService
    ) {

      this.subscriptionA = this.filterUserService.getSelection().subscribe( data => {
        if(data!=null && data!=undefined){
          this.selectedUser = data;
          this.userCompany = data.companyId+"";
          this.disabledButton.saveList = false;
          this.disabledButton.undo = false;
          this.nonEditableList = this.cantEditDevicesList(this.userSeasonInfo,data)
          this.assignedDevicesService.queryDevices(data.id);
        }
      });

      this.subscriptionB = this.assignedDevicesService.get().subscribe( devices => {
        console.log("dispositivos encontrados asignados al usuario seleccionado:",devices);
        if(devices.length){
       
          this.availableList.forEach(element => {
            element["taken"]=this.LIST_STAT.AVAILABLE;

            devices.forEach(row => {
              if(element.id==row.id){
                element["taken"]=this.LIST_STAT.TAKEN;
              }
              
            });
          });
          this.targetList = [];
          this.targetList = devices;
        }

        this.subscriptionZ = this.userPermissionsService.getCompanies().subscribe( compList => {
          this.companiesList = compList;
          if(this.companiesList.length)this.companiesReady=true;
        });
        
      });  

      this.subscriptionC = this.devListResolverService.get().subscribe( devices => {
        console.log("dispositivos del usuario en sesion",devices)
        if(devices.length){
          devices.forEach(element => {
            element["taken"]=this.LIST_STAT.AVAILABLE;
            this.availableList.push(element);
          });
        }
      });

      this.profileService.getUserSeasonInfo().subscribe(data => {
        console.log("/// ////  //// /// got user info",data);
        this.userSeasonInfo = data;
        const names = [null,"Super","Administrador","Secundario","Basico"];
        this.userSeasonInfo["label"] = names[data.level];
      });
      
     }
  
  ngOnDestroy(): void {
    this.assignedDevicesService.clear();
    this.subscriptionA.unsubscribe();
    this.subscriptionB.unsubscribe();
    this.subscriptionC.unsubscribe();
    this.subscriptionZ.unsubscribe();
  }   


  ngOnInit() {
    
  }

  removeItem(id){
    this.setTaken(id,this.LIST_STAT.AVAILABLE);
    this.targetList = this.targetList.filter((element)=> element.id!=id);
  }

  addItem(index){
    this.availableList[index]["taken"]=this.LIST_STAT.TAKEN;
    this.targetList = [...this.targetList,this.availableList[index]]
  }

  setTaken(id,status){
    this.availableList.forEach((element)=> {
      if(element.id==id){
        element["taken"]=status;
      }
    });
  }

  saveList(opt: boolean){
    if(!opt){
      this.dialogRef.close();
      return;
    }
    this.dialogRef.close();
    this.assignedDevicesService.set(this.selectedUser.id,this.targetList);
  }

  public saveChanges(templateRef){
    this.questionType = ACTIONS_TYPES.SAVE;
    this.questionText = "¿Está seguro de guardar los cambios?"
    this.dialogRef = this.dialog.open(templateRef, {
    });
  }
  //* */

  public setNewKey(event: any){
    this.newKey = event.target.value;

    console.log(this.newKey);
  }

  public setNewKeyRep(event: any){
    this.newKeyConfirm = event.target.value;

    console.log(this.newKeyConfirm);
  }

  public setOldKey(event: any){
    this.oldKey = event.target.value;

    console.log(this.oldKey);
  }

  public setNewMail(event: any){
    this.newMail = event.target.value;

    console.log(this.newMail);
  }

  public setNewMailConfirm(event: any){
    this.newMailConfirm = event.target.value;

    console.log(this.newMailConfirm);
  }

  public setNewMailKeyCheck(event: any){
    this. newMailKeyCheck = event.target.value;

    console.log(this.newMailKeyCheck);
  }

  public saveKey(){
    // if(this.newKey == null || this.oldKey == null || this.newKeyConfirm == null){
    if(this.newKey == null || this.newKeyConfirm == null){

      this.showToast("danger", "Error", "Campos incompletos");
    }
    else if(this.newKey != this.newKeyConfirm){
      this.showToast("danger", "Error", "Las contraseñas no coinciden");
    }
    else{
      let ok: string;

      this.profileService.updateKey(this.selectedUser.id, this.newKey, null, true).pipe(
        // tap(
        //   event => ok = event instanceof HttpResponse ? 'succeeded' : '',
        //   error => ok = 'failed'
        // ),
        // // Log when response observable either completes or errors
        // finalize(() => {
        //   if(ok == "failed") {
        //     this.showToast("danger", "Contraseña incorrecta", "Error, verifique su contraseña");
        //   }
        //   else{
        //     this.showToast("success", "Contraseña actualizada", "Se actualizó corretamente la contraseña");

        //     this.newKey = null;
        //     this.oldKey = null;
        //     this.newKeyConfirm = null;
        //   }
        // })
      ).subscribe(data => {
        console.log("DATA RECEIVED---",data.success)
        if(data.success) {
          this.showToast("success", "Contraseña actualizada", "Se actualizó corretamente la contraseña");
          this.newKey = null;
          this.oldKey = null;
          this.newKeyConfirm = null;
          this.updateUsersList();
        }
        else{
          this.showToast("danger", "Contraseña incorrecta", "Error, verifique su contraseña");
        }
      });
    }    
  }

  public saveMail(){
    //if(this.newMail == null || this.newMailConfirm == null || this.newMailKeyCheck == null){
    if(this.newMail == null || this.newMailConfirm == null){  
      this.showToast("danger", "Error", "Campos incompletos");
      return;
    }
    else if(this.newMailConfirm != this.newMail){
      this.showToast("danger", "Error", "Los correos no coinciden");
      return;
    }

    let re = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    let ok: string;
    
    if (!re.test(this.newMailConfirm) || !re.test(this.newMail) ){
      this.showToast("danger", "Error", "Formato de correo inválido");
    } 
    else {
      this.profileService.updateEmail(this.selectedUser.id, this.newMail, null, true).pipe(
        // tap(
        //   event => ok = event instanceof HttpResponse ? 'succeeded' : '',
        //   error => ok = 'failed'
        // ),
        // // Log when response observable either completes or errors
        // finalize(() => {
        //   if(ok == "failed") {
        //     this.showToast("danger", "Contraseña incorrecta", "Error, verifique su contraseña");
        //   }
        //   else{
        //     this.showToast("success", "Correo actualizado", "Se actualizó corretamente el correo");

        //     this.newMail = null;
        //     this.newMailConfirm = null;
        //     this.newMailKeyCheck = null;
        //   }
        // })
      ).subscribe(data => {
        if(data.success) {
            this.showToast("success", "Correo actualizado", "Se actualizó corretamente el correo");
            this.newMail = null;
            this.newMailConfirm = null;
            this.newMailKeyCheck = null;
            this.updateUsersList();
          }
        else{
          this.showToast("danger", "Contraseña incorrecta", "Error, verifique su contraseña");
        }
      });
    }    
  }

  private showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };
    const titleContent = title ? `${title}` : '';

    this.index += 1;
    this.toastrService.show(
      body,
      `${titleContent}`,
      config);
  }

  undoList(){
    this.assignedDevicesService.queryDevices(this.selectedUser.id);
  }

  updateUserFamily(){
    //post the new companyId
    //console.log("set",this.selectedUser,"to",this.userCompany);
    this.profileService.updateUserCompany(this.selectedUser.id,this.userCompany);
    this.updateUsersList();
  }

  updateUsersList(){

  }

  cantEditDevicesList(userSeasonInfo: any, selected: any): any {
    return(userSeasonInfo.level<selected.level) ? false : true;
  }

  public showHelp(){
    this.showHelpText = (this.showHelpText) ? false : true;
  }

}
