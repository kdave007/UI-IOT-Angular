import { Component, OnInit, OnDestroy,Input } from '@angular/core';
import { UserPermissonsService } from '../services/user-permissons.service';
import { Subscription } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { FilterUserService } from '../services/filter-user.service';

@Component({
  selector: 'ngx-users-selection',
  templateUrl: './users-selection.component.html',
  styleUrls: ['./users-selection.component.scss']
})
export class UsersSelectionComponent implements OnInit,OnDestroy {
  @Input('userSeasonInfo') userSeasonInfo : any;
  Users = [];//this array contains only the basic info of the user, but not the user permissions flags (booleans)
  companiesList = [];
  currentCompanyList = 0;
  superUser = false;companiesReady=false;
  subscriptionA : Subscription;
  subscriptionB : Subscription;
  subscriptionC : Subscription;
  currentSelectionUser = undefined;
  showHelpText = false;
  subsFlags = { companies: false, users: false, userSelected: false};

  public settingsTable = {
    actions: {
      add: false,
      delete: false,
      edit: false,
      custom: false
    },
    columns: {
      name: {
        title: 'Nombre',
        type: 'any',
      },
      levelName: {
        title: 'Rol',
        type: 'any',
      },
      email: {
        title: 'Email',
        type: 'any',
      },
      companyName: {
        title: 'Corporativo',
        type: 'any',
      },
      editableLabel:{
        title: 'Permisos',
        type:'any'
      }
    }
  };

 source: LocalDataSource = new LocalDataSource();

  constructor(private userPermissionsService : UserPermissonsService, public filterUserService : FilterUserService) { 
    
  }
  
  ngOnDestroy(): void {
    if(this.subsFlags.companies){
      this.userPermissionsService.cleanAllObjects();
      this.subscriptionB.unsubscribe();
    }
    if(this.subsFlags.users){
      this.subscriptionA.unsubscribe();
    }
    if(this.subsFlags.userSelected){
      this.filterUserService.reset();
    }
  }
  ngOnInit() {
    this.taskQuery(this.userSeasonInfo);

    this.subscriptionB = this.userPermissionsService.getCompanies().subscribe( compList => {
      this.companiesList = compList;
      if(this.companiesList.length) this.companiesReady=true;

      console.log("companies found",this.companiesList)
    });

    this.subscriptionA = this.userPermissionsService.getUsersList().subscribe( uList => {
      uList = uList.filter((element, index, arr) => { //remove the actual user logged in
        element["levelName"] = this.getLevelName(element.level);
        let editableStatus = this.fetchEditable(element);
        element["editableLabel"]= (editableStatus) ? 'Editables' : 'No editables';
        element["editableStatus"]= editableStatus;
        return element.id != this.userSeasonInfo.id;
      });
      this.Users = uList;
      this.source.load(uList);
      console.log("users found",uList)
    });
  }

  private fetchEditable(target){
    if(this.userSeasonInfo.level<3 && target.level > this.userSeasonInfo.level){
      return true
    }
    return false;
  }

  private getLevelName(id){
    if(id==null || id==0 || id==undefined) return "N/A"; 
    let names = [null,"Super","Administrador","Secundario"];
    return names[id];
  }

  public usersFamilySelected(id){
    this.currentCompanyList = id;
    if(id==0){
      this.userPermissionsService.queryAllUsers();
    }else{
      this.userPermissionsService.queryByCompany(id);
    }

  }

  private taskQuery(userInfo){
    let USER_LEVEL = {
      SUPER:1,
      ADMIN:2,
      SECONDARY:3
    }

    let level = userInfo.level;

    switch (level){
      case USER_LEVEL.SUPER:
        this.superUser = true;
        this.userPermissionsService.queryAllCompanies();
        this.userPermissionsService.queryAllUsers();
        this.subsFlags.companies = true;
        this.subsFlags.users = true;
      break;
      case USER_LEVEL.ADMIN:
        this.userPermissionsService.queryAllCompanies();
        this.userPermissionsService.queryByCompany(userInfo.companyId);
        this.subsFlags.users = true;
      break;
      case USER_LEVEL.SECONDARY:
      break;
    }
  } 

  onUserRowSelect($event){
    this.currentSelectionUser = $event.data;
    this.filterUserService.setSelection(this.currentSelectionUser);
    this.subsFlags.userSelected = true;
    console.log("event ----- ",$event.data)
  }

  public showHelp(){
    this.showHelpText = (this.showHelpText) ? false : true;
  }


}
