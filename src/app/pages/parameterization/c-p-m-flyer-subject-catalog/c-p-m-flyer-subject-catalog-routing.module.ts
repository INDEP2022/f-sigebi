import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCFlyerSubjectCatalogComponent } from './c-p-c-flyer-subject-catalog/c-p-c-flyer-subject-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: CPCFlyerSubjectCatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMFlyerSubjectCatalogRoutingModule {}
