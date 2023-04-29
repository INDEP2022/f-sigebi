import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICopiesOfficialOpinion } from 'src/app/core/models/ms-dictation/copies-official-opinion.model';
import { CopiesOfficialOpinionService } from 'src/app/core/services/catalogs/copies-official-opinion.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CopyDocumentationGoodsDialogComponent } from '../dialogs/copy-documentation-goods-dialog/copy-documentation-goods-dialog.component';
import { COPY_DOCUMENTATION_GOODS_COLUMNS } from './copy-documentation-goods.columns';

@Component({
  selector: 'app-copy-documentation-goods',
  templateUrl: './copy-documentation-goods.component.html',
})
export class CopyDocumentationGoodsComponent
  extends BasePage
  implements OnInit, OnDestroy, OnChanges
{
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: true,
      delete: false,
    },
    hideSubHeader: true,
    mode: 'external',
    columns: COPY_DOCUMENTATION_GOODS_COLUMNS,
  };

  dataTable: ICopiesOfficialOpinion[] = [];

  @Input() set loadingData(value: boolean) {
    this.loading = value;
  }

  @Input() set data(value: ICopiesOfficialOpinion[]) {
    this.dataTable = value;
  }

  constructor(
    private modalService: BsModalService,
    private copiesOfficialOpinionService: CopiesOfficialOpinionService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['data']) {
      if (changes['data'].currentValue.length > 0) {
        this.loading = false;
      }
    }
  }

  ngOnInit(): void {
    // this.loading = true;
    // this.data
    //   .onChanged()
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(x => {
    //     this.getData();
    //   });
    // this.params
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getData());
  }

  getData() {
    // this.copiesOfficialOpinionService.getAll(new ListParams()).subscribe({
    //   next: data => {
    //     this.dataTable = data.data;
    //     this.data.load(this.dataTable);
    //     this.totalItems = data.count || 0;
    //     this.data.refresh();
    //     this.loading = false;
    //   },
    //   error: err => {
    //     this.loading = false;
    //   },
    // });
  }

  openForm(copiesOfficial?: ICopiesOfficialOpinion) {
    let config: ModalOptions = {
      initialState: {
        copiesOfficial,
        callback: (next: boolean) => {
          // if (next) this.getData();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CopyDocumentationGoodsDialogComponent, config);
  }
}
