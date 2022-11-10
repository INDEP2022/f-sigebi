/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { SharedComponentsSecurityModule } from '../shared-components-security/shared-components-security.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { SUsersRoutingModule } from './s-m-users-routing.module';

/** COMPONENTS IMPORTS */
import { SUsersComponent } from './users/s-c-users.component';

@NgModule({
  declarations: [SUsersComponent],
  imports: [
    CommonModule,
    SUsersRoutingModule,
    SharedModule,
    TabsModule,
    SharedComponentsSecurityModule,
  ],
})
export class SUsersModule {}
