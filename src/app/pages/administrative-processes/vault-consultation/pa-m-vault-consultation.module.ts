import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from 'src/app/shared/shared.module';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

//Components
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { PaMVaultConsultationRoutingModule } from './pa-m-vault-consultation-routing.module';
import { PaVcCModalListGoodsComponent } from './pa-vc-c-modal-list-goods/pa-vc-c-modal-list-goods.component';
import { PaVcCVaultConsultationComponent } from './pa-vc-c-vault-consultation/pa-vc-c-vault-consultation.component';

@NgModule({
  declarations: [PaVcCVaultConsultationComponent, PaVcCModalListGoodsComponent],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    PaMVaultConsultationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDropdownModule,
    BsDatepickerModule,
    TabsModule,
    ModalModule.forChild(),
    GoodsTypesSharedComponent,
  ],
})
export class PaMVaultConsultationModule {}
