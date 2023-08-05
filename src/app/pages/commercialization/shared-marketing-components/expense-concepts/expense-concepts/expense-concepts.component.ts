import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expense-concepts',
  templateUrl: './expense-concepts.component.html',
  styleUrls: ['./expense-concepts.component.css'],
})
export class ExpenseConceptsComponent implements OnInit {
  address: string;
  constructor(private activateRoute: ActivatedRoute) {
    this.activateRoute.params.subscribe({
      next: param => {
        if (param['id']) {
          this.address = param['id'];
        }
      },
    });
  }

  ngOnInit() {}
}
