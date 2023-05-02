/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { GoodsProcessValidationExtdomComponent } from './goods-process-validation-extdom/goods-process-validation-extdom.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsProcessValidationExtdomComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsProcessValidationExtdomRoutingModule {}
