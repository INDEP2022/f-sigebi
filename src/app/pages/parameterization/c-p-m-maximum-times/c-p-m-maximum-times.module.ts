import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CPMMaximumTimesRoutingModule } from './c-p-m-maximum-times-routing.module';
import { CPMMaximumTimesComponent } from './c-p-m-maximum-times/c-p-m-maximum-times.component';

@NgModule({
  declarations: [CPMMaximumTimesComponent],
  imports: [CommonModule, CPMMaximumTimesRoutingModule, SharedModule],
})
export class CPMMaximumTimesModule {}
