import { Component, OnInit,OnChanges, Input,OnDestroy, SimpleChange, SimpleChanges,ChangeDetectorRef } from '@angular/core';
import { NbWindowService, NbWindowRef } from '@nebular/theme';
import { IDropdownSettings,MultiSelectComponent } from 'ng-multiselect-dropdown';
import { UpdateUserInfoService } from '../../../../services/update-user-info.service';
import { UpdateDevicesListService } from '../../../../services/update-devices-list.service';
import { CreateUserService } from '../../../../services/create-user.service';
import { Subscription } from 'rxjs';
import { DeleteUserService } from '../../../../services/delete-user.service';
import { ClosedEditWinService } from '../../../../services/closed-edit-win.service';

@Component({
  selector: 'ngx-edit-window',
  templateUrl: './edit-window.component.html',
  styleUrls: ['./edit-window.component.scss']
})
export class EditWindowComponent implements OnInit,OnDestroy {
  userN;userName;sessionUserDevices;
  userI;userId;localDevices; 
  userE;userEmail;actualUser;
  userL;userLevel;branchId;
  userA;userAliasLvl;updateActualUser;subUserA;subUserLevel;
  addList = [];removeList=[];
  selectedItems = [];
  onSelectUserDevices;
  pastL =[];
  dropdownSettingsSU:IDropdownSettings;
  dropdownSettingsOnU:IDropdownSettings;
  activeA = false;activeB = false;saveActive=false;activation=null;updatePage=false;
  pre_Add =[];pre_Remove=[];
  createU = false;createActive;deleteActive;deletePermission=false;hasChildren=true;
  subsA : Subscription;subsC : Subscription ;
  constructor(public windowRef: NbWindowRef,
    private ref: ChangeDetectorRef,
    public updateUser : UpdateUserInfoService,
    public updateDevList : UpdateDevicesListService,
    public createUservice : CreateUserService,
    public deleteService : DeleteUserService,
    public windowChange :ClosedEditWinService
    ) { }

