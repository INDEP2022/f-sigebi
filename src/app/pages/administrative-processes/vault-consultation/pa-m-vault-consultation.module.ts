import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';

//Components
import { PaMVaultConsultationRoutingModule } from './pa-m-vault-consultation-routing.module';
import { PaVcCVaultConsultationComponent } from './pa-vc-c-vault-consultation/pa-vc-c-vault-consultation.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { PaVcCModalListGoodsComponent } from './pa-vc-c-modal-list-goods/pa-vc-c-modal-list-goods.component';

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
