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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsForStudyRoutingModule {}
