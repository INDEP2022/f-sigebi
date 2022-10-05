import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeRddgDrpadMTotaldocReceivedDestinationareaRoutingModule } from './pe-rddg-drpad-m-totaldoc-received-destinationarea-routing.module';
import { PeRddgDrpadCTotaldocReceivedDestinationareaComponent } from './pe-rddg-drpad-c-totaldoc-received-destinationarea/pe-rddg-drpad-c-totaldoc-received-destinationarea.component';


@NgModule({
  declarations: [
    PeRddgDrpadCTotaldocReceivedDestinationareaComponent
  ],
  imports: [
    CommonModule,
    PeRddgDrpadMTotaldocReceivedDestinationareaRoutingModule
  ]
})
export class PeRddgDrpadMTotaldocReceivedDestinationareaModule { }
