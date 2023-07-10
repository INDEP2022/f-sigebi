import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BatchService } from 'src/app/core/services/catalogs/batch.service';
import { RackService } from 'src/app/core/services/catalogs/rack.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ListParams } from '../../../../common/repository/interfaces/list-params';
import { IRack } from '../../../../core/models/catalogs/rack.model';
import { DefaultSelect } from '../../../../shared/components/select/default-select';

@Component({
  selector: 'app-rack-form',
  templateUrl: './rack-form.component.html',
  styles: [],
})
export class RackFormComponent extends BasePage implements OnInit {
  form: ModelForm<IRack>;
  title: string = 'Estante';
  edit: boolean = false;
  rack: any;
  racks = new DefaultSelect<IRack>();
  public warehouse = new DefaultSelect();
  public batch = new DefaultSelect();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private rackService: RackService,
    private batchService: BatchService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getWarehouse(new ListParams());
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(2),
        ],
      ],
      idWarehouse: [null, [Validators.required]],
      idBatch: [null, [Validators.required]],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      status: [null, Validators.maxLength(1)],
      registerNumber: [null],
    });

    if (this.rack != null) {
      console.log(this.rack);
      this.edit = true;
      this.form.patchValue(this.rack);
      this.form.controls['idWarehouse'].setValue(
        this.rack.warehouseDetails.idWarehouse
      );
      this.form.controls['idBatch'].setValue(this.rack.batchDetails.id);
      this.getWarehouse(
        new ListParams(),
        this.form.controls['idWarehouse'].value.toString()
      );
      this.getBatch(
        new ListParams(),
        this.form.controls['idBatch'].value.toString()
      );
      this.form.controls['id'].disable();
      this.form.controls['idBatch'].disable();
      this.form.controls['idWarehouse'].disable();
      console.log(this.form);
    }
    this.form.controls['idWarehouse'].disable();
    setTimeout(() => {
      this.getBatch(new ListParams());
    }, 1000);
    //console.log(this.form.value.id);
  }

  getData(params: ListParams) {
    this.rackService.getAll(params).subscribe({
      next: data => {
        this.racks = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.racks = new DefaultSelect();
      },
    });
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.rackService.create(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.loading = false;
        this.onLoadToast('error', error.error.message, '');
      },
    });
  }

  update() {
    this.loading = true;
    this.rackService
      .update8(
        this.rack.id,
        this.rack.idWarehouse,
        this.rack.idBatch,
        this.form.getRawValue()
      )
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
  public searchWarehouse(data: any) {
    console.log(data);
    // this.getWarehouse(new ListParams, data.numStore.idWarehouse);
    const params = new ListParams();
    params['filter.idWarehouse'] = data.numStore.idWarehouse;
    this.rackService.getWarehouse(params).subscribe({
      next: (types: any) => {
        this.warehouse = new DefaultSelect(types.data, types.count);
        console.log(types);
        this.form.controls['idWarehouse'].setValue(types.data[0].idWarehouse);
      },
    });
  }
  public getWarehouse(params: ListParams, id?: string) {
    if (id) {
      params['filter.idWarehouse'] = id;
    }
    this.rackService.getWarehouse(params).subscribe({
      next: (types: any) => {
        this.warehouse = new DefaultSelect(types.data, types.count);
      },
      error: error => {
        this.warehouse = new DefaultSelect();
      },
    });
  }
  public getBatch(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = id;
    }
    this.batchService.getAll(params).subscribe({
      next: (types: any) => {
        this.batch = new DefaultSelect(types.data, types.count);
      },
      error: error => {
        this.batch = new DefaultSelect();
      },
    });
  }
}
