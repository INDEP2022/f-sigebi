import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JprComplementArticleComponent } from './jpr-complement-article.component';

const routes: Routes = [{ path: '', component: JprComplementArticleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JprComplementArticleRoutingModule {}
