import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDGfoCGenerationFilesOpinionComponent } from './jp-d-gfo-c-generation-files-opinion/jp-d-gfo-c-generation-files-opinion.component';

const routes: Routes = [
  {
    path: '',
    component: JpDGfoCGenerationFilesOpinionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMGenerationFilesOpinionRoutingModule {}
