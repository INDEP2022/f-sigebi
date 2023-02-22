import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationAssociationRoutingModule } from './notification-association-routing.module';
import { NotificationAssociationComponent } from './notification-association/notification-association.component';

@NgModule({
  declarations: [NotificationAssociationComponent],
  imports: [CommonModule, NotificationAssociationRoutingModule, SharedModule],
})
export class NotificationAssociationModule {}
