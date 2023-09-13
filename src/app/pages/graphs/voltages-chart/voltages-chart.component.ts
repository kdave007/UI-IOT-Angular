import 'chartjs-plugin-zoom';
import 'chartjs-plugin-crosshair';
import { Component, OnInit, Input } from '@angular/core';
import { NbThemeService, NbColorHelper } from '@nebular/theme';

import { ActivatedRoute } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { UpdateRangeChartsService } from '../../../services/update-range-charts.service';
import { DataGpiosResolverService } from '../../../services/data-gpios-resolver.service';
import { ChartViewService } from '../../../services/chart-view.service';
import { VoltageSamplesResolverService } from '../services/voltage-samples-resolver.service';


@Component({
  selector: 'ngx-voltages-chart',
  templateUrl: './voltages-chart.component.html',
  styleUrls: ['./voltages-chart.component.scss']
})
export class VoltagesChartComponent implements OnInit {

  data: any;
  options: any;
  themeSubscription: any;
  sens0 = new Array();
	sens1 = new Array();
	sens2 = new Array();
	sens3 = new Array();
	sens4 = new Array();
	sens5 = new Array();
	sens6 = new Array();
	sens7 = new Array();
	sens8 = new Array();
	sens9 = new Array();
	sens10 = new Array();
	sens11 = new Array();
	sens12 = new Array();
	sens13 = new Array();
	sens14 = new Array();
	sens15 = new Array();      
  sensLabel = new Array();
  subscription : Subscription;
  gpiosData;
  colors: any;
  chartjs: any;
  voltgeSub : Subscription;
  public hideLoadingData : boolean = false;

  @Input() dataToChild : Subject<any>;//here is received the data binding from the parent component


  constructor(private theme: NbThemeService,private activatedRoute: ActivatedRoute, private range :UpdateRangeChartsService,
    public getDatagpiosService : DataGpiosResolverService, public chartView : ChartViewService,
    public voltageService : VoltageSamplesResolverService) {  }

