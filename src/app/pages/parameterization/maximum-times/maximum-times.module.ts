import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaximumTimesModalComponent } from './maximum-times-modal/maximum-times-modal.component';
import { MaximumTimesRoutingModule } from './maximum-times-routing.module';
import { MaximumTimesComponent } from './maximum-times/maximum-times.component';

@NgModule({
  declarations: [MaximumTimesComponent, MaximumTimesModalComponent],
  imports: [
    CommonModule,
    MaximumTimesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class MaximumTimesModule {}
