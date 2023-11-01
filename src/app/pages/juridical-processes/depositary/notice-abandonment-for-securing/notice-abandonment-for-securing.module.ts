import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NoticeAbandonmentForSecuringRoutingModule } from './notice-abandonment-for-securing-routing.module';

import { NoticeAbandonmentForSecuringModalComponent } from './notice-abandonment-for-securing/notice-abandonment-for-securing-modal/notice-abandonment-for-securing-modal.component';
import { NoticeAbandonmentForSecuringComponent } from './notice-abandonment-for-securing/notice-abandonment-for-securing.component';

@NgModule({
  declarations: [
    NoticeAbandonmentForSecuringComponent,
    NoticeAbandonmentForSecuringModalComponent,
  ],
  imports: [
    CommonModule,
    NoticeAbandonmentForSecuringRoutingModule,
    SharedModule,
  ],
})
export class NoticeAbandonmentForSecuringModule {}
