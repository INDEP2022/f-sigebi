import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITables } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { ITvalTable5 } from 'src/app/core/models/catalogs/tval-Table5.model';
import { DinamicTablesService } from 'src/app/core/services/catalogs/dinamic-tables.service';
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
@Component({
  selector: 'app-additional-values-modal',
  templateUrl: './additional-values-modal.component.html',
  styles: [],
})
export class AdditionalValuesModalComponent extends BasePage implements OnInit {
  title: string = 'Valores Adicionales';
  additionalValuesForm: FormGroup;
  tvalTableForm: ModelForm<ITvalTable5>;
  tvalTable: ITvalTable5;
  value: ITables;
  values = new DefaultSelect<ITables>();
  edit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private valuesService: DinamicTablesService,
    private tvalTableService: TvalTable5Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.additionalValuesForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
    this.tvalTableForm = this.fb.group({
      id: [null],
      table: [null],
      otKey1: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      otKey2: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      otKey3: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      otKey4: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      otKey5: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      otValue01: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue02: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue03: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue04: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue05: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue06: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue07: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue08: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue09: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue10: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue11: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue12: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue13: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue14: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue15: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue16: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue17: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue18: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue19: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue20: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue21: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue22: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue23: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue24: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      otValue25: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      numRegister: [null],
    });
    if (this.tvalTable != null) {
      this.edit = true;
      this.tvalTableForm.patchValue(this.tvalTable);
      this.additionalValuesForm.controls['name'].setValue(this.value.name);
      this.additionalValuesForm.controls['description'].setValue(
        this.value.description
      );
    }
  }
  getAditionalValues(params: ListParams) {
    this.valuesService.getAll(params).subscribe(
      (data: any) => {
        this.values = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }
  onAditionalValuesChange(aditionalValues: ITables) {
    console.log(aditionalValues);
    this.value = aditionalValues;
    this.additionalValuesForm.controls['description'].setValue(
      aditionalValues.description
    );
    this.values = new DefaultSelect();
  }
  close() {
    this.modalRef.hide();
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }
  create() {
    this.loading = true;
    this.tvalTableService
      .create2(this.value.tableType, this.tvalTableForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  update() {
    this.loading = true;
    this.tvalTableService
      .update2(
        this.tvalTableForm.controls['id'].value,
        this.value.tableType,
        this.tvalTableForm.value
      )
      .subscribe({
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
}
