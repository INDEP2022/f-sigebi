import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrFlatFileNotificationsRoutingModule } from './dr-flat-file-notifications-routing.module';
import { DrFlatFileNotificationsComponent } from './dr-flat-file-notifications/dr-flat-file-notifications.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

@NgModule({
  declarations: [DrFlatFileNotificationsComponent],
  imports: [
    CommonModule,
    DrFlatFileNotificationsRoutingModule,
    SharedModule,
    DelegationSharedComponent,
  ],
})
export class DrFlatFileNotificationsModule {}
