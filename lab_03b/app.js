const loadButton = document.getElementById('loadUsers');
const usersDiv = document.getElementById('users');
const message = document.getElementById('message');
const searchInput = document.getElementById('search');
const postsDiv = document.getElementById('posts');

let users = [];

async function loadPosts(userId, postsButton) {
    message.textContent = 'Загрузка...';
    postsDiv.textContent = '';
    postsButton.disabled = true;

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?userId=' + userId);
        if (!response.ok) {
            throw new Error('Ошибка HTTP: ' + response.status);
        }

        const posts = await response.json();

        posts.slice(0, 3).forEach(function(post) {
            const card = document.createElement('div');
            card.className = 'post';

            const title = document.createElement('h3');
            title.textContent = post.title;

            const body = document.createElement('p');
            body.textContent = post.body;

            card.appendChild(title);
            card.appendChild(body);

            postsDiv.appendChild(card);
        });

        message.textContent = '';
    } catch (err) {
        message.textContent = 'Ошибка загрузки публикаций: ' + err.message;
    } finally {
        postsButton.disabled = false;
    }
}

function displayUsers(usersList) {
    usersDiv.textContent = '';

    if (usersList.length === 0) {
        usersDiv.textContent = 'Пользователи не найдены';
        return;
    }

    usersList.forEach(function(user) {
        const card = document.createElement('div');
        card.className = 'user';

        const name = document.createElement('h3');
        name.textContent = user.name;

        const email = document.createElement('p');
        email.textContent = 'Email: ' + user.email;

        const city = document.createElement('p');
        city.textContent = 'Город: ' + user.address.city;

        const postsButton = document.createElement('button');
        postsButton.textContent = 'Показать публикации';

        postsButton.addEventListener('click', function() {
            loadPosts(user.id, postsButton);
        });

        card.appendChild(name);
        card.appendChild(email);
        card.appendChild(city);
        card.appendChild(postsButton);

        usersDiv.appendChild(card);
    });
}

async function loadUsers() {
    message.textContent = 'Загрузка...';
    loadButton.disabled = true;

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error('Ошибка HTTP: ' + response.status);
        }

        users = await response.json();
        searchUsers();

        message.textContent = '';
    } catch (err) {
        message.textContent = 'Ошибка загрузки пользователей: ' + err.message;
    } finally {
        loadButton.disabled = false;
    }
}

function searchUsers() {
    const searchText = searchInput.value.toLowerCase();

    const filteredUsers = users.filter(function(user) {
        return user.name.toLowerCase().includes(searchText);
    });

    displayUsers(filteredUsers);
}

loadButton.addEventListener('click', loadUsers);
searchInput.addEventListener('input', searchUsers);