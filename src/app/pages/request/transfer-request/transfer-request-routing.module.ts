import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationOfRequestsComponent } from './registration-of-requests/registration-of-requests.component';

const routes: Routes = [
  {
    path: 'registration-request/:id/:task',
    component: RegistrationOfRequestsComponent,
    data: {
      process: 'registration-request',
    },
  },
  {
    path: 'verify-compliance/:id/:task',
    component: RegistrationOfRequestsComponent,
    data: {
      process: 'verify-compliance',
    },
  },
  {
    path: 'classify-assets/:id/:task',
    component: RegistrationOfRequestsComponent,
    data: {
      process: 'classify-assets',
    },
  },
  {
    path: 'validate-document/:id/:task',
    component: RegistrationOfRequestsComponent,
    data: {
      process: 'validate-document',
    },
  },
  {
    path: 'notify-clarification-inadmissibility/:id/:task',
    component: RegistrationOfRequestsComponent,
    data: {
      process: 'notify-clarification-inadmissibility',
    },
  },
  {
    path: 'process-approval/:id/:task',
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
