import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RAsuntDicListComponent } from './rasunt-dic-list/rasunt-dic-list.component';

const routes: Routes = [{ path: '', component: RAsuntDicListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RAsuntDicRoutingModule {}
