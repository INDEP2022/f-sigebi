import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiseProcessListComponent } from './sise-process-list/sise-process-list.component';

const routes: Routes = [{ path: '', component: SiseProcessListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiseProcessRoutingModule {}
