import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateMssValueComponent } from './update-mss-value/update-mss-value.component';

const routes: Routes = [
  {
    path: '',
    component: UpdateMssValueComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateMssValueRoutingModule {}
