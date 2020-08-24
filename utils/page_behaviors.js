import DefaultPageBehavior from '../libs/page_behaviors'
import mergePages from '../libs/objectUtils'

const MyageBehavior = mergePages(
  {}, DefaultPageBehavior
)

module.exports = MyageBehavior