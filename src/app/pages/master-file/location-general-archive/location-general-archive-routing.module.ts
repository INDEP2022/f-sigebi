import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationGeneralArchiveComponent } from './location-general-archive/location-general-archive.component';

const routes: Routes = [
  {
    path: '',
    component: LocationGeneralArchiveComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationGeneralArchiveRoutingModule {}
