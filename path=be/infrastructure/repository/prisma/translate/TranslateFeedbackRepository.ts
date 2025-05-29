if (start) {
   where = { ...where, id: { lt: start } };
}
where = start ? { id: { lt: start }, ...where } : where;
