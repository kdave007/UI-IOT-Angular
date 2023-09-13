////////////
/// WIFI ///
////////////

/**
 * @brief
 *  Lista de perfiles de red
 */
export enum WIFI_PROFILES_LIST {
    _1,
    _2,
    _3,
    _4,
    _5,

    max
} 

/**
 * @brief 
 *  Estructura general para el wifi
 */
export interface WIFI_DATA {
    ssid: string;
    key: string;
    bssid: string;
    priority: number;
}

///////////////
/// SENSORS ///
///////////////

/**
 * @brief
 *  Lista de sensores
 */
export enum SENSORS_LIST {
    _1,
    _2,
    _3,
    _4,
    _5,
    _6,
    _7,
    _8,
    _9,
    _10,
    _11,
    _12,
    _13,
    _14,
    _15,
    _16,

    max
}

///////////////////
/// THERMISTORS ///
///////////////////

/**
 * @brief
 *  Lista de termistores
 */
export enum THERMISTORS {
    _1,
    _2,
    _3,
    _4,

    max
}

//////////////
/// REPORT ///
//////////////

/**
 * @brief tipos de reportes
 */
export enum REPORTS_LIST {
    interval,
    scheduled
}

/**
 * @brief
 *  Contenidos del reporte
 */
export interface REPORT_DATA {
    type: REPORTS_LIST;
    
    intervalTime: number;
    scheduleTime: number;
    lte_en?:boolean;
    gps_en?:boolean;
}

////////////////////////////
/// SAMPLING TEMPERATURE ///
////////////////////////////

/**
 * @brief
 *  Contenido para la frecuencia de muestreo
 */
export interface TEMP_SAMP_DATA {
    interval: number;
    samples: number;
}


/////////////////////////////////
/// ADVANCED CONFIG          ///
////////////////////////////////

/**
 * @brief
 *  Contenido de configuraciones avanzadas
 */

export interface ADVANCED_CONFIG   {
    keep_alive: number;
    ka_GPS: boolean;
    log_GPS: number;
}

/////////////////////////////////
/// L_MODULE                 ///
///////////////////////////////

/**
 * @brief
 *   Lista de modulos de sensores de luz
 */

export enum L_MODULE {
    M1=0,
    M2,
    M3,
    M4,

    MAX
}


/////////////////////////////////
/// L_SENS               ///
///////////////////////////////

/**
 * @brief
 *   Lista de sensores de luz
 */

export enum L_SENS{
    L1=0,
    L2,
    L3,

    MAX
}


/////////////////////////////////
/// LIGHT_SENS_CONFIG         ///
////////////////////////////////

/**
 * @brief
 *   Contenido de configuraciones de sensor de luz (3 sensores por modulo ?)
 */

export interface LIGHT_MODULES {
    treshold: number;
    edge: boolean;
    filter: number;
    status: boolean;
}

/////////////////////////////////
/// SUPER USER ACTIONS  FLAGS ///
////////////////////////////////

/**
 * @brief
 *  Contenido de banderas para habilitar acciones de super usuarios (atechnik)
 */

export interface SUPER_USERS_FLAGS {
    disabledPrice: boolean;
    disabledIntervals: boolean;
    disableInterfaceSetup?: boolean;
}