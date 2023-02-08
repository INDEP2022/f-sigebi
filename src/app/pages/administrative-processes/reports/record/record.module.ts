import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
/*Modules*/
//Routing
import { RecordRoutingModule } from './record-routing.module';
//Components
import { RecordDetailsComponent } from './record-details/record-details.component';

@NgModule({
  declarations: [RecordDetailsComponent],
  imports: [
    CommonModule,
    RecordRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class RecordModule {}
