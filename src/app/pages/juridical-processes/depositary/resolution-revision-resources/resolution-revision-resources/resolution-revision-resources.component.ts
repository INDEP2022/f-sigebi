/** BASE IMPORT */
import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IGood } from 'src/app/core/models/good/good.model';
import { IGoodSami } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { RESOLUTION_REVISION_COLUMNS } from './resolution-revision-columns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-resolution-revision-resources',
  templateUrl: './resolution-revision-resources.component.html',
  styleUrls: ['./resolution-revision-resources.component.scss'],
})
export class ResolutionRevisionResourcesComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  @Output() loadingData = new EventEmitter<boolean>();
  showResolucion: boolean = false;
  public form: FormGroup;
  selectedRow: any;
  formLoading = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  data3: IGood[] = [];
  data2: IGood[] = [];
  datePipe: DatePipe;
  totalItems: number = 0;
  dataGood: IListResponse<IGoodSami> = {} as IListResponse<IGoodSami>;
  columnFilters: any = [];
  columns: any = [];
  validUp: boolean = false;
  resolutionBtn: boolean = false;

  constructor(
    private goodService: GoodService,
    private router: Router,
    private fb?: FormBuilder
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: RESOLUTION_REVISION_COLUMNS,
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
  ngOnInit(): void {
    this.startApp();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'goodId':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'quantity':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'status':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'revRecCause':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'physicalReceptionDate':
                if (filter.search) {
                  filter.search = `${this.returnParseDate(
                    filter.search
                  )} 00:00:00`;
                }
                searchFilter = SearchFilter.SD;
                field = `filter.${filter.field}`;
                break;
              case 'resolutionEmissionRecRevDate':
                if (filter.search) {
                  filter.search = `${this.returnParseDate(
                    filter.search
                  )} 00:00:00`;
                }
                searchFilter = SearchFilter.SD;
                field = `filter.${filter.field}`;
                break;
              case 'revRecObservations':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
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
          this.getSubDelegations();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getSubDelegations();
    });
  }

  getSubDelegations() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log('service ');
    this.formLoading = true;
    params['sortBy'] = 'goodId:DESC';
    this.goodService.getByGood2(params).subscribe({
      next: resp => {
        console.log('data -> ', resp.data);
        this.totalItems = resp.count;
        this.data.load(resp.data);
        for (let i = 0; i < resp.count; i++) {
          if (resp.data[i] != undefined) {
            let item = {
              goodId: resp.data[i].id,
              description: resp.data[i].description || null,
              quantity: resp.data[i].quantity || null,
              status: resp.data[i].status || null,
              revRecCause: resp.data[i].revRecCause || null,
              physicalReceptionDate: resp.data[i].physicalReceptionDate || null,
              resolutionEmissionRecRevDate:
                resp.data[i].resolutionEmissionRecRevDate || null,
              revRecObservations: resp.data[i].revRecObservations || null,
            };
            this.data2.push(item as any);
            this.data3 = resp.data;
          } else {
            this.data.refresh();
            break;
          }
        }

        this.columns = resp.data;
        this.data.load(this.data2);
        this.totalItems = resp.count || 0;
        this.data.refresh();

        this.formLoading = false;
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        console.error('error', error);
      },
    });
  }

  startApp() {
    this.form = this.fb.group({
      resolucion: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], //*
    });
  }

  btnResolucion() {
    this.showResolucion = true;
  }

  btnCloseResolucion() {
    console.log(this.form.value);
    this.updateGood();
    this.showResolucion = false;
  }

  onRowSelect(event: any) {
    this.resolutionBtn = true;
    console.log('salida 0', event.data);
    this.selectedRow = event.data;
    console.log('select', this.selectedRow);
    let auxRevision;
    for (let i = 0; i < this.data3.length; i++) {
      if (this.data3[i].goodId == this.selectedRow.goodId) {
        console.log(' encontrado -> ', this.data3[i]);
        auxRevision = this.data3[i];
      }
    }

    this.form.patchValue({
      resolucion: auxRevision.resolution || null,
    });
  }

  //Editar
  formData(doc: any) {
    this.selectedRow = doc;
  }

  doubleClick(doc: any) {
    //console.log("data envio ",this.selectedRow);
    this.router.navigate(
      ['pages/general-processes/historical-good-situation'],
      {
        queryParams: { origin: this.selectedRow },
      }
    );
  }

  flag(event: any) {
    //console.log(event);
    this.validUp = this.form.get('resolucion').value !== '';
  }

  updateGood() {
    if (this.form.valid) {
      this.validUp = true;
      let dataSelect: IGood;

      for (let i = 0; i < this.data3.length; i++) {
        if (this.data3[i].goodId == this.selectedRow.NoBien) {
          console.log(' encontrado -> ', this.data3[i]);
          dataSelect = this.data3[i];
        }
      }
      dataSelect.resolution = this.form.get('resolucion').value;

      const good: any = {
        id: Number(dataSelect.id),
        goodId: Number(dataSelect.id),
        resolution: this.form.get('resolucion').value,
      };
      this.goodService.updateByBody(good as any).subscribe(
        res => {
          this.alert('success', 'Bien', `Actualizado Correctamente`);
        },
        err => {
          this.alert(
            'error',
            'Bien',
            'No se Pudo Actualizar el Bien, por favor Intentelo Nuevamente'
          );
        }
      );
    } else {
      this.validUp = false;
      this.alert('error', 'Resolución debe tener un valor', '');
    }
  }
}
