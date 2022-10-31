/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDeclarationAbandonmentInsuranceComponent } from './declaration-abandonment-insurance/pj-c-declaration-abandonment-insurance.component';

const routes: Routes = [
  {
    path: '',
    component: PJDeclarationAbandonmentInsuranceComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJDeclarationAbandonmentInsuranceRoutingModule {}
