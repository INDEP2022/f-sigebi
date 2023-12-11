import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { ExpenseCaptureDataService } from '../../services/expense-capture-data.service';

@Component({
  selector: 'app-tmp-errores',
  templateUrl: './tmp-errores.component.html',
  styleUrls: ['./tmp-errores.component.css'],
})
export class TmpErroresComponent
  extends BasePageTableNotServerPagination<{ description: string }>
  implements OnInit
{
  toggleInformation = true;
  constructor(private expenseCaptureDataService: ExpenseCaptureDataService) {
    super();
    this.data = [];
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        description: {
          title: 'Descripción',
          sort: false,
          type: 'string',
        },
      },
    };
    this.expenseCaptureDataService.addErrors
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.loading = true;
          console.log(response);
          this.data = response;
          this.totalItems = this.data.length;
          this.dataTemp = [...this.data];
          this.getPaginated(this.params.value);
          this.loading = false;
        },
      });
  }
}
