import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsgRdcbsCRegisterAdditionalDocumentationComponent } from './register-additional-documentation/msg-rdcbs-c-register-additional-documentation.component';

const routes: Routes = [
  {
    path: '',
    component: MsgRdcbsCRegisterAdditionalDocumentationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MsgRdcbsMRegisterAdditionalDocumentationRoutingModule {}
