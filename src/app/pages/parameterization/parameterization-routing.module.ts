import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParameterizationRoutingModule {}
