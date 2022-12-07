import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { AccountStatusRoutingModule } from './account-status-routing.module';
import { AccountStatusComponent } from './account-status/account-status.component';

@NgModule({
  declarations: [AccountStatusComponent],
  imports: [CommonModule, AccountStatusRoutingModule, SharedModule],
})
export class AccountStatusModule {}
