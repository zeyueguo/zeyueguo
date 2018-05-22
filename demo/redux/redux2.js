function compose(...funcs) {
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

const f = (arg) => `函数f(${arg})` 

const g = (arg) => `函数g(${arg})`

// function h 最后一个函数可以接受多个参数
const h = (...arg) => `函数h(${arg.join('_')})`

const result = compose(f, g, h)(1,2,3)

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
