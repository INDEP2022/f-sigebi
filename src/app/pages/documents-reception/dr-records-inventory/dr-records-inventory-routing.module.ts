import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrRecordsInventoryComponent } from './dr-records-inventory/dr-records-inventory.component';

const routes: Routes = [
  {
    path: '',
    component: DrRecordsInventoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrRecordsInventoryRoutingModule {}
