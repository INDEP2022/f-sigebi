import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCGeneralArchiveCatalogComponent } from './c-p-c-general-archive-catalog/c-p-c-general-archive-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: CPCGeneralArchiveCatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMGeneralArchiveCatalogRoutingModule {}
