import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GpWorkMailboxRoutingModule } from './gp-work-mailbox-routing.module';
import { GpWorkMailboxComponent } from './gp-work-mailbox/gp-work-mailbox.component';

@NgModule({
  declarations: [GpWorkMailboxComponent],
  imports: [CommonModule, GpWorkMailboxRoutingModule, SharedModule],
})
export class GpWorkMailboxModule {}
