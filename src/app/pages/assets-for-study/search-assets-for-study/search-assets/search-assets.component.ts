import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-assets',
  templateUrl: './search-assets.component.html',
  styleUrls: ['./search-assets.component.scss'],
})
export class SearchAssetsComponent implements OnInit {
  id: number = 0;
  showAssetsDetail: boolean = true;
  showSearchFilter: boolean = true;
  //datos para pasar al hijo
  data: any;
  //datos del filtro para pre-cargar
  filterData: any | null = null;
  //formulario de busqueda
  searchForm: any;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.id);
  }

  getSearch(event: any): void {
    //console.log(event)
    this.searchForm = event;
  }

  finish(): void {
    //antes de mostrar el textares verificar si la lista cumple con las tareas y preguntas si decea continual
    let a: any;
    Swal.fire({
      title: 'Finalizar',
      html:
        '<br><h6>Proyecto de solicitud:</h6>' +
        '<textarea\n' +
        '                class="form-control"\n' +
        '                placeholder="Ingrese una descripcion"' +
        '                name="text"  ' +
        '                cols="10"\n' +
        '                rows="3"></textarea>', //I will close in <b></b> milliseconds.

      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        a = Swal.getHtmlContainer().querySelector('textarea');
        console.log(a.textContent);
        console.log(a.value);
      }
    });
  }
}
