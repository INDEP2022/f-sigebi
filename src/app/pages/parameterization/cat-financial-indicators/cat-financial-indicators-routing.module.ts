import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatFinancialIndicatorsComponent } from './cat-financial-indicators/cat-financial-indicators.component';

const routes: Routes = [
  {
    path: '',
    component: CatFinancialIndicatorsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatFinancialIndicatorsRoutingModule {}
