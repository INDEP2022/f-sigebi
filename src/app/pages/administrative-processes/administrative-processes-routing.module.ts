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
      {
        path: 'request-numbering-change',
        loadChildren: async () =>
          (await import('./resquest-numbering-change/pa-m-resquest-numbering-change.module'))
            .PaMResquestNumberingChangeModule,
        data: { title: 'Solicitud de cambio a numeracion' },
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
      /**
       * Seguros **Legaspi**
       **/
      {
        path: 'location-goods',
        loadChildren: async () =>
          (
            await import(
              './location-of-goods/location-goods-warehouses-storage/pa-lg-m-location-goods-warehouses-storage.module'
            )
          ).PaLgMLocationGoodsWarehousesStorageModule,
        data: { title: 'Ubicacion de bienes' },
      },
      {
        path: 'warehouse-inquiries',
        loadChildren: async () =>
          (
            await import(
              './warehouse-inquiries/pa-m-warehouse-inquiries.module'
            )
          ).PaMWarehouseInquiriesModule,
        data: { title: 'Consulta Almacenes' },
      },
      {
        path: 'vault-consultation',
        loadChildren: async () =>
          (await import('./vault-consultation/pa-m-vault-consultation.module'))
            .PaMVaultConsultationModule,
        data: { title: 'Consulta Bovedas' },
      },
      {
        path: 'property-registration',
        loadChildren: async () =>
          (await import('./kitchenware/pa-m-kitchenware.module'))
            .PaMKitchenwareModule,
        data: { title: 'Registro de mensaje del bien' },
      },
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
      {
        path: 'monitor-unavoidable-assets',
        loadChildren: async () =>
          (
            await import(
              './monitor-unavoidable-assets/monitor-unavoidable-assets.module'
            )
          ).MonitorUnavoidableAssetsModule,
        data: { title: 'Monitor de bienes incosteables' },
      },
      {
        path: 'sale-goods',
        loadChildren: async () =>
          (await import('./sale-goods/sale-goods.module')).SaleGoodsModule,
        data: { title: 'VENTA DE BIENES' },
      },
      /**
       *Services Pages Legaspi
       **/
      {
        path: 'services',
        loadChildren: async () =>
          (await import('./services/pa-s-m-services.module'))
          .PaSMServicesModule,
          data: { title: 'Servicios' },
      },
      /**
       * Services Pages Legaspi
      **/
      {
        path: 'contracts',
        loadChildren: async () =>
          (await import('./administration-third/contracts/contracts.module'))
            .ContractsModule,
        data: { title: 'Registro de contratos' },
      },
      {
        path: 'unit-cost',
        loadChildren: async () =>
          (await import('./administration-third/unit-cost/unit-cost.module'))
            .UnitCostModule,
        data: { title: 'Costo unitario' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrativeProcessesRoutingModule {}
