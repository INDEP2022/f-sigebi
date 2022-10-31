/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJTracingJudgmentRoutingModule } from './pj-m-tracing-judgment-routing.module';

/** COMPONENTS IMPORTS */
import { PJTracingJudgmentComponent } from './tracing-judgment/pj-c-tracing-judgment.component';

@NgModule({
  declarations: [PJTracingJudgmentComponent],
  imports: [CommonModule, PJTracingJudgmentRoutingModule, SharedModule],
})
export class PJTracingJudgmentModule {}
