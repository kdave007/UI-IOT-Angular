import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DevListResolverService } from './services/dev-list-resolver.service';

import { NbAuthComponent } from './@theme/components/auth/components/auth.component';
import { NbLoginComponent } from './@theme/components/auth/components/login/login.component';
import { NbRegisterComponent } from './@theme/components/auth/components/register/register.component';
import { NbLogoutComponent } from './@theme/components/auth/components/logout/logout.component';
import { NbRequestPasswordComponent } from './@theme/components/auth/components/request-password/request-password.component';
import { NbResetPasswordComponent } from './@theme/components/auth/components/reset-password/reset-password.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: 'pages',
    canActivate: [AuthGuardService],
    loadChildren: () => import('app/pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
  providers: [DevListResolverService]
})
export class AppRoutingModule {
}
