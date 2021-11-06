import Cuota from "models/Cuota";


//TODO: Mover a utils/date
//"dd/mm/yyyy"
const fromLocalDate = (dateStr, timezone = `-03:00`) => {
  const [dd, mm, yyyy] = dateStr.split("/");
  return new Date(`${yyyy}-${mm}-${dd}T00:00:00${timezone}`);
}

export const demoCuotas = [
  new Cuota({
    numero: 1,
    monto: 0,
    timestampVencimiento: fromLocalDate("10/08/2021").getTime(),
    timestampDesbloqueo: fromLocalDate("15/08/2021").getTime(),
    status: Cuota.PAGADA
  }),
  new Cuota({
    numero: 2,
    monto: 0,
    timestampVencimiento: fromLocalDate("10/09/2021").getTime(),
    timestampDesbloqueo: fromLocalDate("15/09/2021").getTime(),
    status: Cuota.PAGADA
  }),
  new Cuota({
    numero: 3,
    monto: 0,
    timestampVencimiento: fromLocalDate("10/10/2021").getTime(),
    timestampDesbloqueo: fromLocalDate("15/10/2021").getTime(),
    status: Cuota.REINTEGRADA
  }),
  new Cuota({
    numero: 4,
    monto: 0,
    timestampVencimiento: fromLocalDate("10/11/2021").getTime(),
    timestampDesbloqueo: fromLocalDate("15/11/2021").getTime(),
    status: Cuota.PENDIENTE
  }),
  new Cuota({
    numero: 5,
    monto: 0,
    timestampVencimiento: fromLocalDate("10/12/2021").getTime(),
    timestampDesbloqueo: fromLocalDate("15/12/2021").getTime(),
    status: Cuota.PENDIENTE
  }),
  new Cuota({
    numero: 6,
    monto: 0,
    timestampVencimiento: fromLocalDate("10/01/2022").getTime(),
    timestampDesbloqueo: fromLocalDate("15/01/2022").getTime(),
    status: Cuota.PENDIENTE
  })
];

export const demoReclamos = [
  {
    cuota: "1",
    status: "CERRADO",
    date: "12/08/2021"
  },
  {
    cuota: "2",
    status: "CERRADO",
    date: "12/09/2021"
  },
  {
    cuota: "3",
    status: "ABIERTO",
    date: "13/10/2021"
  }
];