  ngOnInit() {
    this.userN=this.userName;
    this.userI=this.userId;
    this.userE=this.userEmail;
    this.userL=this.userLevel;
    this.userA=this.userAliasLvl;
    this.localDevices=this.sessionUserDevices;
    this.subUserLevel = this.getSubUserLevel(this.userL);
    this.subUserA = this.getSubUserAlias(this.userA);
   
    if(this.actualUser.level<3&&this.deletePermission==true&&this.hasChildren==false){
      this.activeDeleteUser(true);
    }else{
      this.activeDeleteUser(false);
    }
    if(this.actualUser.level<3 && this.userL<4){//check if create a new sub user is possible
      
      this.activeCreatUser(true);
    }else{
      this.activeCreatUser(false);
    }
    //console.log("name ",this.userN," selec level: ",this.userL);
   //session user assignation LIST
   if(this.onSelectUserDevices[0].DeviceID!=null){
    this.pastL=this.onSelectUserDevices;
   }
   var assigned = this.processDifference(this.onSelectUserDevices);
   if(assigned.length>0&&assigned[0].DeviceID!='null'){
    this.activeA=true;
    for(let c=0;c<assigned.length;c++){
      this.addList.push({
        item_id: assigned[c].DeviceID,
        item_text: assigned[c].Alias
      });
    }
   }
    
    this.dropdownSettingsSU  = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Eliminar selección',
      searchPlaceholderText: 'Buscar...',
      itemsShowLimit: 0,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'Sin datos',
      maxHeight: 150
    };
    //on-select user assignation LIST
    if(this.onSelectUserDevices[0].DeviceID!=null){
      this.activeB=true;
      for(let c=0;c<this.onSelectUserDevices.length;c++){
        this.removeList.push({
          item_id:this.onSelectUserDevices[c].DeviceID,
          item_text:this.onSelectUserDevices[c].Alias
        });
      }
    }
    this.dropdownSettingsOnU  = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Eliminar selección',
      searchPlaceholderText: 'Buscar...',
      itemsShowLimit: 0,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'Sin datos',
      maxHeight: 150
    };

    var self = this;
    //EDIT USER HANDLERS
    document.getElementById("subject").addEventListener('input', function nameReady(){
      var inputtxt= (document.getElementById("subject") as HTMLInputElement);
      let letters = /^[0-9a-zA-Z]+$/;
      let as = inputtxt.value;
      let stripped; 
      if(!inputtxt.value.match(letters))
      {
        stripped = as.replace(/[^a-z \u00D1\u00F10-9]/ig, '');
        inputtxt.value=stripped;
      }
      if($("#subject").val()!="" && $("#subjMail").val()!=""){
        self.activeSaveBtn(true);
      }else{
        self.activeSaveBtn(false);
      }
    }, false);

    document.getElementById("subjMail").addEventListener('input', function emailReady(){
      if($("#subject").val()!="" && $("#subjMail").val()!=""){
        self.activeSaveBtn(true);
      }else{
        self.activeSaveBtn(false);
      }
    }, false);

    //CREATE SUB USER HANDLERS
    document.getElementById("Newsubject").addEventListener('input', function nameReady(){
      if(self.createU){
        var inputtxt= (document.getElementById("Newsubject") as HTMLInputElement);
        let letters = /^[0-9a-zA-Z]+$/;
        let as = inputtxt.value;
        let stripped; 
        if(!inputtxt.value.match(letters))
        {
          stripped = as.replace(/[^a-z \u00D1\u00F10-9]/ig, '');
          inputtxt.value=stripped;
        }
        if(($("#Newsubject").val()!="" && $("#NewsubjMail").val()!="")&& $('#NewPass').val()!=""){
          self.activeSaveBtn(true);
        }else{
          self.activeSaveBtn(false);
        }
      }
    }, false);

    document.getElementById("NewsubjMail").addEventListener('input', function emailReady(){
      if(self.createU){
        if(($("#Newsubject").val()!="" && $("#NewsubjMail").val()!="")&&$('#NewPass').val()!=""){
          self.activeSaveBtn(true);
        }else{
          self.activeSaveBtn(false);
        }
      }
    }, false);

    document.getElementById("NewPass").addEventListener('input', function emailReady(){
      if(self.createU){
        if(($("#Newsubject").val()!="" && $("#NewsubjMail").val()!="")&&$('#NewPass').val()!=""){
          self.activeSaveBtn(true);
        }else{
          self.activeSaveBtn(false);
        }
      }
    }, false);

  }

  processDifference(dList){
    var pList=new Array();let flag=true;
    var indexA; var indexB;
    for(indexA in this.localDevices) {
      for(indexB in dList) {
        if(dList[indexB].DeviceID==this.localDevices[indexA].DeviceID){
          flag=false;
        }
      }
      if(flag){
        pList.push({DeviceID:''+this.localDevices[indexA].DeviceID,Alias:this.localDevices[indexA].Alias});
      }
      flag=true;
    }
    //console.log('returning ',pList);
     return pList;
  }

  processFinalDL(pR,pastL){
    var indexA; var indexB;var flag=true; var pList=[];
    for(indexA in pastL) {
      for(indexB in pR) {
        if(pR[indexB].removeId==pastL[indexA].DeviceID){
          //console.log("coincidence dont add: ",pastL[indexA]);
          flag=false;
        }else{
          //console.log("not coincidence bewteen : ",pR[indexB],"and : ",pastL[indexA])
        }
      }
      if(flag){
        pList.push({DeviceID:''+pastL[indexA].DeviceID,Alias:pastL[indexA].Alias});
      }
      flag=true;
    }
    //console.log('returning aa ',pList);
     return pList;
  }

  close() {
    this.windowRef.close();
  }
  //add list handlers
  onItemSelectAdd(item: any) {
    this.pre_Add.push({DeviceID:item.item_id,alias:item.item_text});
    this.inputsComp(); 
    //console.log("add list ",this.pre_Add);
  }
  onSelectAddAll(items: any) {
    this.pre_Add.splice(0, this.pre_Add.length);
    for(let c=0;c<items.length;c++){
      this.pre_Add.push({
        DeviceID:items[c].item_id,
        alias:items[c].item_text
      });
    }
    this.inputsComp();
    //console.log("add ALL ",this.pre_Add);
  }
  onDeSelectAdd(item: any){
    var index2RemoveA = this.pre_Add.findIndex(obj => obj.DeviceID==item.item_id);
    this.pre_Add.splice(index2RemoveA,1);
    //console.log("add list ",this.pre_Add);
    this.inputsComp();
  }
  onDeSelectAddAll(items: any){
    this.pre_Add.splice(0, this.pre_Add.length);
    //console.log("deselect add ",this.pre_Add);
    this.inputsComp();
  }


 //remove list handlers
  onItemSelectRemove(item: any) {
    this.pre_Remove.push({removeId:item.item_id,alias:item.item_text});
    //console.log("remove list ",this.pre_Remove);
    this.inputsComp();
  }
  onSelectRemoveAll(items: any) {
    this.pre_Remove.splice(0, this.pre_Remove.length);
    for(let c=0;c<items.length;c++){
      this.pre_Remove.push({
        removeId:items[c].item_id,
        alias:items[c].item_text
      });
    }
    this.inputsComp();
    //console.log("remove ALL",this.pre_Remove);
  }
  onDeSelectRemove(item: any){
    var index2RemoveB = this.pre_Remove.findIndex(obj => obj.removeId==item.item_id);
    this.pre_Remove.splice(index2RemoveB,1);
    //console.log("remove list ",this.pre_Remove);
    this.inputsComp();
  }
  onDeSelectRemoveAll(items: any){
    this.pre_Remove.splice(0, this.pre_Remove.length);
    //console.log("deselect remove ALL ",this.pre_Remove);
    this.inputsComp();
  }

  activeSaveBtn(state){
    if(state){
      //active button
      //$("#save_edit_button").removeClass("disabledBtn").addClass("enabledBtn");
      this.saveActive=true;
      this.activation=null;
    }else{
      //deactive button 
      //$("#save_edit_button").removeClass("enabledBtn").addClass("disabledBtn");
      this.saveActive=false;
      this.activation='disabled';
    }
    //console.log('active ',this.activation);
  }

  activeCreatUser(state){
    if(state){
      this.createActive=true;
    }else{
      this.createActive=false;
    }
  }
  
  activeDeleteUser(state){
    if(state){
      this.deleteActive=true;
    }else{
      this.deleteActive=false;
    }
  }

  inputsComp(){
    if($("#subject").val()!="" && $("#subjMail").val()!=""){
      this.activeSaveBtn(true);
    }else{
      this.activeSaveBtn(false);
    }
  }
  
  //save
  saveChanges(){
    //EDIT USER SAVE
    if(this.saveActive&&this.createU==false){
      //console.log("saving user changes ...");
      var a;
      this.updatePage=true; 
      var pre_add2= this.processFinalDL(this.pre_Remove,this.pastL);
      var newL =this.pre_Add.concat(pre_add2);
      var choosenID = this.userId;
    // console.log("pre final 1: ",pre_add2);
    // console.log("final Array to userId: ",choosenID,"  ",newL);
      this.updateUser.postUserInfo(choosenID,$('#subject').val(),$('#subjMail').val()).subscribe(d =>{ 
        a = d;
        if(this.updateActualUser){
          let localStorageJsonData = JSON.parse(localStorage.getItem('userInfo'));
          localStorageJsonData.name = $('#subject').val();
          localStorage.setItem("userInfo", JSON.stringify(localStorageJsonData));
        }
      });
      // this.updateDevList.postDevList(choosenID,newL,this.pastL).subscribe(d => a = d);
      this.activeSaveBtn(false);
    }
    //CREATE USER SAVE
    if(this.saveActive&&this.createU){
      this.updatePage = true;
      
      //console.log("creando sub usuario");
      //console.log("nuevo usuario : "+$('#Newsubject').val()+" email : "+$('#NewsubjMail').val()+" nivel: "+this.subUserLevel+" pass: "+$('#NewPass').val());
      this.activeSaveBtn(false);
      this.subsC = this.createUservice.postCreateUser($('#Newsubject').val(),this.subUserLevel,$('#NewsubjMail').val(),this.userId,this.branchId,$('#NewPass').val()).subscribe(d => a = d);
      this.windowRef.close();
    }
  }

  getSubUserLevel(parentLevel){
    var subUlevel = parentLevel+1;
    return subUlevel;
  }
  getSubUserAlias(parentAlias){
    var subUAlias;
    switch(parentAlias){
      case "Administrador":
          subUAlias="Supervisor";
      break;
      case "Supervisor":
          subUAlias="Operador";
      break;
      case "Operador":
          subUAlias="Cliente";
      break;
      default :
          subUAlias="Cliente";
      break;
    }
    return subUAlias;
  }

  createSubUser(){    
    document.getElementById("assignL").className = "hide-element";
    document.getElementById("quitL").className = "hide-element";
    document.getElementById("userForm").className = "hide-element";

    /*
    document.getElementById("assignL").style.display="none";
    document.getElementById("quitL").style.display="none";
    document.getElementById("userForm").style.display="none";
    
    document.getElementById("assignL").style.visibility="hidden";
    document.getElementById("quitL").style.visibility="hidden";
    document.getElementById("userForm").style.visibility="hidden";
    */

    document.getElementById("subUserForm").style.display="flex";

    this.activeSaveBtn(false);
    this.activeDeleteUser(false);
    this.activeCreatUser(false);
    this.createU = true;
  }

  deleteUser(event){
    
    event.preventDefault();
    var r = confirm("Estás a punto de eliminar al usuario : '"+this.userN+"' de manera permanente,¿Estás seguro?")
    if (r == true) {
      if(this.actualUser.level<3&&this.deletePermission==true&&this.hasChildren==false){
        var a;
        this.activeSaveBtn(false);
        this.activeDeleteUser(false);
        this.activeCreatUser(false);
        this.subsA = this.deleteService.postDeleteUser(this.userId,
          this.actualUser.level,this.actualUser.name,this.userLevel).subscribe(d => a = d);
        this.updatePage = true;
      }
      this.windowRef.close();
    } 
  }


  ngOnDestroy(){
    if(this.updatePage){
      window.location.reload();
    }
    this.windowChange.setFlag(true);
  }

}
