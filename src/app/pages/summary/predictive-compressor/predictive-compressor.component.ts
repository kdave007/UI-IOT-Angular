import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DataSamplesResolverService } from '../../../services/data-samples-resolver.service';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'ngx-predictive-compressor',
  templateUrl: './predictive-compressor.component.html',
  styleUrls: ['./predictive-compressor.component.scss']
})
export class PredictiveCompressorComponent implements OnInit,OnDestroy {
  
  @Input('tempRows') tempData : any;
  subscription :Subscription;
  tempRows;


  constructor(public getDatasamplesService : DataSamplesResolverService) { }

  ngOnInit() {
    // const myRange = {start:'2020-01-01 22:27:59',end:'2020-01-01 23:59:59'};// JUST TESTING PURPOSES
    const myRange = {start:'2020-01-01 20:00:59',end:'2020-01-01 23:59:59'};// JUST TESTING PURPOSES

    this.subscription = this.getDatasamplesService.setNewValues(myRange).subscribe( data  => {
      this.tempRows = this.cleanNulls(data,"temp1","temp2");
      console.log("got week temp rows");
     console.table(this.tempRows);
     let testArray=[];
     testArray[0]=0;
      testArray[1]=220;
      testArray[2]=245;
      testArray[3]=250;
      testArray[4]=258;
      testArray[5]=273.5;
      this.statistics(this.tempRows );
      
   });


  }

  cleanNulls(array,key1,key2){
    var indexFailure=[];
    for(var c = 0; c<array.length;c++){
      if(array[c][key1]=="null"){
        array[c][key1]=-200;
        indexFailure.push({index:c,sensor:key1});
      }
      if(array[c][key2]=="null"){
        array[c][key2]=-200;  
        indexFailure.push({index:c,sensor:key2});
      }
  
    }
    if(indexFailure.length!=0){
      //console.log("List of index null data: ",indexFailure)
    }
    return array;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private statistics(data){
    let sum = [parseFloat(data.length),0,0,0,0,0,0];
    let average ={};
    let t1 = [];
    let t2 = [];
    let floatVal=[];
    let justTest=[];
    let sumTotals={
      "X":0,
      "Y1":0,
      "Y2":0,
      "Xpow2":0,
      "Y1pow2":0,
      "Y2pow2":0,
      "XtimesY1":0,
      "XtimesY2":0
    };
    for(let index=0;index<data.length;index++){
      floatVal[0] = parseFloat(data[index].temp1);
      floatVal[1] = parseFloat(data[index].temp2);
    
      sum[1]=sum[1]+floatVal[0];
      sum[2]=sum[2]+floatVal[1];
      t1[index] = floatVal[0];
      t2[index] = floatVal[1];;
   
      sumTotals.X = sumTotals.X + index;
      sumTotals.Y1 = sumTotals.Y1 + floatVal[0];
      sumTotals.Y2 = sumTotals.Y2 + floatVal[1];
      sumTotals.Xpow2 = sumTotals.Xpow2 + Math.pow((index),2);
     sumTotals.Y1pow2 = sumTotals.Y1pow2 + Math.pow((data[index].temp1),2);
     sumTotals.Y2pow2 = sumTotals.Y2pow2 + Math.pow((data[index].temp2),2);
    
      sumTotals.XtimesY1=sumTotals.XtimesY1 + floatVal[0]*index;
      sumTotals.XtimesY2=sumTotals.XtimesY2 + floatVal[1]*index;

      justTest[index] ={
        "y1":floatVal[0],
        "y2":floatVal[1],
        "y1^2":Math.pow((data[index].temp1),2),//
        "y2^2":Math.pow((data[index].temp2),2),//
        "X^2":Math.pow(index,2),
        "X * Y1":(floatVal[0]*(index)),
        "X * Y2":(floatVal[1]*(index))
      }
    }

    let totals=new Array({
       "x Sum" : sumTotals.X,
       "y1 Sum": sumTotals.Y1,
       "y2 Sum": sumTotals.Y2,
       "y1^2 Sum":sumTotals.Y1pow2,
       "y2^2 Sum":sumTotals.Y2pow2,
       "X^2": sumTotals.Xpow2,
       "X * Y1 Sum": sumTotals.XtimesY1,
       "X * Y2 Sum": sumTotals.XtimesY2
    });
    average={
      temp1:(sum[1]/data.length),
      temp2:(sum[2]/data.length)
    }
    // console.table(average);
    // console.table(justTest);
    // console.table(totals);

    let b1 = ((parseFloat(data.length))*sumTotals.XtimesY1)-(sumTotals.X*sumTotals.Y1);// DELETE THE -1 besides parseFloat !!!!!!!!!!
    b1 = b1/((((parseFloat(data.length))*sumTotals.Xpow2)-Math.pow(sumTotals.X,2)));
    let b2 = ((parseFloat(data.length))*sumTotals.XtimesY2)-(sumTotals.X*sumTotals.Y2);
    b2 = b2/((((parseFloat(data.length))*sumTotals.Xpow2)-Math.pow(sumTotals.X,2)));
  
    let a1 = ((sumTotals.Y1)-(b1*sumTotals.X))/
      (parseFloat(data.length));
    let a2 = ((sumTotals.Y2)-(b2*sumTotals.X))/
      (parseFloat(data.length));  
    let results={
      b1:b1,
      b2:b2,
      a1:a1,
      a2:a2
    }
    console.table(results);
    let Y1f = a1+(b1*((data.length+1)));
    let Y2f = a2+(b2*((data.length+1)));
    console.log((data.length+1)," : ",Y1f);
    console.log((data.length+1)," : ",Y2f);
    let predArray=[];
    for(let index=0;index<t1.length;index++){
      predArray[index]={
        t1:t1[index],
        t2:t2[index]
      }
    }
    for(let index=1;index<21;index++){
      predArray[(144+index)]={
        t1:a1+(b1*((data.length+index))),
        t2:a2+(b2*((data.length+index)))
      }
    }

    console.table(predArray);
   
   
    //NOW FOLLOW THE FORMULAS TO GET AN ARRAY, AND THEN YOU MAKE CSV, PLOT THE RESULTS AGAINST THE ORIGINAL VALUES TO VALIDATE OR FIX ...
    // let medianT12=this.median(t1);
    // let medianT22=this.median(t2);
    // console.log("mediana t1 ",medianT12);
    // console.log("mediana t2 ",medianT22);
  
  }


 median(dataArray){
   
   var values = dataArray;
    if(values.length ===0) return 0;
  
    values.sort((a,b) => {
      return a-b;
    });
  
    var half = Math.floor(values.length / 2);
  
    if (values.length % 2)
      return values[half];
  
    return (values[half - 1] + values[half]) / 2.0;
  }

  downloadFile(data: any) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var a = document.createElement('a');
    var blob = new Blob([csvArray], {type: 'text/csv' }),
    url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = "myFile.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}

  


}

