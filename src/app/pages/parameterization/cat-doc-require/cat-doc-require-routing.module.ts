import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatDocRequireComponent } from './cat-doc-require/cat-doc-require.component';

const routes: Routes = [
  {
    path: '',
    component: CatDocRequireComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatDocRequireRoutingModule {}
