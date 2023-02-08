import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiscationRatioComponent } from './confiscation-ratio/confiscation-ratio.component';

const routes: Routes = [
  {
    path: '',
    component: ConfiscationRatioComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiscationRatioRoutingModule {}
