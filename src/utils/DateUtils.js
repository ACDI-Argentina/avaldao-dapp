/**
 * Clase utilitaria para el manejo de fechas.
 * 
 */
class DateUtils {

  /**
   * Formatea el timestamp medido en milisegundos.
   * 
   * @param timestampMilisecons timestamp medido en milisegundos.
   */
  static formatTimestampMilliseconds(timestampMilisecons) {
    const date = new Date(timestampMilisecons);
    const dd = date.getDate().toString().padStart(2, "0");
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  /**
   * Formatea el timestamp medido en segundos.
   * 
   * @param timestampSeconds timestamp medido en segundos.
   */
  static formatTimestampSeconds(timestampSeconds) {
    return DateUtils.formatTimestampMilliseconds(timestampSeconds * 1000);
  }
}

export default DateUtils;