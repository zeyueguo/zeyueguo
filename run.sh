#!/bin/bash
source=public/books
for dir in *;
do
  #删除gitbook生成的内容
  if [ -d $source/$dir ]; then
    rm -r $source/$dir
  fi
  #重新生成gitbook的内容
  if [ -d $dir ]; then
    gitbook build $dir $source
  fi
done