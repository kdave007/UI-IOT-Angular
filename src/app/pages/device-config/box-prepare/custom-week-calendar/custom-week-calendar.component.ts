import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  addMinutes,
  subMinutes,
  subHours
} from 'date-fns';

import {CompressorSettings,CompressorAdvanced} from './utils';

import { Subject, Subscription } from 'rxjs';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NbDialogService } from '@nebular/theme';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { id } from '@swimlane/ngx-charts/release/utils';
import { CompressorService } from '../../services/compressor.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};


@Component({
  selector: 'ngx-custom-week-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-week-calendar.component.html',
  styleUrls: ['./custom-week-calendar.component.scss']
})
export class CustomWeekCalendarComponent implements OnInit,OnDestroy {
  
  @Input('deviceId') devId : any;
  @ViewChild('modalContent', { static: false }) modalContent: TemplateRef<any>;
  @ViewChild('modalContent2', { static: false }) modalContent2: TemplateRef<any>;
  dialogRef: any ;
  CalendarView = CalendarView;
  dateSetpoint :any;
  viewDate: Date = new Date();
  daysSelected : any = [];
  isAddDisabled : Boolean = true;
  lastLocalIndex : number = 0;
  disableInput : any = {
    startDay : {},
    startHour : {},
    startMin : {},
    endDay : {},
    endHour : {},
    endMin: {}
  }
  deleteSlots : number[] = [];
  firstTimeLoading : boolean = true;
  option;

  dialogData: {
    localID : number;
    title : string;
    timeRange : any;
    newSetup: any;
    inputDisabled : any;
  };

