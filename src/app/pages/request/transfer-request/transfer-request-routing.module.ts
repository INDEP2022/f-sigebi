import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationOfRequestsComponent } from './registration-of-requests/registration-of-requests.component';
import { NotificationAssetsTabComponent } from './tabs/notify-clarifications-impropriety-tabs-component/notification-assets-tab/notification-assets-tab.component';

const routes: Routes = [
  {
    path: 'registration-request/:id',
    component: RegistrationOfRequestsComponent,
    data: {
      process: 'registration-request',
    },
  },
  {
    path: 'verify-compliance/:id',
    component: RegistrationOfRequestsComponent,
    data: {
      process: 'verify-compliance',
    },
  },
  {
    path: 'classify-assets/:id',
    component: RegistrationOfRequestsComponent,
    data: {
      process: 'classify-assets',
    },
  },
  {
    path: 'validate-document/:id',
    component: RegistrationOfRequestsComponent,
    data: {
      process: 'validate-document',
    },
  },
  {
    path: 'notify-clarification-inadmissibility/:id',
    component: NotificationAssetsTabComponent,
    data: {
      process: 'notify-clarification-inadmissibility',
    },
  },
  {
    path: 'process-approval/:id',
    component: RegistrationOfRequestsComponent,
    data: {
      process: 'process-approval',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferRequestRoutingModule {}
