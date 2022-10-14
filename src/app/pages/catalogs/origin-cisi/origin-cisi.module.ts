import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OriginCisiRoutingModule } from './origin-cisi-routing.module';
import { OrignCisiFormComponent } from './orign-cisi-form/orign-cisi-form.component';
import { OriginCisiListComponent } from './origin-cisi-list/origin-cisi-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
