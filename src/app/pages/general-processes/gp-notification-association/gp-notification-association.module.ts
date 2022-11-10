import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GpNotificationAssociationRoutingModule } from './gp-notification-association-routing.module';
import { GpNotificationAssociationComponent } from './gp-notification-association/gp-notification-association.component';

@NgModule({
  declarations: [GpNotificationAssociationComponent],
  imports: [CommonModule, GpNotificationAssociationRoutingModule, SharedModule],
})
export class GpNotificationAssociationModule {}
