import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocReceivedAuthorityComponent } from './doc-received-authority/doc-received-authority.component';

const routes: Routes = [
  {
    path: '',
    component: DocReceivedAuthorityComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocReceivedAuthorityRoutingModule {}
