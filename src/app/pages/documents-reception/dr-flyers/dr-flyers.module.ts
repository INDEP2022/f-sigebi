import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DrFlyersRoutingModule } from './dr-flyers-routing.module';
import { RdFDocumentsReceptionRegisterComponent } from './rd-f-documents-reception-register/rd-f-documents-reception-register.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RdFDocumentsReceptionRegisterComponent],
  imports: [
    CommonModule,
    DrFlyersRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
})
export class DrFlyersModule {}
