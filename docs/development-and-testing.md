## Further steps

## Development Setup

If you want to work on this library (i.e. further develop this library, not use this library)
there are some helpful tools for this.

In the [development folder](../development) you will find a very basic Vue application along
with scripts to `serve`, `build` and `start` the project. You can run these scripts with
`nodemon` using the commands

- `npm run dev:serve`
- `npm run dev:build`
- `npm run dev:start`

This will start the scripts and restart them whenever you change your code so you can work
on the code of VUSSR itself without having to manually restart your server oder build scripts.

## Tests

To run tests simply call

- `npm run test`

We are using `jest` for testing. The tests also include a very small and basic Vue application.
The tests for the pruduction server use an already built version of that app. You can rebuild
this app with

- `npm run test:build`

If you want to see the test app _in action_ run

- `npm run test:start`

## Developers note / Pitfall

Keep in mind that the test app and development app are not the same app and might run out of sync
in terms of their code base. Also note that the test app has its own webopack config to make it run
faster.

✌️ Happy coding

Read more on:

- [Quick Start](../README.md#quick-start)
- [Installation & Basic Usage](./installation-basic-usage.md)
- [Configuration](./configuration.md)
- [Nocks](./nocks.md)
