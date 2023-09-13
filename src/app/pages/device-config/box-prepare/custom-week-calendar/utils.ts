/**
 * @brief 
 *  Data struct for compressor settings
 */
export interface CompressorSettings<MetaType = any>{
     slot?: any;
     title?:string;
     typeID:number;
     localID: number;
     allTimeActive: boolean;// TRUE == ID 2, FALSE == ID 3
     start: any;
     end: any;
     startingDay:any;
     endingDay?:any;
     powerCheck?: any;//ID 2 true/false, ID 3  null/CompressorAdvanced
     childrenEvents?:any;
     isParsed?:boolean;
 }
 export interface CompressorAdvanced<MetaType = any>{
     status: any;// null means it's empty, false is not considered and true is when all values below got filled
     ON_n: any;
     ON_e: { H: any; M: any; S: any },
     timeout:{ H: any; M: any; S: any },
     incremental: boolean;
 }