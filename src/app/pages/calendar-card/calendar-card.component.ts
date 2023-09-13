import { Component, OnInit } from '@angular/core';
import { NbCalendarRange, NbDateService, NbDatepicker, NbRangepickerComponent} from '@nebular/theme';
import { DayCellComponent } from '../extra-components/calendar/day-cell/day-cell.component';
import { UpdateRangeChartsService } from '../../services/update-range-charts.service';


@Component({
  selector: 'ngx-calendar-card',
  templateUrl: './calendar-card.component.html',
  styleUrls: ['./calendar-card.component.scss'],
  entryComponents: [DayCellComponent],
})
export class CalendarCardComponent {

  date = new Date();
  date2 = new Date();
  range: NbCalendarRange<Date>;
  dayCellComponent = DayCellComponent;

  constructor(protected dateService: NbDateService<Date>,public updateRangeService : UpdateRangeChartsService) {
    this.range = {
      start: null,
      end: null
    };
  }

  rangeChange($event){
    if($event.end){
      //console.log("calendar b ",$event);
      this.updateRangeService.sendData($event);// passing values to service... and then got from component
     }
  }

  get monthStart(): Date {
    //console.log( "start ",this.dateService.getMonthStart(new Date()));
    return this.dateService.getMonthStart(new Date());
  }

  get monthEnd(): Date {
    //console.log( "end ",this.dateService.getMonthEnd(new Date()));
    return this.dateService.getMonthEnd(new Date());
  }
  handleRangeChange($event){
    //console.log("calendar a ",$event);
    if($event.end){
      this.updateRangeService.sendData($event);// passing values to service... and then got from component
    }
  }


    

}
