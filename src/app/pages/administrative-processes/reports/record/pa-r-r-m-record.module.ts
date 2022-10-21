import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
/*Modules*/
//Routing
import { PaRRMRecordRoutingModule } from './pa-r-r-m-record-routing.module';
//Components
import { PaRRCRecordDetailsComponent } from './record-details/pa-r-r-c-record-details.component';

@NgModule({
  declarations: [PaRRCRecordDetailsComponent],
  imports: [
    CommonModule,
    PaRRMRecordRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class PaRRMRecordModule {}
