import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchAssetsComponent } from './search-assets/search-assets.component';

const routes: Routes = [
  {
    path: '',
    component: SearchAssetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchAssetsForStudyRoutingModule {}
