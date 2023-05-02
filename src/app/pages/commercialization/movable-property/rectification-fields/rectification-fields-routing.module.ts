import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RectificationFieldsComponent } from './rectification-fields/rectification-fields.component';

const routes: Routes = [
  {
    path: '',
    component: RectificationFieldsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RectificationFieldsRoutingModule {}
