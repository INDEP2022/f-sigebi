import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { RackService } from 'src/app/core/services/catalogs/rack.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
  rack: IRack;
  racks = new DefaultSelect<IRack>();
  public warehouse = new DefaultSelect();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private rackService: RackService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getWarehouse(new ListParams());
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      idWarehouse: [null, [Validators.required]],
      idBatch: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      registerNumber: [null],
    });
    if (this.rack != null) {
      this.edit = true;
      this.form.patchValue(this.rack);
    }
  }

  getData(params: ListParams) {
    this.rackService.getAll(params).subscribe(data => {
      this.racks = new DefaultSelect(data.data, data.count);
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
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.rackService.update(this.rack.id, this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  public getWarehouse(params: ListParams) {
    this.rackService.getWarehouse(params).subscribe({
      next: (types: any) => {
        this.warehouse = new DefaultSelect(types.data, types.count);
      },
    });
  }
}
