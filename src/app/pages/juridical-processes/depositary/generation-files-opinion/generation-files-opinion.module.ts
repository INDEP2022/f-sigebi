import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GenerationFilesOpinionRoutingModule } from './generation-files-opinion-routing.module';
import { GenerationFilesOpinionComponent } from './generation-files-opinion/generation-files-opinion.component';

@NgModule({
  declarations: [GenerationFilesOpinionComponent],
  imports: [CommonModule, GenerationFilesOpinionRoutingModule, SharedModule],
})
export class GenerationFilesOpinionModule {}
