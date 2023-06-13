import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

import { BehaviorSubject, skip } from 'rxjs';
import { IRDictationDoc } from 'src/app/core/models/ms-dictation/r-dictation-doc.model';
import { IMJobManagement } from 'src/app/core/models/ms-officemanagement/m-job-management.model';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DIALOG_SELECTED_MANAGEMENT_COLUMNS } from './dialog-selected-managements';

type ResultHide = IRDictationDoc & { descripcion: string };
@Component({
  selector: 'app-documents-form',
  templateUrl: './dialog-selected-managements.component.html',
  styles: [],
})
export class DialogSelectedManagementsComponent
  extends BasePage
  implements OnInit
{
  documentForm: FormGroup = new FormGroup({});
  mJobManagements: any[] = [];
  title: string = 'Dictamen';
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  queryParams: { [key: string]: string };
  selection = new Map();

  @Output() refresh = new EventEmitter<true>();
  @Output() onSelect = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<IMJobManagement>();
  constructor(
    private modalRef: BsModalRef,
    protected mJobManagementService: MJobManagementService
  ) {
    super();
    // DIALOG_SELECTED_MANAGEMENT_COLUMNS.selection.onComponentInitFunction =
    //   this.onClickSelect.bind(this);
    this.settings.columns = DIALOG_SELECTED_MANAGEMENT_COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    // this.prepareForm();
    this.getMJobManagements();
    this.params.pipe(skip(1)).subscribe((params: ListParams) => {
      this.getMJobManagements(params);
    });
  }

  // prepareForm() {
  //   console.log('TESTDATASELECTOR', this.fb);
  //   this.documentForm = this.fb.group({
  //     id: [null],
  //     description: [
  //       null,
  //       Validators.compose([
  //         Validators.required,
  //         Validators.minLength(1),
  //         Validators.maxLength(100),
  //         Validators.pattern(''),
  //       ]),
  //     ],
  //     numRegister: [
  //       null,
  //       Validators.compose([Validators.minLength(1), Validators.pattern('')]),
  //     ],
  //   });
  //   if (this.edit) {
  //     // this.status = 'Actualizar';
  //     // this.documentForm.patchValue(this.id);
  //   }
  // }

  close(data?: IMJobManagement) {
    this.onClose.emit(data);
    this.modalRef.hide();
  }

  // confirm() {
  //   this.onSelect.emit(this.documentForm.value);
  //   this.edit ? this.update() : this.create();
  // }

  // create() {
  //   this.loading = true;
  //   // this.opinionService.create(this.documentForm.value).subscribe({
  //   //   next: data => this.handleSuccess(),
  //   //   error: error => (this.loading = false),
  //   // });
  // }

  // update() {
  //   // this.loading = true;
  //   // this.opinionService
  //   //   .update(this.opinion.id, this.documentForm.value)
  //   //   .subscribe({
  //   //     next: data => this.handleSuccess(),
  //   //     error: error => (this.loading = false),
  //   //   });
  // }

  convertMapToArray(map: Map<any, any>) {
    return Array.from(map.values());
  }

  onClickSelect(event: any) {
    console.log('EVENT', event);
    this.close(event.data);
    // event.toggle.subscribe((data: any) => {
    //   console.log(data, this.selection);
    //   // data.row.seleccion = data.toggle;
    //   if (data.toggle) {
    //     this.selection.set(data.row.cveDocument, data.row);
    //   } else {
    //     // this.selection = this.selection.filter(
    //     //   (item: any) => item.id !== data.row.id
    //     // );
    //     this.selection.delete(data.row.cveDocument);
    //   }
    // });
  }

  // handleSuccess() {
  //   this.refresh.emit(true);
  //   const message: string = this.edit ? 'Actualizado' : 'Guardado';
  //   this.onLoadToast('success', this.title, `${message} Correctamente`);
  //   this.loading = false;
  //   this.modalRef.content.callback(true);
  //   this.modalRef.hide();
  // }

  getMJobManagements(params: ListParams = new ListParams()) {
    this.loading = true;
    Object.keys(this.queryParams).forEach((key: any) => {
      params[`filter.${key}`] = this.queryParams[key];
    });
    this.mJobManagementService.getAll(params).subscribe({
      next: res => {
        this.totalItems = res.count;
        console.log('DATA', res);
        this.mJobManagements = res.data;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }
}
