export async function listBooks(ctx) {
  let { page, per_page, ...whereQuery } = ctx.query
  const currentPage = Number(page)
  const perPage = Number(per_page)
  const offset = (currentPage - 1) * perPage

  const query = () => ctx.db.Book.find(whereQuery)
  const total = await query().count()
  const books = await query()
    .skip(offset)
    .limit(perPage)

  ctx.body = {
    data: books,
    total,
    per_page: perPage,
    page: page,
  }
}

export async function storeBook(ctx) {
  const book = new ctx.db.Book(ctx.request.body)
  ctx.body = await book.save()
}
