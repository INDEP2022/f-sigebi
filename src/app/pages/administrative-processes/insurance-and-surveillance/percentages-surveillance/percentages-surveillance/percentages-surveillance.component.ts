import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { showQuestion } from 'src/app/common/helpers/helpers';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IVigProcessPercentages } from 'src/app/core/models/ms-survillance/survillance';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
  sources = new LocalDataSource();
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
    this.params.subscribe(res => {
      this.getPercentages(res);
    });

    this.sources.onChanged().subscribe(res => {
      console.log(res);
      if (res.action === 'filter') {
        this.generateFilterDynamically(res.filter.filters);
        this.getPercentages(this.params.getValue());
      }
    });
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

  getPercentages(listParams: ListParams): void {
    this.loading = true;
    this.filters.limit = listParams.limit || 10;
    this.filters.page = listParams.page || 1;
    this.survillanceService
      .getVigProcessPercentages(this.filters.getParams())
      .subscribe({
        next: response => {
          this.sources.load(response.data);
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
    const { cveProcess, delegationNumber, delegationType, percentage } =
      event.data;
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
    showQuestion({
      text: '¿Está seguro de eliminar el registro?',
      title: 'Eliminar',
    }).then(result => {
      if (!result?.isConfirmed) {
        return;
      }
      this.editDialogData = event.data;
      this.deleteInServerPercentage(event.data.cveProcess as any);
      console.log(result);
    });
  }

  deleteInServerPercentage(id: number): void {
    this.loading = true;
    this.survillanceService.deleteVigProcessPercentages(id).subscribe({
      next: response => {
        console.log(response);
        this.loading = false;
        this.sources.remove(this.editDialogData);
        this.editDialogData = null;
        this.totalItems--;
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  openDialogPercentage(): void {
    this.dialogPercentageRef = this.dialogService.show(
      this.dialogPercentageTemplateRef,
      {
        class: 'modal-xl',
      }
    );
  }

  closeDialogPercentage(): void {
    this.dialogPercentageRef.hide();
    this.form.reset();
    this.editDialogData = null;
  }

  saveInServerPercentage(id?: number): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.value as IVigProcessPercentages;
    this.loading = true;
    if (this.editDialogData) {
      this.survillanceService
        .putVigProcessPercentages(this.editDialogData.cveProcess as any, values)
        .subscribe({
          next: () => {
            this.loading = false;
            this.sources.update(this.editDialogData, values);
            this.closeDialogPercentage();
          },
          error: () => {
            this.loading = false;
          },
        });
      return;
    }
    this.survillanceService.postVigProcessPercentages(values).subscribe({
      next: response => {
        console.log(response);
        if (response) {
          this.sources.append(response);
          this.closeDialogPercentage();
          this.totalItems++;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
