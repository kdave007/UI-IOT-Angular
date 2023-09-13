import { Component, OnInit, ViewChild, ElementRef , AfterViewInit} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MsgService } from './msg.service';
import { MessagesService } from './services/messages.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { map, catchError } from 'rxjs/operators';
import { NbThemeService } from '@nebular/theme';
import * as $ from 'jquery';

@Component({
  selector: 'ngx-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, AfterViewInit {
  private gridApi;
  private gridColumnApi;
  //@ViewChild('myGrid', { static: true }) msgTable: ElementRef;

  public messagesAck: boolean = false;

  devId;
  subscription1 : Subscription;

  globalData2;
  globalData;

  public clearTheme = true;

  httpSubscription : Subscription;

  private columnDefs;
  private defaultColDef;
  private rowSelection = 'multiple';
  private rowData = [];

  constructor(private msgService: MessagesService, private activatedRoute : ActivatedRoute, private http: HttpClient,
              private themeService: NbThemeService) {
    this.subscription1= this.activatedRoute.queryParams.subscribe(params => this.devId = params['devId']);

    this.columnDefs = [
      {
        headerName: "Fecha",
        field: 'date',
        filter: 'agDateColumnFilter',
        suppressSizeToFit: false,
        width: 110,
        minWidth: 100,
        maxWidth: 120,
        filterParams: {
          comparator: function(filterLocalDateAtMidnight, cellValue) {
            var dateAsString = cellValue;
            if (dateAsString == null) return -1;
            var dateParts = dateAsString.split('/');
            var cellDate = new Date(
              Number(dateParts[2]),
              Number(dateParts[1]) - 1,
              Number(dateParts[0])
            );
            if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
              return 0;
            }
            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            }
            if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            }
          },
          browserDatePicker: true,
        },
      },
      {
        headerName: "Hora",
        field: 'hour',
        filter: 'agNumberColumnFilter',
        suppressSizeToFit: false,
        width: 110,
        minWidth: 100,
        maxWidth: 120,
      },
      {
        headerName: "Minuto",
        field: 'minute',
        filter: 'agNumberColumnFilter',
        suppressSizeToFit: false,
        width: 110,
        minWidth: 100,
        maxWidth: 120,
      },
      {
        headerName: "Segundo",
        field: 'second',
        filter: 'agNumberColumnFilter',
        suppressSizeToFit: false,
        width: 110,
        minWidth: 100,
        maxWidth: 120,
      },
      {
        headerName: "Tipo",
        field: 'type',
        suppressSizeToFit: false,
        width: 110,
        minWidth: 100,
        maxWidth: 120,
      },
      {
        headerName: "Nivel",
        field: 'level',
        suppressSizeToFit: false,
        width: 110,
        minWidth: 100,
        maxWidth: 120,
      },
      {
        headerName: "Descripción",
        field: 'description',
        filter: false,
        suppressSizeToFit: false,
      },
    ];
    this.defaultColDef = {
      flex: 1,
      minWidth: 150,
      filter: true,
      sortable: true,
      resizable: true,
    };


  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  courses$: Observable<any>;

  ngOnInit() {
    this.msgService.getMessages( this.devId ).subscribe(data => {       
      this.rowData = [];

      this.messagesAck = true;

      for (let index = 0 ; index < data.length ; index++) {
        this.rowData.push(
          {
            date: data[index].date,
            hour: data[index].hour,
            minute: data[index].minute,
            second: data[index].second,
            type: data[index].type,
            level: data[index].level == null ? "NA" : data[index].level,
            description: data[index].description,
          }
        )
      }
      console.log(this.rowData);
    });
  }

  ngAfterViewInit() {
    this.themeService.onThemeChange()
    .subscribe((theme: any) => {

      switch(theme.name){
        case "default":
        case "corporate":
          this.clearTheme = true;
          break;

        case "cosmic":
        case "dark":
          this.clearTheme = false;
          break;
      }

      //ag-theme-material ag-theme-balham-dark
    });
  }
}



/**
 * @brief
 *  Interfaz para los mensajes del dispositivo
 */
export interface DEV_MSG {
  time: string; ///< Fecha y hora del mensaje
  type: string; ///< Tipo de alerta
  level: string; ///< Nivel del evento
  description: string; ///< Descripcion del evento
}

const messages: DEV_MSG[] = [
  { time: "2019-02-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 1" },
  { time: "2019-04-05 15:30:34", type: "Sistema", level: "Error", description: "Prueba 2" },
  { time: "2019-05-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 3" },
  { time: "2019-05-05 15:29:35", type: "Sistema", level: "Error", description: "Prueba 4" },
  { time: "2019-06-08 15:29:34", type: "Sistema", level: "Error", description: "Prueba 5" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 6" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 7" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 8" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 9" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 10" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 11" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 12" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 13" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 14" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 15" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 16" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 17" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 18" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 19" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 20" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 21" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 22" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 23" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 24" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 25" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 26" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 27" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 28" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 29" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 30" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 31" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 32" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 33" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 34" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 35" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 36" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 37" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 38" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 39" },
  { time: "2019-08-05 15:29:34", type: "Sistema", level: "Error", description: "Prueba 40" }
]

