import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { JpDMNoticeOfAbandonmentByReturnRoutingModule } from './jp-d-m-notice-of-abandonment-by-return-routing.module';
import { JpDUcmCNoticeOfAbandonmentByReturnComponent } from './jp-d-ucm-c-notice-of-abandonment-by-return/jp-d-ucm-c-notice-of-abandonment-by-return.component';

@NgModule({
  declarations: [JpDUcmCNoticeOfAbandonmentByReturnComponent],
  imports: [
    CommonModule,
    JpDMNoticeOfAbandonmentByReturnRoutingModule,
    SharedModule,
  ],
})
export class JpDMNoticeOfAbandonmentByReturnModule {}
