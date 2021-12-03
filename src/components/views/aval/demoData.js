import Cuota from "models/Cuota";


//TODO: Mover a utils/date
//"dd/mm/yyyy"
const fromLocalDate = (dateStr, timezone = `-03:00`) => {
  const [dd, mm, yyyy] = dateStr.split("/");
  return new Date(`${yyyy}-${mm}-${dd}T00:00:00${timezone}`);
}

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



