import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterDocumentationMainComponent } from './register-documentation-main/register-documentation-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: RegisterDocumentationMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterDocumentationRoutingModule {}
