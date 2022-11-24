/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GDCBGoodsClassificationComponent } from './goods-classification/gd-cb-c-goods-classification.component';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  {
    path: '',
    component: GDCBGoodsClassificationComponent,
    data: { title: 'Clasificación de Bienes' },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GDCBGoodsClassificationRoutingModule {}
