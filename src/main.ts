import * as express from 'express';
import axios from 'axios';
import * as bodyParser from 'body-parser';
import 'dotenv/config';
import * as yaml from 'js-yaml';
const path = require('path');
const fs = require('fs');

const ymlText: any = yaml.load(fs.readFileSync(path.resolve(__dirname, '../src/example.yml'), 'utf8'));

const BOT_TOKEN = process.env.BOT_TOKEN;
const SERVER_URL = process.env.SERVER_URL;
const TG_URL = process.env.TG_URL;

const buttonIds = {
	level1: {
		NEED_I_LICENCE: `NEED_I_LICENCE`,
		I_WILL_GET_LICENCE: `I_WILL_GET_LICENCE`,
		I_HAVE_GOT_LICENCE: `I_HAVE_GOT_LICENCE`,
	},
	level2: {
		block1: {
			button1: 'level2::block1::button1',
			button2: 'level2::block1::button2',
			button3: 'level2::block1::button3',
		},
		block2: {
			button1: 'level2::block2::button1',
			button2: 'level2::block2::button2',
		},
		block3: {
			button1: 'level2::block3::button1',
			button2: 'level2::block3::button2',
		},
	},
	level3: {
		block1: {
			button1: 'level3::block1::button1',
			button2: 'level3::block1::button2',
		},
		block2: {
			button1: 'level3::block2::button1',
			button2: 'level3::block2::button2',
			button3: 'level3::block2::button3',
		},
		block3: {
			button1: 'level3::block3::button1',
			button2: 'level3::block3::button2',
			button3: 'level3::block3::button3',
		},
	},
	level4: {
		block1: {
			button1: 'level4::block1::button1',
			button2: 'level4::block1::button2',
			button3: 'level4::block1::button3',
			button4: 'level4::block1::button4',
		},
	},
};

const app = express();

app.use(bodyParser.json());

axios.post(`${TG_URL}/bot${BOT_TOKEN}/setWebhook?url=${SERVER_URL}/bot_api`).then(function (response) {
	console.log(response.data);
});

