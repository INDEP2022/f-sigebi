import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterAdditionalDocumentationComponent } from './register-additional-documentation/register-additional-documentation.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterAdditionalDocumentationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterAdditionalDocumentationRoutingModule {}
