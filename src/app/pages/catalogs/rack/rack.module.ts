import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { RackFormComponent } from './rack-form/rack-form.component';
import { RackListComponent } from './rack-list/rack-list.component';
import { RackRoutingModule } from './rack-routing.module';

@NgModule({
  declarations: [RackFormComponent, RackListComponent],
  imports: [
    CommonModule,
    RackRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class RackModule {}
