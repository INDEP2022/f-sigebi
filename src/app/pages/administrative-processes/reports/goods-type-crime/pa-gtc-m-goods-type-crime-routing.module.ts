import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaGtcrCGoodsTypeCrimeReportsComponent } from './goods-type-crime-reports/pa-gtcr-c-goods-type-crime-reports.component';

const routes: Routes = [
  {
    path: '',
    component: PaGtcrCGoodsTypeCrimeReportsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaGtcMGoodsTypeCrimeRoutingModule {}
