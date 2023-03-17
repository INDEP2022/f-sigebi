import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CarouselModule } from 'ngx-bootstrap/carousel';

import { PublicationPhotographsModalComponent } from './publication-photographs-modal/publication-photographs-modal.component';
import { PublicationPhotographsRoutingModule } from './publication-photographs-routing.module';
import { PublicationPhotographsComponent } from './publication-photographs/publication-photographs.component';

@NgModule({
  declarations: [
    PublicationPhotographsComponent,
    PublicationPhotographsModalComponent,
  ],
  imports: [
    CommonModule,
    PublicationPhotographsRoutingModule,
    SharedModule,
    CarouselModule.forRoot(),
  ],
})
export class PublicationPhotographsModule {}
