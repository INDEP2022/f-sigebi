import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IVigProcessPercentages } from 'src/app/core/models/ms-survillance/survillance';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PERCENTAGE_COLUMNS } from './percentage-columns';

@Component({
  selector: 'app-percentages-surveillance',
  templateUrl: './percentages-surveillance.component.html',
  styles: [],
})
export class PercentagesSurveillanceComponent
  extends BasePage
  implements OnInit
{
  sources: LocalDataSource = new LocalDataSource();
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  processes = [
    { name: 'Supervisión', value: '1' },
    { name: 'Validación', value: '2' },
  ];

  delegationTypes = [
    { name: 'Ferronal', value: '1' },
    { name: 'Sae', value: '2' },
  ];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  dialogPercentageRef: BsModalRef;
  editDialogData: IVigProcessPercentages | null = null;
  @ViewChild('dialogPercentage') dialogPercentageTemplateRef: TemplateRef<any>;
  form = new FormGroup({
    percentage: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
    ]),
    cveProcess: new FormControl('', [Validators.required]),
    delegationNumber: new FormControl('', [Validators.required]),
    delegationType: new FormControl('', [Validators.required]),
  });

  filters = new FilterParams();
  delegations = new DefaultSelect<any>();
  columnFilters: any = [];
  constructor(
    private survillanceService: SurvillanceService,
    private dialogService: BsModalService
  ) {
    super();

    this.settings.columns = PERCENTAGE_COLUMNS;

    this.settings.hideSubHeader = false;
    this.settings.actions.add = false;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.sources
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              cveProcess: () => (searchFilter = SearchFilter.EQ),
              delegationNumber: () => (searchFilter = SearchFilter.EQ),
              delegationType: () => (searchFilter = SearchFilter.EQ),
              percentage: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              console.log('filter.search', filter.search);
              if (filter.search == 'motionDate') {
              }
              this.columnFilters[field] = `${filter.search}`;
              // this.columnFilters[field] = `${searchFilter}:${filter.search}`;

              console.log(
                'this.columnFilters[field]',
                this.columnFilters[field]
              );
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          //Su respectivo metodo de busqueda de datos
          this.getPercentages();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getPercentages();
    });

    // this.params.subscribe(res => {
    //   this.getPercentages(res);
    // });

    // this.sources.onChanged().subscribe(res => {
    //   console.log(res);
    //   if (res.action === 'filter') {
    // this.generateFilterDynamically(res.filter.filters);
    // this.getPercentages(this.params.getValue());
    //   }
    // });
  }

  generateFilterDynamically(
    data: { field: string; search: string; filter: any }[]
  ): void {
    const filters: { [key: string]: SearchFilter } = {
      cveProcess: SearchFilter.EQ,
      delegationNumber: SearchFilter.EQ,
      delegationType: SearchFilter.EQ,
      percentage: SearchFilter.EQ,
    };

    const params = new FilterParams();
    data.forEach(item => {
      if (filters.hasOwnProperty(item.field) && item.search) {
        params.addFilter(item.field, item.search, filters[item.field]);
      }
    });
    this.filters = params;
  }

  getPercentages(): void {
    this.loading = true;
    let params: any = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };

    this.survillanceService.getVigProcessPercentages(params).subscribe({
      next: response => {
        console.log('responseresponse', response);
        this.sources.load(response.data);
        this.sources.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onEditConfirm(event: { data: IVigProcessPercentages }): void {
    this.editDialogData = event.data;
    const {
      cveProcess,
      delegationNumber,
      delegationType,
      percentage,
      delegation,
    }: any = event.data;
    this.form.patchValue({
      cveProcess: cveProcess.toString(),
      delegationNumber: delegationNumber.toString(),
      delegationType: delegationType.toString(),
      percentage: percentage,
    });
    this.openDialogPercentage();
  }

  onDeleteConfirm(event: { data: IVigProcessPercentages }): void {
    console.log(event);
    this.alertQuestion(
      'question',
      '¿Está seguro de eliminar el registro?',
      ''
    ).then(async question => {
      if (question.isConfirmed) {
        this.deleteInServerPercentage(event.data.cveProcess);
      }
    });
  }

  deleteInServerPercentage(id: any): void {
    this.loading = true;
    this.survillanceService.deleteVigProcessPercentages(id).subscribe({
      next: response => {
        console.log(response);

        this.alert('success', 'Registro eliminado correctamente', '');
        this.getPercentages();
        this.loading = false;
      },
      error: err => {
        this.alert('error', 'Error al eliminar el registro', '');
        this.loading = false;
      },
    });
  }

  openDialogPercentage(): void {
    this.getDelegation(new ListParams());
    this.dialogPercentageRef = this.dialogService.show(
      this.dialogPercentageTemplateRef,
      {
        class: 'modal-xl',
      }
    );
  }
  typeDele: any = null;
  closeDialogPercentage(): void {
    this.dialogPercentageRef.hide();
    this.form.reset();
    this.editDialogData = null;
    this.typeDele = null;
  }

  saveInServerPercentage(id?: number): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.value as IVigProcessPercentages;
    const delegation: any = this.form.value.delegationNumber;

    let obj: any = {
      cveProcess: this.form.value.cveProcess,
      delegationNumber: this.form.value.delegationNumber,
      delegationType: this.form.value.delegationType,
      percentage: this.form.value.percentage,
      // delegation: delegation,
      // delegationView: this.form.value.delegationNumber,
    };
    // this.loading = true;
    if (this.editDialogData) {
      let obj1: any = {
        cveProcess: this.form.value.cveProcess,
        delegationNumber: this.form.value.delegationNumber,
        delegationType: this.form.value.delegationType,
        percentage: this.form.value.percentage,
        // delegation: delegation,
        // delegationView: this.form.value.delegationNumber,
      };
      this.survillanceService
        .putVigProcessPercentages(this.editDialogData.cveProcess as any, obj1)
        .subscribe({
          next: () => {
            this.alert('success', 'Registro actualizado correctamente', '');
            this.closeDialogPercentage();
            this.getPercentages();
            // this.sources.update(this.editDialogData, values);
          },
          error: () => {
            this.alert('error', 'Error al actualizar el registro', '');
            // this.loading = false;
          },
        });
      return;
    } else {
    }
    this.survillanceService.postVigProcessPercentages(obj).subscribe({
      next: response => {
        console.log('treu', response);
        if (response) {
          this.alert('success', 'Registro creado correctamente', '');
          this.closeDialogPercentage();
          this.getPercentages();
          // this.totalItems++;
        }
        // this.loading = false;
      },
      error: () => {
        this.alert('error', 'Error al crear el registro', '');
        // this.loading = false;
      },
    });
  }

  async getDelegation(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    params.addFilter('description', lparams.text, SearchFilter.ILIKE);

    return new Promise((resolve, reject) => {
      this.survillanceService
        .getViewVigDelegations(params.getParams())
        .subscribe({
          next: (response: any) => {
            console.log('resss', response);
            let result = response.data.map(async (item: any) => {
              item['numberAndDescription'] =
                item.delegationNumber + ' - ' + item.description;
            });

            Promise.all(result).then((resp: any) => {
              this.delegations = new DefaultSelect(
                response.data,
                response.count
              );
              this.loading = false;
            });
          },
          error: error => {
            this.delegations = new DefaultSelect();
            this.loading = false;
            resolve(null);
          },
        });
    });
  }

  async llenarCampos(event: any) {
    this.form.get('delegationType').setValue(event.typeDelegation);
    console.log('event', event);
  }
}
