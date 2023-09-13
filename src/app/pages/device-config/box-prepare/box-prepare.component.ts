import { Component, OnInit, Input } from '@angular/core';
import * as utils from '../services/utils';
import { CompressorService } from '../services/compressor.service';


@Component({
  selector: 'ngx-box-prepare',
  templateUrl: './box-prepare.component.html',
  styleUrls: ['./box-prepare.component.scss']
})
export class BoxPrepareComponent implements OnInit {
  @Input('deviceId') devId : any;
  public kw : number = 0.0;
  private temporarySuperIDs : number[] = [1,2,8,84];// TO DO : This has to be filled with values from a query to the DB super users table...
  

  public SUPER_ACTIONS: utils.SUPER_USERS_FLAGS = {
    disabledPrice: true, disabledIntervals: true
  }
  
  viewDate: Date = new Date();
  constructor(private compressorService : CompressorService) { }

  ngOnInit() {
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    this.configPermissions(userInfo.userId);
    
  }


/**
   * @brief
   *  give permissions of restricted configurations to only super users
   * 
   * @param id 
   *  actual session user id
   */

  public configPermissions(id : number){
    
    for(let i=0;i<this.temporarySuperIDs.length;i++){
      let superFound = (id==this.temporarySuperIDs[i]) ? true : false;
      
      if(superFound){
        this.SUPER_ACTIONS.disabledPrice = false;
        this.SUPER_ACTIONS.disabledIntervals = false;
        
        return;
      }
    }
    
  }



}
