/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

// import { ComponentsModule } from '../../../@components/components.module';

import { NgSelectModule } from '@ng-select/ng-select';

import { FactJurDictamRecrRoutingModule } from './fact-jur-dictam-recr.routing.module';

import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { ThemeModule } from '../../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbWindowModule, NbDatepickerModule } from '@nebular/theme';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
import { SharedLegalProcessModule } from '../shared-legal-process/shared-legal-process.module';
import { FactJurDictamRecrComponent } from './fact-jur-dictam-recr/fact-jur-dictam-recr.component';

@NgModule({
  declarations: [FactJurDictamRecrComponent],
  imports: [
    CommonModule,
    FactJurDictamRecrRoutingModule,
    // ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    // ComponentsModule,
    // ThemeModule,
    // NbCardModule,
    Ng2SmartTableModule,
    // NbSelectModule,
    // NbButtonModule,
    // NbInputModule,
    // NbWindowModule.forChild(),
    // MatPaginatorModule,
    // MatInputModule,
    // MatFormFieldModule,
    // NbDatepickerModule,
    NgSelectModule,
    SharedModule,

    SharedLegalProcessModule,
  ],
  exports: [
    // ComponentsModule,
    NgSelectModule,
  ],
})
export class FactJurDictamRecrModule {}
