import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Routing
import { CCPMParametersRoutingModule } from './c-c-p-m-parameters-routing.module';
//Components
import { CCPlCParametersListComponent } from './parameter-list/c-c-pl-c-parameters-list.component';

@NgModule({
  declarations: [CCPlCParametersListComponent],
  imports: [CommonModule, CCPMParametersRoutingModule, SharedModule],
})
export class CCPMParametersModule {}
