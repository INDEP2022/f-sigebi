import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DrRecordsInventoryRoutingModule } from './dr-records-inventory-routing.module';
import { DrRecordsInventoryComponent } from './dr-records-inventory/dr-records-inventory.component';

@NgModule({
  declarations: [DrRecordsInventoryComponent],
  imports: [CommonModule, DrRecordsInventoryRoutingModule, SharedModule],
})
export class DrRecordsInventoryModule {}
