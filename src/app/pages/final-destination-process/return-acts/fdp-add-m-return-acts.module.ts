import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpAddMReturnActsRoutingModule } from './fdp-add-m-return-acts-routing.module';
import { FdpAddCReturnActsComponent } from './return-acts/fdp-add-c-return-acts.component';

@NgModule({
  declarations: [FdpAddCReturnActsComponent],
  imports: [
    CommonModule,
    FdpAddMReturnActsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgScrollbarModule,
  ],
})
export class FdpAddMReturnActsModule {}
