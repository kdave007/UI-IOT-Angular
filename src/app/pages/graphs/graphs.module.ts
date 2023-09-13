import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { TempChartComponent } from './temp-chart/temp-chart.component';
import { GpiosChartComponent } from './gpios-chart/gpios-chart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { NbCardModule, NbButtonModule, NbIconModule, NbInputModule, } from '@nebular/theme';

import { ChartsModule } from '../charts/charts.module';
import { GraphsComponent } from './graphs.component';
import { PagesModule } from '../pages.module';
import { CalendarCardComponent } from '../calendar-card/calendar-card.component';
import { DayCellComponent } from '../extra-components/calendar/day-cell/day-cell.component'
import { NbCalendarRangeModule,NbCalendarModule,NbDatepickerModule } from '@nebular/theme';
import { VoltagesChartComponent } from './voltages-chart/voltages-chart.component';
import { ExternalSourceComponent } from './external-source/external-source.component';
import { DevicesModule } from '../../devices/devices.module';
import { PowerBankComponent } from './power-bank/power-bank.component';
import { DateTimeSelectorComponent } from './date-time-selector/date-time-selector.component';
import { FormsModule } from '@angular/forms';
import { TempChartBoxComponent } from './temp-chart-box/temp-chart-box.component';





@NgModule({
  declarations: [
    TempChartComponent,
    GpiosChartComponent,
    GraphsComponent,
    CalendarCardComponent,
    DayCellComponent,
    VoltagesChartComponent,
    ExternalSourceComponent,
    PowerBankComponent,
    DateTimeSelectorComponent,
    TempChartBoxComponent
  ],
  imports: [
    NbCalendarRangeModule,
    NbCalendarModule,
    CommonModule,
    ThemeModule,
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
    NbCardModule,
    ChartsModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbDatepickerModule,
    DevicesModule,
    FormsModule
  ],
  
})
export class GraphsModule { }
