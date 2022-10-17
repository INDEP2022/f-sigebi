import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EdosXCoorRoutingModule } from './edos-x-coor-routing.module';

import { EdosXCoorFormComponent } from './edos-x-coor-form/edos-x-coor-form.component';
import { EdosXCoorListComponent } from './edos-x-coor-list/edos-x-coor-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
