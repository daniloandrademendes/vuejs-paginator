const merge_objects = (obj1, obj2) => {
  let obj3 = {};
  for (let attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (let attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  return obj3;
}

const getNestedValue = (obj, path) => {
  let originalPath = path
  path = path.split('.')
  let res = obj
  for (let i = 0; i < path.length; i++) {
    res = res[path[i]]
  }
  if (typeof res == 'undefined') {
    console.log(`[VuePagintor] Response doesn't contain key ${originalPath}!`)
    console.log(`obj: ${JSON.stringify(obj, null, "  ")}`)
    console.log(`path: ${path}`)
  }
  return res
}

const format = (format, args) => {
  return format.replace(/{{([^}]*)}}/g, (match, key) => 
    typeof args[key] !== 'undefined' ? args[key] : ''
  )
}

export const utils = { merge_objects, getNestedValue, format }
