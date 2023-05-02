import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { RegisterAttributesTypesModalComponent } from './register-attributes-types-modal/register-attributes-types-modal.component';
import { RegisterAttributesTypesRoutingModule } from './register-attributes-types-routing.module';
import { RegisterAttributesTypesComponent } from './register-attributes-types/register-attributes-types.component';

@NgModule({
  declarations: [
    RegisterAttributesTypesComponent,
    RegisterAttributesTypesModalComponent,
  ],
  imports: [
    CommonModule,
    RegisterAttributesTypesRoutingModule,
    SharedModule,
    GoodsTypesSharedComponent,
    ModalModule.forChild(),
  ],
})
export class RegisterAttributesTypesModule {}
