import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchAssignmentComponent } from './search-assignment/search-assignment.component';

const routes: Routes = [
  {
    path: '',
    component: SearchAssignmentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateRequestRoutingModule {}
