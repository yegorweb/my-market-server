const EasyYandexS3 = require('easy-yandex-s3')
console.log(process.env);


export let s3 = new EasyYandexS3({
  auth: {
    accessKeyId: process.env.YC_KEY_ID,
    secretAccessKey: process.env.YC_SECRET,
  },
  Bucket: process.env.YC_BUCKET_NAME,
  debug: false
})
