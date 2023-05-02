import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { ValidStatusesRoutingModule } from './valid-statuses-routing.module';
import { ValidStatusesComponent } from './valid-statuses/valid-statuses.component';

@NgModule({
  declarations: [ValidStatusesComponent],
  imports: [CommonModule, ValidStatusesRoutingModule, SharedModule, TabsModule],
})
export class ValidStatusesModule {}
