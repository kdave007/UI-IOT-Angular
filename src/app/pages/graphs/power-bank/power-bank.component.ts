import { Component, OnInit, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { UpdateRangeChartsService } from '../../../services/update-range-charts.service';
import { ChartViewService } from '../../../services/chart-view.service';
import { VoltageSamplesResolverService } from '../services/voltage-samples-resolver.service';
import { PowerBankResolverService } from '../services/power-bank-resolver.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'ngx-power-bank',
  templateUrl: './power-bank.component.html',
  styleUrls: ['./power-bank.component.scss']
})
export class PowerBankComponent implements OnInit {

  constructor(private theme: NbThemeService,private activatedRoute: ActivatedRoute, 
    private range :UpdateRangeChartsService,public chartView : ChartViewService,
    public voltageService : VoltageSamplesResolverService,public powerBankResolverService : PowerBankResolverService) { }
  
  @Input() dataToChild : Subject<any>;  
  @Input() dataToChild_2 : Subject<any>;  
  
  colors: any;
  chartjs: any;
  data: any;
  options: any;
  themeSubscription: any;
  samples: any;
  samples_2: any;
  subscription : Subscription;
  voltageSub : Subscription;
  powBankSub : Subscription;
  series : any = [];
  seriesLabel : any = [];
  series_2 : any = [];
  series_2_Label : any = [];
  public hideLoadingData : boolean = false;
  

  ngOnInit() {
   
    this.chartView.resetChartView().subscribe(cId => { 
      if(cId=="aES"){
        this.createChart();
      }
    })

    this.dataToChild.subscribe( data => {
      this.samples = data;
      this.sortData(this.samples);
      this.createChart();
      this.hideLoadingData = true;
      }
    );

    this.dataToChild_2.subscribe( data => {
      this.samples_2 = data;
      this.sortData_2(data);
      
      
      this.createChart();
      this.hideLoadingData = true;
      }
    );

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => { 
      this.colors= config.variables;
      this.chartjs = config.variables.chartjs;
      this.createChart();
    });

    this.subscription = this.range.getRange().subscribe(myRange => {
      
      this.hideLoadingData = false;
      this.voltageSub = this.voltageService.setNewValues(myRange,true).subscribe( data => {
        
        if(data.length){
          this.series.length=0;
          this.seriesLabel.length=0;
          this.samples = [];
          this.samples = data;
          this.sortData(this.samples);
         
          this.createChart();
          this.hideLoadingData = true;
        }
        
      });

      this.powBankSub = this.powerBankResolverService.setNewValues(myRange,true).subscribe( data => {
        
        if(data.length){
          this.series_2.length=0;
          this.series_2_Label.length=0;
          this.samples_2 = [];
          this.samples_2 = data;
          this.sortData_2(this.samples_2);
          
          this.createChart();
        }
        
      });
    });
  }

  

  private sortData(rows){
    
    var pastTStamp=null;

    for (let i = 0; i < rows.length; i++) {
      if(i>0){
        if(pastTStamp==rows[i].timestamp){
         //ignore
        }else{ 
          this.series.push(rows[i].voltage);
          this.seriesLabel.push(rows[i].timestamp);
        }
      }
      pastTStamp=rows[i].timestamp;
    }
    
  }

  private sortData_2(rows){
    
    var pastTStamp=null;

    for (let i = 0; i < rows.length; i++) {
      if(i>0){
        if(pastTStamp==rows[i].timestamp){
         //ignore
        }else{ 
          this.series_2.push(rows[i].powerbank);
          this.series_2_Label.push(rows[i].timestamp);
        }
      }
      pastTStamp=rows[i].timestamp;
    }
    // console.log("sorted 2 data",this.series_2)
    // console.log("sorted 2 label",this.series_2_Label)
  }

  private createChart(){
    let mergedTsLabels = [...this.seriesLabel,...this.series_2_Label].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    this.data = {
      labels: this.series_2_Label,
      datasets: [
      {
        data: this.series_2,
        fill:false,
        label: 'Voltaje bateria interna del dispositivo',
        backgroundColor: '#007bff',
        borderColor:'#007bff',
        borderWidth: 2,
        cubicInterpolationMode: 'linear',
        pointRadius:2,
        pointStyle:'line'
      }
    ],
       
    };

    this.options = {
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
          maxTicksLimit: 30,
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
                  min: 0,//Pendiente
                  max: 5,//----
                  fontColor: this.chartjs.textColor,
                },
                scaleLabel: {
                  display: true,
                  labelString: "Volts"
                }
              },
            ],
          },
      /* hover: {
        mode: 'nearest',
        intersect: true
      }, */
          tooltips: {
            /* enabled: true,
            mode: 'interpolate',//'index', */
            backgroundColor: 'rgb(255, 255, 255)',
            borderColor: 'rgb(60, 180, 75)',
            borderWidth: 2,
            xAlign: 'center',
            yAlign: 'bottom',
            intersect: false,
            callbacks: {
              title: function (tooltipItem, data) {
                return;
              },
              label: function(tooltipItem, data) {
                let label = tooltipItem.yLabel + " Volts (" + data.datasets[tooltipItem.datasetIndex].label + ")";              
                let time = new Date(data.labels[tooltipItem.index]);
                let hours = time.getHours();
                let minutes = time.getMinutes();
                let ampm = hours >= 12 ? 'pm' : 'am';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                let strMinutes = minutes < 10 ? '0'+minutes : minutes;
                let strTime = hours + ':' + strMinutes + ':' + time.getSeconds() + ' ' + ampm;
                label = label + " - " + time.toDateString() + " " + strTime;
                document.getElementById('tooltipPowerBank').textContent = label;
                return;
              },
              footer: function (tooltipItem, data) { 
                return;
              }
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
              min: 0
            }
          }
        };//options end

    }

}
