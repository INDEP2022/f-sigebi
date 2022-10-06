import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { IdentifierFormComponent } from './identifier-form/identifier-form.component';
import { IdentifiersListComponent } from './identifiers-list/identifiers-list.component';
import { IdentifiersRoutingModule } from './identifiers-routing.module';

@NgModule({
  declarations: [IdentifiersListComponent, IdentifierFormComponent],

  imports: [
    CommonModule,
    SharedModule,
    IdentifiersRoutingModule,
    ModalModule.forChild(),
  ],
})
export class IdentifiersModule {}
