export const paginate = (data: any, page: number, limit: number) => {
  const { datas, total } = data;
  const lastPage = Math.ceil(total / limit);
  const nextPage = page + 1 > lastPage ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;
  return {
    datas: datas,
    count: total,
    current_page: page,
    next_page: nextPage,
    prev_page: prevPage,
    last_page: lastPage,
  };
};
