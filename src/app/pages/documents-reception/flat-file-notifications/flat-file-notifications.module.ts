import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DrFlatFileNotificationsRoutingModule } from './flat-file-notifications-routing.module';
import { FlatFileNotificationsComponent } from './flat-file-notifications/flat-file-notifications.component';

@NgModule({
  declarations: [FlatFileNotificationsComponent],
  imports: [
    CommonModule,
    DrFlatFileNotificationsRoutingModule,
    SharedModule,
    DelegationSharedComponent,
  ],
})
export class FlatFileNotificationsModule {}
