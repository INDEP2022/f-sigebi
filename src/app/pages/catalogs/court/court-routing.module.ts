import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourtListComponent } from './court-list/court-list.component';

const routes: Routes = [
  {
    path: '',
    component: CourtListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourtRoutingModule {}
