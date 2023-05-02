import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlyerSubjectCatalogComponent } from './flyer-subject-catalog/flyer-subject-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: FlyerSubjectCatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlyerSubjectCatalogRoutingModule {}
