/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbChatModule,NbDatepickerModule,NbDialogModule,NbMenuModule,NbSidebarModule,NbToastrModule,NbWindowModule,NbAlertModule,
} from '@nebular/theme';
import { RegistrationDeviceComponent } from './registration-device/registration-device.component';
import { DevicesComponent } from './devices/devices.component';
import { GraphsModule } from './pages/graphs/graphs.module';
import { DevListResolverService } from './services/dev-list-resolver.service';
import { AuthenUserComponent } from './authen-user/authen-user.component';
import { UserLoginComponent } from './authen-user/user-login/user-login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CookieService } from 'ngx-cookie-service';

import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatIconModule
} from '@angular/material';
import { UnauthorizedService } from './interceptors/unauthorized.service';
import { DevicesModule } from './devices/devices.module';

import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [
    AppComponent, 
    RegistrationDeviceComponent, 
    AuthenUserComponent, UserLoginComponent,     
  ],
  imports: [
    FormsModule ,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbAlertModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatIconModule,
    DevicesModule,
    ThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgxPermissionsModule.forRoot()
  ],
  bootstrap: [AppComponent],
  providers:[
    DevListResolverService,
    AuthGuardService,
    CookieService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass:UnauthorizedService, multi:true}
  ]
})
export class AppModule {
}
