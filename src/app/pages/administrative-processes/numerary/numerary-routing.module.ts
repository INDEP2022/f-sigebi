import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NumeraryComponent } from './numerary.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: NumeraryComponent,
    children: [
      {
        path: 'deposit-tokens',
        loadChildren: async () =>
          (await import('./deposit-tokens/deposit-tokens.module'))
            .DepositTokensModule,
        data: { title: 'Fichas de depósito', screen: 'FACTADBFICHASDEPO' },
      },
      {
        path: 'numerary-calc',
        loadChildren: async () =>
          (await import('./numerary-calc/numerary-calc.module'))
            .NumeraryCalcModule,
        data: { title: 'Calculo de numerario', screen: 'FPROSOLNUMERARIO' },
      },
      {
        path: 'numerary-request',
        loadChildren: async () =>
          (await import('./numerary-request/numerary-request.module'))
            .NumeraryRequestModule,
        data: { title: 'Solicitud de numerario', screen: 'FREGSOLNUMERARIO' },
      },
      {
        path: 'numerary-massive-consiliation',
        loadChildren: async () =>
          (
            await import(
              './numerary-massive-conciliation/numerary-massive-conciliation.module'
            )
          ).NumeraryMassiveConciliationModule,
        data: {
          screen: 'FMASIVCONCILNUME',
          title: 'Conciliación masiva numerario',
        },
      },
      {
        path: 'central-offices-transference',
        loadChildren: async () =>
          (
            await import(
              './central-offices-transference/central-offices-transference.module'
            )
          ).CentralOfficesTransferenceModule,
        data: {
          scrren: 'FTRANSFCUENXREG_DEV',
          title: 'Transferencia de cuentas a oficinas centrales',
        },
      },
      {
        path: 'regional-accounts-transference',
        loadChildren: async () =>
          (
            await import(
              './regional-account-transference/regional-account-transference.module'
            )
          ).RegionalAccountTransferenceModule,
        data: {
          screen: 'FTRANSFCUENXREG',
          title: 'Transferencia de cuentas Regionales',
        },
      },
      {
        path: 'tesofe-movements',
        loadChildren: async () =>
          (await import('./tesofe-movements/tesofe-movements.module'))
            .TesofeMovementsModule,
        data: { title: 'Movimientos tesofe', screen: 'FACTADBINTERESCTA' },
      },
      {
        path: 'deposit-tokens-conciliation',
        loadChildren: async () =>
          (
            await import(
              './deposit-consiliation-tokens/deposit-consiliation-tokens.module'
            )
          ).DepositConsiliationTokensModule,
        data: {
          screen: 'FACTADBFICHASBIEN',
          title: 'Conciliacion de fichas de deposito vs expediente',
        },
      },
      {
        path: 'effective-numerary-devolution',
        loadChildren: async () =>
          (
            await import(
              './effective-numerary-devolution/effective-numerary-devolution.module'
            )
          ).EffectiveNumeraryDevolutionModule,
        data: {
          screen: 'FGERADBDEVNUMEFEC',
          title: 'Devolución de numerario efectivo',
        },
      },
      {
        path: 'accounts-insured-by-file',
        loadChildren: async () =>
          (
            await import(
              './accounts-insured-by-file/accounts-insured-by-file.module'
            )
          ).AccountsInsuredByFileModule,
        data: {
          screen: 'FGENADBCTASASEGEX',
          title: 'Cuentas aseguradas por expediente',
        },
      },
      {
        path: 'effective-numerary-reconciliation',
        loadChildren: async () =>
          (
            await import(
              './effective-numerary-reconciliation/effective-numerary-reconciliation.module'
            )
          ).EffectiveNumeraryReconciliationModule,
        data: {
          screen: 'FGERADBCONCNUMEFE',
          title: 'Conciliación de numerario efectivo',
        },
      },
      {
        path: 'bank-accounts-insured',
        loadChildren: async () =>
          (await import('./bank-accounts-insured/bank-accounts-insured.module'))
            .BankAccountsInsuredModule,
        data: {
          screen: 'FGENADBCTASASEGBA',
          title: 'Cuentas aseguradas por bancos',
        },
      },
      {
        path: 'massive-account-indiciado',
        loadChildren: async () =>
          (
            await import(
              './print-massive-accounts/print-massive-accounts.module'
            )
          ).PrintMassiveAccountsModule,
        data: {
          screen: 'FGERADBIMPRMASIVA',
          title: 'Estado de cuenta por Indiciado',
        },
      },
      {
        path: 'unreconcilied-files',
        loadChildren: async () =>
          (await import('./unreconciled-files/unreconciled-files.module'))
            .UnreconciledFilesModule,
        data: {
          screen: 'FGERADBEXPESCONCI',
          title: 'Expedientes sin conciliar',
        },
      },
      {
        path: 'deposit-unreconcilied-files',
        loadChildren: async () =>
          (
            await import(
              './deposit-unreconcilied-files/deposit-unreconcilied-files.module'
            )
          ).DepositUnreconciliedFilesModule,
        data: {
          screen: 'FGERADBFICHADEPOS',
          title: 'Fichas de deposito sin conciliar',
        },
      },
      {
        path: 'confiscation-ratio',
        loadChildren: async () =>
          (await import('./confiscation-ratio/confiscation-ratio.module'))
            .ConfiscationRatioModule,
        data: {
          screen: 'FRELDECOMISO',
          title: 'Relación de decomiso',
        },
      },
      {
        path: 'record-account-statements',
        loadChildren: async () =>
          (
            await import(
              './record-account-statements/record-account-statements.module'
            )
          ).RecordAccountStatementsModule,
        data: {
          screen: 'FACTADBESTADOSCTA',
          title: 'Registro de Estados de cuenta',
        },
      },
      {
        path: 'deposit-account-statement',
        loadChildren: async () =>
          (
            await import(
              './deposit-account-statement/deposit-account-statement.module'
            )
          ).DepositAccountStatementModule,
        data: {
          screen: 'FCONADBEDOCTAXIND',
          title: 'Estado de cuenta (Deposito)',
        },
      },
      {
        path: 'rate-catalog',
        loadChildren: async () =>
          (await import('./rate-catalog/rate-catalog.module'))
            .RateCatalogModule,
        data: {
          screen: 'FPROINTERES',
          title: 'Tasas para interes',
        },
      },
      {
        path: 'massive-numerary-change',
        loadChildren: async () =>
          (
            await import(
              './massive-numerary-change/massive-numerary-change.module'
            )
          ).MassiveNumeraryChangeModule,
        data: {
          screen: 'FMASINSUNUMERARIO',
          title: 'Cambio a numerario masivo',
        },
      },
      {
        path: 'numerary-historical-closing',
        loadChildren: async () =>
          (
            await import(
              './numerary-historical-closing/numerary-historical-closing.module'
            )
          ).NumeraryHistoricalClosingModule,
        data: {
          screen: 'FACTADBACIERRENUM',
          title: 'Cierre historico de numerario',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NumeraryRoutingModule {}
