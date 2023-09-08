import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';

import { PhotosListCommercialComponent } from './photos-list/app-photos-list-commercial.component';
import { PhotoCommercialComponent } from './photos-list/photo/photo-commercial.component';
import { PublicationPhotographsModalComponent } from './publication-photographs-modal/publication-photographs-modal.component';
import { PublicationPhotographsRoutingModule } from './publication-photographs-routing.module';
import { PublicationPhotographsComponent } from './publication-photographs/publication-photographs.component';

@NgModule({
  declarations: [
    PublicationPhotographsComponent,
    PublicationPhotographsModalComponent,
    PhotosListCommercialComponent,
    PhotoCommercialComponent,
  ],
  imports: [
    CommonModule,
    PublicationPhotographsRoutingModule,
    SharedModule,
    PreviewDocumentsComponent,
    CarouselModule.forRoot(),
  ],
})
export class PublicationPhotographsModule {}
