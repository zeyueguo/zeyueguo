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
        // console.log('first a', a);
        // console.log('first b', b);
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
