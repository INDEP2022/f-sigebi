import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThirdPossessionActsComponent } from './third-party-possession-acts/third-possession-acts.component';

const routes: Routes = [
  {
    path: '',
    component: ThirdPossessionActsComponent,
    data: { Title: 'Actas de Posesión de Terceros' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThirdPossessionActsRoutingModule {}
