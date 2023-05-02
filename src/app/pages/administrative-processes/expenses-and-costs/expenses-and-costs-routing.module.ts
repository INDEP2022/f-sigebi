import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesAndCostsComponent } from './expenses-and-costs.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: ExpensesAndCostsComponent,
    children: [
      {
        path: 'catalogue-concepts',
        loadChildren: async () =>
          (
            await import(
              './catalogue-expenses-concepts/catalogue-expenses-concepts.module'
            )
          ).CatalogueExpensesConceptsModule,
        data: {
          title: 'Catalogo de conceptos de gasto',
          screen: 'FACTADBCONCEPTOGASTO',
        },
      },
      {
        path: 'exchange-types',
        loadChildren: async () =>
          (await import('./exchange-types/exchange-types.module'))
            .ExchangeTypesModule,
        data: { title: 'Tipos de Cambio', screen: 'FACTADBTIPOCAMBIO' },
      },
      {
        path: 'costs-procedures',
        loadChildren: async () =>
          (await import('./costs-procedures/costs-procedures.module'))
            .CostsProceduresModule,
        data: { title: 'Procedimientos de cierre de costos' },
      },
      {
        path: 'costs-applied-goods',
        loadChildren: async () =>
          (
            await import(
              './../insurance-and-surveillance/costs-applied-goods/costs-applied-goods.module'
            )
          ).CostsAppliedGoodsModule,
        data: {
          title: 'Gastos aplicados a Bienes',
          screen: 'FGERADBREPOCOSTOS',
        },
      },
      {
        path: 'costs-resume',
        loadChildren: async () =>
          (
            await import(
              './../insurance-and-surveillance/costs-resume/costs-resume.module'
            )
          ).CostsResumeModule,
        data: { title: 'Resumen de Gastos' },
      },
      {
        path: 'expenses-format',
        loadChildren: async () =>
          (
            await import(
              './../insurance-and-surveillance/expenses-format/expenses-format.module'
            )
          ).ExpensesFormatModule,
        data: { title: 'Visitas a inmuebles', screen: 'FCONADBMONSEGUROS' },
      },
      {
        path: 'expenses-register',
        loadChildren: async () =>
          (
            await import(
              './../insurance-and-surveillance/expenses-register/expenses-register.module'
            )
          ).ExpensesRegisterModule,
        data: { title: 'Registro de Gasto', screen: 'FACTADBEJERGASTO' },
      },
      {
        path: 'expenses-concepts',
        loadChildren: async () =>
          (await import('./expenses-concepts/expenses-concepts.module'))
            .ExpensesConceptsModule,
        data: { title: 'Conceptos de Gasto' },
      },
      {
        path: 'applicants-criteria',
        loadChildren: async () =>
          (await import('./applicants-criteria/applicants-criteria.module'))
            .ApplicantsCriteriaModule,
        data: {
          title: 'Criterios de aplicación',
          screen: 'RCRITERIOAPLIGASTO ',
        },
      },
      {
        path: 'costs-clasification',
        loadChildren: async () =>
          (await import('./costs-clasification/costs-clasification.module'))
            .CostsClasificationModule,
        data: {
          title: 'Clasificación de Costos',
          screen: 'CLASIFICACIÓN_COSTOS',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpensesAndCostsRoutingModule {}
