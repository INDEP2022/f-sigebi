import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'destruction-acts',
    loadChildren: () =>
      import('./destruction-acts/destruction-acts.module').then(
        m => m.DestructionActsModule
      ),
    data: { title: 'Actas de Destrucción', screen: 'FACTDESACTASDESTR' },
  },
  {
    path: 'donation-acts',
    loadChildren: () =>
      import('./donation-acts/donation-acts.module').then(
        m => m.DonationActsModule
      ),
    data: { title: 'Actas de Donación', screen: 'FACTDESACTASDONAC' },
  },
  {
    path: 'destination-acts',
    loadChildren: () =>
      import('./destination-acts/destination-goods-acts.module').then(
        m => m.DestinationGoodsActsModule
      ),
    data: { title: 'Actas de Destino', screen: 'FACTDESACTASUTILI' },
  },
  {
    path: 'return-acts',
    loadChildren: () =>
      import('./return-acts/return-acts.module').then(
        m => m.FdpAddMReturnActsModule
      ),
    data: { title: 'Actas de Devolución', screen: 'FACTREFACTADEVOLU' },
  },
  {
    path: 'third-possession-acts',
    loadChildren: () =>
      import('./third-party-possession-acts/third-possession-acts.module').then(
        m => m.ThirdPossessionActsModule
      ),
    data: {
      title: 'Actas de Posesión a Terceros',
      screen: 'FACTREFACTAPOSTER',
    },
  },
  {
    path: 'report-of-acts',
    loadChildren: () =>
      import('./report-of-acts/report-of-acts.module').then(
        m => m.ReportOfActsModule
      ),
    data: {
      title: 'Reporte de Actas Donación/Destrucción/Destino ',
      screen: 'FGERDESACTADONUTI',
    },
  },
  {
    path: 'delivery-schedule',
    loadChildren: () =>
      import('./delivery-schedule/delivery-schedule.module').then(
        m => m.DeliveryScheduleModule
      ),
    data: {
      title: 'Programación de Entregas',
      screen: 'FINDICA_0035V',
    },
  },
  {
    path: 'donation-process',
    loadChildren: () =>
      import('./donation-process/donation-process.module').then(
        m => m.DonationProcessModule
      ),
  },
  {
    path: 'circumstantial-acts-suspension-cancellation',
    loadChildren: () =>
      import(
        './circumstantial-acts-suspension-cancellation/circumstantial-acts-suspension-cancellation.module'
      ).then(m => m.CircumstantialActsSuspensionCancellationModule),
    data: {
      title: 'Actas Circunstanciadas de Suspensión/Cancelación',
      screen: 'FACTCIRCUN_0001',
    },
  },
  {
    path: 'acts-circumstantiated-cancellation-theft',
    loadChildren: () =>
      import(
        './acts-circumstantiated-cancellation-theft/acts-circumstantiated-cancellation-theft.module'
      ).then(m => m.ActsCircumstantiatedCancellationTheftModule),
    data: {
      title: 'Actas Circunstanciadas de Cancelación de Ent por Robo',
      screen: 'FACTCIRCUNR_0001',
    },
  },
  {
    path: 'proof-of-delivery',
    loadChildren: () =>
      import('./proof-of-delivery/proof-of-delivery.module').then(
        m => m.ProofOfDeliveryModule
      ),
    data: {
      title: 'Constancias de Entrega',
      screen: 'FACTCONST_0001',
    },
  },
  {
    path: 'acts-goods-delivered',
    loadChildren: () =>
      import('./acts-goods-delivered/acts-goods-delivered.module').then(
        m => m.ActsGoodsDeliveredModule
      ),
    data: {
      title: 'Bienes Entregados para Estudio',
      screen: 'FACTREFACTAENTEST',
    },
  },
  {
    path: 'acts-regularization-non-existence',
    loadChildren: () =>
      import(
        './acts-regularization-non-existence/acts-regularization-non-existence.module'
      ).then(m => m.ActsRegularizationNonExistenceModule),
    data: {
      title: 'Actas de Regularización por Inexistencia Física',
      screen: 'FACTDESACTASRIF',
    },
  },
  {
    path: 'return-acts-report',
    loadChildren: () =>
      import('./return-acts-report/return-acts-report.module').then(
        m => m.ReturnActsReportModule
      ),
    data: {
      title: 'Reporte de Actas de Devolución',
      screen: 'FREPREFACTADEV',
    },
  },
  {
    path: 'check-donation-requirements',
    loadChildren: () =>
      import(
        './check-donation-requirements/check-donation-requirements.module'
      ).then(m => m.CheckDonationRequirementsModule),
  },
  {
    path: 'check-destruction-requirements',
    loadChildren: () =>
      import(
        './check-destruction-requirements/check-destruction-requirements.module'
      ).then(m => m.CheckDestructionRequirementsModule),
    data: {
      title: 'Comprobación de Requisitos Documentales por Destrucción',
      screen: 'FACTDESDICTAMEDES',
    },
  },
  {
    path: 'check-destination-requirements',
    loadChildren: () =>
      import(
        './check-destination-requirements/check-destination-requirements.module'
      ).then(m => m.CheckDestinationRequirementsModule),
    data: {
      title: 'Comprobación de Requisitos Documentales para Destino',
      screen: 'FACTDESDICTAMEUTI',
    },
  },
  {
    path: 'review-technical-sheets',
    loadChildren: () =>
      import('./review-technical-sheets/review-technical-sheets.module').then(
        m => m.ReviewTechnicalSheetsModule
      ),
    data: {
      title: 'Revisión de Fichas Técnicas',
      screen: 'FINDICA_0042',
    },
  },
  {
    path: 'technical-sheets',
    loadChildren: () =>
      import('./technical-sheets/technical-sheets.module').then(
        m => m.TechnicalSheetsModule
      ),
    data: {
      title: 'Fichas Técnicas',
      screen: 'FINDICA_0041',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinalDestinationProcessRoutingModule {}
