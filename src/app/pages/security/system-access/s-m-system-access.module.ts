/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { SSystemAccessRoutingModule } from './s-m-system-access-routing.module';

/** COMPONENTS IMPORTS */
import { SSystemAccessComponent } from './system-access/s-c-system-access.component';

@NgModule({
  declarations: [SSystemAccessComponent],
  imports: [CommonModule, SSystemAccessRoutingModule, SharedModule, TabsModule],
})
export class SSystemAccessModule {}
