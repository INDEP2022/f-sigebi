import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveillanceConceptsRoutingModule } from './surveillance-concepts-routing.module';
import { SurveillanceConceptsComponent } from './surveillance-concepts/surveillance-concepts.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

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
