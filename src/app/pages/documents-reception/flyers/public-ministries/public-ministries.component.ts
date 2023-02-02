import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IMinpub } from 'src/app/core/models/catalogs/minpub.model';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { PUBLIC_MINISTRIES_COLUMNS } from './public-ministries-columns';

@Component({
  selector: 'app-public-ministries',
  templateUrl: './public-ministries.component.html',
  styles: [],
})
export class PublicMinistriesComponent extends BasePage implements OnInit {
  valuesList: IMinpub[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  callback?: (next: string | number) => void;
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private modalRef: BsModalRef,
    private minPubService: MinPubService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: PUBLIC_MINISTRIES_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getMinPubAll());
  }
  getMinPubAll() {
    this.loading = true;
    this.minPubService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.valuesList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  close() {
    this.modalRef.hide();
  }
}
