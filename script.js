/**
 * Makes $newNode the first child of $parentNode
 * @param {Node} $parentNode
 * @param {Node} $newNode
 */
const prependChild = ($parentNode, $newNode) => {
	$parentNode.insertBefore($newNode, $parentNode.firstChild);
}

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

/**
 * Set $el's height based on the height of its contents
 * @param {HTMLElement} $el
 */
const setHeight = ($el) => {
	// TODO: figure out why the height is 15px shorter on load
	$el.style.height = Math.max($el.scrollHeight, 150) + 15 + 'px';
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
	const isBlank = (index === Number(localStorage.getItem('nextId')));

	const $note = document.createElement('div');
	$note.className = 'note';

	const $delete = document.createElement('button');
	$delete.textContent = 'delete';
	$delete.disabled = isBlank;
	$delete.addEventListener('click', (event) => {
		const ids = getAndParse('ids');
		const idsIndex = ids.indexOf(index);
		ids.splice(idsIndex, 1);
		localStorage.setItem('ids', JSON.stringify(ids));

		localStorage.removeItem(index);
		event.target.parentNode.remove();
	});

	const $title = document.createElement('input');
	$title.value = title;
	$title.placeholder = 'Title'
	$title.addEventListener('input', (event) => {
		updateData(index, 'title', event.target.value);
		if (isBlank) {
			$delete.disabled = false;
		}
	});

	const $body = document.createElement('textarea');
	$body.value = body;
	$body.placeholder = 'Start typing...';
	$body.style.height = 'auto';
	$body.addEventListener('input', (event) => {
		$body.style.height = 'auto';
		setHeight($body);
		updateData(index, 'body', event.target.value);
		if (isBlank) {
			$delete.disabled = false;
		}
	});

	$note.appendChild($title);
	$note.appendChild($delete);
	$note.appendChild($body);
	prependChild(document.getElementById('notes'), $note);

	setTimeout(setHeight, 10, $body);
	return $note;
}

const initStorage = () => {
	if (localStorage.getItem('ids') === null) {
		localStorage.setItem('ids', '[]');
		localStorage.setItem('nextId', '0');
	}
}

const initNotes = () => {
	const items = getAndParse('ids').map(id => [getAndParse(id), id]);
	items.forEach(([note, index]) => {
		if (note === null) {
			console.error(`Unable to find note at index ${index}`);
			return;
		}
		createNote(index, note);
	});

	const $newNote = createNote(Number(localStorage.getItem('nextId')));
	$newNote.getElementsByTagName('textarea')[0].focus();
}

initStorage();
initNotes();
