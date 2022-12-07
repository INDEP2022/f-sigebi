import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartialityDirectAdjudicationMainComponent } from './partiality-direct-adjudication-main/partiality-direct-adjudication-main.component';

const routes: Routes = [
  {
    path: '',
    component: PartialityDirectAdjudicationMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartialityDirectAdjudicationRoutingModule {}
