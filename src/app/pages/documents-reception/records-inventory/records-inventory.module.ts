import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecordsInventoryRoutingModule } from './records-inventory-routing.module';
import { RecordsInventoryComponent } from './records-inventory/records-inventory.component';

@NgModule({
  declarations: [RecordsInventoryComponent],
  imports: [CommonModule, RecordsInventoryRoutingModule, SharedModule],
})
export class RecordsInventoryModule {}
