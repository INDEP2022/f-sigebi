import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicationPhotographsComponent } from './publication-photographs/publication-photographs.component';

const routes: Routes = [
  {
    path: '',
    component: PublicationPhotographsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicationPhotographsRoutingModule {}
