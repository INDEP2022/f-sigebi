import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { TradesRegistrationRoutingModule } from './trades-registration-routing.module';
import { TradesRegistrationComponent } from './trades-registration/trades-registration.component';

@NgModule({
  declarations: [TradesRegistrationComponent],
  imports: [CommonModule, TradesRegistrationRoutingModule, SharedModule],
})
export class TradesRegistrationModule {}
