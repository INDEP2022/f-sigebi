import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpAddCReturnActsComponent } from './return-acts/fdp-add-c-return-acts.component';

const routes: Routes = [
  {
    path: "",
    component: FdpAddCReturnActsComponent,
    data: { Title: 'Actas de Devolución' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdpAddMReturnActsRoutingModule { }
