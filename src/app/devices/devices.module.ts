import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesComponent } from './devices.component';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbIconModule, NbDatepickerModule, NbRadioModule, NbAccordionModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';



@NgModule({
  declarations: [DevicesComponent],
  imports: [
    CommonModule,
    FormsModule,
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbDatepickerModule,
    ThemeModule,
    NbRadioModule,
    NbAccordionModule,
    Ng2SmartTableModule
    
  ],
  exports: [
    DevicesComponent
  ]
})
export class DevicesModule { }
