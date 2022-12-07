import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'generate-request',
    loadChildren: async () =>
      (await import('./generate-request/generate-request.module'))
        .GenerateRequestModule,
    data: { title: 'Generar solicitud' },
  },
  {
    path: 'assignment-list',
    loadChildren: async () =>
      (await import('./search-assignment-list/search-assignment-list.module'))
        .SearchAssignmentListModule,
    data: { title: 'Lista de asignaciones' },
  },
  {
    path: 'search-assests/:id',
    loadChildren: async () =>
      (await import('./search-assets-for-study/search-assets-for-study.module'))
        .SearchAssetsForStudyModule,
    data: { title: 'Búsqueda de bienes que se pueden estudiar' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsForStudyRoutingModule {}
