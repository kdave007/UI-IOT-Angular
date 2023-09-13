import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../@core/data/smart-table';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

import { DatePipe } from '@angular/common';
import { DeviceSelectionService } from '../../services/device-selection.service';
import { UserInfoService } from '../../services/user-info.service';
import * as moment from 'moment/moment'

@Component({
  selector: 'ngx-devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.scss']
})
export class DevicesListComponent implements OnInit,OnDestroy {
  stringCase : string ="";
  settings = {
    actions: {
      columnTitle: 'Acciones',
      add: false,
      delete: false,
      edit: false,
      custom: [
        //{ name: 'devLogs', title: '<i class="nb-email"></i>'}, // commented for beta only
        { name: 'summary', title: '<i class="nb-compose" title="Resumen"></i>'},
        { name: 'chart', title: '<i class="nb-bar-chart" title="Gráficas" ></i> ' },
        { name: 'config', title: '<i class="nb-gear" title="Configuraciones"></i>'},
        { name: 'msg', title: '<i class="nb-alert" title="alarmas"></i>'}
      ],
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      alias: {
        title: 'Alias',
        type: 'string',
      },
      gen: {
        title: 'Generación',
        type: 'string',
      },
      route: {
        title: 'Ruta',
        type: 'string',
      },
      lastseen: {
        title: 'Reportado',
        type:'html',
        valuePrepareFunction: (created,devId) => {
          console.log(devId.id,"CREATED ? ",created);
          let datenew = new Date(created);
          console.log(datenew);

          if(created == "Registro pendiente"){
            return "Registro pendiente";
          }
          
          let uI =JSON.parse(localStorage.getItem("userInfo"));
          let superID = {1:true,2:true,8:true,84:true};
          
          // let timeStamp = this.datePipe.transform(created,'dd MMM yyyy , h:mm:ss ')
          let timeStamp = moment.utc(created).format("YYYY-MM-DD HH:mm:ss");

          if(superID[uI.userId]){//if we find a match, we send an URL instead of just a timestamp
            this.stringCase = `<a href="./#/pages/messages?devId=${devId.id}" >${timeStamp}</a>`;
            return this.stringCase; 
          }
             
            
          return timeStamp; 
        },
    
      }
    },
    rowClassFunction: (row) =>{      
        if(row.cells[3].newValue == "Registro pendiente"){
          return `logo animated infinite flash slower`;      
        }         
    }
  };

  source: LocalDataSource = new LocalDataSource();
  devList;
  subscription: Subscription;
  subscriptionB: Subscription;

  user = {
    name : undefined,
    email: undefined,
    level : undefined
  };

  constructor(private router: Router,private activatedRoute: ActivatedRoute, private datePipe: DatePipe,
    public deviceSelection : DeviceSelectionService, private userInfoService : UserInfoService
    ) {}

  ngOnInit() {
    this.subscription = this.activatedRoute.data.subscribe( response  => {this.devList = response;console.log("got dev",response)});
    
    this.source.load(this.devList['devList']);

    this.userInfoService.request();
    this.subscriptionB = this.userInfoService.get().subscribe(data => {
      this.user = data;
    });
  }

  onCustomAction(event) {

    let devSelecetedJson: NavigationExtras = {
      queryParams: {
          devId: event.data.id//here we save the id of the device selected from the table 
      }
    }
  console.log(`this event : ${event.data}`,event.data);
    switch ( event.action) {
      case 'devLogs':
        this.setDeviceInfo(event.data);
        this.router.navigate(['./pages/layout/list']);
        break;
      case 'chart':
        this.setDeviceInfo(event.data);
        this.router.navigate(['./pages/graphs'],devSelecetedJson);//here we pass the id to the component
        break;
      case 'summary':
        this.setDeviceInfo(event.data);
        this.router.navigate(['./pages/summary'],devSelecetedJson);//here we pass the id to the component
        break;
      case 'config':
        if(this.checkUser()){
          this.setDeviceInfo(event.data);
          this.router.navigate(['./pages/device-config'],devSelecetedJson);//here we pass the id to the component
        }
        break;    
      case 'msg':
        this.setDeviceInfo(event.data);
        this.router.navigate(['./pages/device-notifications'],devSelecetedJson);//here we pass the id to the component
        break;
    }
  }
  checkUser() {
    // if(this.user.level==1){
    //   console.log("USER MASTER")
    //   return true;
    // }
    // console.log("USER NOT A MASTER")
    // return false;
    return true;
  }

  onReportedClick(){
    
  }

  setDeviceInfo(device){
    this.deviceSelection.set(
      device.id,
      device.alias,
      device.route,
      device.gen,
      device.lastseen,
      device.macflag
    );
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.subscriptionB.unsubscribe();
  }

  
}
