---
layout: layout
title: 学习Redux Middleware中间件
date: 2018-05-18 15:05:31
author: 麦砚
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

参数：

- callback 执行数组中每个值的函数
  - accumulator 累加器累加回调的返回值; 它是上一次调用回调时返回的累积值，或initialValue
  - currentValue 数组中正在处理的元素

返回值:

- 函数累计处理的结果

``` js
const array = [1, 2, 3, 4]

// 1. 使用深度嵌套函数模式
const fun_1 = () => array[0] + array[1] // 1 + 2
const fun_2 = () => fun_1() + array[2] // (1 + 2) + 3
const fun_3 = () => fun_2() + array[3] // (1 + 2 + 3) + 4
const result_1 = fun_3(fun_2(fun_1()))
console.log('使用深度嵌套函数模式', result_1); // 10

// 2. 使用深度嵌套函数模式 - 传入上次返回的结果作为参数
const fun_11 = () => array[0] + array[1] // 1 + 2
const fun_22 = (x) => x + array[2] // (1 + 2) + 3
const fun_33 = (x) => x + array[3] // (1 + 2 + 3) + 4
const result_2 = fun_33(fun_22(fun_11()))
console.log('使用深度嵌套函数模式 - 传入上次返回的结果作为参数', result_2); // 10

// 3. 使用reduce
const result = array.reduce((a, b) => {
    return a + b
})
console.log('使用reduce', result) // 10
```

### 1.2 Currying 柯里化

把接受多个参数 的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果

``` js
var curry = function (arg1, arg2) {
    return function (arg3) {
        return arg1 + arg2 - arg3 // 1+2-1
    }
}
console.log(curry(1, 2)(1)); // 2
```



### 1.2 Compose 源代码

src/compose.js  ES6的代码

``` js
function compose(...funcs) {
  // compose(...[])(store.dispatch) 如果中间件数组为空数组的时候，直接返回 store.dispatch
  if (funcs.length === 0) {
    return arg => arg
  }
  // compose(...[middleware1])(store.dispatch) 如果中间件数组只有一个的时候，
  // 第一步compose(...[middleware1])返回了middleware1 ---> funcs[0]
  // 第二部compose(...[middleware1])(store.dispatch) 传入store.dispatch执行middleware1的方法
  if (funcs.length === 1) {
    return funcs[0]
  }
  // a为第一个middleware或者上一次middleware的运行结果
  // b为当前middleware
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
   /*
    return funcs.reduce(function (a, b) {
        return function (...args) {
            return a(b(...args))
        }
    })
    */

}
```

lib/compose.js  ES5的代码

``` js
function compose() {
 // funcs = Array(_len)返回一个 length 的值等于 _len 的数组对象, 不能理解认为它包含 _len 个值为 undefined 的元素
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}
```

DEMO

``` js
function compose(...funcs) {
    console.log('funcs.length', funcs.length);
    if (funcs.length === 0) {
        return arg => arg
    }
  
    if (funcs.length === 1) {
        // console.log('funcs[0]', funcs[0]);
        return funcs[0]
    }

    return funcs.reduce(function (a, b) {
        console.log('before a', a);
        console.log('before b', b);
        return function (...args) {
            console.log('a', a);
            console.log('b', b);
            return a(b(...args))
        }
    })

}

const action = {
    type: 'add',
    payload: {
        number: 0
    }
}

function add_1(action) {
    console.log('add_1')
    action.payload.number += 1;
    return action
}

function add_2(action) {
    console.log('add_2')
    action.payload.number += 2;
    return action
}

function add_3(action) {
    console.log('add_3')
    action.payload.number += 3;
    return action
}
function add_4(action) {
    console.log('add_4')
    action.payload.number += 4;
    return action
}
function add_5(action) {
    console.log('add_5')
    action.payload.number += 5;
    return action
}

// const result = compose(...[])(action)
// const result = compose(...[add_1])(action)
const result = compose(...[add_1, add_2, add_3, add_4, add_5])(action)

// const result = add_1(add_2(add_3(action)))

console.log(result);
```


``` js
let middleware = [routerMiddleware(history), reduxActionsPromise, timerMiddleware]
```



<!-- let middleware = [routerMiddleware(history), reduxActionsPromise, timerMiddleware]

if (__DEBUG__) {
  middleware = [...middleware, createLogger({})] -->