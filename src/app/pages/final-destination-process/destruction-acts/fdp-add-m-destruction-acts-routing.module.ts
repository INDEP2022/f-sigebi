import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpAddCDestructionActsComponent } from './destruction-acts/fdp-add-c-destruction-acts.component';

const routes: Routes = [
  {
    path: '',
    component: FdpAddCDestructionActsComponent,
    data: { Title: 'Actas de destrucción' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpAddMDestructionActsRoutingModule {}
