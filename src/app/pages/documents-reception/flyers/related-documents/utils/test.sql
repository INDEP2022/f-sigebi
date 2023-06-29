IF :blk_toolbar.toolbar_escritura != 'S' THEN
	 LIP_MENSAJE('No tiene permiso de escritura para ejecutar el cambio de numerario','C');
	 RAISE FORM_TRIGGER_FAILURE;
END IF;		


/*IF :blk_bie.no_bien IS NULL AND :MASIVO = 'N' THEN
   LIP_MENSAJE('Debe especificar el bien que se quiere cambiar a numerario','S');
	 RAISE FORM_TRIGGER_FAILURE;
END IF;*/--VALIDA MASIVO LIRH

IF :blk_bie.no_bien IS NULL AND :MASIVO = 'N' THEN --VALIDA MASIVO LIRH

	 LIP_MENSAJE('Debe especificar el bien que se quiere cambiar a numerario','S');
	 RAISE FORM_TRIGGER_FAILURE;

ELSIF :BLK_BIE_NUM_MASIV.no_bien IS NULL AND :MASIVO = 'S' THEN --VALIDA MASIVO LIRH
--IF :blk_bie.no_bien IS NULL AND :MASIVO = 'N' THEN
	 LIP_MENSAJE('Debe cargar los bienes que desea cambiar a numerario','S');
	 RAISE FORM_TRIGGER_FAILURE;
ELSIF :blk_bie.no_bien IS NULL AND :BLK_BIE_NUM_MASIV.no_bien IS NULL THEN
	LIP_MENSAJE('No hay bienes para cambiar a numerario','S');
	 RAISE FORM_TRIGGER_FAILURE;
END IF;
/*IF :importevta IS NULL THEN
	LIP_MENSAJE('Debe especificar el importe para el numerario','S');
	GO_ITEM('ti_importe_new');
	RAISE FORM_TRIGGER_FAILURE;
END IF;*/
--***** 
IF :BLK_CONTROL.CHK_MOVBAN = 'SI' THEN
   IF :ti_banco_new IS NULL THEN
      LIP_MENSAJE('Debe especificar el banco','S');
      GO_ITEM('ti_banco_new');
      RAISE FORM_TRIGGER_FAILURE;
   END IF;		
   IF :di_no_movimiento IS NULL THEN
      LIP_MENSAJE('No ha seleccionado debidamente del deposito que ampara el cambio a numerario','S');
      GO_ITEM('ti_importe_new');
      RAISE FORM_TRIGGER_FAILURE;
   END IF;
/*ELSE
   :TI_BANCO_NEW := NULL;
   :DI_BANCO_NEW := NULL;
   :DI_CUENTA_NEW := NULL;
   :DI_MONEDA_NEW := 'MN';
   :TI_FECHA_NEW := NULL;
   :TI_FICHA_NEW := NULL;*/
END IF;
--*****
IF :BLK_CONTROL.TIPO_CONV IS NULL THEN
	LIP_MENSAJE('No ha seleccionado el tipo de conversión','S');
	GO_ITEM('BLK_CONTROL.TIPO_CONV');
	RAISE FORM_TRIGGER_FAILURE;
END IF;

---H---
/*IF :BLK_CONTROL.TIPO_CONV = 'CNE1' THEN 
	LIP_MENSAJE('Debe especificar el IVA','S');
	GO_ITEM('BLK_CONTROL.PORC1')
END IF;*/

IF :MASIVO = 'S' THEN --- NUMERARIO MASIVO LIRH 16012012
   GO_BLOCK('BLK_BIEN_GEN_MASIV');
   CLEAR_BLOCK(NO_VALIDATE);	 
   PUP_VALIDA_MASIV;
ELSE 
   IF :DI_MONEDA_NEW IS NULL AND PUP_VALIDANUME(:blk_bie.no_bien)= 'S' THEN
      LIP_MENSAJE('Debe especificar el tipo de moneda','S');									
      GO_ITEM('DI_MONEDA_NEW');
      RAISE FORM_TRIGGER_FAILURE;
   END IF;																																		---CAMBIO DIVISAS

   IF (PUP_VALIDANUME(:blk_bie.no_bien)= 'S' AND :BLK_CONTROL.TIPO_CONV not in ('CNE','BBB')) OR 
      (PUP_VALIDANUME(:blk_bie.no_bien)= 'N' AND :BLK_CONTROL.TIPO_CONV = 'CNE') THEN
	    LIP_MENSAJE('El tipo de conversión seleccionado no es permitido para este bien.','S');
	    GO_ITEM('TIPO_CONV');
      RAISE FORM_TRIGGER_FAILURE;
   END IF;																																			---CAMBIO DIVISAS

   IF :importevta IS NULL OR :importevta=0 THEN 
	    IF LIF_MENSAJE_SI_NO('El nuevo bien se generara con un precio de venta de 1. ¿Desea continuar?') = 'S' THEN
		     IF LIF_MENSAJE_SI_NO('¿Seguro que desea cambiar el bien a numerario?') = 'S' THEN
	  --:importevta:=1;
   		      PUP_CREA_BIEN;
		     END IF;
	     ELSE
		     NULL;
	     END IF;
   ELSE
	   	IF LIF_MENSAJE_SI_NO('¿Seguro que desea cambiar el bien a numerario?') = 'S' THEN
		   PUP_CREA_BIEN;
		   END IF;
   END IF;

END IF;

----------

/*
IF LIF_MENSAJE_SI_NO('¿Seguro que desea cambiar el bien a numerario?') = 'S' THEN
	PUP_CREA_BIEN;
END IF;*/