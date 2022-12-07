/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { NotificationFileUpdateRoutingModule } from './notification-file-update-routing.module';

/** COMPONENTS IMPORTS */
import { NotificationFileUpdateComponent } from './notification-file-update/notification-file-update.component';

@NgModule({
  declarations: [NotificationFileUpdateComponent],
  imports: [CommonModule, NotificationFileUpdateRoutingModule, SharedModule],
})
export class NotificationFileUpdateModule {}
