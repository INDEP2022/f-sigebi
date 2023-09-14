import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConciliationExecutionMainComponent } from './conciliation-execution-main/conciliation-execution-main.component';
import { NewAndUpdateComponent } from './conciliation-execution-main/new-and-update/new-and-update.component';
import { ConciliationExecutionRoutingModule } from './conciliation-execution-routing.module';

@NgModule({
  declarations: [ConciliationExecutionMainComponent, NewAndUpdateComponent],
  imports: [
    CommonModule,
    ConciliationExecutionRoutingModule,
    SharedModule,
    NgScrollbarModule,
    BsDatepickerModule,
    TooltipModule.forRoot(),
    AccordionModule,
    FormLoaderComponent,
  ],
})
export class ConciliationExecutionModule {}
