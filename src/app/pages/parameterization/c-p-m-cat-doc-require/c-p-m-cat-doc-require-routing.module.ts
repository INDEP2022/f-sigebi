import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCCatDocRequireComponent } from './c-p-c-cat-doc-require/c-p-c-cat-doc-require.component';

const routes: Routes = [
  {
    path: '',
    component: CPCCatDocRequireComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMCatDocRequireRoutingModule {}
