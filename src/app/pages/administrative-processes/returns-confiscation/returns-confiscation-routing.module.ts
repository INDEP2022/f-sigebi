import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReturnsConfiscationComponent } from './returns-confiscation/returns-confiscation.component';

const routes: Routes = [
  {
    path: '',
    component: ReturnsConfiscationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnsConfiscationRoutingModule {}
