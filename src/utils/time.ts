export function formatMMSS(totalSeconds: number) {
  if (totalSeconds < 0) totalSeconds = 0;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Converts UTC date to IST (Indian Standard Time) - +5:30 offset
 * @param dateString - ISO date string from server
 * @returns Date object in IST
 */
function toIndianTime(dateString: string): Date {
  const utcDate = new Date(dateString);
  // Add 5 hours and 30 minutes (IST offset)
  const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
  return istDate;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Formats a date/time string for Indian timezone (IST)
 * @param dateString - ISO date string from server
 * @returns Formatted date and time in IST
 */
// export function formatIndianDateTime(dateString: string): string {
//   const istDate = toIndianTime(dateString);
  
//   const day = istDate.getUTCDate();
//   const month = monthNames[istDate.getUTCMonth()];
//   const year = istDate.getUTCFullYear();
  
//   let hours = istDate.getUTCHours();
//   const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
//   const ampm = hours >= 12 ? 'PM' : 'AM';
//   hours = hours % 12;
//   hours = hours ? hours : 12; // 0 should be 12
  
//   return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
// }


export const formatIndianDateTime = (dateStr: string | null | undefined): string => {
  if (!dateStr) return 'N/A';

  // Force the timestamp to be treated as UTC by adding 'Z' if missing
  const utcDateString = dateStr.endsWith('Z') ? dateStr : dateStr + 'Z';
  const utcDate = new Date(utcDateString);
  if (isNaN(utcDate.getTime())) return 'Invalid Date';

  // Convert UTC to IST by adding 5 hours 30 minutes (5.5 hours)
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const istDate = new Date(utcDate.getTime() + istOffset);

  const hours = istDate.getUTCHours();
  const minutes = istDate.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const time = `${formattedHours}:${formattedMinutes} ${ampm}`;

  const day = istDate.getUTCDate().toString().padStart(2, '0');
  const month = (istDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = istDate.getUTCFullYear();

  return `${time} | ${day}/${month}/${year}`;
};

/**
 * Formats a date for Indian timezone (IST) - date only
 * @param dateString - ISO date string from server  
 * @returns Formatted date in IST
 */
export function formatIndianDate(dateString: string): string {
  // Force UTC treatment
  const utcDateString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
  const utcDate = new Date(utcDateString);
  const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
  
  const day = istDate.getUTCDate().toString().padStart(2, '0');
  const month = (istDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = istDate.getUTCFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Formats time for Indian timezone (IST) - time only
 * @param dateString - ISO date string from server
 * @returns Formatted time in IST
 */
export function formatIndianTime(dateString: string): string {
  // Force UTC treatment
  const utcDateString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
  const utcDate = new Date(utcDateString);
  const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
  
  let hours = istDate.getUTCHours();
  const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  return `${hours}:${minutes} ${ampm}`;
}
