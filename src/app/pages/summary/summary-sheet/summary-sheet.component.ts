import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SheetService } from '../local-service/sheet.service';
import { Subscription } from 'rxjs';
import { DeviceSelectionService } from '../../../services/device-selection.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { Chart } from 'chart.js';

import { THERM_TITLES } from '../../summary/utils';

@Component({
  selector: 'ngx-summary-sheet',
  templateUrl: './summary-sheet.component.html',
  styleUrls: ['./summary-sheet.component.scss']
})
export class SummarySheetComponent implements OnInit, OnDestroy {
  @Input('deviceId') devId : any;

  subscriptionA : Subscription;
  subscriptionB : Subscription;
  subscriptionC : Subscription;
  subscriptionD : Subscription;
  subscriptionE : Subscription;

  DeviceInfo : any;
  kinetic : any;
  meanTemps : any;
  tempIntervals : any;
  rawTemps : any;
  deviceInformation : any;
  maxminTemps: any;
  chart: Chart;

  inferioresPlate : any;
  superioresPlate : any;
  inferioresBox : any;
  superioresBox : any;

  rawTempsL: boolean;
  maxminTempsL: boolean;
  meanTempsL: boolean;
  kineticL: boolean;
  tempIntervalsL: boolean;

  THERM_TITLES = THERM_TITLES;
  
  constructor(private sheetService : SheetService, private deviceSelectionService : DeviceSelectionService) { }

  ngOnDestroy(){
    this.sheetService.clear();
    //when component is destroyed by changing page/view, we must destroy all the subscriptions to avoid bugs and malfunctions
    this.subscriptionA.unsubscribe();
    this.subscriptionB.unsubscribe();
    this.subscriptionC.unsubscribe();
    this.subscriptionD.unsubscribe();
    this.subscriptionE.unsubscribe();
    
    this.rawTempsL = false;
    this.maxminTempsL = false;
    this.meanTempsL = false;
    this.kineticL = false;
    this.tempIntervalsL = false;
  }//ngOnDestroy

  ngOnInit() {
    this.subscriptionA = this.deviceSelectionService.get().subscribe( data => {
      if(data['id'] != undefined || data['id'] != null) {
        this.deviceInformation = data;
        let ruta = this.deviceInformation.route;
        let alias = this.deviceInformation.alias;
        let generacion = this.deviceInformation.gen;
        this.DeviceInfo =
        {
          "Empresa": "New Transport Applications S.A.de C.V.",
          "Placa": "XYZ-123",
          "Ruta": ruta,
          "Alias": alias,
          "Generacion": generacion.toString().replace(/(\d)(?=(\d{1})+(?!\d))/g, '$1.'),
          "Thermistor3": this.THERM_TITLES.T3_short,
          "Thermistor4": this.THERM_TITLES.T4_short,
        };
      }
    });//deviceInformation

    this.subscriptionB = this.sheetService.getTemps().subscribe( data => {
      if(data['datesRange']['start'] != undefined || data['datesRange']['start'] != null) {
        this.rawTemps = data;
        let Temp1: any = Object.values(this.rawTemps.samples.map(x => x.temp1));
        let maxT1 = Math.max(...Temp1);
        let minT1 = Math.min(...Temp1)
        let Temp2: any = Object.values(this.rawTemps.samples.map(x => x.temp2));
        let maxT2 = Math.max(...Temp2);
        let minT2 = Math.min(...Temp2);
        let Temp3: any = Object.values(this.rawTemps.samples.map(x => x.temp3));
        let maxT3 = Math.max(...Temp3);
        let minT3 = Math.min(...Temp3);
        let Temp4: any = Object.values(this.rawTemps.samples.map(x => x.temp4));
        let maxT4 = Math.max(...Temp4);
        let minT4 = Math.min(...Temp4);
        this.maxminTemps =
        {
          "maxT1": maxT1,
          "minT1": minT1,
          "maxT2": maxT2,
          "minT2": minT2,
          "maxT3": maxT3,
          "minT3": minT3,
          "maxT4": maxT4,
          "minT4": minT4
        };
        this.chartSS();
        this.rawTempsL = true;
        this.maxminTempsL = true;
        this.tempIntervalsL = false;
      }
    });//rawTemps

    this.subscriptionC = this.sheetService.getMeanTemps().subscribe( data => {
      if(data['plate'] != undefined || data['plate'] != null) {
        this.meanTemps = data;
        this.meanTempsL = true;
      }
    });//meanTemps

    this.subscriptionD = this.sheetService.getKinetic().subscribe( data => {
      if(data['mkt1'] != undefined || data['mkt1'] != null) {
        this.kinetic = data;
        this.kineticL = true;
      }
    });//Kinetic

    this.subscriptionE = this.sheetService.getTempIntervals().subscribe( data => {
      if(!(data['limits']['upper'] == 0 && data['limits']['lower'] == 0)) {
        this.tempIntervals = data;
        let inferior = this.tempIntervals['limits']['upper'];
        let superior = this.tempIntervals['limits']['lower'];

        this.inferioresPlate = this.tempIntervals.plate.off.filter(function(s) {
            return s.init.temp < inferior;
        });
        this.superioresPlate = this.tempIntervals.plate.off.filter(function(s) {
          return s.init.temp > superior;
        });
        this.inferioresBox = this.tempIntervals.box.off.filter(function(s) {
          return s.init.temp < inferior;
        });
        this.superioresBox = this.tempIntervals.box.off.filter(function(s) {
          return s.init.temp > superior;
        });

        this.tempIntervalsL = true;
      }
    });//Intervals

  }//ngOnInit

