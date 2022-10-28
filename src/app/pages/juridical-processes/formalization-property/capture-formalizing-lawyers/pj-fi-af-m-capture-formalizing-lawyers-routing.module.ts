/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJFIAFCaptureFormalizingLawyersComponent } from './capture-formalizing-lawyers/pj-fi-af-c-capture-formalizing-lawyers.component';

const routes: Routes = [
  {
    path: '',
    component: PJFIAFCaptureFormalizingLawyersComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJFIAFCaptureFormalizingLawyersRoutingModule {}
