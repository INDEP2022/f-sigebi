import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JprConfiscatedReceptionComponent } from './jpr-confiscated-reception.component';

const routes: Routes = [{ path: '', component: JprConfiscatedReceptionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JprConfiscatedReceptionRoutingModule { }
