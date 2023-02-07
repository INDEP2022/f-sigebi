import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RateCatalogComponent } from './rate-catalog/rate-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: RateCatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RateCatalogRoutingModule {}
