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
        path: 'administration-assets',
        loadChildren: async () =>
          (await import('./administration-assets/administration-assets.module'))
            .AdministrationAssetsModule,
        data: { title: 'Administracion Bienes' },
      },
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
              './resquest-numbering-change/resquest-numbering-change.module'
            )
          ).ResquestNumberingChangeModule,
        data: { title: 'Solicitud de cambio a numeracion' },
      },
      {
        path: 'change-destination-goods-indicators',
        loadChildren: async () =>
          (
            await import(
              './change-destination-goods-indicators/pa-m-change-destination-goods-indicators.module'
            )
          ).PaMChangeDestinationGoodsIndicatorsModule,
        data: { title: 'Cambio de indicadores de destino de bienes' },
      },
      {
        path: 'massive-reclassification-goods',
        loadChildren: async () =>
          (
            await import(
              './massive-reclassification-goods/massive-reclassification-goods.module'
            )
          ).MassiveReclassificationGoodsModule,
        data: { title: 'Reclasificación masiva de bienes' },
      },
      {
        path: 'change-of-status',
        loadChildren: async () =>
          (await import('./change-of-status/change-of-status.module'))
            .ChangeOfStatusModule,
        data: { title: 'Cambio de estatus ', screen: 'CAMMUEESTATUS' },
      },
      {
        path: 'massive-change-status',
        loadChildren: async () =>
          (await import('./massive-change-status/massive-change-status.module'))
            .MassiveChangeStatusModule,
        data: { title: 'Cambio masivo de estatus' },
      },
      {
        path: 'change-status-sti',
        loadChildren: async () =>
          (await import('./change-of-status-sti/change-of-status-sti.module'))
            .ChangeOfStatusStiModule,
        data: { title: 'Cambio de estatus sti' },
      },
      {
        path: 'payment-claim-process',
        loadChildren: async () =>
          (await import('./payment-claim-process/payment-claim-process.module'))
            .PaymentClaimProcessModule,
        data: { title: 'Proceso de reclamacion de pago' },
      },
      {
        path: 'legal-regularization',
        loadChildren: async () =>
          (await import('./legal-regularization/legal-regularization.module'))
            .LegalRegularizationModule,
        data: { title: 'Regularizacion Juridica' },
      },
      /**
       *Legaspi
       **/
      {
        path: 'summary-financial-info',
        loadChildren: () =>
          import('./companies/financial-info/financial-info.module').then(
            m => m.FinancialInfoModule
          ),
      },
      {
        path: 'warehouse-reports',
        loadChildren: () =>
          import('./reports/warehouse/warehouse.module').then(
            m => m.WarehouseModule
          ),
      },
      {
        path: 'record-details',
        loadChildren: () =>
          import('./reports/record/record.module').then(m => m.RecordModule),
      },
      {
        path: 'goods-type-crime-reports',
        loadChildren: async () =>
          (await import('./reports/goods-type-crime/goods-type-crime.module'))
            .GoodsTypeCrimeModule,
        data: { title: 'Reporte de Bienes por Tipo de Delito' },
      },
      {
        path: 'return-confiscation-property',
        loadChildren: () =>
          import(
            './reports/return-confiscation-property/return-confiscation-property.module'
          ).then(m => m.ReturnConfiscationPropertyModule),
      },
      {
        path: 'generate-excel-file',
        loadChildren: () =>
          import(
            './reports/generate-excel-file/generate-excel-file.module'
          ).then(m => m.GenerateExcelFileModule),
      },
      {
        path: 'bills-good',
        loadChildren: () =>
          import('./reports/bills-good/bills-good.module').then(
            m => m.BillsGoodModule
          ),
      },
      {
        path: 'inventory-report',
        loadChildren: () =>
          import('./inventory-report/inventory-report.module').then(
            m => m.InventoryReportModule
          ),
      },
      {
        path: 'unit-conversion-packages',
        loadChildren: () =>
          import(
            './unit-conversion-packages/unit-conversion-packages.module'
          ).then(m => m.UnitConversionPackagesModule),
      },
      {
        path: 'goods-tracking',
        loadChildren: () =>
          import('./goods-tracking/goods-tracking.module').then(
            m => m.GoodsTrackingModule
          ),
      },
      {
        path: 'goods-management',
        loadChildren: () =>
          import('./goods-management/goods-management.module').then(
            m => m.GoodsManagementModule
          ),
      },
      {
        path: 'siab-sami-interaction',
        loadChildren: () =>
          import('./siab-sami-interaction/siab-sami-interaction.module').then(
            m => m.SiabSamiInteractionModule
          ),
      },
      {
        path: 'returns-confiscations',
        loadChildren: async () =>
          (await import('./returns-confiscations/returns-confications.module'))
            .ReturnsConficationsModule,
        data: { title: 'Devoluciones y Decomisos' },
      },
      {
        path: 'reg-warehouse-contract',
        loadChildren: async () =>
          (await import('./third-party-admin/warehouse/warehouse.module'))
            .WarehouseModule,
        data: { title: 'Alta de Almacenes por Contrato' },
      },
      /**
       *Legaspi
       **/
      {
        path: 'location-goods',
        loadChildren: async () =>
          (
            await import(
              './location-of-goods/location-goods-warehouses-storage/location-goods-warehouses-storage.module'
            )
          ).PaLgMLocationGoodsWarehousesStorageModule,
        data: { title: 'Ubicacion de bienes' },
      },
      {
        path: 'warehouse-inquiries',
        loadChildren: async () =>
          (await import('./warehouse-inquiries/warehouse-inquiries.module'))
            .WarehouseInquiriesModule,
        data: { title: 'Consulta Almacenes' },
      },
      {
        path: 'vault-consultation',
        loadChildren: async () =>
          (await import('./vault-consultation/vault-consultation.module'))
            .VaultConsultationModule,
        data: { title: 'Consulta Bovedas' },
      },
      {
        path: 'property-registration',
        loadChildren: async () =>
          (await import('./kitchenware/kitchenware.module')).KitchenwareModule,
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
          (await import('./services/services.module')).PaSMServicesModule,
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
        path: 'procedural-history',
        loadChildren: async () =>
          (
            await import(
              './reports/procedural-history/procedural-history.module'
            )
          ).ProceduralHistoryModule,
        data: { title: 'Histórico procesal' },
      },
      {
        path: 'information-generation',
        loadChildren: async () =>
          (
            await import(
              './reports/information-generation/information-generation.module'
            )
          ).InformationGenerationModule,
        data: { title: 'Generación de informacion para reporte coord' },
      },
      {
        path: 'vaults',
        loadChildren: async () =>
          (await import('./reports/vaults/vaults.module')).VaultsModule,
        data: { title: 'Bovedas y Gavetas' },
      },
      {
        path: 'concentrate-goods-type',
        loadChildren: async () =>
          (
            await import(
              './reports/concentrate-goods-type/concentrate-goods-type.module'
            )
          ).ConcentrateGoodsTypeModule,
        data: { title: 'Concentrado de bienes por expendiente' },
      },
      {
        path: 'flat-file-for-good',
        loadChildren: async () =>
          (
            await import(
              './reports/flat-file-for-good/flat-file-for-good.module'
            )
          ).FlatFileForGoodModule,
        data: { title: 'Generación de archivo plano' },
      },
      {
        path: 'real-estate-analytical-report',
        loadChildren: async () =>
          (
            await import(
              './reports/real-estate-analytical-report/real-estate-analytical-report.module'
            )
          ).RealEstateAnalyticalReportModule,
        data: { title: 'Analitico de bienes inmuebles' },
      },
      {
        path: 'warehouses',
        loadChildren: async () =>
          (await import('./administration-third/warehouses/warehouses.module'))
            .WarehousesModule,
        data: { title: 'Bienes en almacén' },
      },
      {
        path: 'storehouse',
        loadChildren: async () =>
          (await import('./administration-third/storehouse/storehouse.module'))
            .StorehouseModule,
        data: { title: 'Reportes de almacen' },
      },
      {
        path: 'warehouse-type',
        loadChildren: async () =>
          (
            await import(
              './administration-third/warehouse-type/warehouse-type.module'
            )
          ).WarehouseTypeModule,
        data: { title: 'Tipos de Almacén' },
      },
      {
        path: 'control-service-orders',
        loadChildren: async () =>
          (
            await import(
              './administration-third/control-service-orders/control-service-orders.module'
            )
          ).ControlServiceOrdersModule,
        data: { title: 'Control de las ordenes de servicio' },
      },
      {
        path: 'service-orders-format',
        loadChildren: async () =>
          (
            await import(
              './administration-third/service-orders-format/service-orders-format.module'
            )
          ).ServiceOrdersFormatModule,
        data: { title: 'Formato ordenes de servicio ' },
      },
      {
        path: 'performance-indicator',
        loadChildren: async () =>
          (
            await import(
              './administration-third/performance-indicator/performance-indicator.module'
            )
          ).PerformanceIndicatorModule,
        data: { title: 'Indicador de desempeño' },
      },
      {
        path: 'implementation-report',
        loadChildren: async () =>
          (
            await import(
              './administration-third/implementation-report/implementation-report.module'
            )
          ).ImplementationReportModule,
        data: { title: 'Reporte de implementacion' },
      },
      {
        path: 'service-order-reports',
        loadChildren: async () =>
          (
            await import(
              './administration-third/service-order-reports/service-order-reports.module'
            )
          ).ServiceOrderReportsModule,
        data: { title: 'Reportes de Ordenes de Servicio' },
      },
      /**
       * Seguros David Lucas
       */
      {
        path: 'policies-report',
        loadChildren: async () =>
          (await import('./policies-report/policies-report.module'))
            .PoliciesReportModule,
        data: { title: 'Reportes de Pólizas', screen: 'FREPORTBIENESSPOL' },
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
      {
        path: 'indicators-per-good',
        loadChildren: async () =>
          (await import('./indicators-per-good/indicators-per-good.module'))
            .IndicatorsPerGoodModule,
        data: { title: 'Indicadores por Bien', screen: 'FACTADBINDICXBIEN' },
      },
      {
        path: 'financial-information-report',
        loadChildren: async () =>
          (
            await import(
              './financial-information-report/financial-information-report.module'
            )
          ).FinancialInformationReportModule,
        data: {
          title: 'Reporte de información financiera',
          screen: 'FCONADBINFORFINAN',
        },
      },
      {
        path: 'financial-information',
        loadChildren: async () =>
          (await import('./financial-information/financial-information.module'))
            .FinancialInformationModule,
        data: { title: 'Información financiera', screen: 'FACTADBINFORFINAN' },
      },
      {
        path: 'change-of-good-classification',
        loadChildren: async () =>
          (
            await import(
              './change-of-good-classification/change-of-good-classification.module'
            )
          ).ChangeOfStatusModule,
        data: {
          title: 'Cambio de Clasificación del Bien',
          screen: 'FCAMNOCLASIFBIEN',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrativeProcessesRoutingModule {}
