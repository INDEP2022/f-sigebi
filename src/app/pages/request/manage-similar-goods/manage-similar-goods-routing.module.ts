import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'register-additional-documentation',
    loadChildren: () =>
      import(
        './register-additional-documentation/register-additional-documentation.module'
      ).then(m => m.RegisterAdditionalDocumentationModule),
  },
  {
    path: 'register-request-goods/:id/:typeOfRequest',
    loadChildren: () =>
      import('./register-request-goods/register-request-goods.module').then(
        m => m.RegisterRequestGoodsModule
      ),
  },
  {
    path: 'schedule-eye-visits/:id/:typeOfRequest',
    loadChildren: () =>
      import('./schedule-eye-visits/schedule-eye-visits.module').then(
        m => m.ScheduleEyeVisitsModule
      ),
  },
  {
    path: 'receive-validation-of-eye-visit-result/:id/:typeOfRequest',
    loadChildren: () =>
      import(
        './receive-validation-of-eye-visit-result/receive-validation-of-eye-visit-result.module'
      ).then(m => m.ReceiveValidationOfEyeVisitResultModule),
  },
  {
    path: 'transf-notification/:id/:typeOfRequest',
    loadChildren: () =>
      import('./transf-notification/transf-notification.module').then(
        m => m.TransfNotificationModule
      ),
  },
  {
    path: 'prepare-response-office/:id/:typeOfRequest',
    loadChildren: () =>
      import('./prepare-response-office/prepare-response-office.module').then(
        m => m.PrepareResponseOfficeModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageSimilarGoodsRoutingModule {}
