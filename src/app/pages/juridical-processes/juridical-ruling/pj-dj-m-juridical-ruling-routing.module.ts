/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDJJuridicalRulingComponent } from './juridical-ruling/pj-dj-c-juridical-ruling.component';

const routes: Routes = [
  {
    path: '',
    component: PJDJJuridicalRulingComponent,
  },
  // {
  //     path: 'quarterly-accumulated-assets',
  //     loadChildren: async () =>
  //       (await import('./quarterly-accumulated-assets/quarterly-accumulated-assets.module')).QuarterlyAccumulatedAssetsModule,
  //     data: { title: 'Acumulado Trimestral de Bienes' },
  //   },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJDJJuridicalRulingRoutingModule {}
