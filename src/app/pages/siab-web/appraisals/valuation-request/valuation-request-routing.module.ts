import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { valuationRequestComponent } from './valuation-request/valuation-request.component';

const routes: Routes = [
  {
    path: '',
    component: valuationRequestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class valuationRequestRoutingModule {}
