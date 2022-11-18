import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestitutionOfAssetsComponent } from './restitution-of-assets/restitution-of-assets.component';

const routes: Routes = [
  {
    path: '',
    component: RestitutionOfAssetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestitutionAssetsNumericOrSortRoutingModule {}
