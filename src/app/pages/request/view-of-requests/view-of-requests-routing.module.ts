import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewTransferRequestComponent } from './new-transfer-request/new-transfer-request.component';
import { RequestListComponent } from './request-list/request-list.component';

const routes: Routes = [
  {
    path: '',
    component: RequestListComponent,
  },
  {
    path: 'new-transfer-request',
    component: NewTransferRequestComponent,
  },
  {
    path: 'new-transfer-request/:id',
    component: NewTransferRequestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewOfRequestsRoutingModule {}
