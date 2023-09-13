import { Injectable } from '@angular/core';
import { Observable,Subject, BehaviorSubject } from 'rxjs'
import { SERVER_URL,CLOUD_URL } from "../../server";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  private THERMISTOR_REST_API = CLOUD_URL+'thermistor';

  public meansSubject = new BehaviorSubject<object>({
    plate : null,
    box: null
  });

  public tempsSubject = new BehaviorSubject<any>({
    samples:[],
    datesRange:{}
  });
  
  public tempIntervalsSubject = new BehaviorSubject<object>({
    plate : {off:[],in:[],peak:null},
    box: {off:[],in:[],peak:null},
    limits : {upper:0,lower:0}
  });

  public weekCompSubject;
  public compLoadSubject;
  
  public kineticTemp;
  public kineticTempSubject = new Subject;


  constructor(private http : HttpClient) {}

  public clear(){

    this.tempIntervalsSubject.next({
      plate : {off:[],in:[],peak:null},
      box: {off:[],in:[],peak:null},
      limits : {upper:0,lower:0}
    });
    this.meansSubject.next({
      plate : null,
      box: null
    });
    this.tempsSubject.next({
      samples:[],
      datesRange:{}
    });
  }

  public setMeanTemps(values : any){
    let plate = values.plate;
    let box = values.box;
    this.meansSubject.next({plate,box});
  }

  public getMeanTemps():Observable<object>{
    return this.meansSubject.asObservable();
  }

  public setTemps(samples,datesRange){
    this.tempsSubject.next({samples,datesRange});
  }

  public getTemps():Observable<object>{
    return this.tempsSubject.asObservable();
  }

  public setTempIntervals(plate,box,limits){
    this.tempIntervalsSubject.next({plate,box,limits});
  }

  public getTempIntervals():Observable<object>{
    return this.tempIntervalsSubject.asObservable();
  }

  public postRequestKinetic(device,newRange){
    let start = this.formatDate(newRange.start,1);
    let end = this.formatDate(newRange.end,2);
    let contents = {
      range : [start,end],
      device,
      cmd_op:"mean_kinetic",
      extra:null
    }

    this.http.post<any>(this.THERMISTOR_REST_API,contents,{withCredentials: true}).subscribe( data => {
      console.log("mean kinetic data",data)
      this.kineticTemp = data;
      this.kineticTempSubject.next(this.kineticTemp);
    }); 
  }

  public getKinetic():Observable<any>{
    return this.kineticTempSubject.asObservable();
  }

  // public setWeekComp(values : any){

  // }

  // public getWeekComp():Observable<object>{
  //   return;
  // }

  // public setCompLoad(values : any){

  // }

  // public getCompLoad():Observable<object>{
  //   return;
  // }

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
