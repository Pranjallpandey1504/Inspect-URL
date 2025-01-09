import validator from "validator"
import chalk from "chalk"
import fs from "fs"

const dbFile = "db.json"
const searchParamsObj = {}

const loadDatabase = () => {
  try {
    const data = fs.readFileSync(dbFile)
    return JSON.parse(data)
  } catch (error) {
    return [{ activeUrls: [], blacklistedUrls: [] }]
  }
}

const saveDatabase = (db) => {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2))
}

const db = loadDatabase()
const url = process.argv[2]

if (validator.isURL(url)) {
  console.log(chalk.green(`${chalk.underline.bold(url)} is a valid URL`))

  if (validator.blacklist(url, "\\[\\]") !== url) {
    console.log(chalk.underline.red(`${url} is a blacklisted URL`))
    db[1].blacklistedUrls.push({ url: url })
  }

  const searchParams = new URL(url).searchParams
  searchParams.forEach((value, key) => {
    searchParamsObj[key] = value
  })

  db[0].activeUrls.push({ url: url, searchParams: searchParamsObj, status: "valid" })
  saveDatabase(db)

 
  console.log(chalk.blue(`URL: ${url}, Search Params: ${JSON.stringify(searchParamsObj)}, Status: valid`))
} else {
  console.log(chalk.red(`${url} is not a valid URL`))
}