  ngOnInit() {
    
    this.chartView.resetChartView().subscribe(cId => { 
      if(cId=="aV"){
        this.createChart();
        console.log("voltage got ",cId);
      }
    });

    this.dataToChild.subscribe( data => {
        this.gpiosData = data;
        this.sortData(this.gpiosData);
        console.log("as data : ", this.gpiosData);
        this.createChart();
      }
      );

    this.subscription = this.range.getRange().subscribe(myRange => {
      this.hideLoadingData = false;
      this.getDatagpiosService.setNewValues(myRange).subscribe( data  => {
        console.log(" data got from server : ",data)
        this.gpiosData = data; 
        this.sens0.length=0;
        this.sens1.length=0;
        this.sens2.length=0;
        this.sens3.length=0;
        this.sens4.length=0;
        this.sens5.length=0;
        this.sens6.length=0;
        this.sens7.length=0;
        this.sens8.length=0;
        this.sens9.length=0;
        this.sens10.length=0;
        this.sens11.length=0;
        this.sens12.length=0;
        this.sens13.length=0;
        this.sens14.length=0;
        this.sens15.length=0;
        this.sensLabel.length=0;
        this.sortData(this.gpiosData);
        
        //console.log("gpios data : ", this.gpiosData);
        this.createChart();
        this.hideLoadingData = true;
      });

      

   });
    


    //this.sortData(this.dataToChild);
    
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.colors= config.variables;
      this.chartjs = config.variables.chartjs;
      this.createChart();
      this.hideLoadingData = true;
    });
  }

  private createChart(){
      let dataset = new Array();
      let se = new Array();
      let colours = new Array();
      colours=['rgb(254, 6, 6)','rgb(188, 82, 50)','rgb(73, 213, 98)','rgb(240, 173, 50)','rgb(240, 56, 99)'
      ,'rgb(254, 3, 7)','rgb(180, 72, 187)','rgb(175, 130, 187)','rgb(155, 240, 98)','rgb(76, 65, 187)'
      ,'rgb(43, 90, 206)','rgb(43, 151, 206)'];
      const border_colours=['rgb(254, 6, 6,0.30)','rgb(188, 82, 50,0.30)','rgb(73, 213, 98,0.30)','rgb(240, 173, 50,0.30)','rgb(240, 56, 99,0.30)'
      ,'rgb(254, 3, 7,0.30)','rgb(180, 72, 187,0.30)','rgb(175, 130, 187,0.30)','rgb(155, 240, 98,0.30)','rgb(76, 65, 187,0.30)'
      ,'rgb(43, 90, 206,0.30)','rgb(43, 151, 206,0.30)'];
      se =[this.sens0,this.sens1,this.sens2,this.sens3,this.sens4,this.sens5,this.sens6,this.sens7,this.sens8,this.sens9,this.sens10,this.sens11,this.sens12,this.sens13,this.sens14,this.sens15];
      for(let c=0;c<11;c++){
        dataset[c]= this.setGpiosView('Bateria camión',se[c],colours[c],border_colours[c]);
        //console.log('dataset ',dataset[c]);
      }

      this.data = {
        labels: this.sensLabel,
			datasets: [{
				label: 'Compresor',
				data: this.sens12,
				fill:true,
				backgroundColor: 'rgba(255,69,0,0.30)',
				borderColor:'rgba(255,69,0)',
				borderWidth: 1,
				steppedLine: true, 
				showLine: true
			},
			dataset[0],
			// dataset[1],
			// dataset[2],
			// dataset[3],
			// dataset[4],
			// dataset[5],
			// dataset[6],
			//dataset[8],
			//dataset[9],
			//dataset[10]
			//,
			//dataset[11],
			//dataset[12],
			//dataset[13],
			//dataset[14],
			//dataset[15]
		]
      };

      this.options = {
       /*  hover: {
          mode: 'nearest',
          intersect: true
        }, */
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
        spanGaps: true,
        maintainAspectRatio: false,
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
				maxTicksLimit: 10
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
                fontColor: this.chartjs.textColor,
                callback: function(value, index, values) {
                  if (value=='1'){
                   let v='ON';
                  }else if(value=='0') {
                    let v='OFF';
                  }else{
                    let v='';
                  }
                  return this.v ;
                },
                beginAtZero: true
              },
            },
          ],
        },
        legend: {
          display: true,
          filter: function(legendItem, data) {
            return legendItem.index != 1 
          },
          labels: {
            fontColor: this.chartjs.textColor,
          },
        },
		tooltips: {
          /* enabled: true,
          mode: 'interpolate', */
          backgroundColor: 'rgb(255, 255, 255)',
          borderColor: 'rgb(200, 255, 75)',
          borderWidth: 2,
          xAlign: 'center',
          yAlign: 'bottom',
          intersect: false,
          callbacks: {
            title: function (tooltipItem, data) {
              return;
            },
            label: function(tooltipItem, data) {
				let label = tooltipItem.yLabel == 0 ? 'ON' : 'OFF';				
				
				label += ' (' + data.datasets[tooltipItem.datasetIndex].label + ')'; 			  
				
				let time = new Date(data.labels[tooltipItem.index]);
				let hours = time.getHours();
				let minutes = time.getMinutes();
				let ampm = hours >= 12 ? 'pm' : 'am';
				hours = hours % 12;
				hours = hours ? hours : 12; // the hour '0' should be '12'
				let strMinutes = minutes < 10 ? '0'+minutes : minutes;
				let strTime = hours + ':' + strMinutes + ':' + time.getSeconds() + ' ' + ampm;
        label = label + " - " + time.toDateString() + " " + strTime;
        document.getElementById('tooltipVoltages').textContent = label;
				return;			  
            },
            footer: function (tooltipItem, data) { 
              return;
            }
          }
        },
        pan: {
				enabled: true,
				mode: "x",
				speed: 10,
				threshold: 10
        },
        zoom: {
        enabled: true,
        drag: false,
        mode: "x",
          limits: {
            max: 10,
            min: 0.5
          }
        }
      };

  }

  private sortData(s2){
    for (var i = 0; i < s2.length; i++) {
      this.sens0.push(s2[i].gpio0);
      this.sens1.push(s2[i].gpio1);
      this.sens2.push(s2[i].gpio2);
      this.sens3.push(s2[i].gpio3);
      this.sens4.push(s2[i].gpio4);
      this.sens5.push(s2[i].gpio5);
      this.sens6.push(s2[i].gpio6);
      this.sens7.push(s2[i].gpio7);
      this.sens8.push(s2[i].gpio8);
      this.sens9.push(s2[i].gpio9);
      this.sens10.push(s2[i].gpio10);
      this.sens11.push(s2[i].gpio11);
      this.sens12.push(s2[i].gpio12);
      this.sens13.push(s2[i].gpio13);
      this.sens14.push(s2[i].gpio14);
      this.sens15.push(s2[i].gpio15);
      this.sensLabel.push(s2[i].timestamp);
    } 
    
  }

  setGpiosView(legend,gpioData,color,colorB){
    var j={
        label: legend,
        data: gpioData,
        fill:true,
        steppedLine: true, 
        lineTension:0,
        backgroundColor: colorB,
        borderColor:color,
        borderWidth: 1,
        hidden:true,
        showLine: true
      }
    return j;
  }

}

