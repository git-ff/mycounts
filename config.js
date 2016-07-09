//myCounts config
module.exports = {

  'database': 'mongodb://localhost:27017/myCountsDB',
  'port': process.env.PORT || 3000,
  'secretKey': 'MySecretKeyIsVerySimple', //Change in production

}