import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { NonWorkingDaysModalComponent } from './non-working-days-modal/non-working-days-modal.component';
import { NonWorkingDaysRoutingModule } from './non-working-days-routing.module';
import { NonWorkingDaysComponent } from './non-working-days/non-working-days.component';

@NgModule({
  declarations: [NonWorkingDaysComponent, NonWorkingDaysModalComponent],
  imports: [
    CommonModule,
    NonWorkingDaysRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class NonWorkingDaysModule {}
