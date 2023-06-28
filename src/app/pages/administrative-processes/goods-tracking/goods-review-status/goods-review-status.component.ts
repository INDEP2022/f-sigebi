import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { GoodsReview } from 'src/app/core/services/ms-good/goods-review.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IGoodsReview } from '../../../../core/models/ms-good/goods-review.model';
import { COLUMNS } from './columns';
@Component({
  selector: 'app-goods-review-status',
  templateUrl: './goods-review-status.component.html',
  styles: [],
})
export class GoodsReviewStatusComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  columns: IGoodsReview[] = [];
  delegations = new DefaultSelect();
  delegacionId: any;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodsMotivesrev: GoodsReview,
    private departmentService: DepartamentService
  ) {
    super();
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getMotives());
    this.prepareForm();
    this.getMotives();
    console.log(this.getMotives());
  }

  getMotives() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
    };
    this.goodsMotivesrev.getAll(params).subscribe({
      next: response => {
        let result = response.data.map(async (item: any) => {
          //const details: any = await this.getDelegation(item.id)
          item['goodId'] = item.goodNumber.id;
          //item['descripcion'] = item.descripcion.id
        });

        Promise.all(result).then((resp: any) => {
          this.columns = response.data;
          this.data.load(this.columns);
          this.data.refresh();
          this.totalItems = response.count || 0;
          this.loading = false;
          console.log(response);
        });
      },
      error: err => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  async getDelegation(id: any) {
    const params = new ListParams();
    params['delegation'] = `$eq:${id}`;

    return new Promise((resolve, reject) => {
      this.goodsMotivesrev.getAll3(params).subscribe({
        next: response => {
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
          console.log(err);
        },
      });
    });
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      option: [null, [Validators.required]],
    });
  }

  showInfo() {}

  delete(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }
}
