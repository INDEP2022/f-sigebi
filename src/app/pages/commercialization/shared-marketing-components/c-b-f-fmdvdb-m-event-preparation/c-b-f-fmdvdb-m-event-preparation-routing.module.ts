import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBFFmdvdbCEventPreparationComponent } from './c-b-f-fmdvdb-c-event-preparation/c-b-f-fmdvdb-c-event-preparation.component';

const routes: Routes = [
  {
    path: '',
    component: CBFFmdvdbCEventPreparationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBFFmdvdbMEventPreparationRoutingModule {}
