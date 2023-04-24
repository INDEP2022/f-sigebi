--TODO: click en button eliminar
begin
	if LIF_MENSAJE_SI_NO('¿Esta seguro de elimanar la carga del periodo '||:BLK_PERIODO.MTO_NUMERO||' ?') = 'S' then
		:BLK_SEGURIDAD.TIPO_PROCESO := 1;
		PUP_PROCESOS(:BLK_SEGURIDAD.TIPO_PROCESO);		
	end if;
end;

--TODO:  click en button cambiar
begin
	
	if LIF_MENSAJE_SI_NO('¿Esta seguro de cambiar la información del periodo '||:BLK_ENTREPER.ENT_NUM_INI||' al periodo '||:BLK_ENTREPER.ENT_NUM_FIN||' ?') = 'S' then
		:BLK_SEGURIDAD.TIPO_PROCESO := 2;
		PUP_PROCESOS(:BLK_SEGURIDAD.TIPO_PROCESO);		
	end if;
end;

--TODO: click en button sustituir

begin
	if LIF_MENSAJE_SI_NO('¿Esta seguro de cambiar la información del número aleactorio '||:BLK_SUSTITUIR.SUS_ALEATORIO||' en el periodo '||:BLK_SUSTITUIR.SUS_PERIODO||' ?') = 'S' then
		:BLK_SEGURIDAD.TIPO_PROCESO := 3;
		PUP_PROCESOS(:BLK_SEGURIDAD.TIPO_PROCESO);		
	end if;
end;



PROCEDURE PUP_PROCESOS(P_NUM_PRO number) IS

	LV_VALPROC      number;
	LV_ID_ENVIA     number;
	LV_ID_CUERPO    number;
	LV_MSG_PROCESO  varchar2(300);
	LV_EST_PROCESO  number;

