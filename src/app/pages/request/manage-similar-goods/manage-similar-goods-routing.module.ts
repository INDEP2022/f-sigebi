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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageSimilarGoodsRoutingModule {}
