import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'good-types',
    loadChildren: async () =>
      (await import('./good-types/good-types.module')).GoodTypesModule,
    data: { title: 'Tipos de Bien' },
  },
  {
    path: 'good-subtypes',
    loadChildren: async () =>
      (await import('./good-subtypes/good-subtypes.module')).GoodSubtypesModule,
    data: { title: 'Subtipos de Bien' },
  },
  {
    path: 'delegations',
    loadChildren: async () =>
      (await import('./delegations/delegations.module')).DelegationsModule,
    data: { title: 'Delegaciones' },
  },
  {
    path: 'sub-delegations',
    loadChildren: async () =>
      (await import('./sub-delegations/sub-delegations.module'))
        .SubDelegationsModule,
    data: { title: 'Sub Delegaciones' },
  },
  {
    path: 'batch',
    loadChildren: async () =>
      (await import('./batch/batch.module'))
        .BatchModule,
    data: { title: 'Lotes' },
  },
  {
    path: 'minpub',
    loadChildren: async () =>
      (await import('./minpub/minpub.module'))
        .MinpubModule,
    data: { title: 'Minpub' },
  },
  {
    path: 'photograph-media',
    loadChildren: async () =>
      (await import('./photograph-media/photograph-media.module'))
        .PhotographMediaModule,
    data: { title: 'Medio Fotografía' },
  },
  {
    path: 'image-media',
    loadChildren: async () =>
      (await import('./image-media/image-media.module'))
        .ImageMediaModule,
    data: { title: 'Medio Imagen' },
  },
  {
    path: 'revision-reason',
    loadChildren: async () =>
      (await import('./revision-reason/revision-reason.module'))
        .RevisionReasonModule,
    data: { title: 'Motivo Revisión' },
  },
  {
    path: 'non-delivery-reasons',
    loadChildren: async () =>
      (await import('./non-delivery-reasons/non-delivery-reasons.module'))
        .NonDeliveryReasonsModule,
    data: { title: 'Motivo No Entrega' },
  },
  {
    path: 'municipalities',
    loadChildren: async () =>
      (await import('./municipalities/municipalities.module'))
        .MunicipalitiesModule,
    data: { title: 'Municipios' },
  },
  {
    path: 'norms',
    loadChildren: async () =>
      (await import('./norms/norms.module'))
        .NormsModule,
    data: { title: 'Normas' },
  },
  {
    path: 'notary',
    loadChildren: async () =>
      (await import('./notary/notary.module'))
        .NotaryModule,
    data: { title: 'Notarios' },
  },
  {
    path: 'paragraphs',
    loadChildren: async () =>
      (await import('./paragraphs/paragraphs.module'))
        .ParagraphsModule,
    data: { title: 'Párrafos' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
