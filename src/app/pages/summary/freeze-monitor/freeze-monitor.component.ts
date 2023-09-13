import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-freeze-monitor',
  templateUrl: './freeze-monitor.component.html',
  styleUrls: ['./freeze-monitor.component.scss']
})
export class FreezeMonitorComponent implements OnInit {
  @Input('fData') fData : any;
  LastDefDate;sinceDefrost='0';
  statement="No es necesario descongelar.";
  limit=120;
  constructor() { }

  ngOnInit() {
   console.log("sort this ",this.fData);
   if(this.fData[0].temp4=="null" || this.fData[1].temp4=="null" || this.fData[0].temp3=="null" || this.fData[1].temp3=="null"){
    
    
   }else{
      var today = new Date(); var since = new Date("10/07/2019");
      this.LastDefDate = "10/07/2019";
      let sf = today.getTime()-since.getTime();
      sf = sf/(1000 * 3600 *24);
      this.sinceDefrost = Number(sf).toFixed(0);
      if(sf>this.limit){
        this.statement="Descongelar caja del camión.";
      }
  }
  
 }

}
