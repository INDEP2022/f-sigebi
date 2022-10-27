import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpNotificationAssociationRoutingModule } from './gp-notification-association-routing.module';
import { GpNotificationAssociationComponent } from './gp-notification-association/gp-notification-association.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [GpNotificationAssociationComponent],
  imports: [CommonModule, GpNotificationAssociationRoutingModule, SharedModule],
})
export class GpNotificationAssociationModule {}
