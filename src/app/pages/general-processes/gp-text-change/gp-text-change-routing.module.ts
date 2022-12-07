import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpTextChangeComponent } from './gp-text-change/gp-text-change.component';

const routes: Routes = [
  {
    path: '',
    component: GpTextChangeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpTextChangeRoutingModule {}
