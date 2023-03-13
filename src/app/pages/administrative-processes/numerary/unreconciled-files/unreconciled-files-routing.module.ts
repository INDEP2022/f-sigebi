import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnreconciledFilesComponent } from './unreconciled-files/unreconciled-files.component';

const routes: Routes = [
  {
    path: '',
    component: UnreconciledFilesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnreconciledFilesRoutingModule {}
