import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { BasePage } from 'src/app/core/shared';
import { COLUMNSLIST } from 'src/app/pages/executive-processes/authorization-assets-destruction/list-key-proceedings/columns-list-key';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-modal-proceedings',
  templateUrl: './modal-proceedings.component.html',
  styleUrls: [],
})
export class ModalProceedingsComponent extends BasePage implements OnInit {
  @Input() typeProceedings: string = 'DESTRUCCION';
  filterForm: FormGroup;

  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  proceedingSelect: any = null;
  columnFilters: any[] = [];
  completeFilters: any[] = [];

  dataExpedients = new DefaultSelect();
  selectExpedient: boolean = false;

  filterFlag: boolean = false;

  override settings = {
    ...this.settings,
    columns: COLUMNSLIST,
    actions: false,
    hideSubHeader: false,
  };

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private proceedingsDetailDel: ProceedingsDeliveryReceptionService,
    private expedientService: ExpedientService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.getProceedings();
    this.navigate();
    this.columnFilterTable();
  }

  initForm() {
    this.filterForm = this.fb.group({
      expedient: [null],
      prevAv: [null],
      criminalCase: [null],
    });
  }

  close() {
    this.modalRef.hide();
  }

  clearFilter() {
    this.filterForm.reset();
    this.filterFlag = false;
    this.selectExpedient = false;
    this.getProceedings();
  }

  onExpedientChange(e: any) {
    console.log(e);
    this.getProceedings(true);
  }

  filterFn() {
    const expedientValue = this.filterForm.get('expedient').value;
    const prevAvValue = this.filterForm.get('prevAv').value;
    const criminalCaseValue = this.filterForm.get('criminalCase').value;

    if (
      expedientValue == null &&
      prevAvValue == null &&
      criminalCaseValue == null
    ) {
      this.alert(
        'warning',
        'Filtros',
        'Debe ingresar al menos un filtro para realizar la búsqueda'
      );
      return;
    }

    if (expedientValue != null) {
      this.getProceedings(true);
    } else {
      this.alert(
        'info',
        'Se buscó por ' +
          (prevAvValue != null ? 'Averiguación Previa' : 'Causa Penal'),
        'Los expedientes se mostrarán como lista de consulta que corresponde con la búsqueda.\nSe cargará el primer expediente de la lista.'
      );
      this.getExpedients();
    }
  }

  getExpedients(params?: ListParams) {
    const prevAvValue = this.filterForm.get('prevAv').value;
    const criminalCaseValue = this.filterForm.get('criminalCase').value;
    console.log(params);
    const paramsF = new FilterParams();
    prevAvValue != null
      ? paramsF.addFilter('preliminaryInquiry', prevAvValue)
      : paramsF.addFilter('criminalCase', criminalCaseValue);

    this.expedientService.getAllFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.dataExpedients = new DefaultSelect(res.data);
        this.filterForm.get('expedient').setValue(res.data[0].id);
        this.getProceedings(true);
        this.selectExpedient = true;
      },
      err => {
        this.alert(
          'error',
          'Error',
          'Ocurrió un error al cargar los expedientes.'
        );
        console.log(err);
        this.dataExpedients = new DefaultSelect();
        this.selectExpedient = false;
      }
    );
  }

  getProceedings(filter: boolean = false) {
    this.loading = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('typeProceedings', this.typeProceedings);
    paramsF.page = this.params.value.page;
    paramsF.limit = this.params.value.limit;

    if (filter || this.filterFlag) {
      const expedientValue = this.filterForm.get('expedient').value;
      const prevAvValue = this.filterForm.get('prevAv').value;
      const criminalCaseValue = this.filterForm.get('criminalCase').value;

      if (
        expedientValue == null &&
        prevAvValue == null &&
        criminalCaseValue == null
      ) {
        this.alert(
          'warning',
          'Filtros',
          'Debe ingresar al menos un filtro para realizar la búsqueda'
        );
        return;
      }

      const numExp = expedientValue;

      expedientValue != null ? paramsF.addFilter('numFile', numExp) : null;
      this.filterFlag = true;
    }

    for (let data of this.completeFilters) {
      if (data.search != null && data.search != '') {
        paramsF.addFilter(
          data.field,
          data.search,
          data.field != 'id' ? SearchFilter.ILIKE : SearchFilter.EQ
        );
      }
    }

    this.proceedingsDetailDel.getByFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.data.load(res.data);
        this.totalItems = res.count;
        this.loading = false;
      },
      err => {
        console.log(err);
        this.data.load([]);
        this.totalItems = 0;
        this.loading = false;
      }
    );
  }

  columnFilterTable() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          this.completeFilters = filters;
          filters.map((filter: any) => {
            let searchFilter = SearchFilter.ILIKE;
            if (filter.search !== '') {
              this.columnFilters[
                filter.field
              ] = `${searchFilter}:${filter.search}`;
            }
          });
          this.getProceedings();
        }
      });
  }

  navigate() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(result => {
      console.log(result);
      this.getProceedings();
    });
  }

  selectProceeding(event: any) {
    this.proceedingSelect = event.data;
    console.log(this.proceedingSelect);
  }

  accept() {
    this.modalRef.content.callback(this.proceedingSelect);
    this.modalRef.hide();
  }
}
