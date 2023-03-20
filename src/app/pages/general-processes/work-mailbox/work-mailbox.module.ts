import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
//@Standalone Components
import { ManagementAreaSharedComponent } from 'src/app/@standalone/shared-forms/management-area-shared/management-area-shared.component';

import { WorkMailboxRoutingModule } from './work-mailbox-routing.module';
import { WorkMailboxComponent } from './work-mailbox/work-mailbox.component';

@NgModule({
  declarations: [WorkMailboxComponent],
  imports: [
    CommonModule,
    WorkMailboxRoutingModule,
    SharedModule,
    ManagementAreaSharedComponent,
  ],
})
export class WorkMailboxModule {}
