import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { AuthorizationKeysModalComponent } from './authorization-keys-modal/authorization-keys-modal.component';
import { AuthorizationKeysRoutingModule } from './authorization-keys-routing.module';
import { AuthorizationKeysComponent } from './authorization-keys/authorization-keys.component';

@NgModule({
  declarations: [AuthorizationKeysComponent, AuthorizationKeysModalComponent],
  imports: [CommonModule, AuthorizationKeysRoutingModule, SharedModule],
})
export class AuthorizationKeysModule {}
