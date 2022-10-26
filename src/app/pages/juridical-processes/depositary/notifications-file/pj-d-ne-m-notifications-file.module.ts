/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDNENotificationsFileRoutingModule } from './pj-d-ne-m-notifications-file-routing.module';

/** COMPONENTS IMPORTS */
import { PJDNENotificationsFileComponent } from './notifications-file/pj-d-ne-c-notifications-file.component';

@NgModule({
  declarations: [PJDNENotificationsFileComponent],
  imports: [CommonModule, PJDNENotificationsFileRoutingModule, SharedModule],
})
export class PJDNENotificationsFileModule {}
