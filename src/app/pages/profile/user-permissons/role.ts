export class Role {
    id!: number;
    companyName!: string;
    name!: string;
    role!: string;
    level!: number;
    compressor!: boolean;
    sampling!: boolean;
    report!: boolean;
    thermistors!: boolean;
    gpios!: boolean;
    ap!: boolean;
    lightModule!: boolean;
    advanced!: boolean;
    alarmsAccessId : number;
    // regNewDevice: boolean
    // accessAllDevices: boolean
    // accessDeviceMsg: boolean
  }