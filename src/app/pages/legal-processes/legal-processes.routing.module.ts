import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalProcessesComponent } from './legal-processes.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: LegalProcessesComponent,
    children: [
      {
        path: 'fact-jur-dict-amas',
        loadChildren: () =>
          import('./fact-jur-dict-amas/fact-jur-dict-amas.module').then(
            m => m.FactJurDictAmasModule
          ),
      },
      // {
      //   path: 'fact-gen-act-datex', loadChildren: () => import('./fact-gen-act-datex/fact-gen-act-datex.module')
      //   .then(m => m.FactGenActDatexModule)
      // },
      {
        path: 'fact-gen-exped-notif',
        loadChildren: () =>
          import('./fact-gen-exped-notif/fact-gen-exped-notif.module').then(
            m => m.FactGenExpedNotifModule
          ),
      },
      {
        path: 'fact-jur-abandonos',
        loadChildren: () =>
          import('./fact-jur-abandonos/fact-jur-abandonos.module').then(
            m => m.FactJurAbonadosModule
          ),
      },
      {
        path: 'fact-jurreg-dest-leg',
        loadChildren: () =>
          import('./fact-jurreg-dest-leg/fact-jurreg-dest-leg.module').then(
            m => m.FactJurregDestLegModule
          ),
      },
      // {
      //   path: 'fact-adb-sol-dest-leg', loadChildren: () => import('./fact-adb-sol-dest-leg/fact-adb-sol-dest-leg.module')
      //   .then(m => m.FactAdbSolDestLegModule)
      // },
      // {
      //   path: 'fact-condepo-concil-pag', loadChildren: () => import('./fact-condepo-concil-pag/fact-condepo-concil-pag.module')
      //   .then(m => m.FactCondepoConcilPagModule)
      // },
      // {
      //   path: 'fact-con-depo-dis-pagos', loadChildren: () => import('./fact-con-depo-dis-pagos/fact-con-depo-dis-pagos.module')
      //   .then(m => m.FactConDepoDisPagosModule)
      // },
      // {
      //   path: 'fact-ger-dir-nombra-depo', loadChildren: () => import('./fact-ger-dir-nombra-depo/fact-ger-dir-nombra-depo.module')
      //   .then(m => m.FactGerDirNombraDepoModule)
      // },
      // {
      //   path: 'fact-gena-db-bienes-dep', loadChildren: () => import('./fact-gena-db-bienes-dep/fact-gena-db-bienes-dep.module')
      //   .then(m => m.FactGenaDBBienesXDepModule)
      // },
      // {
      //   path: 'fact-jur-emision-acu', loadChildren: () => import('./fact-jur-emision-acu/fact-jur-emision-acu.module')
      //   .then(m => m.FactJurEmisionAcuModule)
      // },
      // {
      //   path: 'fact-jur-bienes-x-amp', loadChildren: () => import('./fact-jur-bienes-x-amp/fact-jur-bienes-x-amp.module')
      //   .then(m => m.FactJurBienesXAmpModule)
      // },
      // {
      //   path: 'fact-conjur-noti-poster', loadChildren: () => import('./fact-conjur-noti-poster/fact-conjur-noti-poster.module')
      //   .then(m => m.FactConjurNotiPosterModule)
      // },
      // {
      //   path: 'fact-jur-dictam-recr', loadChildren: () => import('./fact-jur-dictam-recr/fact-jur-dictam-recr.module')
      //   .then(m => m.FactJurDictamRecrModule)
      // },
      // {
      //   path: 'fact-jurresore-crev', loadChildren: () => import('./fact-jurresore-crev/fact-jurresore-crev.module')
      //   .then(m => m.FactJurresoreCrevModule)
      // },
      // {
      //   path: 'fact-ger-jurrec-derev', loadChildren: () => import('./fact-ger-jurrec-derev/fact-ger-jurrec-derev.module')
      //   .then(m => m.FactGerJurrecDerevModule)
      // },
      // {
      //   path: 'fact-carga-mas-desahogo', loadChildren: () => import('./fact-carga-mas-desahogo/fact-carga-mas-desahogo.module')
      //   .then(m => m.FactCargaMasDesahogoModule)
      // },
      // {
      //   path: 'fact-bie-val-pos-tercero', loadChildren: () => import('./fact-bie-val-pos-tercero/fact-bie-val-pos-tercero.module')
      //   .then(m => m.FactBieValPosTerceroModule)
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalProcessesRoutingModule {}

export const routedComponents = [LegalProcessesComponent];
