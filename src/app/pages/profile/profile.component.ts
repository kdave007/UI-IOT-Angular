import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { UserTokenService } from '../../services/user-token.service';
import { Subscription } from 'rxjs';
import { UserBranchResolverService } from '../../services/user-branch-resolver.service';
import { ActivatedRoute } from '@angular/router';
import { AssignedDevicesService } from '../../services/assigned-devices.service';
import { NbGlobalPhysicalPosition, NbGlobalPosition, NbComponentStatus, NbToastrService } from '@nebular/theme';
import { ToasterConfig } from 'angular2-toaster';
import { ProfileService } from './services/profile.service';
import { MatDialog } from '@angular/material';
import { DevListResolverService } from '../../services/dev-list-resolver.service';
import { UserPermissonsService } from './services/user-permissons.service';

export interface ADMIN_LIST {
  name: string,
  id: number
}

@Component({
  //selector: 'ngx-profile',
  selector: 'ngx-components',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit,OnDestroy {
  /*usersAdmin = [
    {name: "jesus", id:1},
    {name: "kevin", id:2},
    {name: "juan pablo", id:3}
  ]*/

  usersAdmin: ADMIN_LIST[] = [];

  newUserName: string = null;
  newUserMail: string = null;
  newUserType: number = 3;

  userTypeLabel = [null,null,"administrador","secundario"];

  currentUser: string;

  temp_users;
  temp_dev;
  temp_data;
  
  usersB_array: any[] = [];
  userDevList_array: any[] = [];
  masterData_array: any[] = [];
  treeContents: any;

  showOrganizer = true;
  showSelector = false;

  usersB;
  userId;
  selectedId;
  masterData;
  subscription : Subscription;
  subscriptionB : Subscription;
  sessionUserN='';
  userDevList;profileInfo;indexUser;
  public helpText : string = "";
  private dialogHelp;
  userSeasonInfo = {level:3};

  public TYPE = {
    ADMIN:2,
    SECONDARY:3
  }


 //other option usertoken future implementatio to get user id value
  constructor(public userToken : UserTokenService,
    private activatedRoute: ActivatedRoute,
    public BranchResolver : UserBranchResolverService,
    public assignedDev : AssignedDevicesService,
    private toastrService: NbToastrService,
    private profileService: ProfileService,
    private ngZone: NgZone,
    public dialog: MatDialog,
    public devListResolverService : DevListResolverService,
    private userPermissionsService : UserPermissonsService,
    ) {
        let uI=localStorage.getItem('userInfo');
        this.profileInfo = JSON.parse(uI); 
        this.userId = Number( this.profileInfo['userId'] );
        this.selectedId = this.userId;

        this.profileService.getUserSeasonInfo().subscribe(data => {
          console.log("/// ////  //// /// got user info",data);
          this.userSeasonInfo = data;
          const names = [null,"Super","Administrador","Secundario","Basico"];
          this.userSeasonInfo["label"] = names[data.level]

          this.devListResolverService.queryUnresolve(data.id);
        
        });

        // this.subscription= this.activatedRoute.data.subscribe(data  =>  {
        //   this.usersB = data['usersBranch'];
        //   this.indexUser = this.usersB.findIndex(obj => obj.id== this.profileInfo['userId']);
        //   this.sessionUserN=this.usersB[this.indexUser]; 

        //   console.log("usersB");
        //   console.log(this.usersB);

        //   for (let index = 0; index < this.usersB.length; index++) {

        //     if( this.usersB[index].id == this.selectedId ){
        //       this.masterData =  this.usersB[index];
        //       break;
        //     }        
        //   }

        //   this.subscriptionB= this.assignedDev.getData(this.usersB[this.indexUser]['id']).subscribe(dat => {
        //     this.userDevList = dat;

        //     console.log("userDevList");
        //     console.log(this.userDevList);
        // });
        // });
    }

  config: ToasterConfig;
  index = 1;
  destroyByClick = true;
  duration = 5000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = true;
  status: NbComponentStatus = 'info';
  title = 'Tip!';
  content = `Arrastra y ajusta el zoom del diagrama para visualizarlo mejor.`;
  
  ngOnDestroy(): void {
    this.devListResolverService.clean();
  }


  ngOnInit() { 
    //this.makeToast();
    

    this.profileService.getAdminList().subscribe(data => {
      
      for (let index = 0; index < data.length; index++) {
        let content: ADMIN_LIST = {
          name: data[index].name,
          id: data[index].id
        }

        if( data[index].id == this.selectedId ) {
          this.currentUser = data[index].name;
        }

        this.usersAdmin.push(content);
      }

      //this.getTrees();
    });    

  }

  public getTrees() {
    let usersArray: number[] = [];

    for (let index = 0 ; index < this.usersAdmin.length ; index++) {
      let id: number = this.usersAdmin[index].id;
      
      usersArray.push(id);
    }

    this.profileService.getCompleteTree( usersArray ).subscribe(data => {

      for (let index = 0 ; index < this.usersAdmin.length ; index++) {
       let index_devices = data[index][0];
       let index_users = data[index][1];


       this.usersB_array.push( index_users );
       this.userDevList_array.push( index_devices );

       for (let indexAux = 0 ; indexAux < index_users.length ; indexAux++) {
        
        if( index_users[indexAux].id == this.usersAdmin[index].id ) {
          this.masterData_array.push( index_users[indexAux] );
          break;
        }
        
       }
      }

      console.log("usersB_array");
      console.log(this.usersB_array);

      console.log("userDevList_array");
      console.log(this.userDevList_array);

      console.log("masterData_array");
      console.log(this.masterData_array);

/*
      this.temp_users = this.usersB_array[0];
      this.temp_dev = this.userDevList_array[0];
      this.temp_data = this.masterData_array[0];*/

    });




/*
    for (let index = 0 ; index < this.usersAdmin.length ; index++) {

      // Obtiene la lista de usuarios en el arbol
      this.profileService.getUsersTree( this.usersAdmin[index].id ).subscribe(data => {
        this.usersB_array.push(data);        
  
        for (let index = 0; index < data.length; index++) {
  
          if( data[index].id == this.usersAdmin[index].id ){
            this.masterData_array.push( data[index] );
            break;
          }        
        }
        
        this.ngZone.run(() => {});
      });

      // Obtiene la lista de dispositivos del usuario
      this.profileService.getUserDevices( this.usersAdmin[index].id ).subscribe(data => {
        this.userDevList


        console.log("Devices");
        console.log(data);
  
        this.userDevList = data;
  
        this.ngZone.run(() => {});
      }); 

    }
*/

    

      
  }

  public setUser(userId: number){
    if(userId === this.selectedId){
      return;
    }

    this.selectedId = userId;
    this.showOrganizer = false;

    console.log("New user branch:" + String(userId));
    
    this.profileService.getUsersTree(userId).subscribe(data => {
      console.log("Tree");
      console.log(data);

      this.usersB = data;

      for (let index = 0; index < this.usersB.length; index++) {

        if( this.usersB[index].id == this.selectedId ){
          this.masterData =  this.usersB[index];
          break;
        }        
      }
      
      this.ngZone.run(() => {});
    });

    this.profileService.getUserDevices(userId).subscribe(data => {
      console.log("Devices");
      console.log(data);

      this.userDevList = data;

      this.ngZone.run(() => {});    

      setTimeout( x => this.showOrganizer=true, 2000);
    }); 
  }

  /**
   * @brief
   *  Actualiza el nombre del nuevo usuario
   * 
   * @param nameEvent 
   *  Evento con el nombre del usuario
   */
  public setAdminName(nameEvent: any){
    this.newUserName = nameEvent.target.value;

    console.log("New admin name: " + this.newUserName);
  }

  /**
   * @brief
   *  Actualiza el correo del nuevo usuario
   * 
   * @param nameEvent 
   *  Evento con el correo del usuario
   */
  public setAdminMail(nameEvent: any){
    this.newUserMail = nameEvent.target.value;

    console.log("New admin mail: " + this.newUserMail);
  }

  /**
   * @brief
   *  Crea el nuevo usuario
   */
  public createNewAdmin(){
    console.log("New user: " + this.newUserName + ", " + this.newUserMail);

    this.profileService.createUser( this.newUserName, this.newUserMail, this.newUserType, 0 );

    this.newUserName = null;
    this.newUserMail = null;
    this.newUserType = null;

    this.showToast("success", "Nuevo usuario", "Se creó correctamente el nuevo usuario");
    this.updateUsersList();//set a timer maybe??
  }

  updateUsersList() {
    //UPDATE USERS LIST
    setTimeout(()=>{                        
      if(this.userSeasonInfo["level"]==1){
        this.userPermissionsService.queryAllUsers();
      }else{
        this.userPermissionsService.queryByCompany(this.userSeasonInfo["id"]);
      }
    }, 3000);
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

  makeToast() {
    this.showToast(this.status, this.title, this.content);
  }
  
  showHelp(helpTemplate){

    this.helpText = "Para cambiar de rama un usuario puedes arrastrar el cuadro de un usuario hacia el cuadro de otro usuario de un nivel mayor al que seleccionaste."
    +"\n Puedes usar las flechas que aparecen en los cuadros de usuarios para ocultar cuadros de usuarios."
    +"\n También puedes arrastrar el organigrama y hacer zoom a tu gusto.";

    this.dialogHelp= this.dialog.open(helpTemplate,{
       panelClass: 'warning-txt' 
    }); 
  }

  closeHelp(){
    this.dialogHelp.close();
  }

  setNewUserType(type){
    this.newUserType = type;
  }

}
