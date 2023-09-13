import { Component, OnInit,Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { UserTokenService } from '../../../services/user-token.service';

@Component({
  selector: 'ngx-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.scss']
})
export class AccountViewComponent implements OnInit {
  @Input() sessionUserN : any;
  constructor(public userToken : UserTokenService) {
    
   }
 
  ngOnInit() {
    //console.log(this.sessionUserN);}
    
  }

  
  

}
