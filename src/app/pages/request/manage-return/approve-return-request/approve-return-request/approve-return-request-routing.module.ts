/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproveReturnRequestComponent } from './approve-return-request/approve-return-request.component';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  {
    path: '',
    component: ApproveReturnRequestComponent,
    data: { title: 'Clasificación de Bienes' },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApproveReturnRequestRoutingModule {}
