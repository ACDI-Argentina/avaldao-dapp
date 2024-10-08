
import React from 'react'
import { Grid } from '@material-ui/core';
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

 // console.log(`Aval aval.duracionCuotaSeconds: ${aval.duracionCuotaSeconds} -  desbloqueo seconds: ${aval.desbloqueoSeconds}`); // if this is less than one day (24*60*60, we need to format the date with seconds)

  for (let i = 0; i < timestampCuotas.length / 2; i++) {
    const [due_date, unlock] = [timestampCuotas[i * 2], timestampCuotas[i * 2 + 1]];

    const start_date = new Date(timestampCuotas[i * 2] - (aval.duracionCuotaSeconds * 1000));

    cuotas.push({
      number: `Cuota #${i + 1}`,
      start_date,
      due_date,
      unlock
    })
  }

  const includeTime = aval.duracionCuotaSeconds < 24 * 60 * 60; //Only if the cuota lenght is less than one day

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
                <td>{DateUtils.formatLocalDate(cuota.start_date, includeTime)}</td>
                <td>{DateUtils.formatLocalDate(cuota.due_date, includeTime)}</td>
                <td>{DateUtils.formatLocalDate(cuota.unlock, includeTime)}</td>
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