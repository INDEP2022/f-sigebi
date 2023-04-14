/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { NotificationsFileRoutingModule } from './notifications-file-routing.module';

/** COMPONENTS IMPORTS */
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { NotificationsFileComponent } from './notifications-file/notifications-file.component';

@NgModule({
  declarations: [NotificationsFileComponent],
  imports: [
    CommonModule,
    NotificationsFileRoutingModule,
    SharedModule,
    FormLoaderComponent,
  ],
})
export class NotificationsFileModule {}
