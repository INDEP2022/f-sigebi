import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CPCCatFinancialInformationAttributesModalComponent } from './c-p-c-cat-financial-information-attributes-modal/c-p-c-cat-financial-information-attributes-modal.component';
import { CPCCatFinancialInformationAttributesComponent } from './c-p-c-cat-financial-information-attributes/c-p-c-cat-financial-information-attributes.component';
import { CPMCatFinancialInformationAttributesRoutingModule } from './c-p-m-cat-financial-information-attributes-routing.module';

@NgModule({
  declarations: [
    CPCCatFinancialInformationAttributesComponent,
    CPCCatFinancialInformationAttributesModalComponent,
  ],
  imports: [
    CommonModule,
    CPMCatFinancialInformationAttributesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMCatFinancialInformationAttributesModule {}
