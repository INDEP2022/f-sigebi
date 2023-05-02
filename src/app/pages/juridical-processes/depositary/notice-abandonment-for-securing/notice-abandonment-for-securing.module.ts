import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NoticeAbandonmentForSecuringRoutingModule } from './notice-abandonment-for-securing-routing.module';

import { NoticeAbandonmentForSecuringComponent } from './notice-abandonment-for-securing/notice-abandonment-for-securing.component';

@NgModule({
  declarations: [NoticeAbandonmentForSecuringComponent],
  imports: [
    CommonModule,
    NoticeAbandonmentForSecuringRoutingModule,
    SharedModule,
  ],
})
export class NoticeAbandonmentForSecuringModule {}
