/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { ResolutionRevisionResourcesRoutingModule } from './resolution-revision-resources-routing.module';

/** COMPONENTS IMPORTS */
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { ResolutionRevisionResourcesComponent } from './resolution-revision-resources/resolution-revision-resources.component';

@NgModule({
  declarations: [ResolutionRevisionResourcesComponent],
  imports: [
    CommonModule,
    FormLoaderComponent,
    ResolutionRevisionResourcesRoutingModule,
    SharedModule,
  ],
})
export class ResolutionRevisionResourcesModule {}
