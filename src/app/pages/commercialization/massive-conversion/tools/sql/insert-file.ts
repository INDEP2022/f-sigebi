import { showQuestion } from 'src/app/common/helpers/helpers';

export class InsertFileMassiveConversion {
  getFile(): void {
    showQuestion({
      title: '¿Desea cargar el archivo?',
      text: 'Se cargará el archivo',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        this.typeLayout();
      }
    });
  }

  typeLayout(): Promise<any> {
    return new Promise((resolve, reject) => {
      showQuestion({
        title: 'Layout a cargar',
        text: 'Se cargan los cheques con el Layout RFC o Id_Cliente?',
        confirmButtonText: 'RFC',
        cancelButtonText: 'Cancelar',
        denyButtonText: 'Id Cliente',
        showDenyButton: true,
      }).then(({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          resolve('N');
        }
        if (isDenied) {
          resolve('A');
        }
      });
    });
  }

  makeForRfc(): void {}
  makeForIdClient(): void {}
}
