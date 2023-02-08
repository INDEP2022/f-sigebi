import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttributeParametrizationListComponent } from './attribute-parametrization-list/attribute-parametrization-list.component';

const routes: Routes = [
  {
    path: '',
    component: AttributeParametrizationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttributeParametrizationRoutingModule {}
