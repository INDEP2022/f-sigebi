import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TotaldocReceivedDestinationareaComponent } from './totaldoc-received-destinationarea/totaldoc-received-destinationarea.component';

const routes: Routes = [
  {
    path: '',
    component: TotaldocReceivedDestinationareaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TotaldocReceivedDestinationareaRoutingModule {}
