import Vue from 'nativescript-vue';
import App from './components/App.vue';



// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production');

Vue.registerElement('Wikitude', () => require('nativescript-wikitude').Wikitude);
(<any>global).wikitudeLicense = "GNgLlbAL8QXtnza9NRmWmtxXSiV4ZoY5aIxzkIuql7jiRmmBkEDadPgoeeesstE9avA8aJbWiaz2pDYvVwYm4yCVYW7MYSQ3v0FFuplSk39HZ3VzHdUOfpGGI2L5PKFr/Rq5pSS6+m/halPlIo07/MzoNBffMFyUtDZDNmS2Oi5TYWx0ZWRfX4JgFh0TnMM3GD8vvixO30nAWNtL1PgWXCwphoqZWLBx44uSDH+0u3dSmwB5Qx17cf0t5Tk+C/6uPx6nb/hoHk3U0VyrEOHD6C3jA5cdT5mJpqdJLupulu0FhT0YTVJUV4HJalqokd/QaS+FP5F7Sk9EJXb9BTLhFGzJeHwXQhdCD/dKEvKnwVKQlpROzHh+MdxNsISJMf6+CVPJpd2rJqLJWP4x96Knrz6Pv8lXbJn7G7pLHqrqy7NpnIJd8A3O/Gyw5FlKYMfwbh5u8w46SsA31w7L7w1PeQFGI/LH1NmbmJkSeZ9SJA7FTkfhgXeQF1hVu0ehnOWQRSwWHDyeC9UhjejFY0w2CjPWbAkOAWyU9dK17M/gLatr2k/BuuTZgNIssH2YpTpof12sCfDhuFj+D7QFLEZDWzTv7kRdgU9gQWQBwOJcVsY8ShYANuiq9uU2zBmVdUbRiIuKeQ9Qrei4fyxDr5vSPxjx47ixg9JuDdWNv1kFSPY=";

new Vue({

  render: h => h('frame', [h(App)])
}).$start();
