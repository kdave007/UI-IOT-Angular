import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfigsService } from '../services/configs.service';
import * as utils from '../services/utils';
import { Subscription } from 'rxjs';


/**
 * @brief
 *  Report modes
 */
enum REPORT_MODES{
  INTERVAL, // Interval mode
  SCHEDULED // Scheduled mode
}

@Component({
  selector: 'ngx-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit,OnDestroy {
  @Input('deviceId') devId : any;

  public reportModes = [
    { value: REPORT_MODES.INTERVAL, label: 'Por intervalos'},
    { value: REPORT_MODES.SCHEDULED, label: 'Por horario'},
  ];

  public reportMode: utils.REPORTS_LIST = utils.REPORTS_LIST.interval; // TODO update with database
  public defaultReportTime: number = 60; // TODO update with database
  public defaultReportHour: number = 3; // TODO update with database
  public defaultLte = false; // TODO update with database
  public defaultGps = false; // TODO update with databas
  public subscriptionA = new Subscription();

  public REPORT: utils.REPORT_DATA = {
    type: utils.REPORTS_LIST.interval, intervalTime: 0, scheduleTime: 0, lte_en: false, gps_en: false
  }

  constructor(private configService : ConfigsService) { }

  ngOnDestroy(): void {
    this.subscriptionA.unsubscribe();
  }

  ngOnInit() {
    this.subscriptionA = this.configService.getReport().subscribe(newData => {
      this.REPORT.lte_en = (newData.lte_en) ? true : false;
      this.REPORT.gps_en = (newData.gps_en) ? true : false;
      this.REPORT.intervalTime = newData.intervalTime;
      this.REPORT.scheduleTime = newData.scheduleTime;
      this.REPORT.type = newData.type;


      console.log("rreeeeeport ",newData)
      this.defaultReportTime = this.REPORT.intervalTime;
      this.defaultReportHour = this.REPORT.scheduleTime;
      this.reportMode = this.REPORT.type;
    });

    this.configService.queryReport(this.devId);
  }

  /**
   * @brief
   *  Update the report mode
   * 
   * @param newMode 
   *  New report mode
   */
  public setReportMode(newMode: utils.REPORTS_LIST){
    this.reportMode = newMode;

    console.log("Report mode:" + String(this.reportMode));

    this.REPORT.type = newMode;

    this.configService.updateReport(this.REPORT);
  }

  /**
   * @brief
   *  Update interval time
   * 
   * @param newIntTime 
   *  New interval time
   */
  public updateInterval(newIntTime: any){
    this.defaultReportTime = Number(newIntTime.target.value);
    this.REPORT.intervalTime = this.defaultReportTime;

    this.configService.updateReport(this.REPORT);
  }

  /**
   * @brief
   *  Update report hour
   * 
   * @param newIntTime 
   *  New hour
   */
  public updateHour(newHour: any){
    this.defaultReportHour = Number(newHour.target.value);
    this.REPORT.scheduleTime = this.defaultReportHour;

    this.configService.updateReport(this.REPORT);
  }

  /**
   * @brief
   *  Return the avaialable report modes for DOM
   */
  get getReportModes(){
    return REPORT_MODES;
  }

  updateReportSubject(){
    this.configService.updateReport(this.REPORT);
  }
}
