import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { CBmRRrprCRemittancesRecordedRegionComponent } from './c-bm-r-rrpr-c-remittances-recorded-region/c-bm-r-rrpr-c-remittances-recorded-region.component';
import { CBmRRrprMRemittancesRecordedRegionRoutingModule } from './c-bm-r-rrpr-m-remittances-recorded-region-routing.module';

@NgModule({
  declarations: [CBmRRrprCRemittancesRecordedRegionComponent],
  imports: [
    CommonModule,
    CBmRRrprMRemittancesRecordedRegionRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    PreviewDocumentsComponent,
  ],
})
export class CBmRRrprMRemittancesRecordedRegionModule {}
