import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnsSelectComponent } from './components/columns-select/columns-select.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmButtonComponent } from './components/confirm-button/confirm-button.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectComponent } from './components/select/select.component';
import { SeeMoreComponent } from './components/see-more/see-more.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalComponent } from './components/modal/modal.component';
import { CardComponent } from './components/card/card.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PaginateComponent } from './components/pagination/paginate.component';
import { FormCheckComponent } from './components/form-check/form-check.component';
import { FormRadioComponent } from './components/form-radio/form-radio.component';

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
  ],
  imports: [
    CommonModule,
    BsDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    PaginationModule,
    Ng2SmartTableModule,
  ],
  exports: [
    ColumnsSelectComponent,
    FormFieldComponent,
    SearchBarComponent,
    ConfirmButtonComponent,
    SelectComponent,
    SeeMoreComponent,
    ModalComponent,
    CardComponent,
    PaginationComponent,
    NgSelectModule,
    BsDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    FormCheckComponent,
    FormRadioComponent,
  ],
})
export class SharedModule {}
