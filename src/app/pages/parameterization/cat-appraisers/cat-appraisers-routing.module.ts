import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatAppraisersComponent } from './cat-appraisers/cat-appraisers.component';

const routes: Routes = [
  {
    path: '',
    component: CatAppraisersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatAppraisersRoutingModule {}
