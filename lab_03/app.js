const loadBtn = document.getElementById('load-btn');
const postsList = document.getElementById('posts-list');
const statusElem = document.getElementById('status');
const createForm = document.getElementById('create-form');
const titleInput = document.getElementById('title');
const bodyInput = document.getElementById('body');
const createBtn = document.getElementById('create-btn');


const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';
const CREATE_URL = 'https://jsonplaceholder.typicode.com/posts';

function showStatus(msg, type='info') {
    statusElem.textContent = msg;
    statusElem.className = `status visible ${type}`;
}

function clearStatus() {
  statusElem.textContent = '';
  statusElem.className = 'status';
}

function friendlyError(err) {
    if (err.name === 'TypeError') {
        return 'сетевая ошибка. Проверьте подключение к интернету.';
    }

    if (typeof err.message === 'string' && err.message.startsWith('HTTP ')) {
        const code = err.message.slice(5);
        return `сервер вернул ошибку ${code}. Попробуйте ещё раз.`;
    }
    
    return err.message || 'неизвестная ошибка.';
}

function renderPost(post) {
    const card =  document.createElement('div');
    card.className = 'post';

    const title = document.createElement('h3');
    title.textContent = post.title;

    const body = document.createElement('p');
    body.textContent = post.body;

    card.append(title, body);
    return card;
}

async function loadPosts() {
    loadBtn.disabled = true;
    postsList.innerHTML = '';
    showStatus('Загрузка публикаций...', 'info');

    try {
        const response = await fetch(POSTS_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const posts = await response.json();

        posts.forEach((post) => {
            postsList.append(renderPost(post));
        });

        showStatus(`Загружено публикаций: ${posts.length}`, 'success');
    } catch (err) {
        showStatus(
            `Не удалось загрузить публикации: ${friendlyError(err)}`,
            'error'
        );
    } finally {
        loadBtn.disabled = false;
    }
}


async function createPost(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title || !body) {
        showStatus('Заполните заголовок и текст публикации.', 'error');
        return;
    }

    createBtn.disabled = true;
    showStatus('Отправка публикации...', 'info');

    try {
        const response = await fetch(CREATE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, body, userId: 1 }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const created = await response.json();
        showStatus(
            `Публикация создана: «${created.title}» (ID: ${created.id})`,
            'success'
        );

        postsList.prepend(renderPost({ title: created.title, body: created.body }));

        createForm.reset();
    } catch (err) {
        showStatus(
            `Не удалось создать публикацию: ${friendlyError(err)}`,
            'error'
        );
    } finally {
        createBtn.disabled = false;
    }
}

loadBtn.addEventListener('click', loadPosts);
createForm.addEventListener('submit', createPost);
