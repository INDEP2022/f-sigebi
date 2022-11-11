import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCCatEffectiveNumeraireComponent } from './c-p-c-cat-effective-numeraire/c-p-c-cat-effective-numeraire.component';

const routes: Routes = [
  {
    path: '',
    component: CPCCatEffectiveNumeraireComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMCatEffectiveNumeraireRoutingModule {}
