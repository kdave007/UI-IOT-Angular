/**
 * @brief
 *  HELP text 
 */
export const HELP_A : string  = "Las muestras de temperatura serán evaluadas bajo la condición seleccionada de temperatura limite y el lapso de tiempo, si se encuentra que en la caja hay un período en el que la temperatura rebase el limite y el lapso de tiempo ingresado, se enviara una notificación al correo de este usuario";

export const HELP_B : string  = "Las muestras de temperatura serán evaluadas bajo la condición seleccionada de temperatura limite y el lapso de tiempo, si se encuentra que en la placa eutéctica hay un período en el que la temperatura rebase el limite y el lapso de tiempo ingresado, se enviara una notificación al correo de este usuario.";

export const HELP_C : string  = "Las muestras de temperatura serán evaluadas bajo la condición seleccionada de temperatura limite y el lapso de tiempo, si se encuentra que en el sensor de descarga del compresor hay un período en el que la temperatura rebase el limite y el lapso de tiempo ingresado, se enviara una notificación al correo de este usuario.";

export const HELP_D : string  = "Las muestras de temperatura serán evaluadas bajo la condición seleccionada de temperatura limite y el lapso de tiempo, si se encuentra que en el sensor de succión del compresor hay un período en el que la temperatura rebase el limite y el lapso de tiempo ingresado, se enviara una notificación al correo de este usuario.";

export interface alertSettings <MetaType = any>{
     alertType: number;
     conditionParam: any;
     lowerLim: any;
     rowId: any;
     value: any;
     value2: any;
     activeStatus?: boolean;
     status?:string;
}

export enum ALARM_INDEX {
     DEFROST=0,
     BOX_STABLE,
     HIGH_TEMP_S,
     LOW_TEMP_S,
     SUCTION_STABLE,
     HIGH_TEMP_D,
     LOW_TEMP_D,
     DOWNLOAD_STABLE,
     OPEN_BDOOR,
     CLOSED_BDOOR,
     T_BAT_NC,
     T_BAT_C,
     CEDIS_NC,
     CEDIS_C,
     TEMP_DIFF,
     PB_FULL_V,
     PB_EMPTY,
     PB_V_DIFF,
     COMP_OFF,

     MAX
}

export class AlarmParameters {
     public DEFAULT = [
          {
               alias:"Defrost",
               params:{
                    "CONFIG_ID_1": -1,
                    "CONFIG_ID_2": 300000//conversion needed
               }
          },
          {    
               alias:"Box temp stable",
               params:{
                    "CONFIG_ID_3": 300000//conversion needed
               }
           },
           {    
               alias:"High temp suction",
               params:{
                    "CONFIG_ID_11": 60,
                    "CONFIG_ID_13": 600000,//conversion needed
                    "CONFIG_ID_16": 0
               }
           },
           {    
               alias:"Low temp suction",
               params:{
                    "CONFIG_ID_12": 5,
                    "CONFIG_ID_14": 600000,//conversion needed
                    "CONFIG_ID_17": 0
               }
           },
           {    
               alias:"Suction temp stable",
               params:{
                    "CONFIG_ID_15": 300000//conversion needed
               }
           },
           {    
               alias:"High temp download",
               params:{
                    "CONFIG_ID_4": 60,
                    "CONFIG_ID_6": 600000,//conversion needed
                    "CONFIG_ID_9": 0
               }
           },
           {    
               alias:"Low temp download",
               params:{
                    "CONFIG_ID_5": 5,
                    "CONFIG_ID_7": 600000,//conversion needed
                    "CONFIG_ID_10": 0
               }
           },
           {    
               alias:"Download temp stable",
               params:{
                    "CONFIG_ID_8": 300000//conversion needed
               }
           },
           {    
               alias:"Open door time treshold",
               params:{
                    "CONFIG_ID_18": 60000//conversion needed
               }
           },
           {    
               alias:"Closed door",
               params:{
                    "CONFIG_ID_19": 60000//conversion needed
               }
           },
           {    
               alias:"Battery disconnected",
               params:{
                    "CONFIG_ID_21": 0//conversion needed
               }
           },
           {    
               alias:"Battery connected",
               params:{
                    "CONFIG_ID_20": 0//conversion needed
               }
           },
           {    
               alias:"External source NC",
               params:{
                    "CONFIG_ID_23": 0//conversion needed
               }
           },
           {    
               alias:"External source connected",
               params:{
                    "CONFIG_ID_22": 0//conversion needed
               }
           },
           {    
               alias:"Dangerous temps diff",
               params:{
                    "CONFIG_ID_24": 5,
                    "CONFIG_ID_25": 300000,//conversion needed
                    "CONFIG_ID_26": 0
               }
           },
           {    
               alias:"Power Bank full",
               params:{
                    "CONFIG_ID_27": 4.0,
                    "CONFIG_ID_28": 5,
                    "CONFIG_ID_29": 5
               }
           },
           {    
               alias:"Power Bank empty",
               params:{
                    "CONFIG_ID_30": 3.4,
                    "CONFIG_ID_32": 5,
                    "CONFIG_ID_31": 5
               }
           },
           {    
               alias:"Power Bank voltage difference",
               params:{
                    "CONFIG_ID_33": 0.5
               }
           },
           {    
               alias:"Comp OFF period continiously",
               params:{
                    "CONFIG_ID_34": 259200//conversion needed
               }
           },
     ];
}

export class Alarms {
     private PARAMS = new AlarmParameters;
     public settings = [];

     constructor(){
          for(let index = 0; index < this.PARAMS.DEFAULT.length; index++){
               this.settings.push({
                    eventId: index+1,
                    eventAlias: this.PARAMS.DEFAULT[index].alias,
                    active: 0,
                    enabled: 0,
                    params: this.PARAMS.DEFAULT[index].params
               });
          }
     }
}

export enum CONV {
     _MIN_TO_MS=0,
     _SEC_TO_MS,
     _HRS_TO_SEC,
     _MIN_TO_SEC
}

export const TOOLTIPS : any = {
     NOTIFICATIONS : "Activa o desactiva esta casilla para recibir o no un correo de esta alarma.",
     TAB_BASIC : "Ajusta los parámetros y activa o desactiva las notificaciones de las alarmas.",
}