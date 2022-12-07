import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { NoticeOfAbandonmentByReturnRoutingModule } from './notice-of-abandonment-by-return-routing.module';
import { NoticeOfAbandonmentByReturnComponent } from './notice-of-abandonment-by-return/notice-of-abandonment-by-return.component';

@NgModule({
  declarations: [NoticeOfAbandonmentByReturnComponent],
  imports: [
    CommonModule,
    NoticeOfAbandonmentByReturnRoutingModule,
    SharedModule,
  ],
})
export class NoticeOfAbandonmentByReturnModule {}
