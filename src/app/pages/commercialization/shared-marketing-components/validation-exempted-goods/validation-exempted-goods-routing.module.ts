import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidationExemptedGoodsComponent } from './validation-exempted-goods/validation-exempted-goods.component';

const routes: Routes = [
  {
    path: '',
    component: ValidationExemptedGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidationExemptedGoodsRoutingModule {}
