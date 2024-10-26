# Port-Stats
A simple port data statistcs tool

A simple Typescript console application that collects and analyses container vessel schedules.

### How to run on development
This application was built and tested using `node 23.1.0`.
Make sure you're using `node 23.1.0` before running it:

From that point you can do:
```
yarn install
yarn start
```

### How to run via Docker

```
<!-- build the image -->
docker build -t port-stats .

<!-- run the containter -->
docker run --rm port-stats

```
