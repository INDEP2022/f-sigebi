import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-c-c-bsbf-c-brands-sub-brands-form',
  templateUrl: './c-c-bsbf-c-brands-sub-brands-form.component.html',
  styles: [],
})
export class CCBsbfCBrandsSubBrandsFormComponent
  extends BasePage
  implements OnInit
{
  data: LocalDataSource = new LocalDataSource();

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  status: string = 'Nueva';
  edit: boolean = false;

  form: FormGroup = new FormGroup({});
  brand: any;

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: { add: true, edit: true, delete: true },
      delete: {
        ...this.settings.delete,
        confirmDelete: true,
      },
      edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      add: {
        addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
        createButtonContent:
          '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmCreate: true,
      },
      mode: 'inline',
      hideSubHeader: false,
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      brand: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });

    if (this.edit) {
      //console.log(this.brand)
      this.status = 'Actualizar';
      this.form.patchValue(this.brand);
      this.data.load(this.brand.subbrands);
      this.data.refresh();
    }
  }

  onSaveConfirm(event: any) {
    event.confirm.resolve();
    this.onLoadToast('success', 'Elemento Actualizado', '');
  }

  onAddConfirm(event: any) {
    event.confirm.resolve();
    this.onLoadToast('success', 'Elemento Creado', '');
  }

  onDeleteConfirm(event: any) {
    event.confirm.resolve();
    this.onLoadToast('success', 'Elemento Eliminado', '');
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.data.getElements().then((data: any) => {
      //console.log(data)
      this.loading = true;
      this.handleSuccess();
    });
    /*this.bankService.create(this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );*/
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    this.handleSuccess();
    /*this.bankService.update(this.bank.bankCode, this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );*/
  }
}
