import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'documentation',
    loadChildren: async () =>
      (await import('./documentation-examples/documentation-examples.module'))
        .DocumentationExamplesModule,
    data: { title: 'Documentation' },
  },
  {
    path: 'example',
    loadChildren: async () =>
      (await import('./example/example.module')).ExampleModule,
    data: { title: 'Ejemplo' },
  },
  {
    path: 'request',
    loadChildren: async () =>
      (await import('./request/request.module')).RequestModule,
    data: { title: 'Request' },
  },
  {
    path: 'catalogs',
    loadChildren: async () =>
      (await import('./catalogs/catalogs.module')).CatalogModule,
  },
  {
    path: 'documents-reception',
    loadChildren: async () =>
      (await import('./documents-reception/documents-reception.module'))
        .DocumentsReceptionModule,
  },
  {
    path: 'administrative-processes',
    loadChildren: async () =>
      (
        await import(
          './administrative-processes/administrative-processes.module'
        )
      ).AdministrativeProcessesModule,
  },
  {
    path: 'master-file',
    loadChildren: async () =>
      (await import('./master-file/master-file.module')).MasterFileModule,
  },
  {
    path: 'home',
    loadChildren: async () =>
      (await import('./admin/home/home.module')).HomeModule,
    data: { title: 'Inicio' },
  },

  {
    path: 'final-destination-process',
    loadChildren: async () =>
      (
        await import(
          './final-destination-process/final-destination-process.module'
        )
      ).FinalDestinationProcessModule,
    data: { Title: 'Destino final' },
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'juridicos',
    loadChildren: async () =>
      (await import('./juridical-processes/juridical-processes.module'))
        .JuridicalProcessesModule,
    data: { title: 'Juridicos' },
  },
  {
    path: 'seguridad',
    loadChildren: () =>
      import('./security/security.module').then(m => m.SecurityModule),
  },
  {
    path: 'executive-processes',
    loadChildren: async () =>
      (await import('./executive-processes/executive-processes.module'))
        .ExecutiveProcessesModule,
  },
  {
    path: 'commercialization',
    loadChildren: async () =>
      (await import('./commercialization/commercialization.module'))
        .CommercializationModule,
  },
  {
    path: 'judicial-physical-reception',
    loadChildren: async () =>
      (
        await import(
          './judicial-physical-reception/judicial-physical-reception.module'
        )
      ).JudicialPhysicalReceptionModule,
  },

  {
    path: 'general-processes',
    loadChildren: async () =>
      (await import('./general-processes/general-processes.module'))
        .GeneralProcessesModule,
  },

  {
    path: 'documentation-complementary',
    loadChildren: async () =>
      (
        await import(
          './documentation-complementary/documentation-complementary.module'
        )
      ).DocumentationComplementaryModule,
  },
  {
    path: 'scheduling-deliveries',
    loadChildren: async () =>
      (await import('./scheduling-deliveries/scheduling-deliveries.module'))
        .SchedulingDeliveriesModule,
  },
  {
    path: 'parameterization',
    loadChildren: async () =>
      (await import('./parameterization/parameterization.module'))
        .ParameterizationModule,
  },
  {
    path: 'execute-return-deliveries',
    loadChildren: async () =>
      (
        await import(
          './execute-return-deliveries/execute-return-deliveries.module'
        )
      ).ExecuteReturnDeliveriesModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
