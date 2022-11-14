import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPMNonWorkingDaysModalComponent } from './c-p-m-non-working-days-modal/c-p-m-non-working-days-modal.component';
import { CPMNonWorkingDaysRoutingModule } from './c-p-m-non-working-days-routing.module';
import { CPMNonWorkingDaysComponent } from './c-p-m-non-working-days/c-p-m-non-working-days.component';

@NgModule({
  declarations: [CPMNonWorkingDaysComponent, CPMNonWorkingDaysModalComponent],
  imports: [
    CommonModule,
    CPMNonWorkingDaysRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMNonWorkingDaysModule {}
