/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { TracingJudgmentComponent } from './tracing-judgment/tracing-judgment.component';

const routes: Routes = [
  {
    path: '',
    component: TracingJudgmentComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TracingJudgmentRoutingModule {}
