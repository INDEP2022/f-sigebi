import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectsRegisterComponent } from './subjects-register/subjects-register.component';

const routes: Routes = [
  {
    path: '',
    component: SubjectsRegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubjectsRegisterRoutingModule {}
