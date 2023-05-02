import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpScreenComponent } from './help-screen/help-screen.component';

const routes: Routes = [
  {
    path: '',
    component: HelpScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpScreenRoutingModule {}
