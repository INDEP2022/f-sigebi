/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  // Clasificación Bienes
  {
    path: 'goods-classification',
    loadChildren: async () =>
      (await import('./goods-classification/goods-classification.module'))
        .GoodsClassificationModule,
    data: { title: 'Clasificación Bienes' },
  },
  // Clasificación Bienes
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsClassificationRoutingModule {}
