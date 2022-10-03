import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SatClasificationListComponent } from './sat-clasification-list/sat-clasification-list.component';

const routes: Routes = [{ path: '', component: SatClasificationListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SatClasificationRoutingModule {}
