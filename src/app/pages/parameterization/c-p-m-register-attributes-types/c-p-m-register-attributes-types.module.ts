import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { CPCRegisterAttributesTypesModalComponent } from './c-p-c-register-attributes-types-modal/c-p-c-register-attributes-types-modal.component';
import { CPCRegisterAttributesTypesComponent } from './c-p-c-register-attributes-types/c-p-c-register-attributes-types.component';
import { CPMRegisterAttributesTypesRoutingModule } from './c-p-m-register-attributes-types-routing.module';

@NgModule({
  declarations: [
    CPCRegisterAttributesTypesComponent,
    CPCRegisterAttributesTypesModalComponent,
  ],
  imports: [
    CommonModule,
    CPMRegisterAttributesTypesRoutingModule,
    SharedModule,
    GoodsTypesSharedComponent,
    ModalModule.forChild(),
  ],
})
export class CPMRegisterAttributesTypesModule {}
