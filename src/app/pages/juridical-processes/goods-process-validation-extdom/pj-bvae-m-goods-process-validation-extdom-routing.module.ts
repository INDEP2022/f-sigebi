/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJBVAEGoodsProcessValidationExtdomComponent } from './goods-process-validation-extdom/pj-bvae-c-goods-process-validation-extdom.component';

const routes: Routes = [
  {
    path: '',
    component: PJBVAEGoodsProcessValidationExtdomComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJBVAEGoodsProcessValidationExtdomRoutingModule {}
