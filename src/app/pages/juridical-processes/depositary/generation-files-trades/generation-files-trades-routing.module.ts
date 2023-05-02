/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { GenerationFilesTradesComponent } from './generation-files-trades/generation-files-trades.component';

const routes: Routes = [
  {
    path: '',
    component: GenerationFilesTradesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerationFilesTradesRoutingModule {}
