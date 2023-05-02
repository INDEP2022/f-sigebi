import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { SpecsFormComponent } from './specs-form/specs-form.component';
import { SpecsRoutingModule } from './specs-routing.module';
import { SpecsComponent } from './specs/specs.component';

@NgModule({
  declarations: [SpecsComponent, SpecsFormComponent],
  imports: [CommonModule, SpecsRoutingModule, SharedModule],
})
export class SpecsModule {}
