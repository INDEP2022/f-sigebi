import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "articles-complement",
    loadChildren: () =>
      import("./jpr-complement-article/jpr-complement-article.module").then(
        (m) => m.JprComplementArticleModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JudicialPhysicalReceptionRoutingModule { }
