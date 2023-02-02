import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiscatedRecordsComponent } from './confiscated-records.component';

const routes: Routes = [{ path: '', component: ConfiscatedRecordsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiscatedRecordsRoutingModule {}
