import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceRecordsComponent } from './maintenance-records.component';

const routes: Routes = [{ path: '', component: MaintenanceRecordsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceRecordsRoutingModule {}
