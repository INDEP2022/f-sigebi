/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

// import { ComponentsModule } from '../../../@components/components.module';

import { NgSelectModule } from '@ng-select/ng-select';

import { FactJurDictAmasRoutingModule } from './fact-jur-dict-amas.routing.module';

import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { ThemeModule } from '../../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbWindowModule, NbDatepickerModule, NbTabsetModule, NbRadioModule, NbIconModule } from '@nebular/theme';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
import { FactJurDictAmasComponent } from './fact-jur-dict-amas/fact-jur-dict-amas.component';
// import { JuridicalDictumsComponent } from '../../documents-reception/flyers/juridical-dictums/juridical-dictums.component';
// import { FlyersModule } from '../../documents-reception/flyers/flyers.module';

@NgModule({
  declarations: [
    FactJurDictAmasComponent,
    // JuridicalDictumsComponent
  ],
  imports: [
    // FlyersModule,

    CommonModule,
    FactJurDictAmasRoutingModule,
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
    // NbIconModule,
    SharedModule,
  ],
  exports: [
    // ComponentsModule,
    NgSelectModule,
  ],
})
export class FactJurDictAmasModule {}
