import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-comments-form',
  templateUrl: './comments-form.component.html',
  styles: [
    `
      a.text-color:hover,
      a.text-color:active {
        color: #9d2449;
        cursor: pointer;
      }
    `,
  ],
})
export class CommentsFormComponent implements OnInit {
  @Input() op: number;
  @Input() showForm: boolean;

  showComments: boolean = true;

  commentsForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.commentsForm = this.fb.group({
      observations: [null],
      note: [null],
    });
  }
}
