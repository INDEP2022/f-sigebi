/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

// import { ComponentsModule } from '../../../@components/components.module';

import { NgSelectModule } from '@ng-select/ng-select';

import { FactGenActDatexRoutingModule } from './fact-gen-act-datex.routing.module';

import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { ThemeModule } from '../../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbWindowModule, NbDatepickerModule, NbTabsetModule, NbRadioModule } from '@nebular/theme';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
import { FactGenActDatexComponent } from './fact-gen-act-datex/fact-gen-act-datex.component';
// import { FlyersModule } from '../../documents-reception/flyers/flyers.module';
// import { RecordUpdateComponent } from '../../documents-reception/flyers/record-update/record-update.component';

@NgModule({
  declarations: [
    FactGenActDatexComponent,
    // RecordUpdateComponent
  ],
  imports: [
    // FlyersModule,

    CommonModule,
    FactGenActDatexRoutingModule,
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
    // NbTabsetModule,
    // NbRadioModule,
    SharedModule,
  ],
  exports: [
    // ComponentsModule,
    NgSelectModule,
  ],
})
export class FactGenActDatexModule {}
