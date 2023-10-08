import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Provisional Data
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { ParameterBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-brands.service';
import { ExpenseParametercomerService } from '../../expense-capture/services/expense-parametercomer.service';

@Component({
  selector: 'app-inconsistencies',
  templateUrl: './inconsistencies.component.html',
  styles: [],
})
export class InconsistenciesComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  //inconData = dataInco;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  selectedRow: any = null;

  edit: boolean = false;
  title: string =
    'Catálogo de Inconsistencias en la Validación del Cálculo del I.V.A';

  dataI: any;
  dataA: any[] = [];
  dataDet: any;
  columnFilters: any = ([] = []);
  flagSubmit: boolean = false;

  @Output() selected = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private parameterBrandsService: ParameterBrandsService,
    private appraiseService: AppraiseService,
    private expenseParametercomerService: ExpenseParametercomerService
  ) {
    super();
    let objBase = this;
    this.settings = {
      ...this.settings,
      selectMode: '',
      hideSubHeader: false,
      actions: false,
      columns: {
        ...COLUMNS,
        /* option: {
          title: '',
          type: 'custom',
          sort: false,
          renderComponent: CheckboxElementComponent,
          valuePrepareFunction: (isSelected: any, row: any) => {
            //console.log('valuePrepareFunction -> ', row);
            return row.option == 'S' ? true : false;
          },
          onComponentInitFunction(instance: any) {
            instance.toggle.subscribe((data: any) => {
              objBase.select(data);
            });
          },
        }, */
      },
    };
  }

  ngOnInit(): void {
    this.returrr();
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
              case 'value':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'description':
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
          this.onPressed();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        this.onPressed();
      },
    });
  }

  select(data: any) {
    console.log('select ', data.row);
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      goodId: [null, [Validators.required]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  selectRow(row: any) {
    console.log('row ', row);
    if (row.isSelected) {
      this.flagSubmit = true;
      this.selectedRow = row.data;
      console.log('1');
    } else {
      this.flagSubmit = false;
      this.selectedRow = null;
      console.log('2');
    }
    console.log('selectedRow ', this.selectedRow);
  }

  confirm2() {
    //let data = {};
    this.selected.emit(this.selectedRow);
    this.modalRef.hide();
  }

  confirm() {
    let v_reg_aux: string = null;
    let v_validado: number;
    let al_button: number;

    if (this.dataDet != null) {
      console.log('data det ', this.dataDet);
      this.getComerParameterFilterSumit(
        this.dataDet.idDetAppraisal,
        this.dataDet.goodId
      );
    }

    this.selected.emit(this.selectedRow);
    this.modalRef.hide();
  }

  getComerParameter() {
    this.parameterBrandsService.getSuperUser().subscribe({
      next: response => {
        console.log('response ', response);
        this.dataI = response.data;
        this.data.load(this.dataI);
        this.data.refresh();
        this.totalItems = response.count;
      },
      error: err => {
        console.log('error ', err);
      },
    });
  }

  getComerParameterFilter() {
    this.parameterBrandsService.getSuperUser().subscribe({
      next: response => {
        console.log('response ', response);
        this.dataI = response.data;
        this.data.load(this.dataI);
        this.data.refresh();
        this.totalItems = response.count;
      },
      error: err => {
        console.log('error ', err);
      },
    });
  }

  accept() {
    if (this.dataDet != null) {
      console.log('data det ', this.dataDet);
      this.getComerParameterFilterSumitSearch(
        this.dataDet.idDetAppraisal,
        this.dataDet.goodId
      );
    }
  }

  onPressed() {
    this.dataA = [];
    this.params.getValue()['filter.parameter'] = `$eq:CATINCONSVALIVA`;
    this.params.getValue()['order'] = 'value:ASC';

    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.parameterBrandsService.getSuperUserFilter(params).subscribe({
      next: response => {
        console.log('response ', response);
        for (let i = 0; i < response.data.length; i++) {
          let item = {
            value: response.data[i].value,
            description: response.data[i].description,
            option: 'N',
            parameter: response.data[i].parameter,
            address: response.data[i].address,
            typeEventId: response.data[i].typeEventId,
            nbOrigin: response.data[i].nbOrigin,
            comerTpevents: response.data[i].comerTpevents,
          };
          this.dataA.push(item);
        }
        this.data.load(this.dataA);
        this.data.refresh();
        this.totalItems = response.count;
        this.posChange();
      },
      error: err => {
        console.log('error ', err);
      },
    });
  }

  posChange() {
    let v_cadena_num: string;
    let v_col_ini: number = 1;
    let v_col_fin: number = 0;
    if (this.dataDet != null) {
      v_cadena_num = this.dataDet.observation;
      //console.log('this.dataDet ', this.dataDet);
      if (v_cadena_num != null) {
        let v_columna = this.searchComaChar(v_cadena_num, v_col_ini);

        let v_valor = this.extraerSubcadena(
          v_cadena_num,
          v_col_ini,
          v_col_ini - v_columna
        );
      }
    }
  }

  searchComaChar(v_cadena_num: string, v_contador: number): number {
    const comas = v_cadena_num.split(',');

    if (v_contador <= 0 || v_contador > comas.length) {
      return -1; // v_contador fuera de rango
    }

    return comas[v_contador - 1].length;
  }

  extraerSubcadena(cadena: string, inicio: number, fin: number): string {
    if (
      inicio < 0 ||
      fin < 0 ||
      inicio >= cadena.length ||
      fin > cadena.length ||
      inicio >= fin
    ) {
      return '';
    }
    return cadena.substring(inicio, fin);
  }

  returrr() {
    // Ejemplo de uso:
    const v_cadena_num = 'abcdefghijklm';
    const v_col_ini = 3;
    const v_col_fin = 6;

    const v_valor = this.extraerSubcadena(v_cadena_num, v_col_ini, v_col_fin);
    console.log(v_valor); // Debería mostrar 'cde' en la consola
  }

  getComerParameterFilterSumit(idAvaluo: number, goodId: number) {
    let v_validado = 0;
    const params = new ListParams();
    // this.params.getValue()['filter.description'] = '$eq:S';
    // this.params.getValue()['filter.parameter'] = `$eq:${idAvaluo}`;
    // this.params.getValue()['filter.value'] = `$eq:${goodId}`;

    params['filter.description'] = '$eq:S';
    params['filter.parameter'] = `$eq:${idAvaluo}`;
    params['filter.value'] = `$eq:${goodId}`;
    console.log('params send 1', this.params.getValue());
    console.log('params send 2', params);
    this.parameterBrandsService.getSuperUserFilter(params).subscribe({
      next: response => {
        console.log('response submit ', response);
        this.validateRow(response.count);
      },
      error: err => {
        console.log('error ', err);
        v_validado = 0;
        this.validateRow(0);
      },
    });
  }

  validateRow(total: number) {
    if (
      total > 0 &&
      (this.dataDet.check == 'N' || this.dataDet.check == null)
    ) {
      let params = {
        idAppraisal: Number(this.dataDet.idDetAppraisal),
        idDetAppraisal: Number(this.dataDet.idDetAppraisal1),
        noGood: Number(this.dataDet.goodId),
        approved: 'S',
      };
      console.log('Params Update S->', params);
      this.updateDetailEval(params);
      if (total > 0 && this.selectedRow.option == null) {
        let body = {
          parameter: Number(this.dataDet.idDetAppraisal),
          value: Number(this.dataDet.goodId),
          //address: 'I',
        };
        this.deleteParametersGood(body);
      }
    } else {
      this.alert('error', 'El Registro no ha sido encontrado', '');
    }
  }

  deleteParametersGood(body: any) {
    this.expenseParametercomerService.deleteParametersMod(body).subscribe({
      next: resp => {
        this.alert(
          'success',
          'El Registro ha sido Eliminado Correctamente',
          ''
        );
        console.log('registro eliminado');
      },
      error: err => {
        this.alert('error', 'El Registro no ha sido Eliminado', '');
        console.log('registro no eliminado');
      },
    });
  }

  updateDetailEval(valor: any) {
    console.log('Body updateDetailEval-> ', valor);
    this.appraiseService.updateEatDetAppraisal(valor).subscribe({
      next: resp => {
        console.log('Resp updateDetailEval-> ', resp);
        this.alert(
          'success',
          '',
          'El Registro ha sido actualizado correctamente!'
        );
      },
      error: err => {
        this.alert('error', '', 'El Registro no ha sido actualizado!');
      },
    });
  }

  getComerParameterFilterSumitSearch(idAvaluo: number, goodId: number) {
    const params = new ListParams();
    params['filter.description'] = '$eq:S';
    params['filter.parameter'] = `$eq:${idAvaluo}`;
    params['filter.value'] = `$eq:${goodId}`;
    console.log('params send 1', this.params.getValue());
    console.log('params send 2', params);
    this.parameterBrandsService.getSuperUserFilter(params).subscribe({
      next: response => {
        console.log('response submit ', response);
        this.validateRowSearch(response.count, idAvaluo, goodId);
      },
      error: err => {
        console.log('error ', err);
        this.validateRowSearch(0, idAvaluo, goodId);
      },
    });
  }

  validateRowSearch(total: number, idAvaluo: number, goodId: number) {
    if (
      (total == 0 && this.dataDet.check == 'N') ||
      this.dataDet.check == null
    ) {
      this.postComerParameterMod();
      if (this.selectedRow.option == 'S') {
      }
    } else {
      if (total > 0 && this.dataDet.check == 'S') {
        /**Insert Delete */
        let body = {
          parameter: idAvaluo,
          value: goodId,
          address: 'I',
        };

        this.deleteParametersGood(body);
        let params = {
          idAppraisal: idAvaluo,
          idDetAppraisal: this.dataDet.idDetAppraisal1,
          noGood: goodId,
          observations: '',
          //approved: 'S',
        };
        console.log('Params Update S->', params);
        this.updateDetailEval(params);
      }
    }
  }

  postComerParameterMod() {
    let body = {
      parameter: Number(this.dataDet.idDetAppraisal),
      value: Number(this.dataDet.goodId),
      description: 'S',
      address: 'I',
      // typeEventId: null,
      // nbOrigin: 'Dato de tipo texto',
    };
    this.expenseParametercomerService.postComerParametersMod(body).subscribe({
      next: resp => {
        this.alert('success', 'El Registro ha sido guardado correctamente', '');
      },
      error: err => {
        this.alert('error', 'El Registro no ha sido Guardado', '');
      },
    });
  }
}
