import { Injectable, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';

 
@Injectable({
  providedIn: 'root'
})
export class UpdateRangeChartsService  {
  private myRange = new Subject<string>();
 
  constructor() { }
  
  sendData(message : any){
    this.myRange.next(message);
  }

  getRange(): Observable<any> {
    return this.myRange.asObservable();
  }

  

}
