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
    return new Date((seconds ?? 0) * 1000).toISOString().slice(11, 20);
}