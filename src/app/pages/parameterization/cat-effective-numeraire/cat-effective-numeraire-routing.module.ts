import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatEffectiveNumeraireComponent } from './cat-effective-numeraire/cat-effective-numeraire.component';

const routes: Routes = [
  {
    path: '',
    component: CatEffectiveNumeraireComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatEffectiveNumeraireRoutingModule {}
