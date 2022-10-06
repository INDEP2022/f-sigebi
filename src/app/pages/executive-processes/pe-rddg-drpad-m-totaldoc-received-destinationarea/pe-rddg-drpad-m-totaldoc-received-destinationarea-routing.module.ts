import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeRddgDrpadCTotaldocReceivedDestinationareaComponent } from './pe-rddg-drpad-c-totaldoc-received-destinationarea/pe-rddg-drpad-c-totaldoc-received-destinationarea.component';

const routes: Routes = [
  {
    path: '',
    component: PeRddgDrpadCTotaldocReceivedDestinationareaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeRddgDrpadMTotaldocReceivedDestinationareaRoutingModule { }
