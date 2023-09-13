import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DeviceSelectionService } from '../services/device-selection.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit,OnDestroy {
  @Input('deviceInfo') device : any;
  mustUnsubscribe = false;
  subscription : Subscription;


  constructor( private deviceSelection : DeviceSelectionService,public router : Router) { }

  ngOnDestroy(): void {
    if(this.mustUnsubscribe){
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
   
    if(this.device == undefined){
      this.mustUnsubscribe = true;
      this.subscription = this.deviceSelection.get().subscribe( data => {
        if(this.isEmpty(data)){
          this.returnToHomeSillyBoy();
        }
        this.device = data;
      });
    }

  }

  private returnToHomeSillyBoy(){
    //return to home view if service didnt load properly 
    console.log("BACK TO HOME!!!!") ;
    this.router.navigateByUrl('/devices-list');
  }

  private isEmpty(objectData){
    return Object.keys(objectData).length === 0;
  }

}
