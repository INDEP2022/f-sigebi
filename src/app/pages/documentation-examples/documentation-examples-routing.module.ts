import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentationExamplesComponent } from './base-page-documentation/documentation-examples.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentationExamplesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentationExamplesRoutingModule {}
