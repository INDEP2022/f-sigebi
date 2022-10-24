import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';

import { CBBedvCValidationExemptedGoodsComponent } from './c-b-bedv-c-validation-exempted-goods/c-b-bedv-c-validation-exempted-goods.component';
import { CBBedvMValidationExemptedGoodsRoutingModule } from './c-b-bedv-m-validation-exempted-goods-routing.module';
import { EditValidationExemptedGoodsModalComponent } from './edit-validation-exempted-goods-modal/edit-validation-exempted-goods-modal.component';

@NgModule({
  declarations: [
    CBBedvCValidationExemptedGoodsComponent,
    EditValidationExemptedGoodsModalComponent,
  ],
  imports: [
    CommonModule,
    CBBedvMValidationExemptedGoodsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CBBedvMValidationExemptedGoodsModule {}
