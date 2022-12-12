import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ValuesModalComponent } from './values-modal/values-modal.component';
import { ValuesRoutingModule } from './values-routing.module';
import { ValuesComponent } from './values/values.component';

@NgModule({
  declarations: [ValuesComponent, ValuesModalComponent],
  imports: [
    CommonModule,
    ValuesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class ValuesModule {}
