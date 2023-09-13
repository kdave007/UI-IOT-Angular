import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataSamplesResolverService } from '../../services/data-samples-resolver.service';
import { CalendarCardComponent } from '../calendar-card/calendar-card.component';
import { Subscription }   from 'rxjs/Subscription';
import { UpdateRangeChartsService } from '../../services/update-range-charts.service';
import { ChartViewService } from '../../services/chart-view.service';
import { NbGlobalPhysicalPosition, NbGlobalPosition, NbComponentStatus, NbToastrService } from '@nebular/theme';
import { ToasterConfig } from 'angular2-toaster';
import { DataGpiosResolverService } from '../../services/data-gpios-resolver.service';
import { Subject, Observable } from 'rxjs';
import { VoltageSamplesResolverService } from './services/voltage-samples-resolver.service';
import { PowerBankResolverService } from './services/power-bank-resolver.service';
import { DeviceSelectionService } from '../../services/device-selection.service';
import { TEMPS_FILTER } from '../temp.commands';

@Component({
  selector: 'ngx-graphs',
  styleUrls: ['./graphs.component.scss'],
  templateUrl: './graphs.component.html'  
})
export class GraphsComponent implements OnInit,OnDestroy {
  statuses: NbComponentStatus[] = [ 'success', 'success'];
  tempData:Subject<any>= new Subject();
  showT=true;
  gpiosData:Subject<any>= new Subject();
  externalSource :Subject<any>= new Subject();
  powBankSamples :Subject<any>= new Subject();
  devId;
  subscription1 : Subscription;
  subscription2 : Subscription;
  subscription3 : Subscription;
  subscription4 : Subscription;
  subscription5 : Subscription;
  subscription6 : Subscription;
  

  config: ToasterConfig;
  index = 1;
  destroyByClick = true;
  duration = 7000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = true;
  status: NbComponentStatus = 'info';
  title = 'Tip!';
  content = `continúa bajando para ver las graficas, seleccionar fechas y restablecer el zoom.`;

  constructor(private activatedRoute: ActivatedRoute,public getDatasamplesService : DataSamplesResolverService,
     public updateRange : UpdateRangeChartsService, public chartView : ChartViewService,private toastrService: NbToastrService,
     public getDatagpiosService : DataGpiosResolverService, public voltageService : VoltageSamplesResolverService,
     public powerBankResolverService : PowerBankResolverService, public deviceSelection : DeviceSelectionService) { 
    this.subscription1= this.activatedRoute.queryParams.subscribe(params => {
      this.devId = params['devId']
      console.log("DEVICE PARAMS :",params)
    });
   }
  
  ngOnInit() {
    let r = this.defaultDates();
    let filtered = true;

    this.subscription6 = this.deviceSelection.get().subscribe(deviceInfo  => { 
      console.log("DEVICE INFO",deviceInfo)
    });
   //LOW_PASS to RDP
    this.subscription2= this.getDatasamplesService.setNewValues(r,TEMPS_FILTER.RDP).subscribe(data  => { 
      this.tempData.next(data);
    });
    this.subscription3= this.getDatagpiosService.setNewValues(r).subscribe(dataG  => { 
      this.gpiosData.next(dataG);
    });

    this.subscription4= this.voltageService.setNewValues(r).subscribe(dataG  => { 
      this.externalSource.next(dataG);
    });

    this.subscription5= this.powerBankResolverService.setNewValues(r).subscribe(dataG  => { 
      this.powBankSamples.next(dataG);;
    });

    //this.updateRange.sendData(r);

    //this.subscription3= this.getDatagpiosService.setNewValues(r).subscribe( data  =>  this.gpiosData = data['gpiosData']);
    //this.subscription2= this.activatedRoute.data.subscribe( data  =>  this.tempData = data['samplesData']);
    //this.subscription3= this.activatedRoute.data.subscribe( data  =>  this.gpiosData = data['gpiosData']);
    this.makeToast();
  }

  private showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };
    const titleContent = title ? `${title}` : '';

    this.index += 1;
    this.toastrService.show(
      body,
      `${titleContent}`,
      config);
  }

  makeToast() {
    this.showToast(this.status, this.title, this.content);
  }  

  adjustChart(id){
      this.chartView.setView(id);
  }

  ngOnDestroy(){
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
    this.subscription5.unsubscribe();
    this.subscription6.unsubscribe();
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
