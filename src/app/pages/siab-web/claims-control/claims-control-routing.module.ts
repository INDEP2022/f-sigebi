import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'claims-follow-up',
    loadChildren: async () =>
      (await import('./claims-follow-up/claims-follow-up.module'))
        .ClaimsFollowUpModule,
    data: { title: 'Siniestros Seguimiento' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimsControlRoutingModule {}
