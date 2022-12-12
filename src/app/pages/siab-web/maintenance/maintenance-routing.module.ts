import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'maintenance-opinion',
    loadChildren: async () =>
      (await import('./maintenance-opinion/maintenance-opinion.module'))
        .MaintenanceOpinionModule,
    data: { title: 'Mantenimiento dictamen' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceRoutingModule {}
