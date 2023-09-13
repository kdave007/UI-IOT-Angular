import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { AlertsNotificationsService } from './alerts-notifications.service';
import { HttpClient } from '@angular/common/http';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-device-notifications',
  templateUrl: './device-notifications.component.html',
  styleUrls: ['./device-notifications.component.scss']
})
export class DeviceNotificationsComponent implements OnInit,AfterViewInit {
  devId : number;
  subscription1 : Subscription;
  subscription2 : Subscription;

  public messagesAck: boolean = false;
  private columnDefs;
  private defaultColDef;
  private rowSelection = 'multiple';
  private rowData = [];
  private dataAlerts;
  private gridApi;
  private gridColumnApi;
  public clearTheme = true;

  constructor(private activatedRoute : ActivatedRoute, private alertsNotifications : AlertsNotificationsService,private http: HttpClient,
    private themeService: NbThemeService) {
    this.subscription1= this.activatedRoute.queryParams.subscribe(params => this.devId = params['devId']);
    
    this.columnDefs = [
      {
        headerName: "Fecha",
        field: 'date',
        filter: 'agDateColumnFilter',
        suppressSizeToFit: false,
        width: 110,
        minWidth: 190,
        maxWidth: 180,
        // filterParams: {
        //   comparator: function(filterLocalDateAtMidnight, cellValue) {
        //     var dateAsString = cellValue;
        //     if (dateAsString == null) return -1;
        //     var dateParts = dateAsString.split('/');
        //     var cellDate = new Date(
        //       Number(dateParts[2]),
        //       Number(dateParts[1]) - 1,
        //       Number(dateParts[0])
        //     );
        //     if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
        //       return 0;
        //     }
        //     if (cellDate < filterLocalDateAtMidnight) {
        //       return -1;
        //     }
        //     if (cellDate > filterLocalDateAtMidnight) {
        //       return 1;
        //     }
        //   },
        //   browserDatePicker: true,
        // },
      },
      {
        headerName: "Temperatura",
        field: 'hour',
        filter: 'agNumberColumnFilter',
        suppressSizeToFit: false,
        width: 110,
        minWidth: 100,
        maxWidth: 120,
      },
      {
        headerName: "Periodo(Minutos)",
        field: 'minute',
        filter: 'agNumberColumnFilter',
        suppressSizeToFit: false,
        width: 110,
        minWidth: 200,
        maxWidth: 220,
      },
      {
        headerName: "Descripción(Minutos)",
        field: 'description',
        filter: 'agNumberColumnFilter',
        suppressSizeToFit: false
      }
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

  ngOnInit(){
    const uI=JSON.parse(localStorage.getItem('userInfo'));

    this.subscription2 = this.alertsNotifications.getAlertsNotifications(uI.userId,this.devId).subscribe( data =>{
     console.log("data ",data);
      this.rowData = [];

      this.messagesAck = true;

      for (let index = 0 ; index < data.length ; index++) {
        var description="";
        switch(data[index].type){
            case 1:
              description="Valor de temperatura fuera de rango en caja de camión";
            break;
            case 2://CONFIRM TYPE VALUES ............................................................
              description="Valor de temperatura fuera de rango en placa eutectica de camión";
            break;
            case 3:
              description="Valor de temperatura fuera de rango en manguera de descarga del copmresor";
            break;
            case 4:
              description="Valor de temperatura fuera de rango en manguera de succión del copmresor";
            break;
            default:
            break;
        }

        this.rowData.push(
          {
            date: data[index].timestamp,
            hour: data[index].sampleValue,
            minute: data[index].period,
            description:description,
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
