import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JprMaintenanceRecordsComponent } from './jpr-maintenance-records.component';

const routes: Routes = [{ path: '', component: JprMaintenanceRecordsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JprMaintenanceRecordsRoutingModule { }
