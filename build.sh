#!/bin/bash

npm run build

mkdir prod

go build .
cp word-game prod
cp words_dictionary.json prod
cp -r dict prod
cp -r build prod

tar -cavf word-game.tar.xz prod
rm -rf prod
