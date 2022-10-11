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
  },
  {
    path: 'c-b-a-cda-m-appraisal-consultation',
    loadChildren: async () =>
      (await import('./shared-marketing-components/c-b-a-cda-m-appraisal-consultation/c-b-a-cda-m-appraisal-consultation.module')).CBACdaMAppraisalConsultationModule,
    data: { title: 'Consulta de Avalúo' },
  },
  {
    path: 'c-b-a-rda-m-appraisal-registration',
    loadChildren: async () =>
      (await import('./shared-marketing-components/c-b-a-rda-m-appraisal-registration/c-b-a-rda-m-appraisal-registration.module')).CBARdaMAppraisalRegistrationModule,
    data: { title: 'Registro de Avalúos' },
  },
  {
    path: 'c-b-ge-cdg-m-expense-capture',
    loadChildren: async () =>
      (await import('./shared-marketing-components/c-b-ge-cdg-m-expense-capture/c-b-ge-cdg-m-expense-capture.module')).CBGeCdgMExpenseCaptureModule,
    data: { title: 'Captura de gastos' },
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
