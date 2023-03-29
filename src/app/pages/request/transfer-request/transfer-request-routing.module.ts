import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationOfRequestsComponent } from './registration-of-requests/registration-of-requests.component';

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
  },
  {
    path: 'notify-clarification-inadmissibility/:id',
    component: RegistrationOfRequestsComponent,
  },
  {
    path: 'process-approval/:id',
    component: RegistrationOfRequestsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferRequestRoutingModule {}
