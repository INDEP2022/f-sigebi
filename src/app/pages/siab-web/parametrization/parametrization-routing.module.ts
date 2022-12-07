import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'ligies-chapters',
    loadChildren: async () =>
      (await import('./ligies-chapters/ligies-chapters.module'))
        .LigiesChaptersModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametrizationRoutingModule {}
