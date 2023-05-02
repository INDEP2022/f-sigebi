import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

const lorem = `
Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium non placeat beatae blanditiis cumque tenetur, facere vel illo illum, molestias deleniti quo reprehenderit, nam dicta! Nesciunt veniam repellendus architecto ipsam.
        Earum, officia similique. Nihil laborum dolore maiores. Iste corporis officia ullam, illum quo, veniam consectetur magnam porro vero dolor velit alias consequuntur similique ad laudantium accusantium ea placeat cupiditate doloribus?
        Magni recusandae reiciendis aspernatur doloribus laborum commodi aliquam ab! Commodi quisquam ab rerum quidem sint hic sed, porro reprehenderit blanditiis, pariatur laudantium eligendi mollitia. Minima adipisci itaque doloremque fugiat harum.
        Quos neque, incidunt sapiente vitae totam aliquam iusto repellendus provident vel quod laborum blanditiis velit distinctio assumenda id consequuntur voluptate doloribus hic dicta libero numquam dolorem ex cum? Unde, aspernatur!
        Exercitationem odio, voluptates id consequatur repellendus quis cupiditate nemo veritatis omnis quia harum nulla necessitatibus autem sint! Laborum et laudantium, molestiae culpa, voluptatibus fuga tempore maxime excepturi iste delectus cupiditate.`;
@Component({
  selector: 'app-incident-maintenance',
  templateUrl: './incident-maintenance.component.html',
  styles: [],
})
export class IncidentMaintenanceComponent implements OnInit {
  form = this.fb.group({
    aprueba: [null, [Validators.required]],
    incidencia: [null, [Validators.required]],
    ticket: [null, [Validators.required]],
    oficio: [
      null,
      [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
    ],
    solicitud: [
      lorem,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    solucion: [
      lorem,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    scripts: [lorem, [Validators.required, Validators.pattern(STRING_PATTERN)]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
