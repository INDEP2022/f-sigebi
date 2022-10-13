/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

// import { ComponentsModule } from '../../../@components/components.module';

import { NgSelectModule } from '@ng-select/ng-select';

import { FactBieValPosTerceroRoutingModule } from './fact-bie-val-pos-tercero.routing.module';

import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { ThemeModule } from '../../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbWindowModule, NbDatepickerModule, NbIconModule } from '@nebular/theme';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
import { FactBieValPosTerceroComponent } from './fact-bie-val-pos-tercero/fact-bie-val-pos-tercero.component';
import { SharedLegalProcessModule } from '../shared-legal-process/shared-legal-process.module';

@NgModule({
  declarations: [FactBieValPosTerceroComponent],
  imports: [
    CommonModule,
    FactBieValPosTerceroRoutingModule,
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
export class FactBieValPosTerceroModule {}
