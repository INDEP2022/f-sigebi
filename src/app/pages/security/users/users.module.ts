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
import { UsersRoutingModule } from './users-routing.module';

/** COMPONENTS IMPORTS */
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    TabsModule,
    SharedComponentsSecurityModule,
  ],
})
export class UsersModule {}
