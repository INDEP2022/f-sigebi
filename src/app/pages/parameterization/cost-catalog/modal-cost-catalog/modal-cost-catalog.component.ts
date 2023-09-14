import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IServiceCat } from 'src/app/core/models/catalogs/service-cat.model';
import { ServiceCatService } from 'src/app/core/services/catalogs/service-cat.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CostCatalogService } from '../cost-catalog.service';

@Component({
  selector: 'app-modal-cost-catalog',
  templateUrl: './modal-cost-catalog.component.html',
  styles: [],
})
export class ModalCostCatalogComponent extends BasePage implements OnInit {
  title: string = 'Catálogo de Costo';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  data: LocalDataSource = new LocalDataSource();
  allotment: IServiceCat;
  isChecked: boolean = false;
  cost: any[] = [];
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private catalogService: CostCatalogService,
    private serviceCatService: ServiceCatService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      code: [
        null,
        [
          Validators.required,
          Validators.pattern(KEYGENERATION_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(200),
        ],
      ],
      subaccount: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(4),
        ],
      ],
      unaffordabilityCriterion: [null, Validators.maxLength(1)],
      cost: [null, [Validators.required, Validators.maxLength(5)]],
      registryNumber: [null],
    });
    if (this.allotment != null) {
      this.edit = true;
      this.form.patchValue(this.allotment);
      this.form.controls['code'].disable();
      console.log(this.allotment.cost);
      if (this.allotment.cost === 'GASTO') {
        this.form.get('cost').setValue(this.allotment.cost);
      } else {
        this.form.get('cost').setValue(this.allotment.cost);
      }
      if (this.allotment.unaffordabilityCriterion === 'Y') {
        this.isChecked = true;
      } else {
        this.isChecked = false;
      }
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.form.get('cost').value === 'COSTO' ? 'COSTO' : 'GASTO';
    this.isChecked === true
      ? this.form.controls['unaffordabilityCriterion'].setValue('Y')
      : this.form.controls['unaffordabilityCriterion'].setValue('N');
    const id = this.form.get('code').value;
    console.log(this.form.getRawValue());
    this.serviceCatService.update(id, this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  create() {
    if (
      this.form.controls['code'].value.trim() === '' ||
      this.form.controls['description'].value.trim() === '' ||
      this.form.controls['subaccount'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', '');
      return;
    }

    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.serviceCatService.getAll(params).subscribe({
      /*next: (resp: any) => {
        if (resp.data) {
          // resp.data.forEach((item: any) => {
          //   this.data1.push({
          //     keyServices: item.code,
          //     descriptionServices: item.description,
          //     typeExpenditure: item.subaccount,
          //     unaffordable: item.unaffordabilityCriterion,
          //     cost: item.cost,
          //   });
          // });

          this.cost = resp.data;
          this.data.load(this.cost);
          console.log(this.data);
          this.data.refresh();
          this.totalItems = resp.count;
        }*/
      next: resp => {
        this.cost = resp.data;
        this.totalItems = resp.count;
        this.data.load(resp.data);
        this.data.refresh();
        this.loading = false;

        if (this.form.get('code').value == resp.data[0].code) {
          this.alert('error', 'El Codigo ya fue registrado', '');
          return;
        }
        this.loading = true;
        this.form.get('cost').value === 'COSTO' ? 'COSTO' : 'GASTO';
        this.isChecked === true
          ? this.form.controls['unaffordabilityCriterion'].setValue('Y')
          : this.form.controls['unaffordabilityCriterion'].setValue('N');
        //console.log(this.form.getRawValue());
        this.serviceCatService.create(this.form.getRawValue()).subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  getCostCatalog() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.serviceCatService.getAll(params).subscribe({
      /*next: (resp: any) => {
        if (resp.data) {
          // resp.data.forEach((item: any) => {
          //   this.data1.push({
          //     keyServices: item.code,
          //     descriptionServices: item.description,
          //     typeExpenditure: item.subaccount,
          //     unaffordable: item.unaffordabilityCriterion,
          //     cost: item.cost,
          //   });
          // });

          this.cost = resp.data;
          this.data.load(this.cost);
          console.log(this.data);
          this.data.refresh();
          this.totalItems = resp.count;
        }*/
      next: resp => {
        //this.cost = this.data1;
        this.totalItems = resp.count;
        this.data.load(resp.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }
}
