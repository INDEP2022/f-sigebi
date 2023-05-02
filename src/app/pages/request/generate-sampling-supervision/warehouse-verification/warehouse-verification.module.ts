import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedComponentGssModule } from '../shared-component-gss/shared-component-gss.module';
import { VerificationWarehouseAssetsComponent } from './verification-warehouse-assets/verification-warehouse-assets.component';
import { WarehouseVerificationRoutingModule } from './warehouse-verification-routing.module';

@NgModule({
  declarations: [VerificationWarehouseAssetsComponent],
  imports: [
    CommonModule,
    WarehouseVerificationRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    TabsModule,
    SharedComponentGssModule,
  ],
})
export class WarehouseVerificationModule {}
