import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CatFinancialInformationAttributesModalComponent } from './cat-financial-information-attributes-modal/cat-financial-information-attributes-modal.component';
import { CatFinancialInformationAttributesRoutingModule } from './cat-financial-information-attributes-routing.module';
import { CatFinancialInformationAttributesComponent } from './cat-financial-information-attributes/cat-financial-information-attributes.component';

@NgModule({
  declarations: [
    CatFinancialInformationAttributesComponent,
    CatFinancialInformationAttributesModalComponent,
  ],
  imports: [
    CommonModule,
    CatFinancialInformationAttributesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CatFinancialInformationAttributesModule {}
