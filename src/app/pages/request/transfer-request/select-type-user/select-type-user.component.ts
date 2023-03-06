import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { UserProcessService } from 'src/app/core/services/ms-user-process/user-process.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TURN_SELECTED_COLUMNS } from './request-in-turn-selected-columns';

@Component({
  selector: 'app-select-tipe-user',
  templateUrl: './select-type-user.component.html',
  styles: [],
})
export class SelectTypeUserComponent extends BasePage implements OnInit {
  userForm: ModelForm<any>;
  data: any;
  typeAnnex: string;

  paragraphs: any[] = [];
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  //injections
  private fb = inject(FormBuilder);
  private userProcessService = inject(UserProcessService);

  constructor(private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: TURN_SELECTED_COLUMNS,
    };
    this.initForm();

    this.userForm.controls['typeUser'].valueChanges.subscribe((data: any) => {
      this.getUsers();
    });

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getUsers();
    });
  }

  initForm() {
    this.userForm = this.fb.group({
      typeUser: ['TE'],
    });
  }

  getUsers() {
    this.loading = true;
    const typeEmployee = this.userForm.controls['typeUser'].value;
    this.params.value.addFilter('employeeType', typeEmployee);
    const filter = this.params.getValue().getParams();
    this.userProcessService.getAll(filter).subscribe({
      next: resp => {
        this.paragraphs = resp.data;
        this.totalItems = resp.count;
        this.loading = false;
        this.params.value.removeAllFilters();
      },
      error: error => {
        this.loading = false;
        this.params.value.removeAllFilters();
      },
    });
  }

  userSelected(event: any) {
    console.log(event);
  }

  close() {
    console.log('entro');

    this.modalRef.hide();
  }
}
