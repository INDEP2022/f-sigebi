import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';


import { CBBedvMValidationExemptedGoodsRoutingModule } from './c-b-bedv-m-validation-exempted-goods-routing.module';
import { CBBedvCValidationExemptedGoodsComponent } from './c-b-bedv-c-validation-exempted-goods/c-b-bedv-c-validation-exempted-goods.component';


@NgModule({
  declarations: [
    CBBedvCValidationExemptedGoodsComponent
  ],
  imports: [
    CommonModule,
    CBBedvMValidationExemptedGoodsRoutingModule,
    SharedModule
  ]
})
export class CBBedvMValidationExemptedGoodsModule { }
