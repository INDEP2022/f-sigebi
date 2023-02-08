import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatRelationshipOpinionComponent } from './cat-relationship-opinion/cat-relationship-opinion.component';

const routes: Routes = [
  {
    path: '',
    component: CatRelationshipOpinionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatRelationshipOpinionRoutingModule {}
