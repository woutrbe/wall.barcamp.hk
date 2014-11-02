[![Build Status](https://travis-ci.org/woutrbe/wall.barcamp.hk.svg?branch=master)](https://travis-ci.org/woutrbe/wall.barcamp.hk)

# wall.barcamp.hk
http://wall.barcamp.hk

## Getting started
`npm install`

`bower install`

## Gulp
While developing:
`gulp dev`

To build a release:
`gulp build`

## Authentication
We're using http://oauth.io to authenticate with Twitter and Facebook

## Deployment
Just push your changes to the master branch, Travis-ci will prepare a release build and upload it to the SFTP server. (Still in progress)