import moment from './moment.min.js'

function compareKey(propName){
    return function(obj1,obj2){
        if(obj1[propName]<obj2[propName]){
            return -1
        }else if(obj1[propName]===obj2[propName]){
            return 0
        }else{
            return 1
        }
    }
}

function compareByIntKey(propName) {
  return function (obj1, obj2) {
    if (parseInt(obj1[propName]) < parseInt(obj2[propName])) {
      return -1
    } else if (parseInt(obj1[propName]) === parseInt(obj2[propName])) {
      return 0
    } else {
      return 1
    }
  }
}
function compareKeyByTime(propName) {
    return function (obj1, obj2) {
      let val1 = moment(obj1[propName])
      let val2 = moment(obj2[propName])
        if (val1 < val2) {
            return -1
        } else if (val1 === val2) {
            return 0
        } else {
            return 1
        }
    }
}


function compareKeyByTimeDesc(propName) {
    return function (obj1, obj2) {
    let val1 = moment(obj1[propName])
    let val2 = moment(obj2[propName])
    if (val1 < val2) {
      return -1
    } else if (val1 === val2) {
      return 0
    } else {
      return 1
    }
  }
}


export {
  compareKey,
  compareByIntKey,
  compareKeyByTime,
  compareKeyByTimeDesc
}