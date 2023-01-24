import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-sale-goods',
  templateUrl: './sale-goods.component.html',
  styles: [],
})
export class SaleGoodsComponent implements OnInit {
  alienationForm: ModelForm<any>;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.alienationForm = this.fb.group({
      nuProccess: [null, Validators.required],
      cveProcess: [null, Validators.required],
      typeAlienation: [null, Validators.required],
      place: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      dateAnnouncement: [null, Validators.required],
      dateBasicPayment: [null, Validators.required],
      dateClarificationBoard: [null, Validators.required],
      datePresentationProposals: [null, Validators.required],
      dateEconomicOpening: [null, Validators.required],
      dateFailed: [null, Validators.required],
      dateEvent: [null, Validators.required],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
}
