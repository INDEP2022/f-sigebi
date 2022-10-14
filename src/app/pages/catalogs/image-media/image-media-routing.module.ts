import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageMediaListComponent } from './image-media-list/image-media-list.component';

const routes: Routes = [
  {
    path: '',
    component: ImageMediaListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageMediaRoutingModule {}
