import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { SurveillanceConceptsRoutingModule } from './surveillance-concepts-routing.module';
import { SurveillanceConceptsComponent } from './surveillance-concepts/surveillance-concepts.component';

@NgModule({
  declarations: [SurveillanceConceptsComponent],
  imports: [
    CommonModule,
    SurveillanceConceptsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class SurveillanceConceptsModule {}
