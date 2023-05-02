/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { DeclarationAbandonmentInsuranceComponent } from './declaration-abandonment-insurance/declaration-abandonment-insurance.component';

const routes: Routes = [
  {
    path: '',
    component: DeclarationAbandonmentInsuranceComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeclarationAbandonmentInsuranceRoutingModule {}
