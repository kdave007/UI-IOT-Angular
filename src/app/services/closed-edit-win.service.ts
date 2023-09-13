import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClosedEditWinService {
  private flagS = new Subject<string>();
  constructor() { }

  public getState(): Observable<any>{
    return this.flagS.asObservable();
  }

  public setFlag(f){
    this.flagS.next(f);
  }

}
