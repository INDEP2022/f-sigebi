import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CPdfCPublicationPhotographsComponent } from './c-pdf-c-publication-photographs/c-pdf-c-publication-photographs.component';
import { CPdfMPublicationPhotographsRoutingModule } from './c-pdf-m-publication-photographs-routing.module';

@NgModule({
  declarations: [CPdfCPublicationPhotographsComponent],
  imports: [
    CommonModule,
    CPdfMPublicationPhotographsRoutingModule,
    SharedModule,
  ],
})
export class CPdfMPublicationPhotographsModule {}
