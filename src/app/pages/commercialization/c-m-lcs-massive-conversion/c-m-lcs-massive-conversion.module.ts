import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { CMLcsMassiveConversionRoutingModule } from './c-m-lcs-massive-conversion-routing.module';
import { CMLcsMassiveConversionMainComponent } from './c-m-lcs-massive-conversion-main/c-m-lcs-massive-conversion-main.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TableCheckboxComponent } from './components/table-checkbox/table-checkbox.component';
import { AddLcModalComponent } from './components/add-lc-modal/add-lc-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    CMLcsMassiveConversionMainComponent,
    TableCheckboxComponent,
    AddLcModalComponent,
  ],
  imports: [
    CommonModule,
    CMLcsMassiveConversionRoutingModule,
    SharedModule,
    TabsModule,
    CollapseModule.forRoot(),
    ModalModule.forChild(),
    BsDatepickerModule.forRoot(),
  ],
})
export class CMLcsMassiveConversionModule {}
