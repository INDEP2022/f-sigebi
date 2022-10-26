import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { RegistrationOfRequestsComponent } from '../transfer-request/registration-of-requests/registration-of-requests.component';

const routes: Routes = [
  {
    path: '',
    component: RequestListComponent,
  },
  {
    path: 'new-transfer-request',
    component: RequestFormComponent,
  },
  {
    path: 'registration-request/:id',
    component: RegistrationOfRequestsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewOfRequestsRoutingModule {}
