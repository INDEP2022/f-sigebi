import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'commercialization',
    loadChildren: async () =>
      (await import('./commercialization/commercialization.module'))
        .CommercializationModule,
  },
  {
    path: 'sami',
    loadChildren: async () => (await import('./sami/sami.module')).SamiModule,
  },
  {
    path: 'appraisals',
    loadChildren: async () =>
      (await import('./appraisals/appraisals.module')).AppraisalsModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiabWebRoutingModule {}
