import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { OriginCisiListComponent } from './origin-cisi-list/origin-cisi-list.component';
import { OriginCisiRoutingModule } from './origin-cisi-routing.module';
import { OrignCisiFormComponent } from './orign-cisi-form/orign-cisi-form.component';

@NgModule({
  declarations: [OrignCisiFormComponent, OriginCisiListComponent],
  imports: [
    CommonModule,
    OriginCisiRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class OriginCisiModule {}