BEGIN
	
	LV_VALPROC := 1;
	
	if :BLK_GENERALES.MOTIVO_CAMBIO is null then
		LV_VALPROC := 0;
		LIP_MENSAJE('El motivo de cambio del bloque información de correo, es información obligatoria ...','A');
	end if;
	
	if :BLK_GENERALES.ID_ENVIA is null then
		LV_VALPROC := 0;
		LIP_MENSAJE('El identificador de envío del bloque información de correo, es información obligatoria ...','A');
	else
		
		select count(0)
		  into LV_ID_ENVIA
		  from VIG_EMAIL_ENVIA
		 where ID_ENVIA = :BLK_GENERALES.ID_ENVIA;
		 
		if LV_ID_ENVIA = 0 then
			LV_VALPROC := 0;
			LIP_MENSAJE('El identificador de envío del bloque información de correo, no es correcto ...','A');
		end if;
		
	end if;
	
	if :BLK_GENERALES.ID_PARA is null then
		LV_VALPROC := 0;
		LIP_MENSAJE('El correo electronico del destino (Para) del bloque información de correo, es información obligatoria ...','A');
	end if;
	
	if :BLK_GENERALES.ID_COPIA is null then
		LV_VALPROC := 0;
		LIP_MENSAJE('El correo electronico de la copia (CC) del bloque información de correo, es información obligatoria ...','A');
	end if;
	
	if :BLK_GENERALES.ID_CUERPO is null then
		LV_VALPROC := 0;
		LIP_MENSAJE('El identificador de tipo (Cuerpo de correo) del bloque información de correo, es información obligatoria ...','A');
	else
			select count(0)
		  into LV_ID_CUERPO
		  from VIG_EMAIL_CUERPO
		 where ID_CUERPO = :BLK_GENERALES.ID_CUERPO;
		 
		if LV_ID_CUERPO = 0 then
			LV_VALPROC := 0;
			LIP_MENSAJE('El identificador de tipo (Cuerpo de correo) del bloque información de correo, no es correcto ...','A');
		end if;
		
	end if;
	if LV_VALPROC = 1 then
		
  	if P_NUM_PRO = 1 then
  		SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'BUSY');
  		PK_VIGILANCIA_SUPERVISION.PA_ELIMINA_PERIODO(
                                 									:BLK_PERIODO.MTO_ANIO,
                                 									:BLK_PERIODO.MTO_NUMERO, -- ya
                                 									:BLK_PERIODO.MTO_PROCESO, -- ya
                                 									:BLK_PERIODO.MTO_DELEGACION,
                                 									user,
                                 									:BLK_SEGURIDAD.USUARIO_AUT,
                                 									:BLK_GENERALES.FECHA_SOLICITUD,
                                 									:BLK_GENERALES.MOTIVO_CAMBIO,
                                 									:BLK_GENERALES.ID_ENVIA,
                                 									:BLK_GENERALES.ID_PARA,
                                 									:BLK_GENERALES.ID_COPIA,
                                 									:BLK_GENERALES.ID_CUERPO,
                                 									LV_MSG_PROCESO,
                                 									LV_EST_PROCESO
                                									);
  			SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');
  			if LV_EST_PROCESO = 1 then
  				LIP_COMMIT_SILENCIOSO;
    			LIP_MENSAJE(LV_MSG_PROCESO,'A');
					GO_BLOCK('BLK_PERIODO');
    		else
					LIP_MENSAJE(LV_MSG_PROCESO,'S');
					GO_BLOCK('BLK_GENERAL');	
				end if;
  			Set_Window_Property('WIN_AUTORIZA',VISIBLE,PROPERTY_FALSE);
  			
  	elsif P_NUM_PRO = 2 then
  		SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'BUSY');
  		PK_VIGILANCIA_SUPERVISION.PA_CAMBIO_PERIODO(
                                 									:BLK_ENTREPER.ENT_ANIO_INI,
                                 									:BLK_ENTREPER.ENT_NUM_INI,
                                 									:BLK_ENTREPER.ENT_PROC_INI,
                                 									:BLK_ENTREPER.ENT_DEL_INI,
                                 									:BLK_ENTREPER.ENT_ANIO_FIN,
                                 									:BLK_ENTREPER.ENT_NUM_FIN,
                                 									:BLK_ENTREPER.ENT_PROC_FIN,
                                 									:BLK_ENTREPER.ENT_DEL_FIN,
                                 									user,
                                 									:BLK_SEGURIDAD.USUARIO_AUT,
                                 									:BLK_GENERALES.FECHA_SOLICITUD,
                                 									:BLK_GENERALES.MOTIVO_CAMBIO,
                                 									:BLK_GENERALES.ID_ENVIA,
                                 									:BLK_GENERALES.ID_PARA,
                                 									:BLK_GENERALES.ID_COPIA,
                                 									:BLK_GENERALES.ID_CUERPO,
                                 									LV_MSG_PROCESO,
                                 									LV_EST_PROCESO
                                									);
  			SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');	
				if LV_EST_PROCESO = 1 then
  				LIP_COMMIT_SILENCIOSO;
    			LIP_MENSAJE(LV_MSG_PROCESO,'A');
					GO_BLOCK('BLK_PERIODO');
    		else
					LIP_MENSAJE(LV_MSG_PROCESO,'S');
					GO_BLOCK('BLK_GENERAL');	
				end if;
  			Set_Window_Property('WIN_AUTORIZA',VISIBLE,PROPERTY_FALSE);
  			
		elsif P_NUM_PRO = 3 then
			SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'BUSY');
			PK_VIGILANCIA_SUPERVISION.PA_CAMBIO_BIEN_ALE(
                                 									:BLK_SUSTITUIR.SUS_ANIO,
                                 									:BLK_SUSTITUIR.SUS_PERIODO,
                                 									:BLK_SUSTITUIR.SUS_PROCESO,
                                 									:BLK_SUSTITUIR.SUS_DELEGACION,
                                 									:BLK_SUSTITUIR.SUS_ALEATORIO,
                                 									:BLK_SUSTITUIR.SUS_NO_BIEN,
                                 									:BLK_SUSTITUIR.SUS_DESCRIPCION,
                                 									:BLK_SUSTITUIR.SUS_TRANSFERENTE,
                                 									user,
                                 									:BLK_SEGURIDAD.USUARIO_AUT,
                                 									:BLK_GENERALES.FECHA_SOLICITUD,
                                 									:BLK_GENERALES.MOTIVO_CAMBIO,
                                 									:BLK_GENERALES.ID_ENVIA,
                                 									:BLK_GENERALES.ID_PARA,
                                 									:BLK_GENERALES.ID_COPIA,
                                 									:BLK_GENERALES.ID_CUERPO,
                                 									LV_MSG_PROCESO,
                                 									LV_EST_PROCESO
                                									);
      SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');		
			if LV_EST_PROCESO = 1 then
  			LIP_COMMIT_SILENCIOSO;
    		LIP_MENSAJE(LV_MSG_PROCESO,'A');
				GO_BLOCK('BLK_PERIODO');
    	else
				LIP_MENSAJE(LV_MSG_PROCESO,'S');
				GO_BLOCK('BLK_GENERAL');	
			end if;
  			Set_Window_Property('WIN_AUTORIZA',VISIBLE,PROPERTY_FALSE);
  			
		end if;
		
  end if;
			
END;

