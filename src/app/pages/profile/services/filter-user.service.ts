import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterUserService {

  selectedUser = undefined;
  SELECTED_SUBJECT = new BehaviorSubject<any>(undefined);
  constructor() { }

 setSelection(userSelected){
    this.selectedUser = userSelected;
    this.SELECTED_SUBJECT.next(this.selectedUser);
  }

 getSelection(){
    return this.SELECTED_SUBJECT.asObservable();
  }

 reset(){
    this.selectedUser = undefined;
    this.SELECTED_SUBJECT.next(this.selectedUser);
  }

}
