import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { OriginFormComponent } from './origin-form/origin-form.component';
import { OriginListComponent } from './origin-list/origin-list.component';
import { OriginRoutingModule } from './origin-routing.module';

@NgModule({
  declarations: [OriginFormComponent, OriginListComponent],
  imports: [
    CommonModule,
    OriginRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class OriginModule {}
