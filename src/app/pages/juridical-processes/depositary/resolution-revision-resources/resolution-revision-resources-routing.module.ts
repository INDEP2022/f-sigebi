/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { ResolutionRevisionResourcesComponent } from './resolution-revision-resources/resolution-revision-resources.component';

const routes: Routes = [
  {
    path: '',
    component: ResolutionRevisionResourcesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResolutionRevisionResourcesRoutingModule {}
