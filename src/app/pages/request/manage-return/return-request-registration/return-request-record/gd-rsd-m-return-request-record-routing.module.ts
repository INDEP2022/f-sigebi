/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GDRSDReturnRequestRecordComponent } from './return-request-record/gd-rsd-c-return-request-record.component';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  {
    path: '',
    component: GDRSDReturnRequestRecordComponent,
    data: { title: 'Registrar Devolución' },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GDRSDReturnRequestRecordRoutingModule {}
