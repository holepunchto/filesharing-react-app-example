# filesharing-react-app-example

This example app shows how to build a simple file sharing app where all files are shared between everyone who use the app.

To read more details about how to use Pear, read the [Getting Started guide](https://docs.pears.com/guides/getting-started).

## How to run

[Pear](https://docs.pears.com/guides/getting-started) is a prerequisite, which can be installed with `npm i -g pear`.

```
$ git clone https://github.com/holepunchto/filesharing-react-app-example.git
$ cd filesharing-react-app-example
$ npm install 
$ pear run .
```

When a Pear app runs, it uses a local storage that's the same for all instances. To test the file sharing app, it would be good run multiple instances that looks different. To do that, use the `--store/-s` parameter for `pear`.

In one terminal:

```
$ pear run -s /tmp/fs1 .
```

In another terminal:

```
$ pear run -s /tmp/fs2 .
```

## How to release

When a Pear app is released, it can be run by others. Read more about this in this [guide](https://docs.pears.com/guides/sharing-a-pear-app). The details won't be in this section, but just commands to run.

```
$ pear stage foo    # Stage the local version to a key called "foo"
$ pear release foo  # Release the staged version of "foo"
$ pear seed foo     # Start seeding (sharing) the app
```

When running `pear seed` there will be output similar to

```
-o-:-
    pear://a1b2c3...
...
^_^ announced
```

This link can be shared with others.

To run the app, do this (in another terminal):

```
$ pear run pear://a1b2c3...
```
