import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransferorsListComponent } from './transferors-list/transferors-list.component';

const routes: Routes = [
  {
    path: '',
    component: TransferorsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferorsRoutingModule {}
