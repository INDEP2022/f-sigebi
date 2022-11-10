import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //Henry
  {
    path: 'c-p-m-cat-financial-information-attributes',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-cat-financial-information-attributes/c-p-m-cat-financial-information-attributes.module'
        )
      ).CPMCatFinancialInformationAttributesModule,
    data: { title: 'Catálogo de atributos de información financiera' },
  },
  {
    path: 'c-p-m-cat-financial-indicators',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-cat-financial-indicators/c-p-m-cat-financial-indicators.module'
        )
      ).CPMCatFinancialIndicatorsModule,
    data: { title: 'Catálogo de indicadores financieros' },
  },
  {
    path: 'c-p-m-question-catalog',
    loadChildren: async () =>
      (await import('./c-p-m-question-catalog/c-p-m-question-catalog.module'))
        .CPMQuestionCatalogModule,
    data: { title: 'Catálogo de preguntas' },
  },
  {
    path: 'c-p-m-logical-tables-register',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-logical-tables-register/c-p-m-logical-tables-register.module'
        )
      ).CPMLogicalTablesRegisterModule,
    data: { title: 'Catálogo de tablas lógicas' },
  },
  {
    path: 'c-p-m-flyer-subject-catalog',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-flyer-subject-catalog/c-p-m-flyer-subject-catalog.module'
        )
      ).CPMFlyerSubjectCatalogModule,
    data: { title: 'Catálogo de asuntos para volantes' },
  },
  {
    path: 'c-p-m-register-attributes-types',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-register-attributes-types/c-p-m-register-attributes-types.module'
        )
      ).CPMRegisterAttributesTypesModule,
    data: { title: 'Alta de atributos por tipo de bien' },
  },
  {
    path: 'c-p-m-cat-effective-numeraire',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-cat-effective-numeraire/c-p-m-cat-effective-numeraire.module'
        )
      ).CPMCatEffectiveNumeraireModule,
    data: { title: 'Categoria para numerario efectivo' },
  },
  {
    path: 'c-p-m-bank-concepts',
    loadChildren: async () =>
      (await import('./c-p-m-bank-concepts/c-p-m-bank-concepts.module'))
        .CPMBankConceptsModule,
    data: { title: 'Conceptos bancarios' },
  },
  {
    path: 'c-p-m-cat-depository-payment',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-cat-depository-payment/c-p-m-cat-depository-payment.module'
        )
      ).CPMCatDepositoryPaymentModule,
    data: { title: 'Catalogo de conceptos de pagos depositarias' },
  },
  //Alexander
  {
    path: 'maintenance-of-areas',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-maintenance-of-areas/c-p-m-maintenance-of-areas.module'
        )
      ).CPMMaintenanceOfAreasModule,
    data: { title: 'Catálogo de Mantenimiento de Areas' },
  },
  //Félix
  {
    path: 'values',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-values/c-p-m-values.module'
        )
      ).CPMValuesModule,
    data: { title: 'Valores' },
  },
  {
    path: 'additional-values',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-additional-values/c-p-m-additional-values.module'
        )
      ).CPMAdditionalValuesModule,
    data: { title: 'Valores Adicionales' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParameterizationRoutingModule { }
