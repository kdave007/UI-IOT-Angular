import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountViewComponent } from './account-view/account-view.component';
import { ThemeModule } from '../../@theme/theme.module';
import { OrganizerComponent } from './organizer/organizer.component';
import { ProfileComponent } from './profile.component';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbButtonModule, NbTabsetModule, NbStepperModule, NbCheckboxModule, NbAccordionModule, NbToggleModule, NbTooltipModule } from '@nebular/theme';
import { EditWindowComponent } from './organizer/edit-window/edit-window.component';
import { NbWindowModule, NbAlertModule } from '@nebular/theme';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule }   from '@angular/forms';

import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatIconModule,
  MatSelectModule,
  MatDividerModule
} from '@angular/material';
import { UserImageComponent } from './user-image/user-image.component';
import { AccessComponent } from './access/access.component';
import { UserPermissonsComponent } from './user-permissons/user-permissons.component';
import { UsersSelectionComponent } from './users-selection/users-selection.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { OtherUserSettingsComponent } from './other-user-settings/other-user-settings.component';

@NgModule({
  declarations: [
    ProfileComponent,
    AccountViewComponent,
    OrganizerComponent,
    EditWindowComponent,
    UserImageComponent,
    AccessComponent,
    UserPermissonsComponent,
    UsersSelectionComponent,
    OtherUserSettingsComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    NbButtonModule,
    ThemeModule,
    NbTabsetModule,
    NgMultiSelectDropDownModule.forRoot(),
    NbWindowModule.forChild(),
    NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbAlertModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatIconModule,
    MatSelectModule,
    NbStepperModule,
    MatDividerModule,
    NbCheckboxModule,
    NbAccordionModule,
    NbToggleModule,
    NbTooltipModule,
    Ng2SmartTableModule
  ],
  schemas:[NO_ERRORS_SCHEMA],
  entryComponents: [EditWindowComponent],
})
export class ProfileModule { }
