/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJAENNotificationFileUpdateRoutingModule } from './pj-aen-m-notification-file-update-routing.module';

/** COMPONENTS IMPORTS */
import { PJAENNotificationFileUpdateComponent } from './notification-file-update/pj-aen-c-notification-file-update.component';

@NgModule({
  declarations: [PJAENNotificationFileUpdateComponent],
  imports: [
    CommonModule,
    PJAENNotificationFileUpdateRoutingModule,
    SharedModule,
  ],
})
export class PJAENNotificationFileUpdateModule {}
