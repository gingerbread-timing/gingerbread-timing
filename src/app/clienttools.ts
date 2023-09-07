import { User } from './db/dbstuff';
export function getUserAge(user: User)
{
  var today = new Date();
    var birthDate = user.birthday;
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function getStringDate(date?: Date){
  if(!date) {return 'INVALID DATE'}
  return `${date?.getMonth()}/${date?.getDate()}/${date?.getFullYear()}`
}

export function getStringTime(date?: Date){
  if(!date) {return 'INVALID TIME'}
  let hour = date?.getHours();
  let ampm = "AM"
  if(hour > 12){
    hour -= 12
    ampm = "PM"
  }
  return `${hour}:${String(date?.getMinutes()).padStart(2,'0')} ${ampm}`;
}

export function getClockFromSeconds(seconds: number | null){
    return new Date((seconds ?? 0) * 1000).toISOString().slice(11, 22);
}

export function getIsoString(date: Date | undefined) {
  if(!date) return ""
  var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function(num: number) {
          return (num < 10 ? '0' : '') + num;
      };

  return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      dif + pad(Math.floor(Math.abs(tzo) / 60)) +
      ':' + pad(Math.abs(tzo) % 60);
}

export function sanitizeFormDate(formDate: FormDataEntryValue){
  const preDate = new Date(String(formDate))
  const tzo = preDate.getTimezoneOffset() * 60000
  return new Date(preDate.valueOf() - tzo)
}