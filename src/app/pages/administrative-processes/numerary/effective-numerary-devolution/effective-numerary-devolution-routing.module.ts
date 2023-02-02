import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectiveNumeraryDevolutionComponent } from './effective-numerary-devolution/effective-numerary-devolution.component';

const routes: Routes = [
  {
    path: '',
    component: EffectiveNumeraryDevolutionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EffectiveNumeraryDevolutionRoutingModule {}
