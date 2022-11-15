import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'register-documentation',
    loadChildren: async () =>
      (
        await import(
          './gre-m-register-documentation/gre-m-register-documentation.module'
        )
      ).GreMRegisterDocumentationModule,
    data: { title: 'Registrar Solicitud de Resarcimiento Económico' },
  },
  {
    path: 'economic-resources',
    loadChildren: async () =>
      (
        await import(
          './gre-m-economic-resources/gre-m-economic-resources.module'
        )
      ).GreMEconomicResourcesModule,
    data: { title: 'Solicitud de Recursos Económicos' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EconomicCompensationRoutingModule {}
