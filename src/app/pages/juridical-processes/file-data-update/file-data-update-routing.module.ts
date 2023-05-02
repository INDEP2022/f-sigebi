/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { RdFShiftChangeComponent } from '../../documents-reception/flyers/shift-change/shift-change.component';
import { FileDataUpdateComponent } from './file-data-update/file-data-update.component';

const routes: Routes = [
  {
    path: '',
    component: FileDataUpdateComponent,
  },
  {
    path: 'shift-change',
    component: RdFShiftChangeComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileDataUpdateRoutingModule {}
