const storage = {
	ids: [0, 1],
	nextId: 2,
	0: {
		title: 'Title',
		body: 'Hello\nworld!',
	},
	1: {
		title: 'Foo',
		body: 'Bar',
	},
};

const getAndParse = (key) => {
    const value = localStorage.getItem(key);
    if (value === null) throw new Error(`Key ${key} not found in localStorage`);
    try {
        return JSON.parse(value);
    } catch (e) {
        console.error(`Key ${key} has invalid JSON ${value}`);
        throw e;
    }
}

const updateData = (index, property, value) => {
	if (index === Number(localStorage.getItem('nextId'))) {
        const data = {
			title: '',
			body: '',
			[property]: value,
        };
		localStorage.setItem(index, JSON.stringify(data));
        const ids = getAndParse('ids');
        ids.push(index);
        localStorage.setItem('ids', JSON.stringify(ids));
		localStorage.setItem('nextId', index + 1);
		createNote(index + 1);
	} else {
        const data = getAndParse(index);
        data[property] = value;
        localStorage.setItem(index, JSON.stringify(data));
	}
}

const createNote = (index, { title, body } = { title: '', body: '' }) => {
	const $note = document.createElement('div');
	$note.className = 'note';

	const $title = document.createElement('input');
	$title.value = title;
	$title.placeholder = 'Title'
	$title.addEventListener('input', (event) => {
		updateData(index, 'title', event.target.value);
    });
    
    const $delete = document.createElement('button');
    $delete.textContent = 'delete';
    $delete.disabled = (index === Number(localStorage.getItem('nextId')))
    $delete.addEventListener('click', (event) => {
        const ids = getAndParse('ids');
        const idsIndex = ids.indexOf(index);
        ids.splice(idsIndex, 1);
        localStorage.setItem('ids', JSON.stringify(ids));

        localStorage.removeItem(index);
        event.target.parentNode.remove();
    });

	const $body = document.createElement('textarea');
	$body.value = body;
	$body.placeholder = 'Start typing...'
	$body.addEventListener('input', (event) => {
		updateData(index, 'body', event.target.value);
	});

	$note.appendChild($title);
	$note.appendChild($delete);
	$note.appendChild($body);
	document.getElementById('notes').appendChild($note);
}

const initStorage = () => {
    if (localStorage.getItem('ids') === null) {
        localStorage.setItem('ids', '[]');
        localStorage.setItem('nextId', '0');
    }
}

const initNotes = () => {
	const items = getAndParse('ids').map(id => getAndParse(id));
	items.forEach((note, index) => {
		if (note === null) {
			console.error(`Unable to find note at index ${index}`);
			return;
		}
		createNote(index, note);
	});
	createNote(Number(localStorage.getItem('nextId')));
}

initStorage();
initNotes();
