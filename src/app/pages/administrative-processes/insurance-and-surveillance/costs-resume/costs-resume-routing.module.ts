import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostsResumeComponent } from './costs-resume/costs-resume.component';

const routes: Routes = [
  {
    path: '',
    component: CostsResumeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CostsResumeRoutingModule {}
