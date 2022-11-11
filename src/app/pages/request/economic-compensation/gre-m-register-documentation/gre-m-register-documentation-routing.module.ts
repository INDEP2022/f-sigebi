import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GreCRegisterDocumentationMainComponent } from './gre-c-register-documentation-main/gre-c-register-documentation-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: GreCRegisterDocumentationMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreMRegisterDocumentationRoutingModule {}
