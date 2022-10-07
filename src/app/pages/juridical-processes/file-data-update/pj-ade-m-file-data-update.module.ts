/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJADEFileDataUpdateRoutingModule } from './pj-ade-m-file-data-update-routing.module';

/** COMPONENTS IMPORTS */
import { PJADEFileDataUpdateComponent } from './file-data-update/pj-ade-c-file-data-update.component';

@NgModule({
  declarations: [
    PJADEFileDataUpdateComponent
  ],
  imports: [
    CommonModule,
    PJADEFileDataUpdateRoutingModule,
    SharedModule,
  ],
  exports: [
    PJADEFileDataUpdateComponent
  ]
})
export class PJADEFileDataUpdateModule {}
