import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProceduralHistoryComponent } from './procedural-history/procedural-history.component';

const routes: Routes = [
  {
    path: '',
    component: ProceduralHistoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProceduralHistoryRoutingModule {}
