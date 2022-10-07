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
        component: PJDJJuridicalRulingComponent
    }
    // {
    //     path: 'pe-atb-m-quarterly-accumulated-assets',
    //     loadChildren: async () =>
    //       (await import('./pe-atb-m-quarterly-accumulated-assets/pe-atb-m-quarterly-accumulated-assets.module')).PeAtbMQuarterlyAccumulatedAssetsModule,
    //     data: { title: 'Acumulado Trimestral de Bienes' },
    //   },
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PJDJJuridicalRulingRoutingModule { }