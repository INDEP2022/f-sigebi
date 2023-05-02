import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceptionAreaSeraComponent } from './reception-area-sera/reception-area-sera.component';

const routes: Routes = [
  {
    path: '',
    component: ReceptionAreaSeraComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceptionAreaSeraRoutingModule {}
