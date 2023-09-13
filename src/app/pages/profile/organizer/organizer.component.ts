import { Component, OnInit, Input,ViewChild, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectorRef, NgZone} from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { EditWindowComponent } from './edit-window/edit-window.component';
import { NbWindowService } from '@nebular/theme';
import { AssignedDevicesService } from '../../../services/assigned-devices.service';
import { Subscription } from 'rxjs';
import { BranchUpdateService } from '../../../services/branch-update.service';
import { ClosedEditWinService } from '../../../services/closed-edit-win.service';

declare var $: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'ngx-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})

export class OrganizerComponent implements OnInit,AfterViewInit,OnChanges{
  @Input('usersB') usersB : any; 
  @Input('masterData') masterData : any;   
  @Input('userDevList') userDevList : any;//this one arrives later
  @ViewChild(EditWindowComponent, {static: false}) childWindow:EditWindowComponent;
  DS; fl=false;canOpen = true;
  clickedID;newSetParent;
  deleteU;chosenUser:any;
  subscriptionB : Subscription;subsA: Subscription;subsC: Subscription;
  actualUser;

  constructor(public windowService: NbWindowService,
              public assignedDev : AssignedDevicesService,
              public branchService : BranchUpdateService,
              public windowChange : ClosedEditWinService,
              private ref: ChangeDetectorRef,
              private ngZone: NgZone
  ) { 
  }
 
  ngOnInit() { 
    this.actualUser = this.getActualUserInfo();
  }

  ngAfterViewInit(){
    this.initTree();
    
  }

   createDataSource(){
    var usersData=this.usersB;
    //on first row [0] is the ADMIN...
    this.DS= {'id':""+usersData[0].id,'name':""+usersData[0].alias,'title':""+usersData[0].name,'email':usersData[0].email,'children':false};
    var sup = new Array();
    var op = new Array();
    var cli = new Array();
    var r,r2,r3;
    
    if((r=this.findChildren(usersData[0].id))!=false){//find admin children
      for(let c=0;c<r.length;c++){
      sup.push(r[c]);
      }
      //console.log(r)
      this.DS['children']=sup;
    }
  
    for(let c=0;c<this.DS['children'].length;c++){//find superv children
      if((r2=this.findChildren(this.DS['children'][c].id))!=false){//first we get all the children for that userID (array type)
        //console.log(r2);
        op.push(r2);//here we push that array we got before to the op array
        for(let f=0;f<op.length;f++){
          this.DS['children'][c]['children']=op[f];//now we add the array to the main json, notice we dont add all array, just the corresponding index row
        }
        //console.log("checando hijos de"+DS['children'][c].title);
        //console.log("checando hijos de",DS['children'][c]);
        for(let a=0;a<this.DS['children'][c]['children'].length;a++){
          //console.log('%c test : ', 'background: #222; color: #bada55',"iteracion "+a+" checando si hay hijos: "+DS['children'][c]['children'][a].title+":");
          if((r3=this.findChildren(this.DS['children'][c]['children'][a].id))!=false){
            //console.log("found children for "+DS['children'][c]['children'][a].title);
            //console.log("iteracion "+a+" pasando :");
            //console.log(r3);
            cli.push(r3);
            for(let z=0;z<cli.length;z++){
              this.DS['children'][c]['children'][a]['children']=cli[z];
            }
          }
        }
      }
    }
    //console.log('%c users org datasource: ', 'background: #222; color: #bada55');
    //console.log(DS);
    //console.log('%c users org datasource: ', 'background: #222; color: #bada55');
    return this.DS;
  }

  findChildren(sID){
    var usersData=this.usersB;
    sID=""+sID;
    //console.log("looking for children on ID:"+sID);
    let njs = new Array();let f =false;
    for(let c=0;c<usersData.length;c++){
      if((!usersData[c].checked)&&(usersData[c].parent==sID)){
        usersData[c].checked=true;//we set this.flag that we already checked this user 
        //console.log("true",usersData[c].name);
        njs.push({
          'id':""+usersData[c].id,
          'name':""+usersData[c].alias,
          'title':""+usersData[c].name,
          'email':""+usersData[c].email,
          'level':""+usersData[c].level
        });
        f=true;
      }
    }
    if(f){
      return njs;
    }else{
      return false;
    }
  }
  initTree(){
    let f=this.createDataSource();
      $.oc = $('#diagramDiv');
    var options ={
      'data' : f,
      'nodeContent': 'title',
      'draggable':true,
      'pan':true,
      'zoom':true,
      'zoominLimit':2,
      'toggleSiblingsResp':true,
      'nodeId':'id',
      'depth': 2,
     /* 'createNode': function($node, data) {
        var secondMenuIcon = $('<i>', {
          'class': 'fa fa-info-circle second-menu-icon',
          click: function() {
           event.stopPropagation(); 
          $(this).siblings('.second-menu').toggle('hidden');
          }
        });
        //var secondMenu = '<div class="second-menu"><img class="avatar" src="resources/user_icon.png"></div>';
        //$node.append(secondMenuIcon).append(secondMenu);
        }*/
      
    }
    if(!this.fl){
      var oc= $.oc.orgchart(options);
      this.fl=true;
    }else{
      oc.init(options);
    }
    this.onclickNodeLis(oc);
    this.dragDrop(oc);
    //console.log(usersData);
    //$.oc.orgchart('setChartScale', oc, 0.75); //SPINNER BUG!!
  }

