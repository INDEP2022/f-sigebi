import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-justification',
  templateUrl: './justification.component.html',
  styles: [
    `
      .justificationText {
        align-items: center;
      }
      @media (max-width: 576px) {
        .justificationText {
          margin-top: 2rem;
        }
      }
    `,
  ],
})
export class JustificationComponent implements OnInit {
  form: FormGroup;
  loading = false;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      usuario: [null],
      userName: [null],
      justification: [null],
    });
  }

  ngOnInit(): void {}

  saveData() {}
}
