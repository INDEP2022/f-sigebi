import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'register-additional-documentation',
    loadChildren: () =>
      import(
        './register-additional-documentation/msg-rdcbs-m-register-additional-documentation.module'
      ).then(m => m.MsgRdcbsMRegisterAdditionalDocumentationModule),
  },
  {
    path: 'register-request-goods/:id/:typeOfRequest',
    loadChildren: () =>
      import(
        './register-request-goods/msg-rsb-m-register-request-goods.module'
      ).then(m => m.MsgRsbMRegisterRequestGoodsModule),
  },
  {
    path: 'schedule-eye-visits/:id/:typeOfRequest',
    loadChildren: () =>
      import('./schedule-eye-visits/schedule-eye-visits.module').then(
        m => m.ScheduleEyeVisitsModule
      ),
  },
  {
    path: 'validate-eye-visit-result/:id/:typeOfRequest',
    loadChildren: () =>
      import(
        './validate-eye-visit-result/validate-eye-visit-result.module'
      ).then(m => m.ValidateEyeVisitResultModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageSimilarGoodsRoutingModule {}
