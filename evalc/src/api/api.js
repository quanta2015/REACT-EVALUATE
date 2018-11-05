
export function toObj(obj) {
  var ret;
  if (typeof(obj) === "undefined") {
    ret = {}
  }else{
    ret = obj;
  }
  return ret;
}

export function toArr(obj) {
  var ret;
  if (typeof(obj) === "undefined") {
    ret = []
  }else{
    ret = obj;
  }
  return ret;
}

export function getObjVal(obj, key) {
  var ret;
  if ((typeof(obj) === "undefined")||(obj === null)) {
    ret = "";
  }else{
    ret = obj.key;
  }
  return ret;
}