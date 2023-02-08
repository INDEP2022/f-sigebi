import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocReceivedSeraComponent } from './doc-received-sera/doc-received-sera.component';

const routes: Routes = [
  {
    path: '',
    component: DocReceivedSeraComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocReceivedSeraRoutingModule {}
