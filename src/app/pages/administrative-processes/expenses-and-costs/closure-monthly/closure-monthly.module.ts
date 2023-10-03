import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClosureMonthlyRoutingModule } from './closure-monthly-routing.module';
import { ClosureMonthlyComponent } from './closure-monthly/closure-monthly.component';

@NgModule({
  declarations: [ClosureMonthlyComponent],
  imports: [
    CommonModule,
    ClosureMonthlyRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class ClosureMonthlyModule {}
