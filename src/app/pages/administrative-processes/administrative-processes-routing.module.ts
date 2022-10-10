import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrativeProcessesComponent } from './administrative-processes.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: AdministrativeProcessesComponent,
    children: [
      {
        path: 'numerary-operator',
        loadChildren: async () =>
          (await import('./numerary-operator/numerary-operator.module'))
            .NumeraryOperatorModule,
        data: { title: 'Numerario Operado' },
      },
      {
        path: 'numerary-physics',
        loadChildren: async () =>
          (await import('./numerary-physics/numerary-physics.module'))
            .NumeraryPhysicsModule,
        data: { title: 'Numerario Fisico' },
      },
      {
        path: 'other-currencies',
        loadChildren: async () =>
          (await import('./other-currencies/other-currencies.module'))
            .OtherCurrenciesModule,
        data: { title: 'Otras Monedas' },
      },
      {
        path: 'values-per-file',
        loadChildren: async () =>
          (await import('./values-per-file/values-per-file.module'))
            .ValuesPerFileModule,
        data: { title: 'Otras Monedas' },
      },
      {
        path: 'general-account-movements',
        loadChildren: async () =>
          (
            await import(
              './general-account-movements/general-account-movements.module'
            )
          ).GeneralAccountMovementsModule,
        data: { title: 'Movimientos Cuentas Generales' },
      },
      {
        path: 'apply-lif',
        loadChildren: async () =>
          (await import('./apply-lif/apply-lif.module')).ApplyLifModule,
        data: { title: 'Aplicar Lif' },
      },
      {
        path: 'conversion-act',
        loadChildren: async () =>
          (await import('./conversion-act/conversion-act.module')).ConversionActModule,
        data: { title: 'Actas de converision' },

      },
      {
        path: 'conversion-act',
        loadChildren: async () =>
          (await import('./conversion-act/conversion-act.module')).ConversionActModule,
        data: { title: 'Actas de converision' },

      },
      {
        path: 'conversion-management',
        loadChildren: async () =>
          (await import('./conversion-management/conversion-management.module')).ConversionManagementModule,
        data: { title: 'Administracion de converision' },
      },
      {
        path: 'derivation-goods',
        loadChildren: async () =>
          (await import('./derivation-goods/derivation-goods.module')).DerivationGoodsModule,
        data: { title: 'Derivacion de bienes' },
      },
      /**
       * Seguros **Legaspi** 
       **/
      {
        path: 'summary-financial-info',
        loadChildren: () =>
          import(
            './companies/financial-info/pa-e-fi-m-financial-info.module'
          ).then(m => m.PaEFiMFinancialInfoModule),
      },
      {
        path: 'warehouse-reports',
        loadChildren: () =>
          import('./reports/warehouse/pa-r-wh-m-warehouse.module').then(
            m => m.PaRWhMWarehouseModule
          ),
      },
      {
        path: 'record-details', loadChildren: () => import('./reports/record/pa-r-r-m-record.module')
          .then(m => m.PaRRMRecordModule)
      },
      {
        path: 'unit-conversion-packages', loadChildren: () => import('./unit-conversion-packages/pa-ucp-m-unit-conversion-packages.module')
          .then(m => m.PaUcpMUnitConversionPackagesModule)
      },
      /*
      {
        path: 'record', loadChildren: () => import('./record/record.module')
          .then(m => m.RecordModule)
      },
      {
        path: 'unit-conversion-packages', loadChildren: () => import('./unit-conversion-packages/unit-conversion-packages.module')
          .then(m => m.UnitConversionPackagesModule)
      },
      {
        path: 'goods-tracking', loadChildren: () => import('./goods-tracking/goods-tracking.module')
          .then(m => m.GoodsTrackingModule)
      },
      {
        path: 'goods-management', loadChildren: () => import('./goods-management/goods-management.module')
          .then(m => m.GoodsManagementModule)
      },
      {
        path: 'siab-sami-interaction', loadChildren: () => import('./siab-sami-interaction/siab-sami-interaction.module')
          .then(m => m.SiabSamiInteractionModule)
      }*/
      /**
       * Seguros **Legaspi** 
       **/
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrativeProcessesRoutingModule {}
