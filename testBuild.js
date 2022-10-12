const pdfactory = require('./dist/pdfactory.umd.cjs')

(async () => {
    const pdf = await pdfactory()
    console.log(pdf)
})