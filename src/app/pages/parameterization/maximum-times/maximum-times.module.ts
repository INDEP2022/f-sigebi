import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaximumTimesModalComponent } from './maximum-times-modal/maximum-times-modal.component';
import { MaximumTimesRoutingModule } from './maximum-times-routing.module';
import { MaximumTimesUserComponent } from './maximum-times-user/maximum-times-user.component';
import { MaximumTimesComponent } from './maximum-times/maximum-times.component';

@NgModule({
  declarations: [
    MaximumTimesComponent,
    MaximumTimesModalComponent,
    MaximumTimesUserComponent,
  ],
  imports: [
    CommonModule,
    MaximumTimesRoutingModule,
    SharedModule,
    UsersSharedComponent,
    ModalModule.forChild(),
  ],
})
export class MaximumTimesModule {}
