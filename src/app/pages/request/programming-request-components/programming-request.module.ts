import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProgrammingRequestRoutingModule } from './programming-request-routing.module';
import { DetailGoodProgrammingFormComponent } from './shared-components-programming/detail-good-programming-form/detail-good-programming-form.component';

@NgModule({
  declarations: [DetailGoodProgrammingFormComponent],
  imports: [CommonModule, ProgrammingRequestRoutingModule, SharedModule],
})
export class ProgrammingRequestModule {}
