# Nocks

With nocks you can tell VUSSR to record any requests made by the server and reuse them in the future.
Essentially with this feature you can work offline and / or much faster with recorded requests.

To record requests from the server simply start your server with the `--nock --record` parameters:

```console
vuessr serve --nock --record
```

Any request made from the server started with these parameters will be recorded. To tell your server
to use those recoded requests instead of actually querying third party servers, start VUSSR with
`--nock` only.

```console
vuessr serve --nock
```

VUSSR will save the recoded requests as JSON files that you can commit to your VCS. To specifiy the
path where the JSON files will be written to and read from use the `--nockPath [nockPath]` paramter.

```console
vuessr serve --nock --record --nockPath ./src/nocks
vuessr serve --nock --nockPath ./src/nocks
```

You can also run the production server in nock mode.

```console
vuessr start --nock --record --nockPath ./src/nocks
vuessr start --nock --nockPath ./src/nocks
```

## Further steps

Read more on:

- [Quick Start](../README.md#quick-start)
- [Installation & Basic Usage](./installation-basic-usage.md)
- [Configuration](./configuration.md)
- [Development and Testing](./development-and-testing.md)
