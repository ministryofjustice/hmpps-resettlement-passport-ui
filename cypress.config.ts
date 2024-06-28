import { defineConfig } from 'cypress'
// @ts-expect-error "there's no types for this"
import { downloadFile } from 'cypress-downloadfile/lib/addPlugin'
import fs from 'fs'
import pdfParse from 'pdf-parse'
import type PdfParse from 'pdf-parse'
import { resetStubs } from './integration_tests/mockApis/wiremock'
import auth from './integration_tests/mockApis/auth'
import tokenVerification from './integration_tests/mockApis/tokenVerification'
import nomisUserRolesApi from './integration_tests/mockApis/nomisUserRolesApi'
import rpApi from './integration_tests/mockApis/rpApi'
import { resetRedisCache } from './integration_tests/mockApis/redis'

const flagFilePath = './localstack/flags.json'
const flagRestoreFilePath = './integration_tests/flags.restore.json'

const parsePdf = async (pdfPath: string): Promise<PdfParse.Result> => {
  const dataBuffer = fs.readFileSync(pdfPath)
  return pdfParse(dataBuffer)
}

const overwriteFlags = (content: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(flagFilePath, content, 'utf8', err => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

const restoreFlags = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.readFile(flagRestoreFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        overwriteFlags(data)
          .then(() => resolve(true))
          .catch(err2 => reject(err2))
      }
    })
  })
}

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  videoUploadOnPasses: false,
  taskTimeout: 60000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on) {
      on('task', {
        reset: () => Promise.all([resetStubs(), resetRedisCache()]),
        ...auth,
        ...nomisUserRolesApi,
        ...rpApi,
        stubSignIn: () => auth.stubSignIn(['ROLE_RESETTLEMENT_PASSPORT_EDIT']),
        ...tokenVerification,
        downloadFile,
        getPdfContent(pdfPath) {
          return parsePdf(pdfPath).then(x => x.text)
        },
        overwriteFlags,
        restoreFlags,
      })
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'integration_tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
  },
})
