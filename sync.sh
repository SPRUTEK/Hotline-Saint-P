#!/bin/bash
# Копирует опубликованную версию игры из папки проекта в приложение
SRC=${1:-/mnt/project-files/game}
D=$(dirname "$0")/game
rm -rf "$D"; mkdir -p "$D/music" "$D/photos" "$D/voice"
cp "$SRC"/index.html "$D"/
for f in "$SRC"/*.js; do cp "$f" "$D"/; done
cp "$SRC"/music/*.mp3 "$D/music/"; cp "$SRC"/photos/p*.png "$D/photos/"
cp "$SRC"/voice/*.mp3 "$SRC"/voice/voice.json "$D/voice/"
