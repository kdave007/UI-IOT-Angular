import 'chartjs-plugin-zoom';
import 'chartjs-plugin-crosshair';
import { Component, OnInit , Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NbThemeService, NbColorHelper } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { UpdateRangeChartsService } from '../../../services/update-range-charts.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { DataSamplesResolverService } from '../../../services/data-samples-resolver.service';
import { Chart } from 'chart.js';
import { ChartViewService } from '../../../services/chart-view.service';
import { THERM_TITLES } from '../../summary/utils';
import { TEMPS_FILTER } from '../../temp.commands';

@Component({
  selector: 'temp-chartjs-line',
  styleUrls: ['./temp-chart.component.scss'],
  templateUrl: './temp-chart.component.html',  
})
export class TempChartComponent implements OnInit,OnDestroy,AfterViewInit {

  ngAfterViewInit(): void {
   
  }
   
  data: any;
  options: any;
  themeSubscription: any;
  samples: any;
  seriesTemp1 = new Array();
  seriesTemp2 = new Array();
  tempLabel = new Array();
  subscription : Subscription;
  subscriptionB : Subscription;
  tempData;
  colors: any;
  chartjs: any;
  THERM_TITLES = THERM_TITLES;
  private rangeFlag : boolean = false;
  public hideLoadingData : boolean = false;

  @Input() dataToChild : Subject<any>;//here is received the data binding from the parent component
    

  constructor(private theme: NbThemeService,private activatedRoute: ActivatedRoute, private range :UpdateRangeChartsService,
    public getDatasamplesService : DataSamplesResolverService, public chartView : ChartViewService) { }
  
  ngOnDestroy(): void {
      if(this.tempData){
        this.dataToChild.unsubscribe();
      }

      if(this.rangeFlag){
        this.subscription.unsubscribe();
        this.subscriptionB.unsubscribe();
      }
  }

