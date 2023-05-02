import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { PrepareResponseOfficeRoutingModule } from './prepare-response-office-routing.module';
import { PrepareResponseOfficeComponent } from './prepare-response-office/prepare-response-office.component';

@NgModule({
  declarations: [PrepareResponseOfficeComponent],
  imports: [
    CommonModule,
    SharedRequestModule,
    PrepareResponseOfficeRoutingModule,
  ],
})
export class PrepareResponseOfficeModule {}
