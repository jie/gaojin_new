import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'


const PageObject = mergePages({}, PageBehavior, {
  data: {
    pageName: 'event_map'
  }
})
Page(PageObject)