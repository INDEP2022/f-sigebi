import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MassiveNumeraryChangeComponent } from './massive-numerary-change/massive-numerary-change.component';

const routes: Routes = [
  {
    path: '',
    component: MassiveNumeraryChangeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MassiveNumeraryChangeRoutingModule {}
