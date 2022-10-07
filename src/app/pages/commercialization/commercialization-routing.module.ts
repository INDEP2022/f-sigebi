import { NgModule } from '@angular/core'; 
import { RouterModule, Routes } from '@angular/router';
import { CommercializationComponent } from './commercialization.component';

const routes: Routes = [
  {
    path: 'c-b-vdp-m-payment-dispersion-validation',
    loadChildren: async () =>
      (await import('./shared-marketing-components/c-b-vdp-m-payment-dispersion-validation/c-b-vdp-m-payment-dispersion-validation.module')).CBVdpMPaymentDispersionValidationModule,
    data: { title: 'Validación de bienes' },
  },
  {
    path: 'c-b-bedv-m-validation-exempted-goods',
    loadChildren: async () =>
      (await import('./shared-marketing-components/c-b-bedv-m-validation-exempted-goods/c-b-bedv-m-validation-exempted-goods.module')).CBBedvMValidationExemptedGoodsModule,
    data: { title: 'Bienes exentos de validación' },
  },
  {
    path: 'c-b-rdodi-m-reclass-recovery-orders',
    loadChildren: async () =>
      (await import('./shared-marketing-components/c-b-rdodi-m-reclass-recovery-orders/c-b-rdodi-m-reclass-recovery-orders.module')).CBRdodiMReclassRecoveryOrdersModule,
    data: { title: 'Reclasificación OI' },
  },
  {
    path: 'numeraire-conversion-tabs',
    loadChildren: async () =>
      (await import('./shared-marketing-components/numeraire-conversion-tabs/numeraire-conversion-tabs.module')).NumeraireConversionTabsModule,
    data: { title: 'Conversión a numerario' },
  }
];

@NgModule({
  declarations: [
    CommercializationComponent
  ],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommercializationRoutingModule { }
