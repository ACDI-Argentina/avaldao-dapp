/**
 * Clase utilitaria para el manejo de fechas.
 * 
 */
class DateUtils {
  static formatUTCDate(dateStr, includeTime = false) {
    const date = new Date(dateStr);

    // Extract UTC date parts and format as dd/mm/yyyy
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    let formattedDate = `${day}/${month}/${year}`;

    if (includeTime) {
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      
      formattedDate += ` ${hours}:${minutes}`;
    }

    return formattedDate;
  }


  static formatLocalDate(dateStr, includeTime = false) {
    const date = new Date(dateStr);

    // Extract local date parts and format as dd/mm/yyyy
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    let formattedDate = `${day}/${month}/${year}`;

    // If includeTime is true, add the time (hours and minutes) in the local timezone
    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      formattedDate += ` ${hours}:${minutes}`;
    }

    return formattedDate;
  }
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

  static formatddmmyyyy(time) {
    const date = new Date(time);
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

  static formatDateYYYYMMDD(dateStr) {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2); // Months are zero-indexed, so +1
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };
}

export const days = ndays => ndays * 24 * 60 * 60;


export default DateUtils;
