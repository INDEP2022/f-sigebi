import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoordinationComponent } from './coordination/coordination.component';

const routes: Routes = [
  {
    path: '',
    component: CoordinationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoordinationRoutingModule {}
