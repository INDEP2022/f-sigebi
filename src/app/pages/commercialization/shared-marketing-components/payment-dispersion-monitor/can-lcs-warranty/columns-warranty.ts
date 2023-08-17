import { format } from "date-fns";

export const COLUMNS_LCS_WARRANTY = {
    LCG_ID:{
        title:'id',
        sort: false
    },
    RFC:{
        title:'RFC Cliente',
        sort: false
    },
    Public_Batch:{
        title:'Lote',
        sort: false
    },
    Amount:{
        title:'Monto',
        sort: false
    },
    Reference:{
        title:'Referencia',
        sort: false
    },
    Effective_Date:{
        title:'Fec. Vigencia',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => {
            console.log(cell)
            return format(correctDate(cell), 'dd/MM/yyyy')
        }
    },
    Status:{
        title:'Estatus',
        sort: false
    },
    Registration_Date:{
        title:'Fec. Registro',
        sort: false
    },
    Approval_Folio:{
        title:'Folio Aprobación',
        sort: false
    },
    Bank_Reference:{
        title:'Banco Emisor',
        sort: false
    },
    Generated_By_User:{
        title:'User Genera',
        sort: false
    },
    Cheque_Issuing_Bank:{
        title:'Banco Exp. Cheque',
        sort: false
    },
    Cheque_Number:{
        title:'No. Cheque',
        sort: false
    },
    Indicator:{
        title:'Indicador',
        sort: false
    },
    Pallet_Number:{
        title:'No. Paleta',
        sort: false
    },
    Payment_Approval_Date:{
        title:'Fec. Apro. Pago',
        sort: false
    }
}

//Correct Date
function correctDate(date: string) {
    const dateUtc = new Date(date);
    return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
}