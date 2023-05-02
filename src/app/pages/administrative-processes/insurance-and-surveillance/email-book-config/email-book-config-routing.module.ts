import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailBookConfigComponent } from './email-book-config/email-book-config.component';

const routes: Routes = [
  {
    path: '',
    component: EmailBookConfigComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailBookConfigRoutingModule {}
