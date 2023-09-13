import { Component, OnInit } from '@angular/core';
import { NbDateService, NbCalendarRange } from '@nebular/theme';
import { UpdateRangeChartsService } from '../../../services/update-range-charts.service';
import { DayCellComponent } from '../../extra-components/calendar/day-cell/day-cell.component';

@Component({
  selector: 'ngx-date-time-selector',
  templateUrl: './date-time-selector.component.html',
  styleUrls: ['./date-time-selector.component.scss'],
  entryComponents: [DayCellComponent],
})
export class DateTimeSelectorComponent implements OnInit {
  date = new Date();
  date2 = new Date();
  range: NbCalendarRange<Date>;
  public timeRange = {
    start:{min:0,hour:0},
    end:{min:59,hour:23}
  }
  dayCellComponent = DayCellComponent;

  public disableDates : Boolean = true;
  public hideLoadingData : boolean = false;

  constructor(protected dateService: NbDateService<Date>,public updateRangeService : UpdateRangeChartsService) {
    this.range = {
      start: null,
      end: null
    };
  }


  ngOnInit() {
  }

  updateDateBtn(){
    this.dateTimeMerge();
    this.updateRangeService.sendData(this.range);// passing values to service... and then got from component
  }

  rangeChange($event){
    if($event.end){
      this.disableDates = false;
      console.log("calendar b ",$event);
      this.range=$event;
      
      
    }else{
      this.disableDates = true;
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

  private dateTimeMerge(){
    //console.log("merge",this.myRange," with this ",this.timeRange)
    this.range.start.setHours(this.timeRange.start.hour);
    this.range.start.setMinutes(this.timeRange.start.min);
    this.range.end.setHours(this.timeRange.end.hour);
    this.range.end.setMinutes(this.timeRange.end.min);
    console.log(this.range);
  }

  public cleanRangeHour(event,position){
    if(event.target.value=="" || event.target.value==undefined || event.target.value==null) event.target.value=0;
    this.timeRange[position].hour = parseInt(event.target.value);
    if(event.target.value>23)this.timeRange[position].hour=23;
    if(event.target.value<0)this.timeRange[position].hour=0;
 
  }

  public cleanRangeMin(event,position){
    if(event.target.value=="" || event.target.value==undefined || event.target.value==null) event.target.value=0;
    this.timeRange[position].min = parseInt(event.target.value);
    if(event.target.value>59)this.timeRange[position].min=59; 
    if(event.target.value<0)this.timeRange[position].min=0;
 
  }

}
