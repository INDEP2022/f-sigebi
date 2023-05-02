import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatOfSeparatorsDocumentsComponent } from './cat-of-separators-documents/cat-of-separators-documents.component';

const routes: Routes = [
  {
    path: '',
    component: CatOfSeparatorsDocumentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatOfSeparatorsDocumentsRoutingModule {}
