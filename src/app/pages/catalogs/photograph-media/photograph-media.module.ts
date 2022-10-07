import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { PhotographMediaRoutingModule } from './photograph-media-routing.module';
import { PhotographMediaListComponent } from './photograph-media-list/photograph-media-list.component';
import { PhotographMediaFormComponent } from './photograph-media-form/photograph-media-form.component';


@NgModule({
  declarations: [
    PhotographMediaListComponent,
    PhotographMediaFormComponent
  ],
  imports: [
    CommonModule,
    PhotographMediaRoutingModule,
    SharedModule,
    ModalModule.forChild()
  ]
})
export class PhotographMediaModule { }
