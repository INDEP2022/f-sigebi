/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJTracingJudgmentComponent } from './tracing-judgment/pj-c-tracing-judgment.component';

const routes: Routes = [
  {
    path: '',
    component: PJTracingJudgmentComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJTracingJudgmentRoutingModule {}
