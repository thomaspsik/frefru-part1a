# Install
## Install Packages
```
npm i express sequelize pg epilogue @sequelize/postgres
npm i -D sequelize-auto
```
## Create Models
```
npx sequelize-auto -o ./models \
  -d frefru_teacher -h localhost -u postgres -x postgres -e postgres -l esm
```
