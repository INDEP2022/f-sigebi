import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityClassificationComponent } from './entity-classification/entity-classification.component';

const routes: Routes = [
  {
    path: '',
    component: EntityClassificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntityClassificationRoutingModule {}
