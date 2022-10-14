import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ExcelService } from 'src/app/common/services/exportToExcel.service';

import { CBmCdbMConsultationGoodsCommercialRoutingModule } from './c-bm-cdb-m-consultation-goods-commercial-routing.module';
import { CBmCdbCConsultationGoodsCommercialSalesComponent } from './c-bm-cdb-c-consultation-goods-commercial-sales/c-bm-cdb-c-consultation-goods-commercial-sales.component';
import { CBmCdbCConsultationGoodsCommercialBillsComponent } from './c-bm-cdb-c-consultation-goods-commercial-bills/c-bm-cdb-c-consultation-goods-commercial-bills.component';

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
