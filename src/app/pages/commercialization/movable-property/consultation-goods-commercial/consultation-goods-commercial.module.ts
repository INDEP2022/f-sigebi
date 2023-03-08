import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

import { ExcelService } from 'src/app/common/services/excel.service';

import { ConsultationGoodsCommercialBillsComponent } from './consultation-goods-commercial-bills/consultation-goods-commercial-bills.component';
import { ConsultationGoodsCommercialRoutingModule } from './consultation-goods-commercial-routing.module';
import { ConsultationGoodsCommercialSalesComponent } from './consultation-goods-commercial-sales/consultation-goods-commercial-sales.component';

@NgModule({
  declarations: [
    ConsultationGoodsCommercialSalesComponent,
    ConsultationGoodsCommercialBillsComponent,
  ],
  imports: [
    CommonModule,
    ConsultationGoodsCommercialRoutingModule,
    SharedModule,

    BsDatepickerModule,
  ],
  exports: [
    ConsultationGoodsCommercialSalesComponent,
    ConsultationGoodsCommercialBillsComponent,
  ],
  providers: [ExcelService],
})
export class ConsultationGoodsCommercialModule {}
