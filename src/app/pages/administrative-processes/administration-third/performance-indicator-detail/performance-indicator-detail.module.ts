import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PerformanceIndicatorDetailRoutingModule } from './performance-indicator-detail-routing.module';
import { PerformanceIndicatorDetailComponent } from './performance-indicator-detail/performance-indicator-detail.component';

@NgModule({
  declarations: [PerformanceIndicatorDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    PerformanceIndicatorDetailRoutingModule,
    UsersSharedComponent,
    FormsModule,
  ],
})
export class PerformanceIndicatorDetailModule {}