  ngOnInit() {
    //console.log("temps got dates: ",this.dataToChild);
    this.chartView.resetChartView().subscribe(cId => { 
      if(cId=="aT"){
        this.createChart();
      }
    });

      this.dataToChild.subscribe( data => {
        this.tempData=data//this.cleanNulls(data,"temp3","temp4");
        this.sortData(this.tempData);
        //console.table(this.tempData);
        //console.log("temps data : ", this.tempData);
        this.createChart();
        this.hideLoadingData = true;
      }
      );
    //LOW_PASS to RDP
      this.subscription = this.range.getRange().subscribe(myRange => {
        this.rangeFlag = true;
        this.hideLoadingData = false;
        this.subscriptionB = this.getDatasamplesService.setNewValues(myRange,TEMPS_FILTER.RDP,true).subscribe( data  => {
          this.tempData = data; 
          this.seriesTemp1.length=0;
          this.seriesTemp2.length=0;
          this.tempLabel.length=0;
          //this.tempData=this.cleanNulls(this.tempData,"temp3","temp4");
          this.sortData(this.tempData);
          console.log("temps data : ", this.tempData);
          this.createChart();
          this.hideLoadingData = true;
      });
    });
  // this.dataToChild=this.cleanNulls(this.dataToChild,"temp3","temp4");
  // this.sortData(this.dataToChild);//function to sort array in multiple arrays...
    
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => { 
      this.colors= config.variables;
      this.chartjs = config.variables.chartjs;
      this.createChart();
    });
  }

  chartXRanges(xNumR: any) {
    //Calcula Rangos de eje X en la grafica
    xNumR = Math.round(xNumR);
    xNumR = Math.round(xNumR / 10) * 10;
    return xNumR;
  }

  private createChart(){

    let therm1: any = Object.values(this.seriesTemp1);
    let maxT1: any = Math.max(...therm1);
    let minT1: any = Math.min(...therm1);

    let therm2: any = Object.values(this.seriesTemp2);
    let maxT2: any = Math.max(...therm2);
    let minT2: any = Math.min(...therm2);

    let xRangeMax: any = maxT1 > maxT2 ? maxT1 : maxT2;
    let xRangeMin: any = minT1 < minT2 ? minT1 : minT2;

    this.data = {
      labels: this.tempLabel,
      datasets: [{
        data: this.seriesTemp1,
        fill:false,
        label: 'Termistor 1(Descarga compresor)',
        backgroundColor: 'rgba(255,69,0)',
        borderColor:'rgba(255,69,0)',
        borderWidth: 2,
        cubicInterpolationMode: 'linear',
        pointRadius:2,
        pointStyle:'line',
        lineTension: 0.3,
      }, {
        data: this.seriesTemp2,
        fill:false,
        label: 'Termistor 2 (Succión compresor)',
        backgroundColor: '#ffc107',
        borderColor: '#ffc107',
        borderWidth: 2,
        cubicInterpolationMode: 'linear',
        pointRadius:2,
        pointStyle:'line',
        ineTension: 0.3
      },
      ],
    };

    this.options = {
      elements: {
        line: {
          borderJoinStyle: 'round'
        },
      },
      spanGaps: true,
      plugins: {
        crosshair: {
          line: {
            color: '#F66',  // crosshair line color
            width: 1        // crosshair line width
          },
          sync: {
            enabled: false,
          },
          zoom: {
            enabled: false,
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
        labels: {
          filter: function(legendItem, data) {
            return legendItem.index != 1 
          },
          fontColor: this.chartjs.textColor
        }
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: true,
              color: this.chartjs.axisLineColor,
            },
            ticks: {
              fontColor: this.chartjs.textColor,
              autoSkip: true,
              maxTicksLimit: 10,
            },
            scaleLabel: {
              display: true,
              labelString: "T"
            },
            type: 'time',
            time: {
              unit: 'hour',
              stepSize:1,
              displayFormats: {
                'hour': 'D/MMM/YY h:mm a'
              }
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
              color: this.chartjs.axisLineColor,
            },
            ticks: {
              //Rango del eje x en la gráfica
              min: this.chartXRanges(xRangeMin) - 20,
              max: this.chartXRanges(xRangeMax) + 20,
              fontColor: this.chartjs.textColor,
            },
            scaleLabel: {
              display: true,
              labelString: "°C"
            }
          },
        ],
      },
      /*hover: {
        mode: 'index',
        intersect: true
      },*/
      tooltips: {
        /*enabled: true,
        mode: 'index',//'index', */
        backgroundColor: 'rgb(255, 255, 255)',
        borderColor: 'rgb(20, 100, 175)',
        borderWidth: 2,
        xAlign: 'center',
        yAlign: 'bottom',
        intersect: false,
        callbacks: {
          title: function (tooltipItem, data) {
            return;
          },
          label: function(tooltipItem, data) {
            let label = tooltipItem.yLabel + " °C (" + data.datasets[tooltipItem.datasetIndex].label + ")";              
            let time = new Date(data.labels[tooltipItem.index]);
            let hours = time.getHours();
            let minutes = time.getMinutes();
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            let strMinutes = minutes < 10 ? '0'+minutes : minutes;
            let strTime = hours + ':' + strMinutes + ':' + time.getSeconds() + ' ' + ampm;
            label = label + " - " + time.toDateString() + " " + strTime;
            document.getElementById('tooltipTemps').textContent = label;
            
            return;
          },
          /*footer: function (tooltipItem, data) { 
            return null;
          }*/
        }
      },
      pan: {
      enabled: true,
      mode: "xy",
      speed: 10,
      threshold: 10
      },
      zoom: {
      enabled: true,
      drag: false,
      mode: "xy",
        limits: {
          max: 10,
          min: 0.5
        }
      }
    };
  }

  private sortData(s1){
    //Redondeo de datos no nulos
    for (let i = 0; i < s1.length; i++) {
      this.seriesTemp1.push((s1[i].temp1 == null) ? s1[i].temp1 : (Math.round(s1[i].temp1 * 100) / 100));
      this.seriesTemp2.push((s1[i].temp2 == null) ? s1[i].temp2 : (Math.round(s1[i].temp2 * 100) / 100));
      this.tempLabel.push(s1[i].dateTime);
    }

    //Funcionalidad previa
    /* var pastTStamp=[];

    for (let i = 0; i < s1.length; i++) {
      if(i>0){
        if(pastTStamp[0]==s1[i].dateTime ||  pastTStamp[1]==s1[i].dateTime || pastTStamp[2]==s1[i].dateTime || pastTStamp[3]==s1[i].dateTime){
         //ignore
        }else{ 
          this.seriesTemp1.push(Math.round(s1[i].temp1 * 100) / 100);
          this.seriesTemp2.push(Math.round(s1[i].temp2 * 100) / 100);
          this.seriesTemp3.push(Math.round(s1[i].temp3 * 100) / 100);
          this.seriesTemp4.push(Math.round(s1[i].temp4 * 100) / 100);
          this.tempLabel.push(s1[i].dateTime);
        }
      }
      pastTStamp[0]=s1[i].dateTime;
      pastTStamp[1]=s1[i].dateTime;
      pastTStamp[2]=s1[i].dateTime;
      pastTStamp[3]=s1[i].dateTime;
    } */
  
  }

  cleanNulls(array,key1,key2){
    var indexFailure=[];
    for(var c = 0; c<array.length;c++){
      if(array[c][key1]=="null"){
        array[c][key1]=-43;
        indexFailure.push({index:c,sensor:key1});
      }
      if(array[c][key2]=="null"){
        array[c][key2]=-43;  
        indexFailure.push({index:c,sensor:key2});
      }
  
    }
    if(indexFailure.length!=0){
      //console.log("List of index null data: ",indexFailure)
    }
    return array;
  }

  defaultDates(){
    let today = new Date();
    let minusaWeek = today.getTime()-(604800*1000);
    let weekAgoDate = new Date(minusaWeek);
    let fixedStartDate = (weekAgoDate.getDate()>9)? weekAgoDate.getDate() : "0"+weekAgoDate.getDate();
    let fixedStartMonth = (weekAgoDate.getMonth()>8)? (weekAgoDate.getMonth()+1) : "0"+(weekAgoDate.getMonth()+1);
    let fixedEndDate = (today.getDate()>9)? today.getDate() : "0"+today.getDate();
    let fixedEndMonth = (today.getMonth()>8)? (today.getMonth()+1) : "0"+(today.getMonth()+1);
    //weekAgoDate["start"]= fixedStartDate+"-"+fixedStartMonth+"-"+weekAgoDate.getFullYear();
    //today["end"]= fixedEndDate+"-"+fixedEndMonth+"-"+today.getFullYear();
    //console.log("1 week range date start: ",weekAgoDate," end: ",today);
    return {start:weekAgoDate,end:today};
  }

}

