/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDGAFGenerationFilesTradesComponent } from './generation-files-trades/pj-d-gaf-c-generation-files-trades.component';

const routes: Routes = [
  {
    path: '',
    component: PJDGAFGenerationFilesTradesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJDGAFGenerationFilesTradesRoutingModule {}
