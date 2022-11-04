import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { InformationGenerationRoutingModule } from './information-generation-routing.module';
import { InformationGenerationComponent } from './information-generation/information-generation.component';

@NgModule({
  declarations: [InformationGenerationComponent],
  imports: [CommonModule, InformationGenerationRoutingModule, SharedModule],
})
export class InformationGenerationModule {}
