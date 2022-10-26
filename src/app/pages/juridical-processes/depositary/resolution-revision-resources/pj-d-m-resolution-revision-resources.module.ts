/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDResolutionRevisionResourcesRoutingModule } from './pj-d-m-resolution-revision-resources-routing.module';

/** COMPONENTS IMPORTS */
import { PJDResolutionRevisionResourcesComponent } from './resolution-revision-resources/pj-d-c-resolution-revision-resources.component';

@NgModule({
  declarations: [PJDResolutionRevisionResourcesComponent],
  imports: [
    CommonModule,
    PJDResolutionRevisionResourcesRoutingModule,
    SharedModule,
  ],
})
export class PJDResolutionRevisionResourcesModule {}
