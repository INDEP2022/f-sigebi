import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBmFFrCrCRectificationFieldsComponent } from './c-bm-f-fr-cr-c-rectification-fields/c-bm-f-fr-cr-c-rectification-fields.component';

const routes: Routes = [
  {
    path: '',
    component: CBmFFrCrCRectificationFieldsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CBmFFrCrMRectificationFieldsRoutingModule { }
