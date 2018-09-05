---
layout: layout
title: 学习Redux Middleware中间件
date: 2018-05-18 15:05:31
author: maiyan
categories:
  - js
tags:
  - react
  - redux
---

## 1. 前置知识

### 1.1 reduce() 方法

reduce() 方法对累加器和数组中的每个元素（从左到右）应用一个函数，将其减少为单个值。

`arr.reduce(callback[, initialValue])`

参数 ：

- callback 执行数组中每个值的函数
  - accumulator 累加器累加回调的返回值; 它是上一次调用回调时返回的累积值，或 initialValue
  - currentValue 数组中正在处理的元素

返回值:

- 函数累计处理的结果

```js
const array = [1, 2, 3, 4];

// 1. 使用深度嵌套函数模式
const fun_1 = () => array[0] + array[1]; // 1 + 2
const fun_2 = () => fun_1() + array[2]; // (1 + 2) + 3
const fun_3 = () => fun_2() + array[3]; // (1 + 2 + 3) + 4
const result_1 = fun_3(fun_2(fun_1()));
console.log("使用深度嵌套函数模式", result_1); // 10

// 2. 使用深度嵌套函数模式 - 传入上次返回的结果作为参数
const fun_11 = () => array[0] + array[1]; // 1 + 2
const fun_22 = x => x + array[2]; // (1 + 2) + 3
const fun_33 = x => x + array[3]; // (1 + 2 + 3) + 4
const result_2 = fun_33(fun_22(fun_11()));
console.log("使用深度嵌套函数模式 - 传入上次返回的结果作为参数", result_2); // 10

// 3. 使用reduce
const result = array.reduce((a, b) => {
  return a + b;
});
console.log("使用reduce", result); // 10
```

### 1.2 Currying 柯里化

把接受多个参数 的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果

```js
var curry = function(arg1, arg2) {
  return function(arg3) {
    return arg1 + arg2 - arg3; // 1+2-1
  };
};
console.log(curry(1, 2)(1)); // 2
```

### 1.2 Compose 源代码

src/compose.js

```js
[x1, x2, x3, x4].reduce(f) = f( f( f(x1, x2), x3), x4)
```

```js
function compose(...funcs) {
  // compose(...[])(store.dispatch) 如果中间件数组为空数组的时候，直接返回 store.dispatch
  if (funcs.length === 0) {
    return arg => arg;
  }
  // compose(...[middleware1])(store.dispatch) 如果中间件数组只有一个的时候，
  // 第一步compose(...[middleware1])返回了middleware1 ---> funcs[0]
  // 第二部compose(...[middleware1])(store.dispatch) 传入store.dispatch执行middleware1的方法
  if (funcs.length === 1) {
    return funcs[0];
  }
  // a为第一个middleware或者上一次middleware的运行结果
  // b为当前middleware
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
  /*
    return funcs.reduce(function (a, b) {
        return function (...args) {
            return a(b(...args))
        }
    })
    */
}
```

DEMO

```js
function compose(...funcs) {
  return funcs.reduce(function(a, b) {
    console.log("before a", a);
    console.log("before b", b);
    return function(...args) {
      console.log("a", a);
      console.log("b", b);
      return a(b(...args));
    };
  });
}

const f = arg => `函数f(${arg})`;

const g = arg => `函数g(${arg})`;

// function h 最后一个函数可以接受多个参数
const h = (...arg) => `函数h(${arg.join("_")})`;

const result = compose(
  f,
  g,
  h
)(1, 2, 3);

console.log(result);
/* 
before a (arg) => `函数f(${arg})`
before b (arg) => `函数g(${arg})`
before a function (...args) {
            console.log('a', a);
            console.log('b', b);
            return a(b(...args))
        }
before b (...arg) => `函数h(${arg.join('_')})`

a function (...args) {
            console.log('a', a);
            console.log('b', b);
            return a(b(...args))
        }
b (...arg) => `函数h(${arg.join('_')})`
a (arg) => `函数f(${arg})`
b (arg) => `函数g(${arg})`
函数f(函数g(函数h(1_2_3))) 
*/
```

```js
let middleware = [
  routerMiddleware(history),
  reduxActionsPromise,
  timerMiddleware
];
```

<!-- let middleware = [routerMiddleware(history), reduxActionsPromise, timerMiddleware]

if (__DEBUG__) {
  middleware = [...middleware, createLogger({})] -->
