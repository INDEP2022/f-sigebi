import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { ImageMediaFormComponent } from './image-media-form/image-media-form.component';
import { ImageMediaListComponent } from './image-media-list/image-media-list.component';
import { ImageMediaRoutingModule } from './image-media-routing.module';

@NgModule({
  declarations: [ImageMediaFormComponent, ImageMediaListComponent],
  imports: [
    CommonModule,
    ImageMediaRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class ImageMediaModule {}
