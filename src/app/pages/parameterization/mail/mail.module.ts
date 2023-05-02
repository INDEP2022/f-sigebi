import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from 'src/app/shared/shared.module';
import { MailModalComponent } from './mail-modal/mail-modal.component';
import { MailRoutingModule } from './mail-routing.module';
import { MailComponent } from './mail/mail.component';

@NgModule({
  declarations: [MailComponent, MailModalComponent],
  imports: [
    CommonModule,
    MailRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class MailModule {}
