import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DONATION_APPROVAL_COLUMNS } from './donation-approval-columns';
//Models
import { IGood } from 'src/app/core/models/ms-good/good';
//Services
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { UpdateModalComponent } from '../update-modal/update-modal.component';

@Component({
  selector: 'app-donation-approval',
  templateUrl: './donation-approval.component.html',
  styleUrls: ['./donation-approval.scss'],
})
export class DonationApprovalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  data: LocalDataSource = new LocalDataSource();

  expedientSelec = new DefaultSelect<IExpedient>();

  rowSelected: boolean = false;
  selectedRow: any = null;
  title: string = 'Aprobación de Bienes para Donación';
  columnFilters: any = [];
  fileNumber: number;
  consult: boolean = false;
  /// http://sigebimstest.indep.gob.mx/goodprocess/api/v1/update-good-status/getOneStatus

  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private expedientService: ExpedientService,
    private datePipe: DatePipe,
    private modalService: BsModalService,
    private goodprocessService: GoodProcessService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...DONATION_APPROVAL_COLUMNS },
      rowClassFunction: (row: any) => {
        if (row.data.di_disponible === 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        } //bg-dark text-white
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          if (this.consult) this.getGoods(this.fileNumber);
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.consult) this.getGoods(this.fileNumber);
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      idExpedient: [
        null,
        [
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      preliminaryInquiry: [null, []],
      criminalCase: [null, Validators.pattern(STRING_PATTERN)],
      circumstantialRecord: [null, Validators.pattern(STRING_PATTERN)],
      keyPenalty: [null, Validators.pattern(STRING_PATTERN)],
    });
  }

  //Seleccionar expediente
  getExpedient(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('preliminaryInquiry', lparams.text, SearchFilter.LIKE);

    this.expedientService.getExpedientList(params.getParams()).subscribe({
      next: data => {
        this.expedientSelec = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.expedientSelec = new DefaultSelect();
      },
    });
  }

  //Evento cuando se selecciona un item del select
  onValuesChange(expedientChange: IExpedient) {
    this.form.controls['idExpedient'].setValue(expedientChange.id);
    this.form.controls['criminalCase'].setValue(expedientChange.criminalCase);
    this.form.controls['circumstantialRecord'].setValue(
      expedientChange.circumstantialRecord
    );
    this.form.controls['keyPenalty'].setValue(
      expedientChange.circumstantialRecord
    );
    this.expedientSelec = new DefaultSelect();

    // this.getExpedientById();
  }

  getExpedientById(): void {
    let _id = this.form.controls['idExpedient'].value;
    this.fileNumber = _id;
    this.consult = true;
    this.loading = true;
    this.expedientService.getById(_id).subscribe({
      next: response => {
        if (response !== null) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          this.getGoods(response.id);
        } else {
          //TODO: CHECK MESSAGE
          this.alert('warning', this.title, 'No se encontraron registros');
        }
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  getGoodsByExpedient(id: string | number): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoods(id));
  }

  getGoods(id: string | number): void {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['filter.fileNumber'] = `$eq:${id}`;
    this.goodService.getAll(params).subscribe({
      next: async response => {
        let data = await Promise.all(
          response.data.map(async (item: any) => {
            console.log(item.ubicationType);
            switch (item.ubicationType) {
              case 'A':
                item.di_cve_ubicacion = 'ALMACEN';
                item.di_ubicacion1 = `${
                  item.almacen ? item.almacen.ubication : ''
                } LOTE ${item.lotNumber ? item.lotNumber.id : ''} RACK ${
                  item.rackNumber
                }`;
                break;
              case 'B':
                item.di_cve_ubicacion = 'BOVEDA';
                item.di_ubicacion1 = `${
                  item.boveda ? item.boveda.ubication : ''
                } GAVETA ${item.lotNumber ? item.lotNumber.id : ''}`;
                break;
              case 'D':
                item.di_cve_ubicacion = 'DEPOSITARÍA';
                break;
              default:
                item.di_ubicacion1 = 'UBICACIÓN DESCONOCIDA';
                break;
            }
            const di_disponible = await this.getDisponible(item.id);
            item.di_disponible = di_disponible;
            return item;
          })
        );
        console.log('Nueva data: ', data);
        this.data.load(data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  resetScreen() {
    window.scrollTo(0, 0);
    this.form.reset();
  }

  clean() {
    this.consult = false;
    window.scrollTo(0, 0);
    this.form.reset();
  }

  getDisponible(goodNumber: number) {
    return new Promise<string>((res, _rej) => {
      const model = {
        goodNumber,
        vcScreen: 'FACTDESAPROBDONAC',
      };
      console.log(model);
      this.goodprocessService.getDisponible2(model).subscribe({
        next: resp => {
          res('S');
        },
        error: err => {
          res('N');
        },
      });
    });
  }

  edit(good: any) {
    if (good.di_disponible === 'S') {
      this.openModal(good);
    } else {
      this.alert('warning', this.title, 'Este Bien no está disponible');
    }
  }

  openModal(good?: IGood) {
    let config: ModalOptions = {
      initialState: {
        good,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getGoods(this.fileNumber));
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UpdateModalComponent, config);
  }
}
