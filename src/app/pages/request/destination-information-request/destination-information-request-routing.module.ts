import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DestinationInfoRequestListComponent } from './destination-info-request-list/destination-info-request-list.component';
import { DestinationInfoRequestMainComponent } from './destination-info-request-main/destination-info-request-main.component';

const routes: Routes = [
  {
    path: 'list',
    component: DestinationInfoRequestListComponent,
  },
  {
    path: ':step/:request',
    component: DestinationInfoRequestMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DestinationInformationRequestRoutingModule {}
