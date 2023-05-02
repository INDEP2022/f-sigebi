import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'verify-noncompliance',
    loadChildren: async () =>
      (
        await import(
          './generate-formats-verify-noncompliance/generate-formats-verify-noncompliance.module'
        )
      ).GenerateFormatsVerifyNoncomplianceModule,
    data: { title: 'Generar formatos para verificar el incumplimiento' },
  },
  {
    path: 'assets-classification',
    loadChildren: async () =>
      (await import('./assets-classification/assets-classification.module'))
        .AssetsClassificationModule,
    data: { title: 'Clasificación de Bienes (Formato J Y K)' },
  },
  {
    path: 'verify-warehouse-assets',
    loadChildren: async () =>
      (await import('./warehouse-verification/warehouse-verification.module'))
        .WarehouseVerificationModule,
    data: { title: 'Verificación de Bienes de Almacen' },
  },
  {
    path: 'restitution-of-assets',
    loadChildren: async () =>
      (
        await import(
          './restitution-assets-numeric-or-sort/restitution-assets-numeric-or-sort.module'
        )
      ).RestitutionAssetsNumericOrSortModule,
    data: { title: 'Restitución de Bienes (numerario o especie)' },
  },
  {
    path: 'deposit-payment-validations',
    loadChildren: async () =>
      (
        await import(
          './deposit-payment-validations/deposit-payment-validations.module'
        )
      ).DepositPaymentValidationsModule,
    data: { title: 'Validación de pagos de fichas de depósito' },
  },
  {
    path: 'assets-approval',
    loadChildren: async () =>
      (await import('./assets-approval/assets-approval.module'))
        .AssetsApprovalModule,
    data: { title: 'Aprobación de bienes' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateSamplingSupervisionRoutingModule {}
