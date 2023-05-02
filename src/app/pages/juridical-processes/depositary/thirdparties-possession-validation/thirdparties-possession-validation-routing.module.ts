/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { ThirdpartiesPossessionValidationComponent } from './thirdparties-possession-validation/thirdparties-possession-validation.component';

const routes: Routes = [
  {
    path: '',
    component: ThirdpartiesPossessionValidationComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThirdpartiesPossessionValidationRoutingModule {}