  NbDialogData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    // {
    //   label: '<i class="fas fa-fw fa-pencil-alt"></i>',
    //   a11yLabel: 'Edit',
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     console.log("event id ",event.id)
    //     this.handleEvent('Edited', event);
    //   },
    // },
    // {
    //   label: '<i class="fas fa-fw fa-trash-alt"></i>',
    //   a11yLabel: 'Delete',
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.events = this.events.filter((iEvent) => iEvent !== event);
    //     this.handleEvent('Deleted', event);
    //   },
    // },
  ];

  refresh: Subject<any> = new Subject();

  settings: CompressorSettings[]=[];
  pastSettings = [];

  events: CalendarEvent[] = [
    //{
    //   start: subDays(startOfDay(new Date()), 2),
    //   end: addDays(new Date(), 0),
    //   title: 'A 3 day event',
    //   color: colors.red,
    //   actions: this.actions,
    //   allDay: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: true,
    // },
    // {
    //   start: startOfDay(new Date()),
    //   title: 'An event with no end date',
    //   color: colors.red,
    //   actions: this.actions,
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: 'A long event that spans 2 months',
    //   color: colors.red,
    //   allDay: true,
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: addHours(new Date(), 2),
    //   title: 'A draggable and resizable event',

    //   color: colors.red,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: true,
    // },
  ];

   advSpecsModel : CompressorAdvanced = {
    status: true,// null means it's empty, false is not considered and true is when all values below got filled
    ON_n: null,
    ON_e: { H: null, M: null, S: null },
    timeout:{ H: null, M: null, S: null },//all at zero is considered as null
    incremental: true
   };

  activeDayIsOpen: boolean = true;
  public subscription : Subscription;
  
  constructor(private dialogService: NbDialogService, private compressorService : CompressorService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.dateSetpoint = {// creates the offset from the actual date
      startOfDay: startOfDay(new Date()),
      weeksDay: startOfDay(new Date()).getDay()
    };
 
    this.subscription = this.compressorService.getCompSettings().subscribe( (newData) => {
      newData = (!newData || newData==null || newData==undefined) ? [] : newData;
      this.pastSettings = newData;
      console.log("NEWdATA ",newData)
  
      if(this.firstTimeLoading){
        
        for(let i=0;i<newData.length;i++){
          let powerCheckConfig = this.parsePowCheck(newData[i]);
          //console.log("parsed CHK",powerCheckConfig)

          this.offsetParseEvent(
              newData[i].startingDay,// days array, index 0 contains parent
              newData[i].allTimeActive,
              newData[i].start,
              newData[i].end,
              newData[i].slot,
              newData[i].typeID,
              newData[i].title,
              powerCheckConfig
            );

          }
      
          this.refresh.next();
      }
    });
   
    this.compressorService.queryComp(this.devId);
    this.compressorService.updateDELETE(this.deleteSlots);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({//When resized manually event
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {

    let nStart = this.parseDateFormat(newStart); 
    let nEnd = this.parseDateFormat(newEnd); 
    // console.log(" start ",nStart.time," end ",nEnd.time);

    if(nEnd.time.H==0 && nEnd.time.M==0) {
      nEnd.time.H = 23;
      nEnd.time.M = 59;
      newEnd = this.parseOffsetDate(nStart.day,nEnd.time);
    }
    //recalculate, if still same day, update
    nStart = this.parseDateFormat(newStart); 
    nEnd = this.parseDateFormat(newEnd);

    if(nStart.day==nEnd.day){
      this.events = this.events.map((iEvent) => {//updates the start-end time in the events object
        if (iEvent === event) {
          return {
            ...event,
            start: newStart,
            end: newEnd,
          };
        }
        return iEvent;
      });
    }
    
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.NbDialogData = { event, action};

    if(action=='Edited'){
      let result = this.settingsGetValue(event.id,"allTimeActive");
      if(!result.error){
        //depending on activeAllTime toggle switch state, we show a different dialog window
        this.dialogRef = this.dialogService.open((!result.value) ? this.modalContent : this.modalContent2,{context:{ title: `Editar Configuración `},autoFocus:false,hasScroll:false} );
      }
    }
    
    if(action=='Dropped or resized'){
      let setupID = this.eventIDTranslate(event.id);
      this.resetPowCheckSpecs(setupID);
      this.eventsToSettingsUpdate(event.id,"event");
      this.updateSubject();
      this.compressorService.updateEVENTS(this.events);
    }
    
  }

  addEvent(): void {
    this.daysSelected.forEach(element => {
      element = Number (element);
      let timeStart = {H:12,M:0};//default start
      let timeEnd = {H:23,M:59};//default end
      let start = this.parseOffsetDate(element,timeStart);
      let end = this.parseOffsetDate(element,timeEnd);
      let localID = this.lastLocalIndex+=100;
      let disable = false;
      let powerCheckConfig = this.advSpecsModel;

      this.disableInputState(localID,"new",disable);

      this.settings = [
        ...this.settings,
        {
          slot:false,
          title: 'OP '+localID,
          typeID:3,// 3 is always the default
          localID,
          allTimeActive:false,
          start: timeStart,
          end: timeEnd,
          startingDay:[element+""],
          endingDay :[this.returnEndDay(element,timeStart,timeEnd)+""],
          powerCheck: powerCheckConfig,
          childrenEvents: [(element+localID)+""],
          isParsed:true
        }
      ];

      this.events = [
        ...this.events,
        {
          id:(element+localID)+"",
          title: "OP "+localID,
          start,
          end,
          actions: this.actions,
          color: colors.blue,
          draggable: true,
          resizable: {
            beforeStart: (disable) ? false : true,
            afterEnd: (disable) ? false : true,
          },
        },
      ];

    });
    console.log("add new settings are : ",this.settings)
    this.daysSelected = [];
    this.isAddDisabled = true;
    this.compressorService.updateEVENTS(this.events);
    this.firstTimeLoading = false;
    this.updateSubject();
  }

  offsetParseEvent(weeksDay,allTimeActive,timeStart,timeEnd,slot,typeID,title,powerCheck){
    //HERE WE ADD OFFSET TO THE DAY OF THE WEEK, BASED ON TODAY'S DATE
    let setUpdone = false;
    let setupIndex = null;

    weeksDay.forEach(element => {
     
      let localID = Number(slot)*100;
      this.lastLocalIndex = localID;
      let start = this.parseOffsetDate(element,timeStart);
      let end = this.parseOffsetDate(element,timeEnd);
      
      //this.disableInputState(localID,"new",allTimeActive);//set disable inputs depending on alltimeActive flag
      let eventID = Number(element)
      eventID = (eventID==0) ? 7 : eventID;
      eventID = localID+eventID;

      if(!setUpdone){
  
        this.settings = [
          ...this.settings,
          {
            slot,
            title,
            typeID,
            localID,
            allTimeActive,
            start: timeStart,
            end: timeEnd,
            startingDay:[],
            endingDay: [],
            powerCheck,
            childrenEvents:[],//make empty array
            isParsed:true
          }
        ];

        setupIndex = this.getSettingsIndex(localID);
        setUpdone = true;
     
      }
      this.settings[setupIndex].startingDay.push(element+"");
      this.settings[setupIndex].childrenEvents.push(eventID);// push event id
      this.settings[setupIndex].endingDay.push(this.returnEndDay(element,timeStart,timeEnd)+"");

      this.events = [
        ...this.events,
        {
          id: eventID,
          title,
          start,
          end,
          actions: this.actions,
          color: colors.yellow,
          draggable: (weeksDay.length>1) ? false : true,
          resizable: {
            beforeStart: (weeksDay.length>1) ? false : true,
            afterEnd: (weeksDay.length>1) ? false : true,
          },
        },
      ];
    });
    this.compressorService.updateEVENTS(this.events);
    this.firstTimeLoading = false;
    //console.log("events",this.events)
  }

  deleteEvent(id) {
    let result = this.settingsGetValue(id,"slot");
    if(!result.error){
      if(result.value){
        this.deleteSlots = [...this.deleteSlots,result.value];
      }
    }
    //delete events and settings
    let setupIndex = this.getSettingsIndex(id)
    this.deleteChildrenEvents(setupIndex);
    this.settings = this.settings.filter((event) => event.localID !== id);
    this.disableInputState(id,"delete");

    //update subject and events object service
    this.updateSubject();
    this.compressorService.updateEVENTS(this.events);
    this.compressorService.updateDELETE(this.deleteSlots);
  }

  close(){
    this.dialogRef.close();
  }

  parseOffsetDate(dayOfTheWeek,time){
    dayOfTheWeek = (dayOfTheWeek==7) ? 0 : dayOfTheWeek;//7 and 0 is sunday
    let offsetDate :any = null;
    if(this.dateSetpoint.weeksDay==dayOfTheWeek){//If is the same day of the week, just add Hours and minutes
      //console.log(`same ${this.dateSetpoint.weeksDay} vs ${dayOfTheWeek}`)
      offsetDate = addHours(this.dateSetpoint.startOfDay,time.H);
      offsetDate = addMinutes(offsetDate,time.M);

    }else if(this.dateSetpoint.weeksDay>dayOfTheWeek){
      let daysDiff = this.dateSetpoint.weeksDay - dayOfTheWeek;
      offsetDate = subDays(this.dateSetpoint.startOfDay,daysDiff);
      offsetDate = addHours(offsetDate,time.H);
      offsetDate = addMinutes(offsetDate,time.M);
      //console.log(`${this.dateSetpoint.weeksDay} greater than ${dayOfTheWeek}`)

    }else if(this.dateSetpoint.weeksDay<dayOfTheWeek){
      let daysDiff = dayOfTheWeek - this.dateSetpoint.weeksDay;
      offsetDate = addDays(this.dateSetpoint.startOfDay,daysDiff);
      offsetDate = addHours(offsetDate,time.H);
      offsetDate = addMinutes(offsetDate,time.M);
      //console.log(` ${this.dateSetpoint.weeksDay} less than ${dayOfTheWeek}`)
    }

    return offsetDate;
  }

  selection($eventSelection){
     this.isAddDisabled = ($eventSelection.length) ? false : true;
  }

  basicOverlap(id){
    let errorF = false;
    let setupIndex = this.getSettingsIndex(id)
    
    let startD = Number(this.settings[setupIndex].startingDay[0]);
    let endD = Number(this.settings[setupIndex].endingDay[0]);
    let startH = (this.settings[setupIndex].start.H==null) ? 0 : Number(this.settings[setupIndex].start.H);
    let startM = (this.settings[setupIndex].start.M==null) ? 0 : Number(this.settings[setupIndex].start.M);
    let endH = (this.settings[setupIndex].end.H==null) ? 0 : Number(this.settings[setupIndex].end.H);
    let endM = (this.settings[setupIndex].end.M==null) ? 0 : Number(this.settings[setupIndex].end.M);

    if(startD==endD){
      //On same start-end day
      if(startH==endH){
        if(startM>=endM){
          //console.log("same day,same hour, but startM ",startM,">= ",endM,"endM  ID: ",id)
          errorF =  true;
        }
        
      }else if(startH>=endH){
        //console.log("same day,same hour, but startH ",startH,">= ",endH,"endH  ID: ",id)
        errorF =  true;
      }
  
    }else{
      //On different start-end days
      let inBetween = endD - startD;
      if( inBetween<0 || inBetween>1){
        //console.log("in between found : ",inBetween,"different day at id ",id) 
        errorF =  true;
      }
    }
  
    return errorF;
  }

  operationDays(id,array){
      let error = this.basicOverlap(id);
      this.updateChildrenEvents(array,id);

      if(!error) {
        this.settingsToEventsUpdate(id);
      }else{
        this.eventsToSettingsUpdate(id,"settings");
      }
      this.updateSubject();
  }

  eventsToSettingsUpdate(id,typeID){//update values from settings object to events object ONLY WHEN THERE IS A UNIQUE EVENT, NOT MULTIPLE
    let setupID = Number(id);
    let eventID = Number(id);
    let setupIndex = null;

    if(typeID=="event"){
      setupID = this.eventIDTranslate(eventID);//get the setting ID
      setupIndex = this.getSettingsIndex(setupID);

    }else if(typeID=="settings"){
      setupIndex = this.getSettingsIndex(setupID);
      eventID = this.settings[setupIndex].childrenEvents[0];//get first child ID as reference
      eventID = Number(eventID);

    }
     //console.log("eventsToSettingsUpdate A")
    // console.log("typeID ",typeID," calculated: event ",eventID," setup ",setupID);

    let eventIndex= this.getEventsIndex(eventID);
    let tStart = this.parseDateFormat(this.events[eventIndex].start);
    let tEnd = this.parseDateFormat(this.events[eventIndex].end);

    let childrenEventsCount = this.settings[setupIndex].childrenEvents.length;//IF ONLY 1 EVENT FOUND, MEANS IT CAN BE DRAGGED...
   
    if(childrenEventsCount==1){
      //UPDATE DAYS AND CHILDREN EVENTS ONLY WHEN EVENT DRAGGED
      let newDay = Number(tStart.day);// update the day 
      newDay = (newDay==0) ? 7 : newDay;//sunday parse
      let newChildID=(newDay+setupID);//update the child, SETTING ID(offset) + day number = EVENT ID
      this.events[eventIndex].id=newChildID+"";//SINCE DRAGGED, ALSO UPDATE DE EVENT ID

      this.settings[setupIndex].childrenEvents = [newChildID];
      this.settings[setupIndex].startingDay = [tStart.day+""];
      this.settings[setupIndex].endingDay = [tEnd.day+""];
    }

    this.settings[setupIndex].start=tStart.time;
    this.settings[setupIndex].end=tEnd.time;
  }

  settingsToEventsUpdate(id){//update values from events object to settings object
    let setupIndex = this.getSettingsIndex(id);
    let numberID = Number(id);
    //console.log("settingsToEventsUpdate B")
    let childrenIDs = [...this.settings[setupIndex].childrenEvents];

    for(let index = 0; index < this.events.length; index++){
      for(let i = 0; i < childrenIDs.length; i++){
        let childID = Number(childrenIDs[i]);
        let dayCode = childID-numberID;

        if(this.events[index].id == childID){
          //matches events and settings objects on : start and end dates
          let startDay = dayCode;
          let endDay = dayCode;
          let start = { H: Number(this.settings[setupIndex].start.H), M: Number(this.settings[setupIndex].start.M)}
          let end = { H: Number(this.settings[setupIndex].end.H), M: Number(this.settings[setupIndex].end.M)}
            
          let startOffSet = this.parseOffsetDate(startDay,start);
          let endOffSet = this.parseOffsetDate(endDay,end);
  
          this.events[index].start = startOffSet;
          this.events[index].end = endOffSet;
        }

      }
    }

    this.events = [//copies object, hence, the calendar view
      ...this.events
    ];
    
  }

  updateChildrenEvents(daysChoosen,id){
    //get index and childrenEvents as Past childrenEvents
    let setupIndex = this.getSettingsIndex(id);
    let pastChildren = this.settings[setupIndex].childrenEvents;

    //IF SELECTION WAS EMPTY, FORCE SELECT TO SELECT THE LAST OPTION
    if(!daysChoosen.length){
      daysChoosen[0]=(Number(pastChildren[0])-Number(id));// minus offset
      daysChoosen[0]=(daysChoosen[0]==7) ? "0" : ""+daysChoosen[0];// we use the last children id seen, hence 7 must be taken as 0 (sunday)
    }
    //add raw days selected as starting day and ending day (array type)
    this.settingsSetAValue(id,"startingDay",[...daysChoosen]);
    this.settingsSetAValue(id,"endingDay",[...daysChoosen]);

    //add events and also generate the related local id array
    daysChoosen = daysChoosen.map((element,index)=>{
        element = (element==0) ? 7 : element;
        daysChoosen[index]=Number(element)+Number(id);
        return daysChoosen[index];
    });
    //ADD NEW CHILDREN EVENTS ID's TO SETTINGS
    this.settings[setupIndex].childrenEvents = daysChoosen;

    //DELETE OLD CHILDREN EVENTS ID's FROM SETTINGS TO UPDATE
    this.deleteChildrenEvents(setupIndex);
    
    //UPDATE EVENTS
    this.addLinkedEvent(daysChoosen,setupIndex);

    // console.log(id," pastChildren ",pastChildren)
    // console.log(id," new ",daysChoosen)
    // console.log(this.settings)
  }

  settingsSetAValue(id,key,value){
    this.settings.forEach( (e,index )=> {
      if(e.localID == id){
        this.settings[index][key]=value;
      }
    });
  }

  settingsGetValue(id,key){
    var value : any = false;
    let response = {error:true,value:value};
    this.settings.forEach( (e,index )=> {
      if(e.localID == id){
        response = {error:false, value:this.settings[index][key]};
      }
    });
    return response;
  }

  eventsSetAValue(id,key,value){
    this.events.forEach( (e,index )=> {
      if(e.id == id){
        this.events[index][key]=value;
      }
    });
  }

  eventsGetValue(id,key){
    var value : any = false;
    let response = {error:true,value:value};
    this.events.forEach( (e,index )=> {
      if(e.id == id){
        response = {error:false, value:this.events[index][key]};
      }
    });
    return response;
  }

  parseDateFormat(d){
    let date = new Date(d);

    return {
      time: {H:date.getHours(),M:date.getMinutes()},
      day : date.getDay()
    };
  }

  returnEndDay(day,startT,endT){
    let startH = startT.H,startM = startT.M,endH = endT.H,endM = endT.M;
    let compareByMin = (startH==endH) ? true : false;
    let difference = endH-startH;
    
    //console.log(`difference between : startH ${startH} and endH ${endH}`);
    if(compareByMin){
         difference = endM-startM;
         //console.log(`option 2 required, difference between : startM ${startM} and endM ${endM}`);
    }

    if(difference>0){//if difference is positive, return a false overflow
         return day;
    }

    return day+1;
  }

  inputEndDay(daySelected,id){
 
    this.disableInput.startDay[id] = this.endInputChainEvent(id);
    let error = this.basicOverlap(id);
    if(!error) {
      this.settingsToEventsUpdate(id);
    }else{
      this.eventsToSettingsUpdate(id,"settings");
    }
  
  }

  getDayName(nextDay,value){
    let names = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

    value = parseInt(value);
    if(nextDay) value = (value>=6) ? 0 : value+1;

    return names[value];
  }

  conversionNextDay(value){
    value = parseInt(value);
    value = (value>=6) ? 0 : value+1;
    return value;
  }

  endInputChainEvent(id){
   let lock = false;
   for(let index=0;index<this.settings.length;index++){

      if(this.settings[index].localID==id){
        let startD = Number(this.settings[index].startingDay);
        let endD = Number(this.settings[index].endingDay);
        let inBetween = endD - startD;
      
        if(inBetween>0){//when different days, just disable de start day input
          lock = true;
          break;
        }else{//when selected same day, we need to make sure time doesn´t overlap
          let startH =  Number(this.settings[index].start.H);
          let startM =   Number(this.settings[index].start.M);
          let endH =  Number(this.settings[index].end.H);
          let endM = Number(this.settings[index].end.M);

          if(startH==23 && startM==59){
            this.settings[index].start.M = 0;
            endH = 23;
            endM = 59;

          }else if(startH==endH){// same hour?, just re-adjust minutes
            this.settings[index].start.M = 0;
            endM = 59;
          }else if(startH>endH){
            this.settings[index].start.M = 0;
            endH = startH;
            endM = 59;
          }

          this.settings[index].end.H = endH;
          this.settings[index].end.M = endM;
          this.settingsToEventsUpdate(id);//UPDATE changes from settings to events
          break;
        }
      }//end id located

    }//for end
    return lock;
  }

  inputChangeDetected(id):void{
    let error = this.basicOverlap(id);
    if(!error) {
      this.settingsToEventsUpdate(id);
    }else{
      let setupIndex = this.getSettingsIndex(id);
      this.eventsToSettingsUpdate(id,"settings");
    }
    this.resetPowCheckSpecs(id);
    this.updateSubject();
  }

  allDayEvent(event,id){
    let resizable = {
        beforeStart: (event) ? false : true,
        afterEnd: (event) ? false : true,
    }
    let disableAllInputs= event;
    this.disableInputState(id,"set",disableAllInputs);
    this.eventsSetAValue(id,"resizable",resizable);

    if(event){
        let start = {H:0,M:0};
        let end = {H:23,M:59};
        this.settingsSetAValue(id,"start",start);
        this.settingsSetAValue(id,"end",end);
        this.settingsSetAValue(id,"typeID",2);
        this.settingsSetAValue(id,"powerCheck",true);
        this.settingsToEventsUpdate(id);
    }else{
        this.settingsSetAValue(id,"typeID",3);
        this.addPowCheckSetup(id);
    }
    //console.log(this.settings)
    this.updateSubject();
  }

  disableInputState(id,action,status?){
   let keys = Object.keys(this.disableInput);
  
   keys.forEach(key => {
     if(action=="delete"){
      delete this.disableInput[key][id];
     }else if(action=="new" || action=="set"){
      this.disableInput[key][id] = status;
     }
    
   });
   
  }

  getEventsIndex(id):number{
    let eID = Number(id); 
    let index:any = undefined;

    for(let i=0; i<this.events.length;i++){
      let eventNumID = Number(this.events[i].id);
      if(eID == eventNumID){
        index=i;
        break;
      }
    }
    
    return index;
  }

  getSettingsIndex(id):any{
    let index : any = undefined;
    for(let i=0; i<this.settings.length;i++){
      if(id == this.settings[i].localID){
        index=i;
        break;
      }
    }
    
    return index;
  }

  advancedBtn(id){
      let setupCopy : any = null;
      let result = this.settingsGetValue(id,"allTimeActive");
      let setupIndex = this.getSettingsIndex(id);
      let timeRange = this.calculateTimeRangeMAX(id);

      if (typeof this.settings[setupIndex].powerCheck === "boolean"){
        setupCopy = (this.settings[setupIndex].powerCheck) ? true : false;
      }else{
        setupCopy = {
          status : this.settings[setupIndex].powerCheck.status, 
          ON_n : this.settings[setupIndex].powerCheck.ON_n, 
          ON_e : {...this.settings[setupIndex].powerCheck.ON_e},// in this sintax we copy only the keys and values, but not the object pointer
          timeout : {...this.settings[setupIndex].powerCheck.timeout},// in this sintax we copy only the keys and values, but not the object pointer
          incremental : this.settings[setupIndex].powerCheck.incremental
        };//we make a copy of the power check to set the new changes, but wont bind it to the original yet
      }

      this.dialogData = {
        localID: id,
        title : this.settings[setupIndex].title,
        timeRange,
        newSetup: setupCopy ,
        inputDisabled : this.inputDisabledDialog(setupIndex)
      };
   
      if(!result.error){
        //depending on activeAllTime toggle switch state, we show a different dialog window
        this.dialogRef = this.dialogService.open((!result.value) ? this.modalContent : this.modalContent2,{context:{ title: `Editar Configuración `},autoFocus:false,hasScroll:false} );
      }
      console.log(this.dialogData);
      console.log(this.settings[setupIndex]);
  }

  acceptDialogEvent(dialogRef,id,idType){
    let setupIndex = this.getSettingsIndex(id);
    this.settingsSetAValue(id,"typeID",idType);// re define the ID (2 OR 3)
    this.settings[setupIndex].powerCheck = this.dialogData.newSetup;
    if(idType == 3){
      this.settings[setupIndex].powerCheck.status = true;
    }
    dialogRef.close();
    delete this.dialogData;
    this.updateSubject();
  }

  addPowCheckSetup(id){
    let powerCheckConfig = this.advSpecsModel;
    this.settingsSetAValue(id,"powerCheck",powerCheckConfig);
  }

  parsePowCheck(setup){
    let sorted = null;

    if(setup.typeID==2){
      sorted = setup.powerCheck;

    }else if(setup.typeID==3){

      if(setup.powerCheck==null){
        sorted = {...this.advSpecsModel};

      }else{
        let parsedON_e = this.convertFromSec(setup.powerCheck.ON_e);
        parsedON_e.H = (!parsedON_e.H) ? null : parsedON_e.H;
        parsedON_e.M = (!parsedON_e.M) ? null : parsedON_e.M;
        parsedON_e.S = (!parsedON_e.S) ? null : parsedON_e.S;

        let parsedTimeout = this.convertFromSec(setup.powerCheck.timeout);
        parsedTimeout.H = (!parsedTimeout.H) ? null : parsedTimeout.H;
        parsedTimeout.M = (!parsedTimeout.M) ? null : parsedTimeout.M;
        parsedTimeout.S = (!parsedTimeout.S) ? null : parsedTimeout.S;

        sorted = {
          status:true,
          ON_n:setup.powerCheck.ON_n,
          ON_e: parsedON_e,
          timeout: parsedTimeout,
          //incremental: setup.powerCheck.incremental
          incremental: true
        }

      }
      
    }

    return sorted;
  }

  inputDisabledDialog(setupIndex){
    let ON_e = false; let timeout = true;
    if(typeof this.settings[setupIndex].powerCheck !== "boolean"){
      
      if(this.settings[setupIndex].powerCheck.ON_e.H != null || this.settings[setupIndex].powerCheck.ON_e.M != null || this.settings[setupIndex].powerCheck.ON_e.S != null ){
          ON_e = true;
          console.log("case 2",this.settings[setupIndex].powerCheck.ON_e.S)
      }
      
      if(this.settings[setupIndex].powerCheck.timeout.H != null || this.settings[setupIndex].powerCheck.timeout.M != null || this.settings[setupIndex].powerCheck.timeout.S != null ){
        timeout = false;
      }
    
    }

    let inputDisableStatus = {
      ON_n: (typeof this.settings[setupIndex].powerCheck === "boolean") ? true : (this.settings[setupIndex].powerCheck.ON_n != null) ? false : true,
      ON_e,
      timeout
    }
   
    this.settings[setupIndex].powerCheck;
    //SET STATES FROM SETTINGS <---------------------
    return inputDisableStatus;
  }

  calculateTimeRangeMAX(id){
    let aChildID = this.settings[this.getSettingsIndex(id)].childrenEvents[0];//GET just the first ID to get the date range
    let start = this.eventsGetValue(aChildID,"start");
    let end = this.eventsGetValue(aChildID,"end");
    let sDate = new Date(start.value).getTime();
    let eDate = new Date(end.value).getTime();

    let totalSeconds = eDate - sDate;
    totalSeconds = totalSeconds/1000;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);

    return {maxH : hours, maxM: minutes}
  }

  setMaxMinute(timeRange,inputH){//set max min input
    
    let max = (inputH==timeRange.maxH) ? timeRange.maxM : 59;
    return max;
  }

  resetMinuteInput(timeRange,timeInput){
    let updateVal = timeInput.M;
    if(timeInput.H==0 && timeInput.M==null){
      updateVal=1;
    }
    if(timeInput.H==0 && timeInput.M==0){
      updateVal=1;
    }else{
      if( timeInput.H==timeRange.maxH && timeInput.M>timeRange.maxM ){
        updateVal = timeRange.maxM;
      }
     
    }
 
   return updateVal;
  }

  setInputsNull(event,key):void{
    this.dialogData.inputDisabled[key] = (event.target.checked) ? true : false;
    
    if(event.target.checked){
      if(key=="ON_n"){
        this.dialogData.newSetup[key]= null;
        
      }else{
        this.dialogData.newSetup[key].H = null;
        this.dialogData.newSetup[key].M = null;
        this.dialogData.newSetup[key].S = null;
      }
    }
     
   
  }
  
  convertToSec(hours: number,minutes: number,seconds?: number): number {
    let totalSec = 0;
    totalSec = Math.floor(hours * 60 * 60);
    totalSec += Math.floor(minutes * 60);
    totalSec = (seconds!=undefined) ? (totalSec+seconds) : totalSec; 
    return totalSec;
  }

  convertFromSec(seconds: number){//<---------------------- need it?
    let H = null; let M = null; let S = null;
    H = Math.floor(seconds / 3600);
    M = Math.floor(seconds % 3600 / 60);
    S = Math.floor(seconds % 3600 % 60);
    return {H,M,S};
  }

  setAllowedOpTimeLabel(totalRange,operation):string{
    let text =` ${totalRange.maxH} Hora(s) y ${totalRange.maxM} Minuto(s)`;
    if(operation.H!=null || operation.M!=null){
      text =` ${(operation.H==null) ? 0 : operation.H} Hora(s) y ${(operation.M==null) ? 0:operation.M} Minuto(s)`;
    }

    return text;
  }

  resetPowCheckSpecs(id){
    let setupIndex = this.getSettingsIndex(id);
    let powerCheckConfig = this.advSpecsModel;
    if(typeof this.settings[setupIndex].powerCheck === "object"){
      this.settings[setupIndex].powerCheck = powerCheckConfig;
    }
  }

  updateSubject(){
    this.compressorService.update(this.settings);
  }

  addLinkedEvent(days,setupIndex){
    //console.log("GOT THIS ",this.settings[setupIndex]);
    let timeStart = this.settings[setupIndex].start;
    let timeEnd = this.settings[setupIndex].end;
    let idOffset = Number(this.settings[setupIndex].localID);
    let onlyaDay = (days.length==1) ? true : false;
    
    days.forEach(element => {
      let daySubs = Number(element);
      daySubs = daySubs-idOffset;
      daySubs = (daySubs==7) ? 0 : daySubs;// 7 equals to 0, sunday
      let start = this.parseOffsetDate(daySubs,timeStart);
      let end = this.parseOffsetDate(daySubs,timeEnd);
   
      this.events = [
        ...this.events,
        {
          id:element,
          title: this.settings[setupIndex].title,
          start,
          end,
          actions: this.actions,
          color: colors.blue,
          draggable: onlyaDay,
          resizable: {
            beforeStart: onlyaDay,
            afterEnd: onlyaDay,
          },
        },
      ];

    });
    this.refresh.next();
    this.compressorService.updateEVENTS(this.events);
    console.log("THIS EVENTS ",this.events)
  }

  deleteChildrenEvents(setupIndex){
    let idOffset = Number(this.settings[setupIndex].localID);
    let limit = idOffset+100;
  
    this.events = this.events.filter((element,index)=>{
      let id = Number(element.id);
      if(id<idOffset || id>=limit){
        return true;
      }
    });
 
  }

  returnDayText(day){
    let days = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
    return days[day];
  }

  editTitle(id,text){
    let setupIndex = this.getSettingsIndex(id);
    this.settings[setupIndex].title = text.target.value;
    let childrenEvents = this.settings[setupIndex].childrenEvents;
    for(let i =0;i < childrenEvents.length; i++){
      let eventIndex = this.getEventsIndex(childrenEvents[i]);
      this.events[eventIndex].title = text.target.value;
    }
  }

  eventIDTranslate(id){
    id = Number(id);
    return  Math.trunc((id/100))*100;;
  }

}

