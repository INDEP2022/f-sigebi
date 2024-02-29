import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IBankMovementsTypes } from 'src/app/core/models/catalogs/bank-movements-types.models';
import { RecordAccountStatementsService } from 'src/app/core/services/catalogs/record-account-statements.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BankMovementType } from 'src/app/core/services/ms-bank-movement/bank-movement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BankMovementsFormComponent } from '../bank-movements-form/bank-movements-form.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-bank-movements-types',
  templateUrl: './bank-movements-types.component.html',
  styles: [],
})
export class BankMovementsTypesComponent extends BasePage implements OnInit {
  form: FormGroup;
  form1: FormGroup;
  bankMovementsTypes: IBankMovementsTypes[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  selectedRow: IBankMovementsTypes;
  bankAccountSelect = new DefaultSelect();
  banks = new DefaultSelect();

  paramsSubject: BehaviorSubject<ListParams> = new BehaviorSubject<ListParams>(
    new ListParams()
  );
  bankCode: string;
  result: any;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private bankMovementType: BankMovementType,
    private recordAccountStatementsService: RecordAccountStatementsService,
    private accountMovementService: AccountMovementService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions.add = false;
    this.settings.actions.edit = true;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.searchBanks(new ListParams());
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
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'accountKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'accountType':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'coinKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'branchOffice':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'bankKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'registryNumber':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getDeductives();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  private prepareForm() {
    this.form = this.fb.group({
      bankSelect: [null, [Validators.required]],
    });
    this.form1 = this.fb.group({
      account: [null],
      branch: [null],
    });
  }

  rowsSelected(event: any) {
    this.selectedRow = event.data;
  }

  // Trae la lista de bancos por defecto
  async searchBanks(params: ListParams) {
    this.banks = new DefaultSelect();
    //this.getDeductives();
    let text;
    if (params.text) {
      params['filter.bankCode'] = `$ilike:${params.text}`;
      params['search'] = ``;
      text = params.text;
    }

    let user = await this.getBanc(params);
    let dataBanc: any = user;
    if (user == null) {
      if (text) {
        let params1 = new ListParams();
        params1['filter.name'] = `$ilike:${text}`;
        params1['search'] = ``;
        let user1 = await this.getBanc(params1);
        let dataBanc1: any = user1;
        this.loading = false;
        console.log(dataBanc1);
        this.result = dataBanc1.data.map(async (item: any) => {
          item['codeName'] = item.bankCode + ' - ' + item.name;
        });
        this.banks = new DefaultSelect(dataBanc1.data, dataBanc1.count);
      } else {
        this.banks = new DefaultSelect();
      }
    } else if (user) {
      console.log(dataBanc);
      this.loading = false;
      this.result = dataBanc.data.map(async (item: any) => {
        item['codeName'] = item.bankCode + ' - ' + item.name;
      });
      this.banks = new DefaultSelect(dataBanc.data, dataBanc.count);
    } else {
      this.banks = new DefaultSelect();
    }

    /*this.loading = true;
    this.bankAccountSelect = new DefaultSelect();
    if (params.text) {
      params['filter.name'] = `$ilike:${params.text}`;
    }
    this.recordAccountStatementsService.getAll(params).subscribe({
      next: response => {
        this.loading = true;

        this.banks = new DefaultSelect(response.data, response.count);
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.alert('warning', 'No existen bancos', ``);
      },
    });*/
  }

  async getBanc(params: ListParams) {
    return new Promise((resolve, reject) => {
      this.recordAccountStatementsService.getAll(params).subscribe({
        next: response => {
          resolve(response);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  changeBanc(event: any) {
    console.log(event);
  }

  // Permite buscar los bancos por nombre
  onSearchName(inputElement: any) {
    const name = inputElement.value;
    setTimeout(() => {
      this.recordAccountStatementsService
        .getAllDinamicName(name, this.params.getValue())
        .subscribe({
          next: response => {
            this.result = response.data.map(async (item: any) => {
              item['codeName'] = item.bankCode + ' - ' + item.name;
            });
            this.banks = new DefaultSelect(response.data, response.count);
            this.loading = false;
          },
          error: (err: any) => {
            this.loading = false;
            // this.alert('warning', 'No Existen Bancos', ``);
          },
        });
    }, 3000);
  }

  consultarBanco(event: any) {
    const bankSelectValue = event;
    this.onBankSelectChange(bankSelectValue);
  }

  // Asigna el valor del banco seleccionado a la función "searchBankAccount"
  onBankSelectChange(bankSelectValue: any) {
    this.bankAccountSelect = new DefaultSelect();
    this.loading = false;
    if (bankSelectValue) {
      const bankCode = bankSelectValue;
      this.searchBankAccount(bankCode, this.paramsSubject);
      this.loading = false;
    } else {
      this.cleandInfoAll();
      this.loading = false;
    }
  }

  // Toma el banco seleccionado y busca todas las cuentas pertenecientes a ese banco
  searchBankAccount(
    bankCode: string,
    paramsSubject: BehaviorSubject<ListParams>
  ) {
    this.bankCode = bankCode;
    const params = paramsSubject.getValue();
    this.bankMovementType.getAllFilter(this.bankCode, params).subscribe({
      next: response => {
        this.bankMovementsTypes = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  onClearSelection() {
    this.searchBankAccount(this.bankCode, this.paramsSubject);
  }

  getDeductives() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.accountMovementService.getPaymentControl(params).subscribe({
      next: response => {
        /*this.bankMovementsTypes = response.data.map(item => ({
          ...item,
          coinKey: item.coinKey.replace(/'/g, ''),
        }));*/
        this.data.load(response.data);
        this.data.refresh();
        console.log(this.data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        /*this.alert(
          'warning',
          'No se encontraron registros con el parámetro de búsqueda',
          ''
        );*/
      },
    });
  }

  //Modal para crear o editar clientes penalizados
  openForm(bankMovementsTypes?: IBankMovementsTypes) {
    console.log(bankMovementsTypes);
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      bankMovementsTypes,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(BankMovementsFormComponent, modalConfig);
  }

  showDeleteAlert(bankMovementsTypes?: IBankMovementsTypes) {
    console.log(bankMovementsTypes);
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(bankMovementsTypes.id);
      }
    });
  }

  delete(id: number) {
    this.bankMovementType.remove(id).subscribe({
      next: () => {
        this.getDeductives();
        this.alert('success', 'El movimiento ha sido eliminado', '');
      },
      error: err => {
        this.alert(
          'warning',
          'No se puede eliminar el registro porque está referenciado en otra tabla',
          ''
        );
      },
    });
  }

  cleandInfoAll() {
    this.form.reset();
    this.totalItems = 0;
    this.searchBanks(new ListParams());
  }

  cleandInfoDate() {
    this.form.get('bankSelect').reset();
    this.data.load([]);
    this.getDeductives();
  }
}
