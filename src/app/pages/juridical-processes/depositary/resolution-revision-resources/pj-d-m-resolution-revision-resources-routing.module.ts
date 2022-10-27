/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDResolutionRevisionResourcesComponent } from './resolution-revision-resources/pj-d-c-resolution-revision-resources.component';

const routes: Routes = [
  {
    path: '',
    component: PJDResolutionRevisionResourcesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJDResolutionRevisionResourcesRoutingModule {}
