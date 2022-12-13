import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaximumTimesRoutingModule } from './maximum-times-routing.module';
import { MaximumTimesComponent } from './maximum-times/maximum-times.component';

@NgModule({
  declarations: [MaximumTimesComponent],
  imports: [CommonModule, MaximumTimesRoutingModule, SharedModule],
})
export class MaximumTimesModule {}
