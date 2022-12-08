import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageDebuggingComponent } from './image-debugging/image-debugging.component';

const routes: Routes = [
  {
    path: '',
    component: ImageDebuggingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageDebuggingRoutingModule {}
