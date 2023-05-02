import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiscatedReceptionComponent } from './confiscated-reception.component';

const routes: Routes = [{ path: '', component: ConfiscatedReceptionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiscatedReceptionRoutingModule {}
