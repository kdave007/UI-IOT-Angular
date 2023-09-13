import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { InterfaceSetupService } from '../services/interface-setup.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-interface-settings',
  templateUrl: './interface-settings.component.html',
  styleUrls: ['./interface-settings.component.scss']
})
export class InterfaceSettingsComponent implements OnInit,OnDestroy {
  @Input('deviceId') devId : any;
  defaultValues = [
    {configId: 1, deviceId: undefined, value: 1, inPorcentage:0},
    {configId: 2, deviceId: undefined, value: 1, inPorcentage:0},
    {configId: 3, deviceId: undefined, value: 1, inPorcentage:0},
    {configId: 4, deviceId: undefined, value: 1, inPorcentage:0}];

    filterValues = [];  
    subs : Subscription;
  
  constructor(private interfaceSetupService : InterfaceSetupService) { }

  ngOnDestroy(): void {
    this.interfaceSetupService.emptyValues();
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.filterValues = this.defaultValues;
    console.log("interface-settings device ",this.devId);
    this.interfaceSetupService.queryValues(this.devId);

    this.subs = this.interfaceSetupService.getValues().subscribe( values => {
      console.log("----------------->>>  interface-settings got values ",values);
      try{
        for(let i = 0; i<values.length; i++){
          this.filterValues[i].deviceId = values[i].deviceId;
          this.filterValues[i].value = values[i].value;
          this.filterValues[i].inPorcentage = this.toPorcentage(values[i].value);
        }
      }catch(e){
        this.filterValues = this.defaultValues;
        console.error("no filter values found")
      }
    });
  }

  private toDecimal(value) {
    value = parseFloat(value);
    if(isNaN(value)){
      value = 0;
      return 0;
    }
    value = (value>100) ? 100 : (value<0) ? 0 : value;
    let result = 100 - value;
    return result/100;
  }

  private toPorcentage(value) {
   
    value = parseFloat(value);
    value = (value>1) ? 1 : (value<0) ? 0 : value;
    let result = (1 - value)*100;
    return(Math.round(result * 100) / 100).toFixed(0);
  }

  public filterChange(row){
    row.value = this.toDecimal(row.inPorcentage);
  }

  public updateValues(){
    console.log("change to ",this.filterValues)
    this.interfaceSetupService.setValues(this.filterValues);
    console.log("KEY")
  }

}