  getContext(element: any) {
    let canvas: any = <HTMLCanvasElement> document.getElementById(element);
    let ctx = canvas.getContext('2d');
    return ctx
  }
  
  chartXRanges(xNumR: any) {
    //Calcula Rangos de eje X en la grafica
    xNumR = Math.round(xNumR);
    xNumR = Math.round(xNumR / 10) * 10;
    return xNumR;
  }

  chartSS() {

    let xRangeMax: any = this.maxminTemps.maxT3 > this.maxminTemps.maxT4 ? this.maxminTemps.maxT3 : this.maxminTemps.maxT4;
    let xRangeMin: any = this.maxminTemps.minT3 < this.maxminTemps.minT4 ? this.maxminTemps.minT3 : this.maxminTemps.minT4;

    if(this.chart != null){
      this.chart.destroy();
    }
    this.chart = new Chart(this.getContext('PDFChart'), {
      type: 'line',
      data: {
        labels: this.rawTemps.samples.map(x => x.dateTime),
        datasets: [
          {
            label: this.DeviceInfo.Thermistor3,
            data: this.rawTemps.samples.map(x => x.temp3),
            borderColor: '#007bff',
            fill: false,
            borderWidth: 1.5,
          },
          {
            label: this.DeviceInfo.Thermistor4,
            data: this.rawTemps.samples.map(x => x.temp4),
            borderColor: '#28a745',
            fill: false,
            borderWidth: 1.5,
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
            ticks: {
              maxTicksLimit: 15,
              beginAtZero: true,
              precision: 0
            },
            type: 'time',
            time: {
              unit: 'hour',
              stepSize:1,
              displayFormats: {
                'hour': 'DD/MM HH:mm'
              }
            },
          }],
          yAxes: [{
            ticks: {
              //Rango del eje x en la gráfica
              stepSize:10,
              min: this.chartXRanges(xRangeMin) - 20,
              max: this.chartXRanges(xRangeMax) + 20,
            },
            scaleLabel: {
              display: true,
              labelString: "°C"
            }
          }],
        },
        spanGaps: true,
        maintainAspectRatio: true,
        interaction: {
          intersect: false,
        },
        elements: {
          point:{
              radius: 0,
          }
        },
        responsive: true,
        plugins: {
          crosshair: false,
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Grafíco de temperaturas',
          },
        }
      },
    }); //Line chart
  }//SS

  public downloadPDF() {

    let DATA: any = document.getElementById('htmlData');
    //let width: any = document.getElementById('htmlData')!.offsetWidth;
    //let height: any = document.getElementById('htmlData')!.offsetHeight;

    let options = {

      dpi: 1000,
      background: 'white',
      scale: 3
    };

    html2canvas(DATA, options).then((canvas) => {
      
      let pdf = new jsPDF('p', 'mm', [215.9, 279.4]);
      let imgData = canvas.toDataURL('image/PNG');
      let x = 15;
      let y = 15;
      let imgProps = (pdf as any).getImageProperties(imgData);
      let XpdfWidth = pdf.internal.pageSize.getWidth() - 2 * x;
      let YpdfHeight = (imgProps.height * XpdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', x, y, XpdfWidth, YpdfHeight, undefined, 'FAST');
      pdf.addPage();
      if(this.tempIntervalsL) {
        autoTable(pdf, { html: '#IntervalosM1' });
        autoTable(pdf, { html: '#Intervalosm1' });
        autoTable(pdf, { html: '#IntervalosM2' });
        autoTable(pdf, { html: '#Intervalosm2' });
        pdf.addPage();
      }
      autoTable(pdf, { html: '#Muestras' });
      
      return pdf;

    }).then((pdfResult) => {
      let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      let inicio = (this.rawTemps['datesRange'].start).toLocaleString('es-MX', options)
      let final = (this.rawTemps['datesRange'].end).toLocaleString('es-MX', options)
      pdfResult.save(`Reporte de Temperaturas del Dispositivo ${this.devId} - ${this.DeviceInfo.Alias} Placa ${this.DeviceInfo.Placa} Muestras del ${ inicio } al ${ final }.pdf`);
    });
  }//PDF


}