app.post('/bot_api', async (request, response) => {
	console.log(request.body);
	response.status(200).send('ok');
	if (request.body.message) {
		const message = request.body.message.text;
		if (message == '/start') {
			const chatId = request.body.message.chat.id;
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level1.block1.text,
				parse_mode: 'markdown',
				reply_markup: {
					inline_keyboard: [
						[{ text: 'Нужна ли мне лицензия', callback_data: JSON.stringify({ buttonId: buttonIds.level1.NEED_I_LICENCE }) }],
						[{ text: 'Буду получать лицензию', callback_data: JSON.stringify({ buttonId: buttonIds.level1.I_WILL_GET_LICENCE }) }],
						[{ text: 'Недавно получена', callback_data: JSON.stringify({ buttonId: buttonIds.level1.I_HAVE_GOT_LICENCE }) }],
					],
				},
			});
		}
	} else if (request.body.callback_query) {
		const callbackQuery = request.body.callback_query;
		const chatId = callbackQuery.message.chat.id;
		const buttonId = JSON.parse(callbackQuery.data).buttonId;
		if (buttonId == buttonIds.level1.NEED_I_LICENCE) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level2.block1.text,
				parse_mode: 'markdown',
				reply_markup: {
					inline_keyboard: [
						[{ text: 'Когда нужна', callback_data: JSON.stringify({ buttonId: buttonIds.level2.block1.button1 }) }],
						[{ text: 'Преимущества', callback_data: JSON.stringify({ buttonId: buttonIds.level2.block1.button2 }) }],
						[{ text: 'Как получить', callback_data: JSON.stringify({ buttonId: buttonIds.level2.block1.button3 }) }],
					],
				},
			});
		} else if (buttonId == buttonIds.level1.I_WILL_GET_LICENCE || buttonId == buttonIds.level2.block1.button3) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level2.block2.text,
				parse_mode: 'markdown',
				reply_markup: {
					inline_keyboard: [
						[{ text: 'Онлайн обучение', callback_data: JSON.stringify({ buttonId: buttonIds.level2.block2.button1 }) }],
						[{ text: 'Очное обучение', callback_data: JSON.stringify({ buttonId: buttonIds.level2.block2.button2 }) }],
					],
				},
			});
		} else if (buttonId == buttonIds.level1.I_HAVE_GOT_LICENCE) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level2.block3.text,
				parse_mode: 'markdown',
				reply_markup: {
					inline_keyboard: [
						[{ text: 'как правильно начать работу', callback_data: JSON.stringify({ buttonId: buttonIds.level2.block3.button1 }) }],
						[{ text: 'Заказать консультацию', callback_data: JSON.stringify({ buttonId: buttonIds.level2.block3.button2 }) }],
					],
				},
			});
		}
		//LEVEL 2 START
		else if (buttonId == buttonIds.level2.block1.button1) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level2.block1.afterButton1,
				parse_mode: 'markdown',
			});
		} else if (buttonId == buttonIds.level2.block1.button2) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level2.block1.afterButton2,
				parse_mode: 'markdown',
			});
		} else if (buttonId == buttonIds.level2.block1.button3) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level2.block1.text,
				parse_mode: 'markdown',
				reply_markup: {
					inline_keyboard: [
						[{ text: 'как правильно начать работу', callback_data: JSON.stringify({ buttonId: buttonIds.level2.block3.button1 }) }],
						[{ text: 'Заказать консультацию', callback_data: JSON.stringify({ buttonId: buttonIds.level2.block3.button2 }) }],
					],
				},
			});
		} else if (buttonId == buttonIds.level2.block2.button1) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level3.block1.text,
				parse_mode: 'markdown',
				reply_markup: {
					inline_keyboard: [
						[{ text: 'Что необходимо', callback_data: JSON.stringify({ buttonId: buttonIds.level3.block1.button1 }) }],
						[{ text: 'Порядок получения', callback_data: JSON.stringify({ buttonId: buttonIds.level3.block1.button2 }) }],
					],
				},
			});
		} else if (buttonId == buttonIds.level2.block2.button2) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level3.block2.text,
				parse_mode: 'markdown',
				reply_markup: {
					inline_keyboard: [
						[{ text: 'Что необходимо', callback_data: JSON.stringify({ buttonId: buttonIds.level3.block2.button1 }) }],
						[{ text: 'Порядок получения', callback_data: JSON.stringify({ buttonId: buttonIds.level3.block2.button2 }) }],
						[{ text: 'Заказать консультацию', callback_data: JSON.stringify({ buttonId: buttonIds.level3.block2.button3 }) }],
					],
				},
			});
		} else if (buttonId == buttonIds.level2.block3.button1) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level3.block3.text,
				parse_mode: 'markdown',
				reply_markup: {
					inline_keyboard: [
						[{ text: 'ФИС ФРДО', callback_data: JSON.stringify({ buttonId: buttonIds.level3.block3.button1 }) }],
						[{ text: 'Учебный документооборот', callback_data: JSON.stringify({ buttonId: buttonIds.level3.block3.button2 }) }],
						[{ text: 'Информационная открытость', callback_data: JSON.stringify({ buttonId: buttonIds.level3.block3.button3 }) }],
					],
				},
			});
		} else if (buttonId == buttonIds.level2.block3.button2) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: 'Недавно получена >> Заказать консультацию >> TEXT',
				parse_mode: 'markdown',
				reply_markup: {
					inline_keyboard: [
						[{ text: 'Заказать консультацию', callback_data: JSON.stringify({ buttonId: buttonIds.level2.block3.button1 }) }],
					],
				},
			});
		}
		////////////////LEVEL 3
		else if (buttonId == buttonIds.level3.block1.button1) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level4.block1.text,
				parse_mode: 'markdown',
				reply_markup: {
					inline_keyboard: [
						[{ text: 'Разработка программы', callback_data: JSON.stringify({ buttonId: buttonIds.level4.block1.button1 }) }],
						[{ text: 'ЭИОС', callback_data: JSON.stringify({ buttonId: buttonIds.level4.block1.button2 }) }],
						[{ text: 'Подготовка заявления', callback_data: JSON.stringify({ buttonId: buttonIds.level4.block1.button4 }) }],
					],
				},
			});
		} else if (buttonId == buttonIds.level3.block1.button2) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level3.block1.afterButton2,
				parse_mode: 'markdown',
			});
		} else if (buttonId == buttonIds.level3.block2.button1) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level4.block1.text,
				parse_mode: 'markdown',
				reply_markup: {
					inline_keyboard: [
						[{ text: 'Разработка программы', callback_data: JSON.stringify({ buttonId: buttonIds.level4.block1.button1 }) }],
						[{ text: 'СЭЗ', callback_data: JSON.stringify({ buttonId: buttonIds.level4.block1.button3 }) }],
						[{ text: 'Подготовка заявления', callback_data: JSON.stringify({ buttonId: buttonIds.level4.block1.button4 }) }],
					],
				},
			});
		} else if (buttonId == buttonIds.level3.block2.button2) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level3.block2.afterButton2,
				parse_mode: 'markdown',
			});
		} else if (buttonId == buttonIds.level3.block2.button3) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: 'Буду получать лицензию >> Очное обучение >> Заказать консультацию >> TEXT END // HELLO WORLD',
				parse_mode: 'markdown',
			});
		} else if (buttonId == buttonIds.level3.block3.button1) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level3.block3.afterButton1,
				parse_mode: 'markdown',
			});
		} else if (buttonId == buttonIds.level3.block3.button2) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level3.block3.afterButton2,
				parse_mode: 'markdown',
			});
		} else if (buttonId == buttonIds.level3.block3.button3) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level3.block3.afterButton3,
				parse_mode: 'markdown',
			});
		}

		///LEVEL 4
		else if (buttonId == buttonIds.level4.block1.button1) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level4.block1.afterButton1,
				parse_mode: 'markdown',
			});
		} else if (buttonId == buttonIds.level4.block1.button2) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level4.block1.afterButton2,
				parse_mode: 'markdown',
			});
		} else if (buttonId == buttonIds.level4.block1.button3) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level4.block1.afterButton3,
				parse_mode: 'markdown',
			});
		} else if (buttonId == buttonIds.level4.block1.button4) {
			await axios.post(`${TG_URL}/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: chatId,
				text: ymlText.level4.block1.afterButton4,
				parse_mode: 'markdown',
			});
		}
	} else {
		response.send('okey');
	}
});

app.listen(3000, () => {
	console.log('server works');
});

interface PayloadI {
	text: string;
	battons: any[];
}

function delayInSec(sec: number) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(true);
		}, sec * 1000);
	});
}
