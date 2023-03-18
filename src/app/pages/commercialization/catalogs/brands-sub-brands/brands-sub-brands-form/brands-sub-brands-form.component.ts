import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';

import { ParameterBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-brands.service';
import { ParameterSubBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-sub-brands.service';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-brands-sub-brands-form',
  templateUrl: './brands-sub-brands-form.component.html',
  styles: [],
})
export class BrandsSubBrandsFormComponent
  extends BasePageWidhtDinamicFilters
  implements OnInit
{
  status: string = 'Nueva';
  edit: boolean = false;

  form: FormGroup = new FormGroup({});
  brand: any;

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private sanitizer: DomSanitizer,
    private brandServices: ParameterBrandsService,
    private subBrandService: ParameterSubBrandsService
  ) {
    super();
    this.service = this.subBrandService;

    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        add: true,
        edit: true,
        delete: true,
      },
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

  override ngOnInit(): void {
    const field = `filter.idBrand`;
    if (this.brand)
      this.columnFilters[field] = `${SearchFilter.EQ}:${this.brand.id}`;
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      brandDescription: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });

    if (this.edit) {
      //console.log(this.brand)
      this.status = 'Actualizar';
      this.form.patchValue(this.brand);
      this.getData();
      // this.data.load(this.brand.subbrands);
      // this.data.refresh();
    }
  }

  onSaveConfirm(event: any) {
    const body = {
      idBrand: this.form.get('id').value,
      idSubBrand: event.newData.subBrand,
      subBrandDescription: event.newData.description,
    };
    this.subBrandService.create(body).subscribe({
      next: (respSubBrand: any) => {
        if (respSubBrand) {
          event.confirm.resolve();
          this.onLoadToast('success', 'Elemento Actualizado', '');
        }
      },
    });
  }

  onAddConfirm(event: any) {
    const body = {
      idBrand: this.form.get('id').value,
      idSubBrand: event.newData.idSubBrand,
      subBrandDescription: event.newData.subBrandDescription,
    };
    this.subBrandService.create(body).subscribe({
      next: (respSubBrand: any) => {
        if (respSubBrand) {
          event.confirm.resolve();
          this.onLoadToast('success', 'Elemento Creado', '');
        }
      },
    });
  }

  onDeleteConfirm(event: any) {
    this.subBrandService
      .remove({ idBrand: this.brand.id, idSubBrand: event.data.idSubBrand })
      .subscribe({
        next: response => {
          event.confirm.resolve();
          this.onLoadToast('success', 'Elemento Eliminado', '');
        },
      });
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
      this.createBrand();
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

  updateBrand() {
    this.brandServices.update(this.form.value.id, this.form.value).subscribe({
      next: (resp: any) => {
        if (resp.statusCode === 200) {
          return this.handleSuccess();
        }
      },
    });
  }

  createBrand() {
    this.brandServices.create(this.form.value).subscribe({
      next: (resp: any) => {
        if (resp) {
          return this.handleSuccess();
        }
      },
    });
  }

  update() {
    this.loading = true;
    this.updateBrand();

    /*this.bankService.update(this.bank.bankCode, this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );*/
  }
}
