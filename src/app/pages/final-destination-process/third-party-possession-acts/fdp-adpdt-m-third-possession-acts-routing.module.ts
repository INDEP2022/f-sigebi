import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpAdpdtCThirdPossessionActsComponent } from './third-party-possession-acts/fdp-adpdt-c-third-possession-acts.component';

const routes: Routes = [
  {
    path: '',
    component: FdpAdpdtCThirdPossessionActsComponent,
    data: { Title: 'Actas de Posesión de Terceros' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpAdpdtMThirdPossessionActsRoutingModule {}
