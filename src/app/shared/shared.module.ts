import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { esLocale } from 'ngx-bootstrap/locale';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CardComponent } from './components/card/card.component';
import { CheckboxColumnComponent } from './components/checkbox-column/checkbox-column.component';
import { CheckboxElementComponent } from './components/checkbox-element-smarttable/checkbox-element';
import { ColumnsSelectComponent } from './components/columns-select/columns-select.component';
import { ConfirmButtonComponent } from './components/confirm-button/confirm-button.component';
import { DividerComponent } from './components/divider/divider.component';
import { FormCheckComponent } from './components/form-check/form-check.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { FormRadioComponent } from './components/form-radio/form-radio.component';
import { ModalComponent } from './components/modal/modal.component';
import { PaginateComponent } from './components/pagination/paginate.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SearchBarSimpleComponent } from './components/search-bar-simple/search-bar-simple.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SeeMoreComponent } from './components/see-more/see-more.component';
import { SelectComponent } from './components/select/select.component';

@NgModule({
  declarations: [
    ColumnsSelectComponent,
    FormFieldComponent,
    SearchBarComponent,
    ConfirmButtonComponent,
    SelectComponent,
    SeeMoreComponent,
    ModalComponent,
    CardComponent,
    PaginationComponent,
    PaginateComponent,
    FormCheckComponent,
    FormRadioComponent,
    CheckboxColumnComponent,
    SearchBarSimpleComponent,
    DividerComponent,
    CheckboxElementComponent,
  ],
  imports: [
    CommonModule,
    BsDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    PaginationModule,
    Ng2SmartTableModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: [
    ColumnsSelectComponent,
    FormFieldComponent,
    SearchBarComponent,
    SearchBarSimpleComponent,
    DividerComponent,
    ConfirmButtonComponent,
    SelectComponent,
    SeeMoreComponent,
    ModalComponent,
    CardComponent,
    PaginationComponent,
    BsDatepickerModule,
    NgSelectModule,
    BsDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    FormCheckComponent,
    FormRadioComponent,
    CommonModule,
    CheckboxElementComponent,
    CheckboxColumnComponent,
  ],
})
export class SharedModule {
  constructor(private localeService: BsLocaleService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }
}
