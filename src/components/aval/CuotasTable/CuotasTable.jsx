
import { Grid } from '@material-ui/core';
import React from 'react'
import CuotaCard from '../cards/CuotaCard';
import { makeStyles, Typography } from '@material-ui/core';
import { days } from 'utils/DateUtils';
import DateUtils from 'utils/DateUtils';
import './CuotasTable.scss';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});


const CuotasTable = ({ aval, timestampCuotas }) => {
  const classes = useStyles();
  const cuotas = [];

  const showCaption =  aval.status?.id === 0 ;



  for (let i = 0; i < timestampCuotas.length / 2; i++) {
    const [due_date, unlock] = [timestampCuotas[i * 2], timestampCuotas[i * 2 + 1]];

    const start_date = new Date(timestampCuotas[i * 2] - days(aval.duracionCuotasDias) * 1000);

    cuotas.push({
      number: `Cuota #${i + 1}`,
      start_date,
      due_date,
      unlock
    })
  }

  return (
    (<Grid container className={classes.root} spacing={1}>
      <table className="cuotas-table">
        <thead>
          <tr>
            <th>Cuota</th>
            <th>Fecha Inicio</th>
            <th>Fecha vencimiento</th>
            <th>Fecha desbloqueo</th>
          </tr>
        </thead>
        <tbody>
          {cuotas.map(cuota => {
            return (
              <tr key={cuota.number}>
                <td>{cuota.number}</td>
                <td>{DateUtils.formatUTCDate(cuota.start_date)}</td>
                <td>{DateUtils.formatUTCDate(cuota.due_date)}</td>
                <td>{DateUtils.formatUTCDate(cuota.unlock)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {showCaption && <div className="caption">
        *Las fechas de las cuotas estarán confirmadas una vez almacenadas en la blockchain. Esto sucederá cuando AvalDAO acepte el aval.
      </div>}

    </Grid>
    )
  );
}

export default CuotasTable;