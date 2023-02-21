export interface IThirdParty { //Terceros comercializadores
    id: number,
    nameReason: string,
    calculationRoutine: string,
    userAttempts: number,
    userBlocked: string,
    userBlockedEnd: string,
    userBlockedStart: string,
    userStatus: string,
    userKey:string,
    userPwd: string,
    user: string,
}

export interface ITypeEventXtercomer { //Tipos de eventos que atienda el tercero comercializador
    thirdPartyId: number,
    typeEventId: number,
}


export interface IComiXThird { //montos / Precios de los eventos
    idComiXThird: number,
    idThirdParty: number,
    startingAmount: number,
    pctCommission: number,
    finalAmount: number,
}