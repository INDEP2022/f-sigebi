import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITablesType } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { ITvalTable5 } from 'src/app/core/models/catalogs/tval-Table5.model';
import { DinamicTablesService } from 'src/app/core/services/catalogs/dinamic-tables.service';
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
  value: ITablesType;
  values = new DefaultSelect<ITablesType>();
  edit: boolean = false;

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
      otKey1: [null, [Validators.required]],
      otKey2: [null],
      otKey3: [null],
      otKey4: [null],
      otKey5: [null],
      fromDate: [null],
      toDate: [null],
      otValue01: [null, [Validators.required]],
      otValue02: [null],
      otValue03: [null],
      otValue04: [null],
      otValue05: [null],
      otValue06: [null],
      otValue07: [null],
      otValue08: [null],
      otValue09: [null],
      otValue10: [null],
      otValue11: [null],
      otValue12: [null],
      otValue13: [null],
      otValue14: [null],
      otValue15: [null],
      otValue16: [null],
      otValue17: [null],
      otValue18: [null],
      otValue19: [null],
      otValue20: [null],
      otValue21: [null],
      otValue22: [null],
      otValue23: [null],
      otValue24: [null],
      otValue25: [null],
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
  onAditionalValuesChange(aditionalValues: any) {
    console.log(aditionalValues);
    this.value = aditionalValues;
    this.additionalValuesForm.controls['cdtabla'].setValue(
      aditionalValues.name
    );
    this.additionalValuesForm.controls['dstabla'].setValue(
      aditionalValues.description
    );
    this.tvalTableForm.controls['table'].setValue(aditionalValues.table);
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
  update() {
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
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
