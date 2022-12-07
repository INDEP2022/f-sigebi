import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpinionComponent } from './opinion/opinion.component';

const routes: Routes = [
  {
    path: '',
    component: OpinionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpinionRoutingModule {}
