export default function Config(environment) {
  if (environment === 'development'){
    const SECRETKEY = 'UFsUQbQvpjsXXCJSPeUkFx7y'
    return {
      DATABASE_URI: 'mongodb://localhost:27017/qouria',
      KEY: SECRETKEY
    }
  }
  else if (environment === 'production'){
    const SECRETKEY = process.env.SECRETKEY;
    return {
      DATABASE_URI: process.env.DATABASE_URI,
      KEY: SECRETKEY
    }
  }
  else if (environment === 'test'){
    const SECRETKEY = 'okay-you-need-to-be-kept-secret'
    return {
      DATABASE_URI: process.env.TEST_DATABASE_URI,
      KEY: SECRETKEY
    }
  }
  
  throw new Error(`Environment ${environment} configuration does not exist!`)

}