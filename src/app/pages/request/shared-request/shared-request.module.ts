import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestFormComponent } from './request-form/request-form.component';
import { UsersSelectedToTurnComponent } from './users-selected-to-turn/users-selected-to-turn.component';

@NgModule({
  declarations: [RequestFormComponent, UsersSelectedToTurnComponent],
  imports: [
    CommonModule,
    ModalModule,
    TabsModule,
    SharedModule,
    NgScrollbarModule,
  ],
  exports: [RequestFormComponent, UsersSelectedToTurnComponent],
})
export class SharedRequestModule {}
