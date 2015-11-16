/// <reference path="typings.d.ts" />

interface Prop<T> {
  (p?: T): T
}

class TodoItem {
  description: Prop<string>
  done: Prop<boolean>
  constructor(description: string) {
    this.description = m.prop(description);
    this.done = m.prop(false);
  }
}

class ViewModel {
  list: Array<TodoItem>
  description: Prop<string>
  constructor() {
    this.list = [];
    this.description = m.prop("Type your new task in here");
  }
  add = () => {
    this.list.push(new TodoItem(this.description()));
    this.description("");
  }
  remove = (i: number) => {
    this.list.splice(i, 1);
  }
  removeCompleted = () => {
    this.list = this.list.filter(it => !it.done());
  }
}

const ENTER_KEY = 13;
let handleEnter = (action: () => any) => (evt: KeyboardEvent) => {
    m.redraw.strategy("none");
    if (evt.which === ENTER_KEY) {
      action();
      m.redraw.strategy("diff");
    }
  };
  
var debounce = (rate: number, action: Function) => {
  var timeoutHandle;
  return function () {
    clearTimeout(timeoutHandle);
    timeoutHandle = setTimeout(action.bind(this, arguments), rate||200);
  };
}

let changer = (evt: Event) => {
  console.log(evt);
}

function view(vm: ViewModel) {
  return (
    <div class="todo-list">
      <input value={vm.description()}
             onchange={m.withAttr("value", vm.description)} 
             //oninput={m.withAttr("value", vm.description)} // For instant 2-way databinding-ness
             onkeyup={handleEnter(vm.add)} />
      <button onclick={vm.add}>Add</button>
      <button onclick={vm.removeCompleted}>Remove Completed</button>
      <ul>
        { vm.list.map((task, index) =>
            <li>
              <input type="checkbox"
                     onclick={ m.withAttr("checked", task.done) }
                     checked={task.done()} />
              <span style={{ textDecoration: task.done() ? "line-through" : "none" }}>
                {task.description()}
              </span>
              <button onclick={() => vm.remove(index)}>Remove</button>
            </li>)
        }
      </ul>
    </div>);
}

m.mount(document.body, {controller: ViewModel, view});
