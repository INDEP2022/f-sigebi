import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveillanceConceptsComponent } from './surveillance-concepts/surveillance-concepts.component';

const routes: Routes = [
  {
    path: '',
    component: SurveillanceConceptsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveillanceConceptsRoutingModule {}
