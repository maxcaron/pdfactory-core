import { pdfactory } from '../dist/pdfactory.umd.cjs'
import path from 'path';

(async () => {
  const render = await pdfactory({
    templatesDir: [path.join(path.resolve(), 'src', 'templates')]
  })
  const pdf = await render({ document: 'test', data: { allo: 'allo' } })
  console.log('Rendered PDF: ', pdf)
  process.exit(0)
})()
