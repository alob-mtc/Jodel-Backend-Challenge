export async function listBooks(ctx) {
  const books = await ctx.db.Book.find({})
  ctx.body = books
}

export async function storeBook(ctx) {
  const book = new ctx.db.Book(ctx.request.body)
  ctx.body = await book.save()
}
