import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EdosXCoorRoutingModule } from './edos-x-coor-routing.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { EdosXCoorFormComponent } from './edos-x-coor-form/edos-x-coor-form.component';
import { EdosXCoorListComponent } from './edos-x-coor-list/edos-x-coor-list.component';

@NgModule({
  declarations: [EdosXCoorListComponent, EdosXCoorFormComponent],
  imports: [
    CommonModule,
    EdosXCoorRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class EdosXCoorModule {}
