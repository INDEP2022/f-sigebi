import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { JpDGfoCGenerationFilesOpinionComponent } from './jp-d-gfo-c-generation-files-opinion/jp-d-gfo-c-generation-files-opinion.component';
import { JpDMGenerationFilesOpinionRoutingModule } from './jp-d-m-generation-files-opinion-routing.module';

@NgModule({
  declarations: [JpDGfoCGenerationFilesOpinionComponent],
  imports: [
    CommonModule,
    JpDMGenerationFilesOpinionRoutingModule,
    SharedModule,
  ],
})
export class JpDMGenerationFilesOpinionModule {}
