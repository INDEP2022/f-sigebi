import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoadOfLocatorsRoutingModule } from './load-of-locators-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, LoadOfLocatorsRoutingModule, SharedModule],
})
export class LoadOfLocatorsModule {}
