import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentationComplementaryFormComponent } from './documentation-complementary-form/documentation-complementary-form.component';
import { DocumentationComplementaryRegisterFormComponent } from './documentation-complementary-register-form/documentation-complementary-register-form.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentationComplementaryFormComponent,
  },
  {
    path: 'register',
    component: DocumentationComplementaryRegisterFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentationComplementaryRoutingModule {}
