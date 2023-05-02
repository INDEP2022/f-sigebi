import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerationFilesOpinionComponent } from './generation-files-opinion/generation-files-opinion.component';

const routes: Routes = [
  {
    path: '',
    component: GenerationFilesOpinionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerationFilesOpinionRoutingModule {}
