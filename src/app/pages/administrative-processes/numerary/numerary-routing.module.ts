import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositTokensComponent } from './deposit-tokens/deposit-tokens.component';
import { NumeraryComponent } from './numerary.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: NumeraryComponent,
    children: [
      { path: 'deposit-tokens', component: DepositTokensComponent },
      {
        path: 'numerary-calc',
        loadChildren: async () =>
          (await import('./numerary-calc/numerary-calc.module'))
            .NumeraryCalcModule,
        data: { title: 'Calculo de numerario' },
      },
      {
        path: 'numerary-request',
        loadChildren: async () =>
          (await import('./numerary-request/numerary-request.module'))
            .NumeraryRequestModule,
        data: { title: 'Solicitud de numerario' },
      },
      {
        path: 'numerary-massive-consiliation',
        loadChildren: async () =>
          (
            await import(
              './numerary-massive-conciliation/numerary-massive-conciliation.module'
            )
          ).NumeraryMassiveConciliationModule,
        data: { title: 'Conciliación masiva numerario' },
      },
      {
        path: 'central-offices-transference',
        loadChildren: async () =>
          (
            await import(
              './central-offices-transference/central-offices-transference.module'
            )
          ).CentralOfficesTransferenceModule,
        data: { title: 'Transferencia de cuentas a oficinas centrales' },
      },
      {
        path: 'regional-accounts-transference',
        loadChildren: async () =>
          (
            await import(
              './regional-account-transference/regional-account-transference.module'
            )
          ).RegionalAccountTransferenceModule,
        data: { title: 'Transferencia de cuentas Regionales' },
      },
      {
        path: 'tesofe-movements',
        loadChildren: async () =>
          (await import('./tesofe-movements/tesofe-movements.module'))
            .TesofeMovementsModule,
        data: { title: 'Movimientos tesofe' },
      },
      {
        path: 'deposit-tokens-conciliation',
        loadChildren: async () =>
          (
            await import(
              './deposit-consiliation-tokens/deposit-consiliation-tokens.module'
            )
          ).DepositConsiliationTokensModule,
        data: { title: 'Conciliacion de fichas de deposito vs expediente' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NumeraryRoutingModule {}
