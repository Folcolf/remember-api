import { readFile } from 'fs'
import { readdir } from 'fs/promises'

import db from '.'

readdir('db/migrations')
  .then((files) => {
    files.forEach((file) => {
      readFile(`db/migrations/${file}`, 'utf8', (err, data) => {
        if (err) {
          throw err
        }
        db.run(data)
        console.log(`Migrated ${file}`)
      })
    })
  })
  .catch((err) => {
    console.error(err)
  })
