# In order to build apps(services)
```
yarn build:products
yarn build:imports
```

# In order to launch build services locally
```
yarn start:sls:products
yarn start:sls:imports
```

# Simulate s3 event locally
```
aws --endpoint http://localhost:4569 s3 cp ~/Desktop/rs-aws/backend/apps/imports/tmp/userdata.csv  s3://rs-shop-back-lozita-products/uploaded/userdata.csv --profile s3local
```

# .env
environment.d.ts describes all variables.
