/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { TracingJudgmentRoutingModule } from './tracing-judgment-routing.module';

/** COMPONENTS IMPORTS */
import { TracingJudgmentComponent } from './tracing-judgment/tracing-judgment.component';

@NgModule({
  declarations: [TracingJudgmentComponent],
  imports: [CommonModule, TracingJudgmentRoutingModule, SharedModule],
})
export class TracingJudgmentModule {}
