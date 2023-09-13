import { Component } from '@angular/core';
import { NbCalendarRange, NbDateService } from '@nebular/theme';
import { DayCellComponent } from './day-cell/day-cell.component';


@Component({
  selector: 'ngx-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.scss'],
  entryComponents: [DayCellComponent],
})
export class CalendarComponent {

  date = new Date();
  date2 = new Date();
  range: NbCalendarRange<Date>;
  dayCellComponent = DayCellComponent;

  constructor(protected dateService: NbDateService<Date>) {
    this.range = {
      start: this.dateService.addDay(this.monthStart, 3),
      end: this.dateService.addDay(this.monthEnd, -3),
    };
  }
 
  get monthStart(): Date {
    console.log('mon start ', this.dateService.getMonthStart(new Date()));
    return this.dateService.getMonthStart(new Date());
  }

  get monthEnd(): Date {
    console.log('mon end ',this.dateService.getMonthEnd(new Date()));
    return this.dateService.getMonthEnd(new Date());
  }
  
}
