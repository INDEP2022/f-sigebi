import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NumeraryHistoricalClosingComponent } from './numerary-historical-closing/numerary-historical-closing.component';

const routes: Routes = [
  {
    path: '',
    component: NumeraryHistoricalClosingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NumeraryHistoricalClosingRoutingModule {}
