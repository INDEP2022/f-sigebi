import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { NumeraryRequestRoutingModule } from './numerary-request-routing.module';
import { NumeraryRequestComponent } from './numerary-request/numerary-request.component';

@NgModule({
  declarations: [NumeraryRequestComponent],
  imports: [
    CommonModule,
    NumeraryRequestRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class NumeraryRequestModule {}
