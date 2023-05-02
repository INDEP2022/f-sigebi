import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReturnToPerformProgrammingFormComponent } from './return-to-perform-programming-form/return-to-perform-programming-form.component';
import { ReturnToPerformProgrammingRoutingModule } from './return-to-perform-programming-routing.module';

@NgModule({
  declarations: [ReturnToPerformProgrammingFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReturnToPerformProgrammingRoutingModule,
    TabsModule.forRoot(),
  ],
})
export class ReturnToPerformProgramming {}
