import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalAffairListComponent } from './legal-affair-list/legal-affair-list.component';

const routes: Routes = [
  {
    path: '',
    component: LegalAffairListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalAffairRoutingModule {}
