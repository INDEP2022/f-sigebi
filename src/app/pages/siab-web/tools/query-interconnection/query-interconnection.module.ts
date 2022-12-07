import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { QueryInterconnectionRoutingModule } from './query-interconnection-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, QueryInterconnectionRoutingModule],
})
export class QueryInterconnectionModule {}
