import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddLcModalComponent } from './components/add-lc-modal/add-lc-modal.component';
import { TableCheckboxComponent } from './components/table-checkbox/table-checkbox.component';
import { MassiveConversionMainComponent } from './massive-conversion-main/massive-conversion-main.component';
import { MassiveConversionRoutingModule } from './massive-conversion-routing.module';

@NgModule({
  declarations: [
    MassiveConversionMainComponent,
    TableCheckboxComponent,
    AddLcModalComponent,
  ],
  imports: [
    CommonModule,
    MassiveConversionRoutingModule,
    SharedModule,
    TabsModule,
    CollapseModule.forRoot(),
    ModalModule.forChild(),
    BsDatepickerModule.forRoot(),
  ],
})
export class MassiveConversionModule {}
