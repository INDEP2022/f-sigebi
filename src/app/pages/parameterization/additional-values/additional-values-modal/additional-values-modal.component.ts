import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITablesType } from 'src/app/core/models/catalogs/dinamic-tables.model';
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
  title: string = 'Valor de Atributo';
  additionalValuesForm: FormGroup;
  tvalTableForm: ModelForm<ITvalTable5>;
  tvalTable: ITvalTable5;
  value: ITablesType;
  values = new DefaultSelect<ITablesType>();
  edit: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  minDate: Date;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private valuesService: DinamicTablesService,
    private tvalTableService: TvalTable5Service,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.additionalValuesForm = this.fb.group({
      cdtabla: [null, [Validators.required]],
      dstabla: [null, [Validators.required]],
    });
    this.tvalTableForm = this.fb.group({
      id: [null],
      table: [null],
      otKey1: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(15),
        ],
      ],
      otKey2: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(15)],
      ],
      otKey3: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(15)],
      ],
      otKey4: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(15)],
      ],
      otKey5: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(15)],
      ],
      fromDate: [null],
      toDate: [null],
      otValue01: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      otValue02: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue03: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue04: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue05: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue06: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue07: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue08: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue09: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue10: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue11: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue12: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue13: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue14: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue15: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue16: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue17: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue18: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue19: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue20: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue21: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue22: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue23: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue24: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      otValue25: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      numRegister: [null],
    });
    if (this.tvalTable != null) {
      this.edit = true;
      this.tvalTableForm.patchValue(this.tvalTable);
      console.log(this.value);
      this.additionalValuesForm.controls['cdtabla'].setValue(
        this.value.cdtabla
      );
      this.additionalValuesForm.controls['dstabla'].setValue(
        this.value.dstabla
      );
      this.tvalTableForm.controls['table'].setValue(this.value.nmtabla);
      const { cdtabla } = this.value;
      this.values = new DefaultSelect([cdtabla], 1);
      if (this.tvalTable.fromDate) {
        let datefrom = new Date(this.tvalTable.fromDate);
        this.tvalTableForm.controls['fromDate'].setValue(datefrom);
      }
      if (this.tvalTable.toDate) {
        let date = new Date(this.tvalTable.toDate);
        this.tvalTableForm.controls['toDate'].setValue(date);
      }
    } else {
      this.tvalTableForm.patchValue(this.tvalTable);
      console.log(this.value);
      this.additionalValuesForm.controls['cdtabla'].setValue(
        this.value.cdtabla
      );
      this.additionalValuesForm.controls['dstabla'].setValue(
        this.value.dstabla
      );
      this.tvalTableForm.controls['table'].setValue(this.value.nmtabla);
      const { cdtabla } = this.value;
      this.values = new DefaultSelect([cdtabla], 1);
    }
  }
  getAditionalValues(param: ListParams) {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.valuesService.getAll2(params).subscribe(
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
  onAditionalValuesChange(aditionalValues: any) {
    console.log(aditionalValues);
    this.value = aditionalValues;
    this.additionalValuesForm.controls['cdtabla'].setValue(
      aditionalValues.name
    );
    this.additionalValuesForm.controls['dstabla'].setValue(
      aditionalValues.description
    );
    this.params = this.pageFilter(this.params);

    this.tvalTableForm.controls['table'].setValue(aditionalValues.table);
    this.values = new DefaultSelect([aditionalValues.name], 1);
  }
  close() {
    this.modalRef.hide();
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }
  create() {
    if (
      this.tvalTableForm.controls['otKey1'].value.trim() == '' ||
      this.tvalTableForm.controls['otValue01'].value.trim() == '' ||
      (this.tvalTableForm.controls['otKey1'].value.trim() == '' &&
        this.tvalTableForm.controls['otValue01'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      if (this.tvalTableForm.controls['fromDate'].value) {
        this.tvalTableForm.controls['fromDate'].setValue(
          this.datePipe.transform(
            this.tvalTableForm.controls['fromDate'].value,
            'yyyy-MM-dd'
          )
        );
      }
      if (this.tvalTableForm.controls['toDate'].value) {
        this.tvalTableForm.controls['toDate'].setValue(
          this.datePipe.transform(
            this.tvalTableForm.controls['toDate'].value,
            'yyyy-MM-dd'
          )
        );
      }
      this.tvalTableService.create2(5, this.tvalTableForm.value).subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.loading = false;
          if (this.tvalTable) {
            if (this.tvalTable.fromDate) {
              let datefrom = new Date(this.tvalTable.fromDate);
              this.tvalTableForm.controls['fromDate'].setValue(datefrom);
            }
            if (this.tvalTable.toDate) {
              let date = new Date(this.tvalTable.toDate);
              this.tvalTableForm.controls['toDate'].setValue(date);
            }
          }
        },
      });
    }
  }
  update() {
    if (
      this.tvalTableForm.controls['otKey1'].value.trim() == '' ||
      this.tvalTableForm.controls['otValue01'].value.trim() == '' ||
      (this.tvalTableForm.controls['otKey1'].value.trim() == '' &&
        this.tvalTableForm.controls['otValue01'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      if (this.tvalTableForm.controls['fromDate'].value) {
        this.tvalTableForm.controls['fromDate'].setValue(
          this.datePipe.transform(
            this.tvalTableForm.controls['fromDate'].value,
            'yyyy-MM-dd'
          )
        );
      }
      if (this.tvalTableForm.controls['toDate'].value) {
        this.tvalTableForm.controls['toDate'].setValue(
          this.datePipe.transform(
            this.tvalTableForm.controls['toDate'].value,
            'yyyy-MM-dd'
          )
        );
      }

      this.tvalTableService
        .update2(
          this.tvalTableForm.controls['id'].value,
          5,
          this.tvalTableForm.value
        )
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => {
            this.loading = false;

            if (this.tvalTable.fromDate) {
              let datefrom = new Date(this.tvalTable.fromDate);
              this.tvalTableForm.controls['fromDate'].setValue(datefrom);
            }
            if (this.tvalTable.toDate) {
              let date = new Date(this.tvalTable.toDate);
              this.tvalTableForm.controls['toDate'].setValue(date);
            }
          },
        });
    }
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  validateDate(event: Date) {
    this.minDate = event;
  }
}
