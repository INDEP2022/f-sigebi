import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { RemittancesRecordedRegionRoutingModule } from './remittances-recorded-region-routing.module';
import { RemittancesRecordedRegionComponent } from './remittances-recorded-region/remittances-recorded-region.component';

@NgModule({
  declarations: [RemittancesRecordedRegionComponent],
  imports: [
    CommonModule,
    RemittancesRecordedRegionRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    PreviewDocumentsComponent,
  ],
})
export class RemittancesRecordedRegionModule {}
