/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJADEFileDataUpdateComponent } from './file-data-update/pj-ade-c-file-data-update.component';

const routes: Routes = [
  {
    path: '',
    component: PJADEFileDataUpdateComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJADEFileDataUpdateRoutingModule {}
