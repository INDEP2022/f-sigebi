import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CarouselModule } from 'ngx-bootstrap/carousel';

import { PublicationPhotographsRoutingModule } from './publication-photographs-routing.module';
import { PublicationPhotographsComponent } from './publication-photographs/publication-photographs.component';

@NgModule({
  declarations: [PublicationPhotographsComponent],
  imports: [
    CommonModule,
    PublicationPhotographsRoutingModule,
    SharedModule,
    CarouselModule.forRoot(),
  ],
})
export class PublicationPhotographsModule {}
