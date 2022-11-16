import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCCatRelationshipOpinionComponent } from './c-p-c-cat-relationship-opinion/c-p-c-cat-relationship-opinion.component';

const routes: Routes = [
  {
    path: '',
    component: CPCCatRelationshipOpinionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMCatRelationshipOpinionRoutingModule {}
