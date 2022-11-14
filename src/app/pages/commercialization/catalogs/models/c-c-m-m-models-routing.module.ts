import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CCMlCModelsListComponent } from './models-list/c-c-ml-c-models-list.component';

const routes: Routes = [
  {
    path: '',
    component: CCMlCModelsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CCMMModelsRoutingModule {}
