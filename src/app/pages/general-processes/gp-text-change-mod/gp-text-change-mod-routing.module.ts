import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpTextChangeModComponent } from './gp-text-change-mod/gp-text-change-mod.component';
const routes: Routes = [
  {
    path: '',
    component: GpTextChangeModComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpTextChangeModRoutingModule {}
