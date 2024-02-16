import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';

import { EditValidationExemptedGoodsModalComponent } from './edit-validation-exempted-goods-modal/edit-validation-exempted-goods-modal.component';
import { NewValidationExemptedGoodModalComponent } from './new-validation-exempted-goods-modal/new-validation-exempted-goods-modal.component';
import { ValidationExemptedGoodsRoutingModule } from './validation-exempted-goods-routing.module';
import { ValidationExemptedGoodsComponent } from './validation-exempted-goods/validation-exempted-goods.component';
import { ValidationExemptedListComponent } from './validation-exempted-goods/validation-exempted/validation-exempted.component';

@NgModule({
  declarations: [
    ValidationExemptedGoodsComponent,
    ValidationExemptedListComponent,
    EditValidationExemptedGoodsModalComponent,
    NewValidationExemptedGoodModalComponent,
  ],
  imports: [
    CommonModule,
    ValidationExemptedGoodsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class ValidationExemptedGoodsModule {}
