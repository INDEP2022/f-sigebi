import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  financialAtribs,
  financialIndicators,
} from '../select-attributes/info';
import { SelectAttributesComponent } from '../select-attributes/select-attributes.component';

export interface FinancialAtrib {
  id: string;
  description: string;
  isSelected: boolean;
}

export interface FinancialIndicator {
  id: string;
  description: string;
  formula: string;
  isSelected: boolean;
}

@Component({
  selector: 'app-summary-financial-info',
  templateUrl: './summary-financial-info.component.html',
  styles: [],
})
export class SummaryFinancialInfoComponent extends BasePage implements OnInit {
  financialIndicators: FinancialIndicator[] = financialIndicators;
  financialAtribs: FinancialAtrib[] = financialAtribs;

  checkedListFI: FinancialIndicator[];
  checkedListFA: FinancialAtrib[];

  form: FormGroup = new FormGroup({});

  constructor(private modalService: BsModalService, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.checkedListFA = [];
    this.checkedListFI = [];
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      from: [null, [Validators.required]],
      to: [null, [Validators.required]],
      type: [null, [Validators.required]],
    });
  }

  openModal(): void {
    let checkedListFA = JSON.parse(JSON.stringify(this.financialAtribs));
    let checkedListFI = JSON.parse(JSON.stringify(this.financialIndicators));

    const modalRef = this.modalService.show(SelectAttributesComponent, {
      initialState: {
        checkedListFA,
        checkedListFI,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.data.subscribe(data => {
      if (data) this.financialAtribs = data.checkedListFA;
      this.financialIndicators = data.checkedListFI;
      this.checkedListFA = this.financialAtribs.filter(fa => fa.isSelected);
      this.checkedListFI = this.financialIndicators.filter(fi => fi.isSelected);
    });
  }

  confirm(): void {
    this.loading = true;
    //console.log(this.checkedListFA,this.checkedListFI)
    //console.log(this.form.value)
    setTimeout(st => {
      this.loading = false;
    }, 5000);
  }

  removeItem(id: string, tags: string): void {
    if (tags == 'financialAtribs') {
      this.financialAtribs
        .filter(fa => fa.id == id)
        .map(a => {
          a.isSelected = false;
        });
      this.checkedListFA = this.financialAtribs.filter(fa => fa.isSelected);
    }

    this.financialIndicators
      .filter(fi => fi.id == id)
      .map(i => {
        i.isSelected = false;
      });
    this.checkedListFI = this.financialIndicators.filter(fi => fi.isSelected);
  }
}
