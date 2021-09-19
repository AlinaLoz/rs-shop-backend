# Run s3 event locally
```
aws --endpoint http://localhost:4569 s3 cp ~/Desktop/rs-aws/backend/apps/imports/tmp/userdata.csv  s3://rs-shop-back-lozita-products/imports/uploaded/userdata.csv --profile s3local
```
