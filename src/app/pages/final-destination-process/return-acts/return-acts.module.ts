import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpAddMReturnActsRoutingModule } from './return-acts-routing.module';
import { FdpAddCReturnActsComponent } from './return-acts/return-acts.component';

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
