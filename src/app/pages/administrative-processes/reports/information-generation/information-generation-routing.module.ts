import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationGenerationComponent } from './information-generation/information-generation.component';

const routes: Routes = [
  {
    path: '',
    component: InformationGenerationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformationGenerationRoutingModule {}
