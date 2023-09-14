import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IUnits } from 'src/app/core/models/administrative-processes/siab-sami-interaction/measurement-units';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { MODAL_CONFIG } from '../../../../../common/constants/modal-config';
import { ContractService } from '../../../../../core/services/contract/strategy-contract.service';
import { MeasuremenUnitsModalComponent } from '../measuremen-units-modal/measuremen-units-modal.component';
import { MEASUREMENTUNITS_COLUMNS } from './measurement-units-columns';

@Component({
  selector: 'app-measurement-units',
  templateUrl: './measurement-units.component.html',
  styles: [],
})
export class MeasurementUnitsComponent extends BasePage implements OnInit {
  data1: any[] = [];
  data = new LocalDataSource();
  columns: IUnits[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columnFilters: any = [];
  //filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  dataSelect: IUnits;
  form: FormGroup = new FormGroup({});
  newOrEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService,
    private movementService: AccountMovementService,
    private goodsQueryService: GoodsQueryService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: true,
        position: 'right',
      },
      columns: MEASUREMENTUNITS_COLUMNS,
    };
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.prepareForm();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filters.field) {
              case 'number':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getAllUnits();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        if (this.data) this.getAllUnits();
      },
    });
  }

  getAllUnits() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.data1 = [];
    this.goodsQueryService.getAllUnits(params).subscribe({
      next: response => {
        console.log('RESPUESTA: ', response);
        this.totalItems = response.count;
        console.log('this.totalItems: ', this.totalItems);
        for (let i = 0; i < response.data.length; i++) {
          //  console.log("DATA: ", response.data[i].registryNumber);

          let dataForm = {
            unit: response.data[i].unit,
            registryNumber: response.data[i].registryNumber,
            description: response.data[i].description,
          };
          this.data1.push(dataForm);
        }
        this.data.load(this.data1);
      },
      error: err => {
        console.log(err);
        this.data.load(this.data1);
      },
    });
  }

  showDeleteAlert(units?: IUnits) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        let numero = units.unit;
        //  console.log("Numero: ", numero);
        this.delete(numero);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(numero: string | number) {
    this.goodsQueryService.remove(numero).subscribe({
      next: response => {
        console.log(response);
        this.getAllUnits();
      },
      error: err => {
        console.log(err);
      },
    });
  }

  update() {
    let bool = false;
    this.loadModal(bool);
  }

  loadModal(bool: boolean) {
    if (bool != false) {
      this.openModal(true, this.dataSelect);
    } else {
      this.openModal(false, this.dataSelect);
    }
  }

  openModal(newOrEdit: boolean, data: IUnits) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      newOrEdit,
      data,
      callback: (next: boolean) => {
        if (next) this.getAllUnits();
      },
    };
    this.modalService.show(MeasuremenUnitsModalComponent, modalConfig);
  }

  prepareForm() {
    this.form = this.fb.group({
      unit: [''],
      description: ['', Validators.required],
      registryNumber: ['', Validators.required],
    });

    if ((this.newOrEdit = true)) {
      this.form.controls['unit'].disable();
    }
  }

  onRowSelect(event: IUnits) {
    //console.log(event);
    this.dataSelect = event;
    console.log(this.dataSelect);
    let bool = true;
    this.loadModal(bool);
  }
}
