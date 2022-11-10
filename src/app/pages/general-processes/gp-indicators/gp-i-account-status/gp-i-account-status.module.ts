import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { GpIAccountStatusRoutingModule } from './gp-i-account-status-routing.module';
import { GpIAccountStatusComponent } from './gp-i-account-status/gp-i-account-status.component';

@NgModule({
  declarations: [GpIAccountStatusComponent],
  imports: [CommonModule, GpIAccountStatusRoutingModule, SharedModule],
})
export class GpIAccountStatusModule {}
