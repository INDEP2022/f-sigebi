import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralArchiveCatalogComponent } from './general-archive-catalog/general-archive-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralArchiveCatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralArchiveCatalogRoutingModule {}
