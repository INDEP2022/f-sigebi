import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPdfCPublicationPhotographsComponent } from './c-pdf-c-publication-photographs/c-pdf-c-publication-photographs.component';

const routes: Routes = [
  {
    path: '',
    component: CPdfCPublicationPhotographsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPdfMPublicationPhotographsRoutingModule {}
