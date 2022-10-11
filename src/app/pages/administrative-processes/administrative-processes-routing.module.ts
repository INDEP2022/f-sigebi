import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrativeProcessesComponent } from './administrative-processes.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: AdministrativeProcessesComponent,
    children: [
      /*{
        path: 'numerary-physics', loadChildren: () => import('./numerary-physics/numerary-physics.module')
          .then(m => m.NumeraryPhysicsModule)
      },*/
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
      /*{
        path: 'storehouse', loadChildren: () => import('./storehouse/storehouse.module')
          .then(m => m.StorehouseModule)
      },
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
          (await import('./conversion-act/conversion-act.module'))
            .ConversionActModule,
        data: { title: 'Actas de converision' },
      },
      {
        path: 'conversion-act',
        loadChildren: async () =>
          (await import('./conversion-act/conversion-act.module'))
            .ConversionActModule,
        data: { title: 'Actas de converision' },
      },
      {
        path: 'conversion-management',
        loadChildren: async () =>
          (await import('./conversion-management/conversion-management.module'))
            .ConversionManagementModule,
        data: { title: 'Administracion de converision' },
      },
      {
        path: 'derivation-goods',
        loadChildren: async () =>
          (await import('./derivation-goods/derivation-goods.module'))
            .DerivationGoodsModule,
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
        path: 'record-details',
        loadChildren: () =>
          import('./reports/record/pa-r-r-m-record.module').then(
            m => m.PaRRMRecordModule
          ),
      },
      {
        path: 'unit-conversion-packages',
        loadChildren: () =>
          import(
            './unit-conversion-packages/pa-ucp-m-unit-conversion-packages.module'
          ).then(m => m.PaUcpMUnitConversionPackagesModule),
      },
      {
        path: 'goods-tracking',
        loadChildren: () =>
          import('./goods-tracking/pa-gt-m-goods-tracking.module').then(
            m => m.PaGtMGoodsTrackingModule
          ),
      },
      {
        path: 'goods-management',
        loadChildren: () =>
          import('./goods-management/pa-gm-m-goods-management.module').then(
            m => m.PaGmMGoodsManagementModule
          ),
      },
      {
        path: 'siab-sami-interaction',
        loadChildren: () =>
          import(
            './siab-sami-interaction/pa-ssi-m-siab-sami-interaction.module'
          ).then(m => m.PaSsiMSiabSamiInteractionModule),
      },
      {
        path: 'location-goods',
        loadChildren: async () =>
          (await import('./location-of-goods/location-goods-warehouses-storage/pa-lg-m-location-goods-warehouses-storage.module')).PaLgMLocationGoodsWarehousesStorageModule,
        data: { title: 'Ubicacion de bienes' },
      },
      {
        path: 'warehouse-inquiries',
        loadChildren: async () =>
         (await import('./warehouse-inquiries/pa-m-warehouse-inquiries.module')).PaMWarehouseInquiriesModule,
         data: { title: 'Consulta Almacenes'}
      },
      {
        path: 'vault-consultation',
        loadChildren: async () =>
         (await import('./vault-consultation/pa-m-vault-consultation.module')).PaMVaultConsultationModule,
         data: { title: 'Consulta Bovedas'}
      },
      {
        path: 'property-registration',
        loadChildren: async () =>
         (await import('./kitchenware/pa-m-kitchenware.module')).PaMKitchenwareModule,
         data: { title: 'Registro de mensaje del bien'}
      },
      /**
       * Seguros **Legaspi**
       **/
      {
        path: 'appraisal-request',
        loadChildren: async () =>
          (await import('./appraisal-request/appraisal-request.module'))
            .AppraisalRequestModule,
        data: { title: 'Solicitud de Avalúos' },
      },
      {
        path: 'appraisal-registry',
        loadChildren: async () =>
          (await import('./appraisal-registry/appraisal-registry.module'))
            .AppraisalRegistryModule,
        data: { title: 'Registro de Avalúos' },
      },
      {
        path: 'appraisal-monitor',
        loadChildren: async () =>
          (await import('./appraisal-monitor/appraisal-monitor.module'))
            .AppraisalMonitorModule,
        data: { title: 'Monitor de Avalúos' },
      },
      {
        path: 'appraisal-goods',
        loadChildren: async () =>
          (await import('./appraisal-goods/appraisal-goods.module'))
            .AppraisalGoodsModule,
        data: { title: 'Bienes sin Avalúos' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrativeProcessesRoutingModule {}
