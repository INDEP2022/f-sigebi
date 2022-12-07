/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { CaptureFormalizingLawyersComponent } from './capture-formalizing-lawyers/capture-formalizing-lawyers.component';

const routes: Routes = [
  {
    path: '',
    component: CaptureFormalizingLawyersComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaptureFormalizingLawyersRoutingModule {}
