// Dependencies
const axios = require('axios')

// GraphQL query for Github API (https://developer.github.com/v4/)
const query = `
  query {
    reactNative: repository(owner: "facebook", name: "react-native") {
      url
      stargazers {
        totalCount
      }
    }
    flutter: repository(owner: "flutter", name: "flutter") {
      url
      stargazers {
        totalCount
      }
    }
  }
`

module.exports = (ctx, cb) => {
  
  // Github access tokens
  const {
    GITHUB_TOKEN_1,
    GITHUB_TOKEN_2,
    GITHUB_TOKEN_3,
    GITHUB_TOKEN_4,
    GITHUB_TOKEN_5
  } = ctx.secrets

  const tokens = [GITHUB_TOKEN_1, GITHUB_TOKEN_2, GITHUB_TOKEN_3, GITHUB_TOKEN_4, GITHUB_TOKEN_5]
  const GITHUB_TOKEN =tokens[Math.floor(Math.random() * tokens.length)]

  // Github GraphQL axios instance
  const github = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`
    }
  })

  // Get Flutter & React Native info
  github.post('graphql', { query }).then(res => {
    console.log(res)
    cb(null, res.data)
  })
  
}
