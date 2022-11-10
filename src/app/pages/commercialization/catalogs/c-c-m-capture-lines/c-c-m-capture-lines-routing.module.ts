import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCCCaptureLinesMainComponent } from './c-c-c-capture-lines-main/c-c-c-capture-lines-main.component';

const routes: Routes = [
  {
    path: '',
    component: CCCCaptureLinesMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CCMCaptureLinesRoutingModule {}
