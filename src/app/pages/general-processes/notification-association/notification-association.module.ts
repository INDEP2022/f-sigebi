import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InputCellComponent } from 'src/app/@standalone/smart-table/input-cell/input-cell.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationAssociationRoutingModule } from './notification-association-routing.module';
import { NotificationAssociationComponent } from './notification-association/notification-association.component';

@NgModule({
  declarations: [NotificationAssociationComponent],
  imports: [
    CommonModule,
    NotificationAssociationRoutingModule,
    SharedModule,
    InputCellComponent,
  ],
})
export class NotificationAssociationModule {}
