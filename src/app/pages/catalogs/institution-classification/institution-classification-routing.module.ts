import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstitutionClassificationListComponent } from './institution-classification-list/institution-classification-list.component';

const routes: Routes = [
  {
    path: '',
    component: InstitutionClassificationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstitutionClassificationRoutingModule {}
