import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordsInventoryComponent } from './records-inventory/records-inventory.component';

const routes: Routes = [
  {
    path: '',
    component: RecordsInventoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsInventoryRoutingModule {}
