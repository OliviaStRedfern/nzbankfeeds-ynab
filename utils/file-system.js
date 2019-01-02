
const fs = require('fs')

function newestCSVFile (path) {
  return new Promise(resolve => {
    fs.readdir(path, function (err, files) {
      if (err) { throw err }
      const csvFiles = files.filter(function (file) { return isCSV(file) })
      const newestCSVFile = newestFile(csvFiles, path)

      console.log(`${newestCSVFile} is the newest CSV file`)
      resolve(newestCSVFile)
    })
  })
}

function isCSV (file) {
  return file.substr(-4).toLowerCase() === '.csv'
}

function newestFile (files, path) {
  let out = []
  files.forEach(function (file) {
    let stats = fs.statSync(path + '/' + file)
    if (stats.isFile()) {
      out.push({ file, mtime: stats.mtime.getTime() })
    }
  })
  out.sort(function (a, b) {
    return b.mtime - a.mtime
  })
  return (out.length > 0) ? out[0].file : ''
}

module.exports = { newestCSVFile, isCSV }
