import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_URL,CLOUD_URL } from "../../server";

enum THERMISTOR_LIST{
  _1,
  _2,
  _3,
  _4,
  _max
}

@Injectable({
  providedIn: 'root'
})

export class TempCalibrationSamplesService {
  private SETTINGS_REST_API = CLOUD_URL+'mother_base';
  private THERMISTOR_REST_API = CLOUD_URL+'thermistor';

  private selectedSamples = new Subject<any>();
  private samplePoints = new Subject<any>();
  private setpoints = [];
  

  constructor(private http : HttpClient) { }

  public getLatest(deviceId){//NOT USED ANYMORE .... DELETE LATER IN THE BACKEND
    let contents = {
      cmd:"getTempSamples",
      taskCmd:"last_four",
      deviceId
    }
   
    let gotSamp = this.http.post<any>( this.SETTINGS_REST_API, contents, {withCredentials: true});
    return gotSamp;
  }

  setNewValues(deviceId,newRange){
    let start = this.formatDate(newRange.start,1);
    let end = this.formatDate(newRange.end,2);

     let pD ={
       device: deviceId,
       range: [start,end],
       cmd_op:"raw",
       extra: null
     };

     console.log("temp post : ",pD)

    this.http.post<any>(this.THERMISTOR_REST_API,pD,{withCredentials: true}).subscribe( data => {
      console.log("samples",data)
     this.selectedSamples.next(data);
    });  
    // console.log('termistor service got new range: '+start+' to '+end+' for dev '+this.devId);
    
  }

  getSelected(){
    return this.selectedSamples.asObservable();
  }

  setPoints(points){
    this.setpoints = points;
    this.samplePoints.next(points);
  }

  savePoints(deviceId){
    let contents = {
       device: deviceId,
       cmd_op:"set_ref_points",
       extra: this.setpoints
    }

    console.log("SAVE SETPOINTS ",contents)

   let result = this.http.post<any>( this.THERMISTOR_REST_API, contents, {withCredentials: true}).subscribe( a => {
     
     return a;
   });
   return result;
  }

  queryPoints(deviceId){
    let contents = {
       range:[],
       device: deviceId,
       cmd_op:"get_ref_points",
       extra: null
    }
    this.http.post<any>(this.THERMISTOR_REST_API,contents,{withCredentials: true}).subscribe( data => {
     console.log("samples",data)
     if(data!=null){ 
      this.setpoints = this.sortSetpoints(data);
      this.samplePoints.next(this.setpoints);
    }
    });
  }

  getPoints(){
    return this.samplePoints.asObservable();
  }

  private sortSetpoints(rows : Array<any>){
    
    let sorted = [
      { id: THERMISTOR_LIST._1, samples: [] },
      { id: THERMISTOR_LIST._2, samples: [] },
      { id: THERMISTOR_LIST._3, samples: [] },
      { id: THERMISTOR_LIST._4, samples: [] }
   ];

    for(let i = THERMISTOR_LIST._1; i < THERMISTOR_LIST._max; i++){
      let testArray = [];
      testArray = rows.filter((element,index) => element["thermistor"]== i+1);
      
      testArray.forEach((element)=> {
        sorted[i].samples.push({
          temp : element.sampleValue,
          timestamp : element.timestamp,
          value : element.inputValue
        });
      });

    }
    console.log("test sort array ",sorted);
    return sorted;
  }

  private formatDate(dt,sort){
    //console.log("dt looks like this ",dt)
   var time; 
   if(sort==1){
     time = '00:00:00';//for the start date
   }else if(sort==2){
     time = '23:59:59';//for the end date
   } 
   let D = new Date(dt);
   let date = D.getDate();
   
   let month = D.getMonth()+1;
   let year = D.getFullYear();
   var datee,mon;
   if(date<10){
     datee='0'+date;
   }else{
     datee=date;
   }
   if(month<10){
     mon='0'+month;
   }else{
     mon=month;
   }
   let timeStamp = year+"-"+mon+"-"+datee+" "+time;

   let finalDate = new Date(timeStamp);
   return finalDate.getTime()/1000; 
  }

}
