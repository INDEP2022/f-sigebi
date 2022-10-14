import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResponseRepuveListComponent } from './response-repuve-list/response-repuve-list.component';

const routes: Routes = [{ path: '', component: ResponseRepuveListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResponseRepuveRoutingModule {}
