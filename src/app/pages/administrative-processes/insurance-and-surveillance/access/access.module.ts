import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { AccessRoutingModule } from './access-routing.module';
import { UserAccessComponent } from './user-access/user-access.component';

@NgModule({
  declarations: [UserAccessComponent],
  imports: [
    CommonModule,
    AccessRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class AccessModule {}
