import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrativeProcessesComponent } from './administrative-processes.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: AdministrativeProcessesComponent,
    children: [
       {
        path: 'numerary-operator',
        loadChildren: async () =>
          (await import('./numerary-operator/numerary-operator.module')).NumeraryOperatorModule,
        data: { title: 'Numerario Operado' },
      },
      /*{
        path: 'numerary-physics', loadChildren: () => import('./numerary-physics/numerary-physics.module')
          .then(m => m.NumeraryPhysicsModule)
      },*/
      {
        path: 'summary-financial-info', loadChildren: () => import('./companies/financial-info/pa-e-fi-m-financial-info.module')
          .then(m => m.PaEFiMFinancialInfoModule)
      },
      {
        path: 'warehouse-reports', loadChildren: () => import('./reports/warehouse/pa-r-wh-m-warehouse.module')
          .then(m => m.PaRWhMWarehouseModule)
      },
      /*{
        path: 'storehouse', loadChildren: () => import('./storehouse/storehouse.module')
          .then(m => m.StorehouseModule)
      },
      {
        path: 'record', loadChildren: () => import('./record/record.module')
          .then(m => m.RecordModule)
      },
      {
        path: 'unit-conversion-packages', loadChildren: () => import('./unit-conversion-packages/unit-conversion-packages.module')
          .then(m => m.UnitConversionPackagesModule)
      },
      {
        path: 'goods-tracking', loadChildren: () => import('./goods-tracking/goods-tracking.module')
          .then(m => m.GoodsTrackingModule)
      },
      {
        path: 'goods-management', loadChildren: () => import('./goods-management/goods-management.module')
          .then(m => m.GoodsManagementModule)
      },
      {
        path: 'siab-sami-interaction', loadChildren: () => import('./siab-sami-interaction/siab-sami-interaction.module')
          .then(m => m.SiabSamiInteractionModule)
      }*/
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativeProcessesRoutingModule { }
