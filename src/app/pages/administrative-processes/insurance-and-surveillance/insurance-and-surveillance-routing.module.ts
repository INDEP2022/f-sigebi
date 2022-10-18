import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsuranceAndSurveillanceComponent } from './insurance-and-surveillance.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: InsuranceAndSurveillanceComponent,
    children: [
      {
        path: 'policy-maintenance',
        loadChildren: async () =>
          (await import('./policy-maintenance/policy-maintenance.module'))
            .PolicyMaintenanceModule,
        data: { title: 'Mantenimiento de Pólizas' },
      },
      {
        path: 'insurance-policy',
        loadChildren: async () =>
          (await import('./insurance-policy/insurance-policy.module'))
            .InsurancePolicyModule,
        data: { title: 'Pólizas de seguro' },
      },
      {
        path: 'registration-of-policy',
        loadChildren: async () =>
          (
            await import(
              './registration-of-goods-policy/registration-of-goods-policy.module'
            )
          ).RegistrationOfGoodsPolicyModule,
        data: { title: 'Alta de bienes en pólizas' },
      },
      {
        path: 'loss-of-policy',
        loadChildren: async () =>
          (await import('./loss-of-goods-policy/loss-of-goods-policy.module'))
            .LossOfGoodsPolicyModule,
        data: { title: 'Baja de bienes en pólizas' },
      },
      {
        path: 'maintenance',
        loadChildren: async () =>
          (await import('./maintenance/maintenance.module')).MaintenanceModule,
        data: { title: 'Mantenimiento' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsuranceAndSurveillanceRoutingModule {}
