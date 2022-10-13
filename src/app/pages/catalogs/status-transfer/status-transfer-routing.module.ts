import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusTransferListComponent } from './status-transfer-list/status-transfer-list.component';

const routes: Routes = [
  {
    path: '',
    component: StatusTransferListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusTransferRoutingModule {}
