import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemLogComponent } from './system-log/system-log.component';

const routes: Routes = [
  {
    path: '',
    component: SystemLogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemLogRoutingModule {}
