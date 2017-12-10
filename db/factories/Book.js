import Rosie from 'rosie'
import Chance from 'chance'

const chance = new Chance()
const { Factory } = Rosie

export default new Factory()
  .attr('title', () => chance.sentence({ words: 3 }))
  .attr('genre', () =>
    chance.pickone(['thriller', 'action', 'romance', 'horror', 'comedy'])
  )
  .attr('description', () => chance.sentence())
  .attr('author', () => chance.name())
  .attr('publisher', () => chance.company())
  .attr('pages', () => Math.floor(Math.random() * 100))
  .attr('image_url', chance.url())
  .attr('buy_url', () => chance.url())
  .attr('created_at', () => chance.date())
