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
import { PaMChangeOfStatusRoutingModule } from './pa-m-change-of-status-routing.module';
import { PaCsCChangeOfStatusComponent } from './pa-cs-c-change-of-status/pa-cs-c-change-of-status.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { PaCsCModalChangeComponent } from './pa-cs-c-modal-change/pa-cs-c-modal-change.component';

@NgModule({
  declarations: [PaCsCChangeOfStatusComponent, PaCsCModalChangeComponent],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    PaMChangeOfStatusRoutingModule,
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
export class PaMChangeOfStatusModule {}
