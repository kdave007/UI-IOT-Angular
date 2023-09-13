import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartViewService {
  private cId = new Subject<string>();
  constructor() { }

  resetChartView(): Observable<any> {
    return this.cId.asObservable();
  }

  setView(chartId){
    this.cId.next(chartId);
  }
}
