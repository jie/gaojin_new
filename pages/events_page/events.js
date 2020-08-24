import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'
import EventsMixin from '../events/events_mixin'

const PageObject = mergePages({}, EventsMixin)
Page(PageObject)