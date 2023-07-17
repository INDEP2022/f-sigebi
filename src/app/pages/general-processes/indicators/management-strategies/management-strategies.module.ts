import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManagementStrategiesRoutingModule } from './management-strategies-routing.module';
import { ManagementStrategiesComponent } from './management-strategies/management-strategies.component';

@NgModule({
  declarations: [ManagementStrategiesComponent],
  imports: [
    CommonModule,
    ManagementStrategiesRoutingModule,
    SharedModule,
    UsersSharedComponent,
    DelegationSharedComponent,
  ],
})
export class ManagementStrategiesModule {}
