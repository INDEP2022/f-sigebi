import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { QueryInterconnectionFormRoutingModule } from './query-interconnection-form-routing.module';
import { QueryInterconnectionFormComponent } from './query-interconnection-form/query-interconnection-form.component';

@NgModule({
  declarations: [QueryInterconnectionFormComponent],
  imports: [CommonModule, SharedModule, QueryInterconnectionFormRoutingModule],
})
export class QueryInterconnectionFormModule {}
