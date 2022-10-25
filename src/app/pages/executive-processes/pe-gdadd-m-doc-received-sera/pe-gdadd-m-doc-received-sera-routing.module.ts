import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeGdaddCDocReceivedSeraComponent } from './pe-gdadd-c-doc-received-sera/pe-gdadd-c-doc-received-sera.component';

const routes: Routes = [
  {
    path: '',
    component: PeGdaddCDocReceivedSeraComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeGdaddMDocReceivedSeraRoutingModule { }
