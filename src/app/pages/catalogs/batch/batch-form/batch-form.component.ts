import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IBatch } from '../../../../core/models/catalogs/batch.model';
import { BatchService } from './../../../../core/services/catalogs/batch.service';

@Component({
  selector: 'app-batch-form',
  templateUrl: './batch-form.component.html',
  styles: [],
})
export class BatchFormComponent extends BasePage implements OnInit {
  batchForm: FormGroup = new FormGroup({});
  title: string = 'Lote';
  edit: boolean = false;
  batch: IBatch;
  items = new DefaultSelect<IBatch>();
  @Output() refresh = new EventEmitter<true>();
  itemsAlmacen = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private batchService: BatchService,
    private render: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.batchForm = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],

      numStore: [null, [Validators.required]],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      status: [null, [Validators.required]],
    });
    if (this.batch != null) {
      this.edit = true;
      console.log(this.batch);
      console.log(this.batch.numStore.idWarehouse);
      this.batchForm.patchValue(this.batch);
      this.batchForm.controls['numStore'].setValue(
        this.batch.numStore.idWarehouse
      );
      this.getAlmacen(new ListParams(), this.batch.numStore.idWarehouse);
      this.batchForm.controls['numStore'].disable();
      this.batchForm.controls['id'].disable();
    }
    this.getAlmacen(new ListParams());
  }

  getAlmacen(params: ListParams, id?: string) {
    if (id) {
      params['filter.idWarehouse'] = `$eq:${id}`;
    }
    this.batchService.getAlmacen(params).subscribe((data: any) => {
      this.itemsAlmacen = new DefaultSelect(data.data, data.count);
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (this.batchForm.controls['description'].value.trim() === '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.batchService.create(this.batchForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.loading = false;
        this.alert(
          'error',
          'El Codigo Lote con el No. Almacen ya fueron registrados',
          ''
        );
      },
    });
  }

  update() {
    this.loading = true;
    this.batchService
      .update(this.batch.id, this.batchForm.getRawValue())
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
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
