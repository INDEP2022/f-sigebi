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

import { PaMChangeOfStatusStiRoutingModule } from './pa-m-change-of-status-sti-routing.module';
import { PaCsCChangeOfStatusStiComponent } from './pa-cs-c-change-of-status-sti/pa-cs-c-change-of-status-sti.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';

@NgModule({
  declarations: [PaCsCChangeOfStatusStiComponent],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    PaMChangeOfStatusStiRoutingModule,
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
export class PaMChangeOfStatusStiModule {}
