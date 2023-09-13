
//class to find and avoid a save when overlap dates on compressor operation calendar

exports.validate = (events) => {
     let conflict = checkSettings(events);
     return conflict;
}

function checkSettings(events){
     console.log("service events received: ",events);
     let conflict={error:false};
     for(let i=0;i<events.length;i++){
          conflict = compare(events,i);
          if(conflict.error){
               console.log("violating rules! ",events[i].id);
               return conflict;
          }
     }
     return conflict;
}

function compare(events,targetIndex){
     let conflict={error:false};
     for(let i=0;i<events.length;i++){
          if(events[targetIndex]===events[i]){
     
          }else{
               conflict = evaluate(events[targetIndex],events[i]);
          }
          if(conflict.error){
               return conflict;
          }
     }
     return conflict;
}

function evaluate(target,event){
     let conflict = {error:true};
     let startTarget = toSeconds(target.start);
     let startEvent = toSeconds(event.start);
     let endTarget = toSeconds(target.end);
     let endEvent = toSeconds(event.end);
     
     if(startTarget >= startEvent && endTarget >= startEvent){
          if(startTarget >= endEvent && endTarget >= endEvent){
               conflict = {error:false};
               //console.log(target.id,"event superior")
          }    
     }else if(startTarget <= startEvent && endTarget <= startEvent){
          if(startTarget <= endEvent && endTarget <= endEvent){
               //console.log(target.id,"event inferior")
               conflict = {error:false};
          }
     }

     if(conflict.error){
          console.log(target,event);
          console.log(`${target.id} and ${event.id} have conflict? ${true}`)
          let conflictDay =  returnDayText(target.start.getDay());
          
          conflict.error=true;
          conflict["msg"]=`Conflicto el día ${conflictDay}, relacionado a la operación : ${target.title}.`;
          conflict["id"]=target.id;
     }

     return conflict;
}

function toSeconds(date : Date):number{
     date = new Date(date);
     let seconds = date.getTime();
     seconds = seconds/1000;

     return seconds;
}

function returnDayText(day){
  day = (day==7) ? 0 : day;
  const days = ["DOMINGO","LUNES","MARTES","MIÉRCOLES","JUEVES","VIERNES","SÁBADO"];
  return days[day];
}




