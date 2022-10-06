import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'numerary-operator',
    loadChildren: async () =>
      (await import('./numerary-operator/numerary-operator.module')).NumeraryOperatorModule,
    data: { title: 'Numerario Operado' },
  },
  {
    path:'conversion-management',
    loadChildren: async () =>
      (await import('./conversion-management/conversion-management.module')).ConversionManagementModule,
    data: { title: 'Administracion Conversiones' }
  },
  {
    path: 'conversion-act',
    loadChildren: async () =>
      (await import('./conversion-act/conversion-act.module')).ConversionActModule,
    data: { title: 'Actas Conversion' }
  },
  {
    path: 'derivation-goods',
    loadChildren: async () =>
      (await import('./derivation-goods/derivation-goods.module')).DerivationGoodsModule,
    data: { title: 'Derivacion Bienes' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativeProcessesRoutingModule { }
