/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GDASDApproveReturnRequestComponent } from './approve-return-request/gd-asd-c-approve-return-request.component';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  {
    path: '',
    component: GDASDApproveReturnRequestComponent,
    data: { title: 'Clasificación de Bienes' },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GDASDApproveReturnRequestRoutingModule {}
