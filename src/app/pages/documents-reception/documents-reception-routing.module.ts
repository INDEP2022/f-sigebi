import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'flyers-registration',
    children: [
      {
        path: '',
        loadChildren: async () =>
          (await import('./dr-flyers/dr-flyers.module')).DrFlyersModule,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsReceptionRoutingModule {}
