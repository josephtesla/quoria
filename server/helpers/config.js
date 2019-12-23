export default function Config(environment) {
  if (environment === 'development'){
    const SECRETKEY = 'UFsUQbQvpjsXXCJSPeUkFx7y'
    return {
      DATABASE_URI: 'mongodb://localhost:27017/send-it-app',
      KEY: SECRETKEY
    }
  }
  else if (environment === 'production'){
    const SECRETKEY = 'UFsUQbQvpjsXXCJSPeUkFx7ymvhrzhwzjsnirnd2chfamp9re8r1'
    return {
      DATABASE_URI: 'cloud-hosted-database-uri-here',
      KEY: SECRETKEY
    }
  }
  throw new Error(`Environment ${environment} configuration does not exist!`)

}
