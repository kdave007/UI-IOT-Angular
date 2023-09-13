import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NbDateService } from '@nebular/theme';
import { DeviceSelectionService } from '../../services/device-selection.service';

@Component({
  selector: 'ngx-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit,OnDestroy {
  subscription1: Subscription;
  subscription2 : Subscription;
  subscription3 : Subscription;
  subscription4 : Subscription;
  subscription5 : Subscription;
  subscription6 : Subscription;

  devId; 
  tempData: any;
  gpiosData: any;
  fData:any;
  compData:any;
  deviceInfo : any;

  

  constructor(private activatedRoute: ActivatedRoute,protected dateService: NbDateService<Date>,
    private deviceSelection : DeviceSelectionService
    ) { 
    this.subscription1= this.activatedRoute.queryParams.subscribe(params => this.devId = params['devId']);
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
    this.subscription5.unsubscribe();
    this.subscription6.unsubscribe();
  }

  ngOnInit() {
    this.subscription6 = this.deviceSelection.get().subscribe(deviceInfo  => { 
      console.log("DEVICE INFO",deviceInfo)
      this.deviceInfo = deviceInfo;
    });

    this.subscription2= this.activatedRoute.data.subscribe( data  =>  {
      this.tempData = data['samplesData']; 
  });
    this.subscription3= this.activatedRoute.data.subscribe( data  =>  this.gpiosData = data['gpiosData']);
    
    this.subscription4= this.activatedRoute.data.subscribe( data => {
      this.fData = data['fData'];
    });
    this.subscription5= this.activatedRoute.data.subscribe( data => {
      this.compData = data['compData'];
    });

    
    
  }

  

}
