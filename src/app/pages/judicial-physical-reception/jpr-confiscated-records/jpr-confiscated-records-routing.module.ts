import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JprConfiscatedRecordsComponent } from './jpr-confiscated-records.component';

const routes: Routes = [
  { path: '', component: JprConfiscatedRecordsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JprConfiscatedRecordsRoutingModule {}
