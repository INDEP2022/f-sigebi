import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkMailboxRoutingModule } from './work-mailbox-routing.module';
import { WorkMailboxComponent } from './work-mailbox/work-mailbox.component';

@NgModule({
  declarations: [WorkMailboxComponent],
  imports: [CommonModule, WorkMailboxRoutingModule, SharedModule],
})
export class WorkMailboxModule {}
