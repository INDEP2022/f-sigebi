import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { defineLocale } from 'ngx-bootstrap/chronos';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
  BsLocaleService,
} from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { esLocale } from 'ngx-bootstrap/locale';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CardComponent } from './components/card/card.component';
import { CheckboxColumnComponent } from './components/checkbox-column/checkbox-column.component';
import { CheckboxDisabledElementComponent } from './components/checkbox-element-smarttable/checkbox-disabled-element';
import { CheckboxElementComponent } from './components/checkbox-element-smarttable/checkbox-element';
import { CheckboxElementRecordAccountStatementsComponent } from './components/checkbox-element-smarttable/checkbox-element-record-account-statements';
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
import { AutoSizeDirective } from './directives/autosize.directive';
import { MaxLengthDirective } from './directives/maxlength.directive';
import { NumbersFilterDirective } from './directives/numbers-filter.directive';
import { PermissionsDirective } from './directives/permissions.directive';
/*Redux NgRX Global Vars Store*/
import { CustomSelectWidthLoading } from '../@standalone/shared-forms/custom-select-loading/custom-select-loading.component';
import { CustomDateFilterComponent } from '../@standalone/shared-forms/filter-date-custom/custom-date-filter';
import { CustomDateDayFilterComponent } from '../@standalone/shared-forms/filter-date-mounth-custom/custom-date-day-filter';
import { CustomDateMounthFilterComponent } from '../@standalone/shared-forms/filter-date-mounth-custom/custom-date-mounth-filter';
import { CustomFilterComponent } from '../@standalone/shared-forms/input-number/input-number';
import { ButtonColumnComponent } from './components/button-column/button-column.component';
import { DatePickerDirective } from './directives/date-picker.directive';
import { UppercaseDirective } from './directives/uppercase.directive';
import { GlobalVarsModule } from './global-vars/global-vars.module';

@NgModule({
  declarations: [
    ColumnsSelectComponent,
    FormFieldComponent,
    SearchBarComponent,
    ConfirmButtonComponent,
    SelectComponent,
    CustomSelectWidthLoading,
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
    CheckboxElementRecordAccountStatementsComponent,
    CheckboxDisabledElementComponent,
    PermissionsDirective,
    MaxLengthDirective,
    NumbersFilterDirective,
    AutoSizeDirective,
    UppercaseDirective,
    DatePickerDirective,
    CustomDateFilterComponent,
    CustomDateMounthFilterComponent,
    CustomDateDayFilterComponent,
    ButtonColumnComponent,
    CustomFilterComponent,
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
    NgScrollbarModule,
    GlobalVarsModule,
  ],
  exports: [
    ColumnsSelectComponent,
    FormFieldComponent,
    SearchBarComponent,
    SearchBarSimpleComponent,
    DividerComponent,
    ConfirmButtonComponent,
    SelectComponent,
    CustomSelectWidthLoading,
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
    CheckboxElementRecordAccountStatementsComponent,
    CheckboxDisabledElementComponent,
    CheckboxColumnComponent,
    NgScrollbarModule,
    PermissionsDirective,
    GlobalVarsModule,
    MaxLengthDirective,
    NumbersFilterDirective,
    AutoSizeDirective,
    UppercaseDirective,
    DatePickerDirective,
    CustomDateFilterComponent,
    CustomDateMounthFilterComponent,
    CustomDateDayFilterComponent,
    ButtonColumnComponent,
    CustomFilterComponent,
  ],
  providers: [{ provide: BsDatepickerConfig, useFactory: getDatepickerConfig }],
})
export class SharedModule {
  constructor(private localeService: BsLocaleService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }
}
export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    showWeekNumbers: false,
  });
}
