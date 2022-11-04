import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReturnConfiscationPropertyComponent } from './return-confiscation-property/return-confiscation-property.component';

const routes: Routes = [
  {
    path: '',
    component: ReturnConfiscationPropertyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnConfiscationPropertyRoutingModule {}
