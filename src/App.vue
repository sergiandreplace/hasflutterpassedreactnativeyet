<template>
  <div id="app">
    <github-corner/>
    <p>Has Flutter passed ReactNative yet?</p>
    <template v-if="repos">
      <h1 v-if="!tie">{{ flutterHasPassedReactNative ? 'YES' : 'NO' }}</h1>
      <h1 v-else>TIE!</h1>
      <p>
        <small v-if="!flutterHasPassedReactNative && !tie" class="away">
          Only {{ reactNativeStars - flutterStars | formatNumber }} {{ reactNativeStars - flutterStars === 1 ? 'star' : 'stars'}} away!
        </small>
      </p>
      <ul>
        <li>
          <a :href="repos.flutter.url" target="_blank">
            <flutter-icon/>
            <span>{{ flutterStars | formatNumber }}</span>
            <star-icon/>
          </a>
        </li>
        <li>
          <a :href="repos.reactNative.url" target="_blank">
            <reactNative-icon/>
            <span>{{ reactNativeStars | formatNumber }}</span>
            <star-icon/>
          </a>
        </li>
      </ul>
      <span class="reload" :class="{ reloading }" @click="reload">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#333333" d="M19 8l-4 4h3c0 3.31-2.69 6-6 6a5.87 5.87 0 0 1-2.8-.7l-1.46 1.46A7.93 7.93 0 0 0 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46A7.93 7.93 0 0 0 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
      </span>
    </template>
    <template v-else-if="error">
      <h1 class="error">Error</h1>
      <p>
        Couldn't retrieve any data.
        The API rate limits might have kicked in. Just wait a bit and try again.
      </p>
    </template>
    <p v-else>Loading...</p>
  </div>
</template>

<script>
import axios from 'axios'
import GithubCorner from './components/GithubCorner'
import { FlutterIcon, ReactNativeIcon, StarIcon } from './components/icons'

const FUNCTIONS_ENDPOINT = 'https://wt-3680e28e08f1182ebff7681e313bb81e-0.sandbox.auth0-extend.com/fetch-github-stars'

export default {
  name: 'App',

  data() {
    return {
      repos: null,
      error: false,
      reloading: false
    }
  },

  components: {
    FlutterIcon,
    ReactNativeIcon,
    StarIcon,
    GithubCorner
  },

  mounted() {
    this.fetchRepos()
  },

  computed: {
    flutterHasPassedReactNative() {
      return this.flutterStars > this.reactNativeStars
    },

    flutterStars() {
      return this.repos.flutter.stargazers.totalCount
    },

    reactNativeStars() {
      return this.repos.reactNative.stargazers.totalCount
    },
    tie() {
      return this.flutterStars === this.reactNativeStars
    }
  },

  filters: {
    formatNumber(number) {
      return new Intl.NumberFormat().format(number)
    }
  },

  methods: {
    async fetchRepos() {
      try {
        const { data: res } = await axios.get(FUNCTIONS_ENDPOINT)
        if (res.errors && res.errors.length) {
          this.error = true
          this.repos = null
          // eslint-disable-next-line
          console.log(res.errors)
        } else {
          this.error = true
          this.repos = res.data
        }
      } catch (err) {
        // eslint-disable-next-line
        console.log(err)
      }
    },

    async reload() {
      if (this.reloading) return
      this.reloading = true
      await this.fetchRepos()
      setTimeout(() => {
        this.reloading = false
      }, 900)
    }
  }
}
</script>

<style>

* {
  box-sizing: border-box;
}

::selection {
  background: rgba(0,0,0,0);
}
::-moz-selection {
  background: rgba(0,0,0,0);
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  text-align: center;
  color: #333;
  background: #efefef;
}

#app {
  width: 300px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07);
  overflow: hidden;
  position: relative;
}

h1 {
  font-size: 100px;
  margin: 10px 0;
}

ul {
  margin: 0;
  padding: 0;
  display: flex;
}

li {
  list-style-type: none;
  flex: 1;
}

li a {
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #dddddd;
  padding: 10px;
  text-decoration: none;
  color: #333;
}

li:hover {
  background: #eeeeee;
}

li a > svg {
  display: block;
  width: 22px;
}

li a > * {
  margin: 5px;
}

li:last-of-type {
  border-left: 1px solid #dddddd;
}

h1.error {
  font-size: 2em;
}

p {
  padding: 0 1em;
}

.away {
  display: block;
  margin-bottom: 40px;
}

.reload {
  position: absolute;
  left: 50%;
  bottom: 30px;
  margin-left: -20px;
  background: #ffffff;
  width: 40px;
  height: 40px;
  text-align: middle;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dddddd;
  border-radius: 50%;
}

.reload:hover {
  cursor: pointer;
  background: #eeeeee;
}

.reloading {
  animation: rotate 1s infinite ease-in-out;
}

@keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to { 
    -webkit-transform: rotate(-360deg);
  }
}

</style>
