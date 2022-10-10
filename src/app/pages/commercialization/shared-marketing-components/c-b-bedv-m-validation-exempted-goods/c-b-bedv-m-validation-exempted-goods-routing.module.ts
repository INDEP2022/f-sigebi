import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBBedvCValidationExemptedGoodsComponent } from './c-b-bedv-c-validation-exempted-goods/c-b-bedv-c-validation-exempted-goods.component';

const routes: Routes = [
  {
    path: '',
    component: CBBedvCValidationExemptedGoodsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CBBedvMValidationExemptedGoodsRoutingModule { }
