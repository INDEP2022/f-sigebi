import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpTradesRegistrationRoutingModule } from './gp-trades-registration-routing.module';
import { GpTradesRegistrationComponent } from './gp-trades-registration/gp-trades-registration.component';

@NgModule({
  declarations: [GpTradesRegistrationComponent],
  imports: [CommonModule, GpTradesRegistrationRoutingModule, SharedModule],
})
export class GpTradesRegistrationModule {}
