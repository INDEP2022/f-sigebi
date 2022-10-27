import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBmVmCdeCEntityClassificationComponent } from './c-bm-vm-cde-c-entity-classification/c-bm-vm-cde-c-entity-classification.component';

const routes: Routes = [
  {
    path: '',
    component: CBmVmCdeCEntityClassificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CBmVmCdeMEntityClassificationRoutingModule { }
