(function () {
  const STORAGE_KEY = 'todoItems';

  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const dueInput = document.getElementById('todo-due');
  const list = document.getElementById('todo-list');
  const itemsLeft = document.getElementById('items-left');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let todos = loadTodos();
  let currentFilter = 'all';

  function loadTodos() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function render() {
    const filtered = todos.filter(function (todo) {
      if (currentFilter === 'active') return !todo.completed;
      if (currentFilter === 'completed') return todo.completed;
      return true;
    });

    list.innerHTML = filtered.map(function (todo) {
      const dueLabel = todo.due ? '<span class="todo-due">Due ' + todo.due + '</span>' : '';
      return '<li class="' + (todo.completed ? 'completed' : '') + '" data-id="' + todo.id + '">' +
        '<input type="checkbox" class="toggle-btn" ' + (todo.completed ? 'checked' : '') + '>' +
        '<span class="todo-text">' + escapeHtml(todo.text) + dueLabel + '</span>' +
        '<button type="button" class="delete-btn" aria-label="Delete task">✕</button>' +
        '</li>';
    }).join('');

    const remaining = todos.filter(function (todo) { return !todo.completed; }).length;
    itemsLeft.textContent = remaining + (remaining === 1 ? ' item left' : ' items left');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    todos.push({ id: Date.now(), text: text, completed: false, due: dueInput.value });
    saveTodos();
    render();
    form.reset();
    input.focus();
  });

  list.addEventListener('click', function (e) {
    const li = e.target.closest('li');
    if (!li) return;
    const id = Number(li.dataset.id);

    if (e.target.classList.contains('toggle-btn')) {
      const todo = todos.find(function (t) { return t.id === id; });
      if (todo) todo.completed = !todo.completed;
      saveTodos();
      render();
    }

    if (e.target.classList.contains('delete-btn')) {
      todos = todos.filter(function (t) { return t.id !== id; });
      saveTodos();
      render();
    }
  });

  clearCompletedBtn.addEventListener('click', function () {
    todos = todos.filter(function (t) { return !t.completed; });
    saveTodos();
    render();
  });

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  render();
})();
