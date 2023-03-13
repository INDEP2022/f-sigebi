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
import { GoodsStatusSharedComponent } from 'src/app/@standalone/shared-forms/goods-status-shared/goods-status-shared.component';
import { MassiveChangeStatusRoutingModule } from './massive-change-status-routing.module';
import { MassiveChangeStatusComponent } from './massive-change-status/massive-change-status.component';

@NgModule({
  declarations: [MassiveChangeStatusComponent],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    MassiveChangeStatusRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDropdownModule,
    BsDatepickerModule,
    TabsModule,
    ModalModule.forChild(),
    GoodsStatusSharedComponent,
  ],
})
export class MassiveChangeStatusModule {}
