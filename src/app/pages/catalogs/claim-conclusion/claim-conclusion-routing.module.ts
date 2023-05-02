import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimConclusionListComponent } from './claim-conclusion-list/claim-conclusion-list.component';

const routes: Routes = [
  {
    path: '',
    component: ClaimConclusionListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimConclusionRoutingModule {}
