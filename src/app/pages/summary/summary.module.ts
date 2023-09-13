import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { SummaryComponent } from './summary.component';
import { NbCardModule, NbButtonModule, NbIconModule,NbDatepickerModule,NbRadioModule,NbAccordionModule, NbDatepickerDirective } from '@nebular/theme';
import { OperationMonitorComponent } from './operation-monitor/operation-monitor.component';
import { FreezeMonitorComponent } from './freeze-monitor/freeze-monitor.component';
import { CompressorMonitorComponent } from './compressor-monitor/compressor-monitor.component';
import { PredictiveCompressorComponent } from './predictive-compressor/predictive-compressor.component';
import { FormsModule } from '@angular/forms';
import { SummarySheetComponent } from './summary-sheet/summary-sheet.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DevicesModule } from '../../devices/devices.module';
import { DevicesComponent } from '../../devices/devices.component';


@NgModule({
  declarations: [SummaryComponent, OperationMonitorComponent,
     FreezeMonitorComponent, CompressorMonitorComponent,
     PredictiveCompressorComponent, SummarySheetComponent 
    ],
  imports: [
    FormsModule,
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbDatepickerModule,
    ThemeModule,
    NbRadioModule,
    NbAccordionModule,
    Ng2SmartTableModule,
    DevicesModule,
  ]
})
export class SummaryModule { }
