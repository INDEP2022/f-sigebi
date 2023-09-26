import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
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
  @Input() ordServform: FormGroup = new FormGroup({});

  showComments: boolean = true;
  readonly: boolean = false;

  // commentsForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    //this.prepareForm();
    this.readonly = this.op == 1 ? false : true;
  }

  ngOnChanges(changes: SimpleChanges): void {}

  /*prepareForm() {
    this.commentsForm = this.fb.group({
      observations: [null],
      note: [null],
    });
  }*/
}
