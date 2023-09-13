import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { DevicesListComponent } from './devices-list/devices-list.component' ;
import { RegistrationDeviceComponent } from './registration-device/registration-device.component' ;
import { ContactComponent } from './contact/contact.component' ;
import { DevListResolverService } from '../services/dev-list-resolver.service';
import { GraphsComponent } from './graphs/graphs.component';
import { TempChartComponent } from './graphs/temp-chart/temp-chart.component';
import { GpiosChartComponent } from './graphs/gpios-chart/gpios-chart.component';
import { DataSamplesResolverService } from '../services/data-samples-resolver.service';
import { DataGpiosResolverService } from '../services/data-gpios-resolver.service';
import { ProfileComponent } from './profile/profile.component';
import { UserBranchResolverService } from '../services/user-branch-resolver.service';
import { SummaryComponent } from './summary/summary.component';
import { FreezeMonitorResolverService } from '../services/freeze-monitor-resolver.service';
import { AlertsViewComponent } from '../pages/alerts-view/alerts-view.component';
import { DeviceConfigComponent } from '../pages/device-config/device-config.component';
import { MessagesComponent } from '../pages/messages/messages.component';
import { CompressorActivationResolverService } from '../services/compressor-activation-resolver.service';
import { DeviceNotificationsComponent } from './device-notifications/device-notifications.component';
import { VoltageSamplesResolverService } from './graphs/services/voltage-samples-resolver.service';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'contact',
      component: ContactComponent,
    },
    {
      path: 'registration-device',
      component: RegistrationDeviceComponent,
    },
    {
      path: 'devices-list',
      component: DevicesListComponent,
      resolve: { devList : DevListResolverService }
    },
    {
      path: 'profile',
      component: ProfileComponent,
      resolve: { usersBranch : UserBranchResolverService }
    },
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'graphs',
      component: GraphsComponent,
      resolve: { samplesData : DataSamplesResolverService, gpiosData : DataGpiosResolverService, externalSource : VoltageSamplesResolverService }
    },
    {
      path: 'profile',
      component: ProfileComponent,
    },
    {
      path: 'summary',
      component: SummaryComponent,
      resolve: { samplesData : DataSamplesResolverService, 
        gpiosData : DataGpiosResolverService,
        compData : CompressorActivationResolverService, 
        fData : FreezeMonitorResolverService }
    },
    {
      path: 'alerts-view',
      component: AlertsViewComponent,
      resolve: { devList : DevListResolverService }
    },
    {
      path: 'device-config',
      component: DeviceConfigComponent,
      //resolve: { devList : DevListResolverService }
    },
    {
      path: 'messages',
      component: MessagesComponent,
      //resolve: { devList : DevListResolverService }
    },
    {
      path: 'device-notifications',
      component: DeviceNotificationsComponent,
    },
    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: 'forms',
      loadChildren: () => import('./forms/forms.module')
        .then(m => m.FormsModule),
    },
    {
      path: 'ui-features',
      loadChildren: () => import('./ui-features/ui-features.module')
        .then(m => m.UiFeaturesModule),
    },
    {
      path: 'modal-overlays',
      loadChildren: () => import('./modal-overlays/modal-overlays.module')
        .then(m => m.ModalOverlaysModule),
    },
    {
      path: 'extra-components',
      loadChildren: () => import('./extra-components/extra-components.module')
        .then(m => m.ExtraComponentsModule),
    },
    {
      path: 'maps',
      loadChildren: () => import('./maps/maps.module')
        .then(m => m.MapsModule),
    },
    {
      path: 'charts',
      loadChildren: () => import('./charts/charts.module')
        .then(m => m.ChartsModule),
    },
    {
      path: 'editors',
      loadChildren: () => import('./editors/editors.module')
        .then(m => m.EditorsModule),
    },
    {
      path: 'tables',
      loadChildren: () => import('./tables/tables.module')
        .then(m => m.TablesModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'devices-list',
     
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
