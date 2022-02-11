/* el-table合并行通用 */
export function mergeTableRow(config) {
  let data = config.data
  const { mergeColNames, firstMergeColNames, firstMerge } = config
  if (!mergeColNames || mergeColNames.length === 0) {
    return data
  }
  mergeColNames.forEach((m) => {
    const mList = {}
    data = data.map((v, index) => {
      const rowVal = v[m]
      if (mList[rowVal] && mList[rowVal].newIndex === index) {
        const flag = firstMergeColNames.filter((f) => { return f === m }).length !== 0
        const mcFlag = mergeColNames.filter((mc) => { return mc === firstMerge }).length === 0
        if ((mcFlag && flag) || (flag && data[index][firstMerge + '-span'] && data[index][firstMerge + '-span'].rowspan === 1)) {
          v[m + '-span'] = {
            rowspan: 1,
            colspan: 1
          }
        } else {
          data[mList[rowVal]['index']][m + '-span'].rowspan++
          v[m + '-span'] = {
            rowspan: 0,
            colspan: 0
          }
          mList[rowVal]['num']++
          mList[rowVal]['newIndex']++
        }
      } else {
        mList[rowVal] = { num: 1, index: index, newIndex: index + 1 }
        v[m + '-span'] = {
          rowspan: 1,
          colspan: 1
        }
      }
      return v
    })
  })
  return data
}