  onclickNodeLis(oc){
    var self = this;
    var usersData=this.usersB;
    var deleteBtnActive = false;
    $('#diagramDiv').find('.node').on('click', function () {
      let info = $(this).data('nodeData');
      
      //console.log("chosen level:",info.level," id:",info.id," name ",info.title);
      //console.log("actual id user:",self.actualUser);
      this.clickedID=info.id;
      this.deleteU={
        id:info.id,
        level:info.level,
        name:info.title
      };
      
      /*
      $('#LevelLabel').html(info.name);
      if(info.level==4){
        deleteBtnActive(false);
        document.getElementById("create_user_button").style.display="none";
      }else{
        document.getElementById("create_user_button").style.display="block";
      }
  */  
      let child = oc.getRelatedNodes($(this), 'children');
      var haschildren = false;
      if(child.length!=0){
        haschildren = true;
       // console.log("children of selection : ",oc.getRelatedNodes($(this), 'children').data('nodeData'));
      }
      if((info.level==1)&&(self.actualUser.level==1)){//if we clicked on one ADMIN and we are not an ADMIN, don let it edit info
        deleteBtnActive=true;
        if(info.id==self.actualUser.id){
          deleteBtnActive=false;
        }
        //console.log('you the admin!');
        if(self.canOpen){
          self.openUserView(info,true,deleteBtnActive,haschildren);// the true flag means to update actual user localstorage info
          self.canOpen=false;
        }
      }else if(info.level!=1){
        if((self.actualUser.level<info.level)){
          deleteBtnActive=true;
          if(self.canOpen){
            self.openUserView(info,false,deleteBtnActive,haschildren);
            self.canOpen=false;
          }
        }else if(self.actualUser.level==4){
          alert("Permiso denegado, No cuenta con los permisos suficientes para editar a otros usuarios");                           
        }else if((info.id==self.actualUser.id)){
          //console.log("this is yourself!");
          deleteBtnActive=false;
          if(self.canOpen){
            self.openUserView(info,true,deleteBtnActive,haschildren);
            self.canOpen=false;
          }
        }else{
          alert("Aviso, Solo puedes editar usuarios de nivel inferior al tuyo");
        }
      }
      if(info.id==self.actualUser.id){
        //deleteBtnActive=false;
      }
  
      let parent = oc.getRelatedNodes($(this), 'parent');
      if(parent.length!=0){
        //console.log("this",$(this));
        //console.log("parent of selection : ",oc.getRelatedNodes($(this), 'parent').data('nodeData'));
      }
      
      if(self.actualUser.level>2){
       // deleteBtnActive(false);
      }
      this.newSetParent={parentId : info.id, parentLevel:info.level};
      
    });
    
  }
  
 openUserView(userInfo,upActualU,deletePerm,haschildren){
      this.subscriptionB= this.assignedDev.getData(userInfo.id).subscribe(onSelectUserDL => {
        this.windowService.open(EditWindowComponent, { 
          title: `Editar: `+userInfo.title,
          context: {
            userName : userInfo.title,
            userId : userInfo.id,
            userEmail : userInfo.email,
            userLevel : userInfo.level,
            userAliasLvl : userInfo.name,
            sessionUserDevices : this.userDevList,
            onSelectUserDevices : onSelectUserDL,
            updateActualUser: upActualU,
            actualUser : this.actualUser,
            branchId : this.usersB[0].id,
            deletePermission : deletePerm,
            hasChildren : haschildren
          } 
        });
    });
    this.subsC = this.windowChange.getState().subscribe( flag => {
      this.canOpen = flag;
    } );
 }

 dragDrop(oc){
   var self = this;
	oc.$chart.on('nodedrop.orgchart', function(event, extraParams) {
		let currentN = extraParams.draggedNode.data('nodeData');
		let dragZ = extraParams.dragZone.data('nodeData');
		let dropZ = extraParams.dropZone.data('nodeData');
	/*	console.log('draggedNode:' , currentN.id
		  , ', FROM line :' , dragZ.title, "(level: ",dragZ.level,")"
		  , ', TO:' , dropZ.title, "(level: ",dropZ.level,")"
		
		);*/
		if(self.actualUser.level<4){
			if((currentN.level-dropZ.level)==1){
				if (!window.confirm('Estas seguro de cambiar de lugar a: '+currentN.title)) {
					event.preventDefault();
				}else{
          var r;
          self.subsA = self.branchService.postNewBranch(self.actualUser.name,currentN.id,dropZ.id).subscribe(m => r = m );
				}
			}else{
                           // swal("Aviso", "Solo puedes cambiar un usuario a una rama de su mismo nivel : cliente -> cliente", "info");
				alert("Solo puedes cambiar un usuario a una rama de su mismo nivel : cliente -> cliente");
				event.preventDefault();
			}
		}else{
                    //swal("Permiso denegado", "Permisos insuficientes", "info");
			alert('Los permisos de este usuario no permiten editar otros usuarios.');
			event.preventDefault();
		}
	  });
}

getActualUserInfo(){
  console.log("Current master data: ");
  console.log(this.masterData);
/*
  let uI=localStorage.getItem('userInfo');
  var profileInfo = JSON.parse(uI);
  var indexUser = this.usersB.findIndex(obj => obj.id== profileInfo['userId']);
  console.log('your user Info ',this.usersB[indexUser]);
  return this.usersB[indexUser];*/

  return this.masterData;
}

 ngOnChanges(changes : SimpleChanges){
  //console.log("changes");  

  //this.ngZone.run(() => {});
 }



 
}
