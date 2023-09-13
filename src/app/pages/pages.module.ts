import { NgModule } from '@angular/core';
import { NbMenuModule, NbSelectModule, NbToggleModule, NbAccordionModule, NbTabsetModule, NbTooltipModule } from '@nebular/theme';
import { NbCardModule,NbButtonModule, NbIconModule, NbInputModule, NbTreeGridModule, NbCheckboxModule, NbDatepickerModule, NbStepperModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { DevicesListComponent } from './devices-list/devices-list.component';
import { RegistrationDeviceComponent } from './registration-device/registration-device.component';
import { ContactComponent } from './contact/contact.component';
import { TablesRoutingModule, routedComponents } from './tables/tables-routing.module';
import { FsIconComponent } from './tables/tree-grid/tree-grid.component';

import { CommonModule } from '@angular/common';
import { CalendarCardComponent } from './calendar-card/calendar-card.component';
import { GraphsModule } from './graphs/graphs.module';
import { ProfileComponent } from './profile/profile.component';
import { OrganizerComponent } from './profile/organizer/organizer.component';

import { AccountViewComponent } from './profile/account-view/account-view.component';
import { ProfileModule } from './profile/profile.module';
import { SummaryModule } from './summary/summary.module';
import { DeviceConfigModule} from './device-config/device-config.module';
import { AlertsViewComponent } from './alerts-view/alerts-view.component';
import { DeviceConfigComponent } from './device-config/device-config.component';
import { MatDividerModule} from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { FormsModule }   from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

import { HttpClientModule } from '@angular/common/http';

import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatIconModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule,
  MatCheckboxModule,
  MatDialogModule,
  MatSortModule
} from '@angular/material';
import { MessagesComponent } from './messages/messages.component';
import { DeviceNotificationsComponent } from './device-notifications/device-notifications.component';
import { AlarmsViewComponent } from './alerts-view/alarms-view/alarms-view.component';

@NgModule({
  imports: [
    NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule,NbButtonModule,NbDatepickerModule,
    Ng2SmartTableModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    TablesRoutingModule,
    CommonModule,
    GraphsModule,
    SummaryModule,
    DeviceConfigModule,
    ProfileModule,
    NbSelectModule,
    NbCheckboxModule,
    NbToggleModule,
    MatDividerModule,
    MatListModule,
    NbAccordionModule,
    NbStepperModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSortModule,
    NbTabsetModule,
    HttpClientModule,
    NbTooltipModule,
    AgGridModule.withComponents([])
  ],
  declarations: [
    PagesComponent,
    DevicesListComponent,
    RegistrationDeviceComponent,
    ContactComponent,
    FsIconComponent,
    routedComponents,
    AlertsViewComponent,
    MessagesComponent,
    DeviceNotificationsComponent,
    AlarmsViewComponent,
  ],


})
export class PagesModule {
}
