import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { RATE_CATALOG_COLUMNS } from './rate-catalog-columns';

@Component({
  selector: 'app-rate-catalog',
  templateUrl: './rate-catalog.component.html',
  styles: [],
})
export class RateCatalogComponent extends BasePage implements OnInit {
  form: FormGroup;
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: RATE_CATALOG_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.form = this.fb.group({
      month: [null, Validators.required],
      year: [null, Validators.required],
      ratePesos: [null, Validators.required],
      dollarRate: [null, Validators.required],
      uroRate: [null, Validators.required],
    });
  }
}
