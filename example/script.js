const [increase, decrease] = document.querySelectorAll('button');
const counter = document.querySelector('.value');

const store = createInstance({
  state: {
    counter: 0,
  },

  actions: {
    increase(setter) {
      setter.state = {
        counter: setter.state.counter + 1,
      }
    },

    decrease(setter) {
      setter.state = {
        counter: setter.state.counter - 1,
      }
    },
  },
})

store.subscribe('counter', (state) => {
  counter.innerHTML = state.counter;
});

store.subscribe('counter', (state, prevState) => {
  document.body.dataset.counter = `Counter: ${state.counter}`;
})

decrease.addEventListener('click', () => {
  store.dispatch('decrease');
});

increase.addEventListener('click', () => {
  store.dispatch('increase');
});
