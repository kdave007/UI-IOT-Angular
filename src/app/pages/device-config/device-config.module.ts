import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { NbToggleModule, NbCardModule, NbAccordionModule, NbRadioModule, NbTabsetModule, NbCheckboxModule, NbButtonModule, NbSelectModule, NbToastrModule, NbInputModule, NbDatepickerModule } from '@nebular/theme';
import { MatListModule } from '@angular/material/list';

import { DeviceConfigComponent } from './device-config.component';
import { BoxPrepareComponent } from './box-prepare/box-prepare.component';
import { SamplingComponent } from './sampling/sampling.component';
import { ReportComponent } from './report/report.component';
import { ThermistorCalComponent } from './thermistor-cal/thermistor-cal.component';
import { GpioFilterComponent } from './gpio-filter/gpio-filter.component';
import { WifiComponent } from './wifi/wifi.component';
import {NumberPickerModule} from 'ng-number-picker';
import { FormsModule } from '@angular/forms';
import { CalendarCommonModule, CalendarWeekModule } from 'angular-calendar';

import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatIconModule,
  MatSelectModule,
  MatDialogModule,
} from '@angular/material';
import { CustomWeekCalendarComponent } from './box-prepare/custom-week-calendar/custom-week-calendar.component';
import { AdvancedComponent } from './advanced/advanced.component';
import { LModComponent } from './l-mod/l-mod.component';
import { DevicesModule } from '../../devices/devices.module';
import { InterfaceSettingsComponent } from './interface-settings/interface-settings.component';

@NgModule({
  declarations: [DeviceConfigComponent, 
    BoxPrepareComponent, SamplingComponent, ReportComponent, ThermistorCalComponent, 
    GpioFilterComponent, WifiComponent, CustomWeekCalendarComponent, AdvancedComponent, LModComponent, InterfaceSettingsComponent],
  imports: [
    CommonModule,
    ThemeModule,
    NbToggleModule,
    NbCardModule,
    MatListModule,
    NbAccordionModule,
    NumberPickerModule,
    NbCheckboxModule,
    NbRadioModule,
    NbTabsetModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatIconModule,
    NbButtonModule,
    NbSelectModule,
    MatSelectModule,
    NbToastrModule,
    NbInputModule,
    MatDialogModule,
    FormsModule,
    CalendarCommonModule,
    NbDatepickerModule, 
    CalendarWeekModule,
    DevicesModule
    
  ],
})
export class DeviceConfigModule { }
