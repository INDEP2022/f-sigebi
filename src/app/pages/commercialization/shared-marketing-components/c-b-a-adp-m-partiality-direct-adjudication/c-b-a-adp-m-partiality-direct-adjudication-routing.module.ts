import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBAAdpCPartialityDirectAdjudicationMainComponent } from './c-b-a-adp-c-partiality-direct-adjudication-main/c-b-a-adp-c-partiality-direct-adjudication-main.component';

const routes: Routes = [
  {
    path: '',
    component: CBAAdpCPartialityDirectAdjudicationMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBAAdpMPartialityDirectAdjudicationRoutingModule {}
