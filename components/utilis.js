export function formatDate(date) {
  
    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    
    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    
    let yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;
    
    let hh = date.getHours() % 100
    if (hh < 10) hh = '0' + hh;
  
    let mi = date.getMinutes() % 100
    if (mi < 10) mi = '0' + mi;
    return dd + '.' + mm + '.' + yy + ' ' + hh + ':' + mi;
}