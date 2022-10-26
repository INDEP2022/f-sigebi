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
          (
            await import(
              './resquest-numbering-change/pa-m-resquest-numbering-change.module'
            )
          ).PaMResquestNumberingChangeModule,
        data: { title: 'Solicitud de cambio a numeracion' },
      },
      {
        path: 'massive-reclassification-goods',
        loadChildren: async () =>
          (
            await import(
              './massive-reclassification-goods/pa-m-massive-reclassification-goods.module'
            )
          ).PaMMassiveReclassificationGoodsModule,
        data: { title: 'Reclasificación masiva de bienes' },
      },
      {
        path: 'change-of-status',
        loadChildren: async () =>
          (await import('./change-of-status/pa-m-change-of-status.module'))
            .PaMChangeOfStatusModule,
        data: { title: 'Cambio de estatus' },
      },
      {
        path: 'massive-change-status',
        loadChildren: async () =>
          (
            await import(
              './massive-change-status/pa-m-massive-change-status.module'
            )
          ).PaMMassiveChangeStatusModule,
        data: { title: 'Cambio masivo de estatus' },
      },
      {
        path: 'change-status-sti',
        loadChildren: async () =>
          (
            await import(
              './change-of-status-sti/pa-m-change-of-status-sti.module'
            )
          ).PaMChangeOfStatusStiModule,
        data: { title: 'Cambio de estatus sti' },
      },
      {
        path: 'payment-claim-process',
        loadChildren: async () =>
          (
            await import(
              './payment-claim-process/pa-m-payment-claim-process.module'
            )
          ).PaMPaymentClaimProcessModule,
        data: { title: 'Proceso de reclamacion de pago' },
      },
      {
        path: 'legal-regularization',
        loadChildren: async () =>
          (
            await import(
              './legal-regularization/pa-m-legal-regularization.module'
            )
          ).PaMLegalRegularizationModule,
        data: { title: 'Regularizacion Juridica' },
      },
      /**
       *Legaspi
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
       *Legaspi
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
      {
        path: 'process',
        loadChildren: async () =>
          (await import('./administration-third/process/process.module'))
            .ProcessModule,
        data: { title: 'Procesos para precios unitarios' },
      },
      {
        path: 'services-unit-prices',
        loadChildren: async () =>
          (
            await import(
              './administration-third/services-unit-prices/services-unit-prices.module'
            )
          ).ServicesUnitPricesModule,
        data: { title: 'Servicios para precios unitarios' },
      },
      {
        path: 'specs',
        loadChildren: async () =>
          (await import('./administration-third/specs/specs.module'))
            .SpecsModule,
        data: { title: 'Especificaciones para precios unitarios' },
      },
      {
        path: 'turn-type',
        loadChildren: async () =>
          (await import('./administration-third/turn-type/turn-type.module'))
            .TurnTypeModule,
        data: { title: 'Turno y tipo' },
      },
      {
        path: 'measurement-units',
        loadChildren: async () =>
          (
            await import(
              './administration-third/measurement-units/measurement-units.module'
            )
          ).MeasurementUnitsModule,
        data: { title: 'Unidades de medida' },
      },
      {
        path: 'variable-cost',
        loadChildren: async () =>
          (
            await import(
              './administration-third/variable-cost/variable-cost.module'
            )
          ).VariableCostModule,
        data: { title: 'Variable costo' },
      },

      {
        path: 'zones',
        loadChildren: async () =>
          (await import('./administration-third/zones/zones.module'))
            .ZonesModule,
        data: { title: 'Coordinacion por zonas' },
      },
      {
        path: 'electronic-signature',
        loadChildren: async () =>
          (await import('./electronic-signature/electronic-signature.module'))
            .ElectronicSignatureModule,
        data: { title: 'Firma Electrónica' },
      },
      {
        path: 'proceedings-conversion',
        loadChildren: async () =>
          (
            await import(
              './proceedings-conversion/proceedings-conversion.module'
            )
          ).ProceedingsConversionModule,
        data: { title: 'Detalle de actas de conversión' },
      },
      {
        path: 'returns-confiscation',
        loadChildren: async () =>
          (await import('./returns-confiscation/returns-confiscation.module'))
            .ReturnsConfiscationModule,
        data: { title: 'Devoluciones y decomisos' },
      },
      /**
       * Seguros David Lucas
       */
      {
        path: 'policies-report',
        loadChildren: async () =>
          (await import('./policies-report/policies-report.module'))
            .PoliciesReportModule,
        data: { title: 'Reportes de Pólizas' },
      },
      {
        path: 'accumulated-monthly-assets',
        loadChildren: async () =>
          (
            await import(
              './accumulated-monthly-assets/accumulated-monthly-assets.module'
            )
          ).AccumulatedMonthlyAssetsModule,
        data: { title: 'Acumulado de bienes mensual' },
      },
      {
        path: 'insured-numerary-account',
        loadChildren: async () =>
          (
            await import(
              './insured-numerary-account/insured-numerary-account.module'
            )
          ).InsuredNumeraryAccountModule,
        data: { title: 'Cuenta de numerario asegurado' },
      },
      {
        path: 'performance-evaluation-report',
        loadChildren: async () =>
          (
            await import(
              './performance-evaluation-report/performance-evaluation-report.module'
            )
          ).PerformanceEvaluationReportModule,
        data: { title: 'Reporte de evaluación de desempeño' },
      },
      /**Numerario Abner */
      {
        path: 'numerary',
        loadChildren: async () =>
          (await import('./numerary/numerary.module')).NumeraryModule,
        data: { title: 'Numerario' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrativeProcessesRoutingModule {}
