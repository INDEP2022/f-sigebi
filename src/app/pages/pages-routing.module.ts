import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { async } from 'rxjs';

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
    path: 'home',
    loadChildren: async () =>
      (await import('./admin/home/home.module')).HomeModule,
    data: { title: 'Inicio' },
  },

  {
    path: 'final-destination-process',
    loadChildren: async() =>
    (await import('./final-destination-process/final-destination-process.module')).FinalDestinationProcessModule,
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
      (await import('./juridical-processes/juridical-processes.module')).JuridicalProcessesModule,
    data: { title: 'Juridicos' },
  },
  // {

  //   path: 'legal-processes',
  //   loadChildren: () => import('./legal-processes/legal-processes.module')
  //     .then(m => m.LegalProcessesModule),
  // },
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
