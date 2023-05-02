import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComplementArticleComponent } from './complement-article.component';

const routes: Routes = [{ path: '', component: ComplementArticleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplementArticleRoutingModule {}
