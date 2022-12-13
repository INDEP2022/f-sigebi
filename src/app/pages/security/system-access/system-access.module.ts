/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { SystemAccessRoutingModule } from './system-access-routing.module';

/** COMPONENTS IMPORTS */
import { SystemAccessComponent } from './system-access/system-access.component';

@NgModule({
  declarations: [SystemAccessComponent],
  imports: [CommonModule, SystemAccessRoutingModule, SharedModule, TabsModule],
})
export class SystemAccessModule {}
