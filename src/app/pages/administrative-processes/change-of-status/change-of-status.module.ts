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
import { ChangeOfStatusRoutingModule } from './change-of-status-routing.module';
import { ChangeOfStatusComponent } from './change-of-status/change-of-status.component';
import { ModalChangeComponent } from './modal-change/modal-change.component';

@NgModule({
  declarations: [ChangeOfStatusComponent, ModalChangeComponent],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    ChangeOfStatusRoutingModule,
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
export class ChangeOfStatusModule {}
