// шаблон начала письма
var intro = ['$a_intro$', '$b_intro$'];
// шаблон тела письма
var text = ['$a_text$', '$b_text$'];
// шаблон концовки письма
var outro = ['$a_outro$', '$b_outro$'];

// задаем набор фраз и слов для всех шаблонов сразу
var text_obj = {
	// структуру письма пока оставляем пустой
	structure: [

	],
	// текст для начала
	a_intro: ['Здравствуйте.', 'Добрый день!'],
	b_intro: ['Привет!', 'Хэллоу!', 'Бонжур!'],
	// варианты основного текста
	a_text: ['Перед вами — первое письмо в рассылке. Наш $somebody$ рад тому, что вы не прошли мимо подписки, и приглашает вас на нашу выставку, адрес — во вложении.', 'Меня зовут Михаил Максимов, и я — $somebody$ в этой компании. От лица всех сотрудников я рад приветствовать вас в рядах наших единомышленников.'],
	b_text: ['Если ты видишь это письмо, знай — наш $somebody$ здорово постарался для этого. Зато ты теперь сможешь прийти к нам на выставку и убедиться своими глазами в том, о чём мы тебе говорили!', 'Ты сделал это, а значит, твой $somebody$ будет в восторге! Если нет — дай нам знать, и мы это исправим.'],
	// должность
	somebody: ['директор', 'руководитель', 'начальник отдела'],
	// текст для концовки
	a_outro: ['Спасибо, что подписались на нашу рассылку!', 'Если будут вопросы — пишите.', 'Если письмо попало к вам по ошибке — проигнорируйте его.'],
	b_outro: ['Теперь ты один из нас!', 'Здорово, что мы теперь — команда!', 'Рады, что ты с нами! Пиши, если есть что спросить.'],
};

// убираем знаки доллара после замены шаблонного слова на реальный текст
function parse_keywords(string) {
	// задаем шаблон поиска таких слов
	pattern = /\$\w+\$/g;
	// проверяем, есть ли в строке нужные нам слова
	keyword = string.match(pattern);

	// если есть, делаем перебор и убираем значок доллара во всех таких словах
	if (keyword) {
		for (var i = keyword.length - 1; i >= 0; i--) {
			keyword[i] = keyword[i].replace(/\$/g, '');
		}
	}
	// возвращаем слово без знаков доллара
	return keyword;
}

// генератор случайных чисел в диапазоне от min до max
function randz(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// выбираем случайный элемент массива
function randomanize(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

// меняем одно слово на другое
function replace_keyword(source, keyword, variant) {
	return (source.replace('$' + keyword + '$', variant));
}

// подставляем случайным образом готовые слова вместо шаблонных слов со знаком доллара
function bake(object) {
	// переменная, в которой на выходе получится готовый текст
	var result = randomanize(object['structure']);
	// выбираем шаблонные слова со знаком доллара
	do {
		keywords = parse_keywords(result);
		// если они есть, перебираем и подставляем вместо них слова из наборов
		if (keywords) {
			for (var i = keywords.length - 1; i >= 0; i--) {
				if (object.hasOwnProperty(keywords[i])) {
					result = replace_keyword(result, keywords[i], randomanize(object[keywords[i]]));
				}
			}
		}
	}
	while (keywords);
	// возвращаем готовый результат
	return result;
}

// собираем письмо в одно целое
function generate_structure() {
	// случайным образом определяем тон письма - официальное (0) или неформальное (1)
	var mood = randz(0, 1);
	// результат помещаем в переменную вместе с тегами
	result = '<h2>' + intro[mood] + '</h2>\n';
	result += '<p>' + text[mood] + '</p>\n';
	result += '<p>' +  outro[mood] + '</p>\n';
	// возвращаем результат - одну строку с HTML-разметкой
	return result;
}

// подставляем текст с тегами в нужное место на странице
function send(text) {
	document.getElementById('text_here').innerHTML = text;
}

// то, что делаем по нажатию на кнопку
function get_text() {
	// заводим переменную для структуры текста
	var currentObject = text_obj;
	// наполняем структуру текстом с шаблонными словами
	currentObject.structure[0] = generate_structure();
	// меняем шаблонные слова на нормальный текст
	result = bake(currentObject);
	// выводим результат
	send(result);
}