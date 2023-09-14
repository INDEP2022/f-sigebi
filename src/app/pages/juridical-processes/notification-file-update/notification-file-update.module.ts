/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { NotificationFileUpdateRoutingModule } from './notification-file-update-routing.module';

/** COMPONENTS IMPORTS */
import { EditFormComponent } from './edit-form/edit-form.component';
import { NotificationFileUpdateComponent } from './notification-file-update/notification-file-update.component';

@NgModule({
  declarations: [NotificationFileUpdateComponent, EditFormComponent],
  imports: [
    CommonModule,
    NotificationFileUpdateRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class NotificationFileUpdateModule {}
