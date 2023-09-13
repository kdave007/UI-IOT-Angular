import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NbGlobalPhysicalPosition, NbComponentStatus, NbToastrService, NbGlobalPosition } from '@nebular/theme';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RegisterService, REG_DATA } from './services/register.service';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-registration-device',
  templateUrl: './registration-device.component.html',
  styleUrls: ['./registration-device.component.scss']
})
export class RegistrationDeviceComponent implements OnInit {
  public regList: REG_DATA[] = [];
  public dataSource;
  subscription1 : Subscription;
  userId;

  displayedColumns: string[] = ['select', 'id', 'alias', 'route', 'bssid', 'time'];  

  selection = new SelectionModel<REG_DATA>(true, []);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  public devAlias: string = null;
  public devBssid: string = null;
  public devRoute: string = null;

  showDevices = false;

  public selectUnavailable = true;  

  private dialogRef;

  constructor(private toastrService: NbToastrService, public dialog: MatDialog, private regService : RegisterService, private ngZone: NgZone) {
    let uI=localStorage.getItem('userInfo');
    let profileInfo = JSON.parse(uI); 
    this.userId = profileInfo['userId'];

    console.log("User id: " + String(this.userId));
   }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<REG_DATA>(this.regList);
    this.paginator._intl.itemsPerPageLabel = 'Registros por página:';
    console.log(this.dataSource);
    this.dataSource.paginator = this.paginator;

    this.regService.getDevices().subscribe(newData => {
      this.regList = newData;

      this.dataSource.data = newData;
      this.paginator._changePageSize(this.paginator.pageSize); 

      this.showDevices = true;

      /*
      this.dataSource = new MatTableDataSource<REG_DATA>(this.regList);
      this.paginator._intl.itemsPerPageLabel = 'Registros por página:';
      this.dataSource.paginator = this.paginator;

      console.log("New data");
      console.log(newData);
      this.ngZone.run(() => {
        console.log('enabled time travel');
      });*/
    });

    this.regService.queryDevices();
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * @brief
   *  Selecciona todas las filas en caso de no estar seleccionado, en otro caso elimina la seleccion
   */
  public masterToggle() {
    if(this.isAllSelected()){
      this.selection.clear();
      this.selectUnavailable = true;
    }
    else{
      this.selectUnavailable = false;
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  /**
   * @brief
   *  El titulo para los checkbox pasados a la file
   * 
   * @param row 
   *  Fila
   */
  public checkboxLabel(row?: REG_DATA): string {
    let result: any;

    if(!row){
      result = `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    else{
      result = `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

    if(this.selection.selected.length == 0){
      this.selectUnavailable = true;
    }
    else{
      this.selectUnavailable = false;
    }

    return result;
  }

  /**
   * @brief
   *  Elimina los datos seleccionados de la tabla
   */
  public deleteSelection(){
    this.showDevices = false;

    console.log(this.selection.selected);

    for (let index = 0 ; index < this.selection.selected.length ; index++) {
      this.regService.deleteDevice(this.selection.selected[index].id);
    }    

    this.regService.queryDevices();
    
    this.dialogRef.close();
    this.showToast("success", "Registros eliminados", "Se eliminaron correctamente los registros seleccionados", true, 5000);
    //this.showToast("warning", "Acceso denegado", "La eliminación de dispositivos se encuentra bloqueada por seguridad, comuníquese con soporte", true, 10000);    

    //setTimeout( x => this.showDevices=true, 2000);
  }

  /**
   * @brief
   *  Cancela el borrado de datos
   */
  public cancelDelete(){
    this.dialogRef.close();
  }

  /**
   * @brief
   *  Confirma el borrado de los datos
   * 
   * @param templateRef 
   *  Referencia html
   */
  public deleteConfirmation(templateRef) {
    this.dialogRef = this.dialog.open(templateRef, {

    });

    this.dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
    });        
}

  /**
   * @brief
   *  Update new device alias
   * 
   * @param event 
   *  Alias input key event
   */
  public updateAlias(event: any){
    this.devAlias = event.target.value;

    console.log(this.devAlias);
  }

  /**
   * @brief
   *  Update new device bssid
   * 
   * @param event 
   *  Bssid input key event
   */
  public updateBssid(event: any){
    this.devBssid = event.target.value;

    console.log(this.devBssid);
  }

  /**
   * @brief
   *  Update new device route
   * 
   * @param event 
   *  Route input key event
   */
  public updateRoute(event: any){
    this.devRoute = event.target.value;

    console.log(this.devRoute);
  }

    /**
   * @brief
   *  Estructura el BSSID
   * 
   * @param e 
   *  BSSID
   */
  public formatMAC(e) {
    let r = /([a-f0-9]{2})([a-f0-9]{2})/i,
        str = e.target.value.replace(/[^a-f0-9]/ig, "");

    while (r.test(str)) {
        str = str.replace(r, '$1' + ':' + '$2');
    }

    this.devBssid =  str.slice(0, 17);
    e.target.value = this.devBssid;

    console.log(this.devBssid);
  }

  /**
   * @brief
   *  Registra un nuevo dispositivo
   */
  public regNewDev(){
    this.showDevices = false;

    console.log("Register new device");

    this.regService.createDevice(this.devAlias, this.devRoute, this.devBssid);
    this.regService.queryDevices();

    this.showToast("success", "Nuevo registro", "El dispositivo fue registrado correctamente", true, 3000);

    this.devAlias = null;
    this.devBssid = null;
    this.devRoute = null;
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
}

/**
 * @brief
 *  Device registration data
 */
/*export interface REG_DATA {
  id: number; ///< Device ID
  alias: string; ///< Device alias
  route: string; ///< Device route
  bssid: string; ///< Device BSSID
  time: string; ///< Registration time
}*/
/*
regList: REG_DATA[] = [
  { id: 1, alias: "test1", route: "route1", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 2, alias: "test2", route: "route2", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 3, alias: "test3", route: "route3", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 4, alias: "test4", route: "route4", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 5, alias: "test5", route: "route5", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 6, alias: "test6", route: "route6", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 7, alias: "test7", route: "route7", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 8, alias: "test8", route: "route8", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 9, alias: "test9", route: "route9", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 10, alias: "test10", route: "route10", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 11, alias: "test11", route: "route11", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 12, alias: "test12", route: "route12", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 13, alias: "test13", route: "route13", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 14, alias: "test14", route: "route14", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 15, alias: "test15", route: "route15", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 16, alias: "test16", route: "route16", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 17, alias: "test17", route: "route17", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 18, alias: "test18", route: "route18", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 19, alias: "test19", route: "route19", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
  { id: 20, alias: "test20", route: "route20", bssid:"AA:AA:AA:AA:AA:AA", time:"	2019-08-05 15:29:34"},
]*/
