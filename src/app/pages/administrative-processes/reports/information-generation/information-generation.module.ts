import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformationGenerationRoutingModule } from './information-generation-routing.module';
import { InformationGenerationComponent } from './information-generation/information-generation.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    InformationGenerationComponent
  ],
  imports: [
    CommonModule,
    InformationGenerationRoutingModule,
    SharedModule,
  ]
})
export class InformationGenerationModule { }
