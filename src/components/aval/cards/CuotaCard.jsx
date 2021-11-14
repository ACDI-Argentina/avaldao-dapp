import React from 'react'
import styled from 'styled-components';
import DateUtils from 'utils/DateUtils';
import FiatUtils from '../../../utils/FiatUtils';

//https://gradients.cssgears.com/

const Card = styled.div`
  margin:10px;
  padding:15px;
  flex-shrink:0;
  border-radius:12px;
  line-height:30px;
  min-width:340px;
  box-shadow: 1.40323px 0px 18.2419px rgba(48, 55, 85, 0.07);

  /* Pagada en termino x el avalado y devuelta a los fondos comunes */
  ${props => props.status === "PAGADA" && `
    color:white;
    background:linear-gradient(135deg, #184e68 0%,#47a66d 100%);
    
  `}
  ${props => props.status === "PENDIENTE" && `
    color:white;
    background:linear-gradient(135deg, #5D6874 0%,#C3C3C3 100%);
  `}
  ${props => props.status === "RECLAMADA" && `
    color:white;
    background:linear-gradient(135deg, #f76b1c 0%,#f2ca38 100%);
  `}

  /* Reintegrada por el sistema al comerciante */
  ${props => props.status === "REINTEGRADA" && ` 
    color:white;
    background:linear-gradient(135deg, #0470dc 0%,#13c5fc 100%);
  `}
  
`
const Index = styled.div`
  font-size: 1.25em;
  font-weight: 500;
  margin-bottom:10px;
`

const Label = styled.span`
  font-weight: 600;
  padding-right:5px;
  font-size:1em;
`
const Value = styled.span`
  font-weight: 500;
  padding-right:3px;
  font-size:0.9em;
`

const CuotaCard = ({ cuota }) => {
  const statusStr = cuota?.status?.name?.toUpperCase();
  const montoFiatStr = FiatUtils.format(cuota?.montoFiat);
  const vencimiento = DateUtils.formatTimestampSeconds(cuota.timestampVencimiento);
  const desbloqueo = DateUtils.formatTimestampSeconds(cuota.timestampDesbloqueo);

  return (
    <Card status={statusStr}>
      <Index>Cuota #{cuota.numero}</Index>
      <div>
        <Label>Monto:</Label>
        <Value>{montoFiatStr}</Value>
      </div>
      <div>
        <Label>Estado:</Label>
        <Value>{statusStr}</Value>
      </div>
      <div>
        <Label>Fecha de vencimiento:</Label>
        <Value>{vencimiento}</Value>
      </div>
      <div>
        <Label>Fecha de desbloqueo:</Label>
        <Value>{desbloqueo}</Value>
      </div>
    </Card>

  )
}
export default CuotaCard;