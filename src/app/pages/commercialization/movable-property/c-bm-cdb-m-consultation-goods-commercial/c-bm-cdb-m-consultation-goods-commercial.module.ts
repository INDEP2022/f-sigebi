import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

import { ExcelService } from 'src/app/common/services/excel.service';

import { CBmCdbCConsultationGoodsCommercialBillsComponent } from './c-bm-cdb-c-consultation-goods-commercial-bills/c-bm-cdb-c-consultation-goods-commercial-bills.component';
import { CBmCdbCConsultationGoodsCommercialSalesComponent } from './c-bm-cdb-c-consultation-goods-commercial-sales/c-bm-cdb-c-consultation-goods-commercial-sales.component';
import { CBmCdbMConsultationGoodsCommercialRoutingModule } from './c-bm-cdb-m-consultation-goods-commercial-routing.module';

@NgModule({
  declarations: [
    CBmCdbCConsultationGoodsCommercialSalesComponent,
    CBmCdbCConsultationGoodsCommercialBillsComponent,
  ],
  imports: [
    CommonModule,
    CBmCdbMConsultationGoodsCommercialRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
  exports: [
    CBmCdbCConsultationGoodsCommercialSalesComponent,
    CBmCdbCConsultationGoodsCommercialBillsComponent,
  ],
  providers: [ExcelService],
})
export class CBmCdbMConsultationGoodsCommercialModule {}
