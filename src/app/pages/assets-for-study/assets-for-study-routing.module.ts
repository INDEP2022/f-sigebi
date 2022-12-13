import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'generate-request',
    loadChildren: async () =>
      (await import('./generate-request/generate-request.module'))
        .GenerateRequestModule,
    data: { title: 'Generar solicitud' },
  },
  {
    path: 'assignment-list',
    loadChildren: async () =>
      (await import('./search-assignment-list/search-assignment-list.module'))
        .SearchAssignmentListModule,
    data: { title: 'Lista de asignaciones' },
  },
  {
    path: 'search-assests/:id',
    loadChildren: async () =>
      (await import('./search-assets-for-study/search-assets-for-study.module'))
        .SearchAssetsForStudyModule,
    data: { title: 'Búsqueda de bienes que se pueden estudiar' },
  },
  {
    path: 'prepare-request-for-responsables/:id',
    loadChildren: async () =>
      (
        await import(
          './prepare-request-responsables/prepare-request-responsables.module'
        )
      ).PrepareRequestResponsablesModule,
    data: { title: 'Elaborar solicitud a responsable del estudio' },
  },
  {
    path: 'save-answer/:id',
    loadChildren: async () =>
      (await import('./save-responsible-answer/save-responsible-answer.module'))
        .SaveResponsibleAnswerModule,
    data: { title: 'Guardar respuesta de la responsable del estudio' },
  },
  {
    path: 'schedule-delivery/:id',
    loadChildren: async () =>
      (
        await import(
          './schedule-delivery-assets/schedule-delivery-assets.module'
        )
      ).ScheduleDeliveryAssetsModule,
    data: { title: 'Programar entrega de bienes' },
  },

  {
    path: 'dictate-assets-to-be-study/:id',
    loadChildren: async () =>
      (await import('./dictate-assets-study/dictate-assets-study.module'))
        .DictateAssetsStudyModule,
    data: { title: 'Dictaminar bien a ser estudiado' },
  },
  //David modules
  {
    path: 'clasify-programmed-goods',
    loadChildren: async () =>
      (
        await import(
          './clasify-programmed-goods/clasify-programmed-goods.module'
        )
      ).ClasifyProgrammedGoodsModule,
    data: { title: 'Clasificar bienes programados' },
  },
  {
    path: 'generate-document-of-programmed-goods',
    loadChildren: async () =>
      (
        await import(
          './generate-document-of-programmed-goods/generate-document-of-programmed-goods.module'
        )
      ).GenerateDocumentOfProgrammedGoodsModule,
    data: { title: 'Generar e imprimir constancia de bienes programados' },
  },
  {
    path: 'change-destiny-delivered-goods',
    loadChildren: async () =>
      (
        await import(
          './change-destiny-delivered-good/change-destiny-delivered-good.module'
        )
      ).ChangeDestinyDeliveredGoodModule,
    data: { title: 'Cambiar destino al bien entregado' },
  },
  {
    path: 'generate-document-not-accepted-goods',
    loadChildren: async () =>
      (
        await import(
          './generate-document-not-accepted-goods/generate-document-not-accepted-goods.module'
        )
      ).GenerateDocumentNotAcceptedGoodsModule,
    data: { title: 'Generar e imprimir constancia de bienes no aceptados' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsForStudyRoutingModule {}
