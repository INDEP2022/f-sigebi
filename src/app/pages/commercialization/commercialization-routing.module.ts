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
];

@NgModule({
  declarations: [
    CommercializationComponent
  ],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommercializationRoutingModule { }
