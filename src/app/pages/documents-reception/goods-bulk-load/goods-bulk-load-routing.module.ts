import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsBulkLoadComponent } from './goods-bulk-load/goods-bulk-load.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsBulkLoadComponent,
  },
  {
    // CARGA MASIVA SAT
    path: ':tipo/:ASUNTO_SAT/:P_NO_EXPEDIENTE/:P_NO_OFICIO/:P_NO_VOLANTE/:P_SAT_TIPO_EXP/:P_INDICADOR_SAT',
    component: GoodsBulkLoadComponent,
  },
  {
    // CARGA MASIVA PGR
    path: ':tipo/:P_NO_EXPEDIENTE/:P_NO_VOLANTE/:P_AV_PREVIA',
    component: GoodsBulkLoadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsBulkLoadRoutingModule {}
