import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { PhotographMediaFormComponent } from './photograph-media-form/photograph-media-form.component';
import { PhotographMediaListComponent } from './photograph-media-list/photograph-media-list.component';
import { PhotographMediaRoutingModule } from './photograph-media-routing.module';

@NgModule({
  declarations: [PhotographMediaListComponent, PhotographMediaFormComponent],
  imports: [
    CommonModule,
    PhotographMediaRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class PhotographMediaModule {}
