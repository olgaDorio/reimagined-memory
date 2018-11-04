# reimagined-memory
## Установка
`npm install --save olgaDorio/reimagined-memory`     
или     
`<script src="https://olgadorio.github.io/reimagined-memory/index.min.js">`   

## Использование
### createInstance(store, callback)
Функция `createInstance` принимает два параметра и возвращает объект

- #### store: {state: {}, actions: {}}
    Пример
    ```sh
    store: {
        state: {
            value: 0,
        },
        actions: {
            updateValue(state, payload) {
                state.a = payload;
            },
            ...
        }
    }
    ```
- #### callback(?optional)
    Необязательный параметр. Используется для передачи функии, которая будет вызываться после каждого обновления store. В нее будут переданы текущее и предыдущее значение state:
    ```sh
    (currentState, previousState) => {
        // do something with new state
    }
    ```
- ### Возвращаемое значение 
    ```
    state: {},
    dispatch: ()=> {},
    subscribe: ()=> {}
    ```

### .dispatch(actionName, payload?)
Вызов методов store производится при помощи функции `dispatch`, принимающей два параметра: `actionName` и `payload`. Пример:
```sh
const store = createInstance({
  state: {
    counter: 0,
  },

  actions: {
    increase(state) {
      state.counter += 1;
    },

    decrease(state) {
      state.counter -= 1;
    },
  },
}, myCallback)

// ...

store.dispatch('increment')

// myCallback is called
```

### .subscribe(`property.name`, callback, immediate)
Еще один способ подписаться на обновления state, помимо callback в createInstance.
Функция принимает три параметра: 
- property - строка идентифицирующая наблюдаемое свойство;
- callback - функция, вызываемая после обновления соответствующего значения в state;
- immediate - флаг о немедленном вызове функции (по умолчанию false);

Пример:

```sh
const store = createInstance({
  state: {
    counter: 0,
  },

  actions: {
    increase(state) {
      state.counter += 1;
    },

    decrease(state) {
      state.counter -= 1;
    },
  },
})

// ...

store.dispatch('increment')

store.subscribe('counter', ({counter}) => {
    // Вызовется после любого обновления поля counter
    console.log(`Counter: ${counter}`)
}, true)
```
