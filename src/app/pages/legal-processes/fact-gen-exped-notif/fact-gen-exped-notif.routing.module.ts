import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactGenExpedNotifComponent } from './fact-gen-exped-notif/fact-gen-exped-notif.component';

const routes: Routes = [
  {  
    path: '', component: FactGenExpedNotifComponent
  },
  

]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactGenExpedNotifRoutingModule { }
