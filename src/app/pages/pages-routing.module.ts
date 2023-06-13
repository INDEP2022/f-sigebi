import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
    data: { title: 'page' },
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
    redirectTo: 'general-processes/goods-tracker',
    pathMatch: 'full',
  },
  {
    path: 'juridical',
    loadChildren: async () =>
      (await import('./juridical-processes/juridical-processes.module'))
        .JuridicalProcessesModule,
    data: { title: 'Juridicos' },
  },
  {
    path: 'security',
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
    path: 'parameterization',
    loadChildren: async () =>
      (await import('./parameterization/parameterization.module'))
        .ParameterizationModule,
  },

  {
    path: 'siab-web',
    loadChildren: async () =>
      (await import('./siab-web/siab-web.module')).SiabWebModule,
  },
  {
    path: 'assets-for-study',
    loadChildren: async () =>
      (await import('./assets-for-study/assets-for-study.module'))
        .AssetsForStudyModule,
    data: { title: 'Bienes para estudio' },
  },
  {
    path: '404-not-found',
    pathMatch: 'full',
    loadChildren: async () =>
      (await import('./errors/error-404/error-404.module')).Error404Module,
    data: { title: 'Página no Encontrada' },
  },
  { path: '**', redirectTo: '404-not-found' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
