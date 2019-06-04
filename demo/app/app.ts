/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as app from "tns-core-modules/application";

(<any>global).wikitudeLicense = "GNgLlbAL8QXtnza9NRmWmtxXSiV4ZoY5aIxzkIuql7jiRmmBkEDadPgoeeesstE9avA8aJbWiaz2pDYvVwYm4yCVYW7MYSQ3v0FFuplSk39HZ3VzHdUOfpGGI2L5PKFr/Rq5pSS6+m/halPlIo07/MzoNBffMFyUtDZDNmS2Oi5TYWx0ZWRfX4JgFh0TnMM3GD8vvixO30nAWNtL1PgWXCwphoqZWLBx44uSDH+0u3dSmwB5Qx17cf0t5Tk+C/6uPx6nb/hoHk3U0VyrEOHD6C3jA5cdT5mJpqdJLupulu0FhT0YTVJUV4HJalqokd/QaS+FP5F7Sk9EJXb9BTLhFGzJeHwXQhdCD/dKEvKnwVKQlpROzHh+MdxNsISJMf6+CVPJpd2rJqLJWP4x96Knrz6Pv8lXbJn7G7pLHqrqy7NpnIJd8A3O/Gyw5FlKYMfwbh5u8w46SsA31w7L7w1PeQFGI/LH1NmbmJkSeZ9SJA7FTkfhgXeQF1hVu0ehnOWQRSwWHDyeC9UhjejFY0w2CjPWbAkOAWyU9dK17M/gLatr2k/BuuTZgNIssH2YpTpof12sCfDhuFj+D7QFLEZDWzTv7kRdgU9gQWQBwOJcVsY8ShYANuiq9uU2zBmVdUbRiIuKeQ9Qrei4fyxDr5vSPxjx47ixg9JuDdWNv1kFSPY=";


app.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
