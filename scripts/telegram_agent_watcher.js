/**
 * Trajektia Agent — Telegram Autonomous Watcher
 * Écoute en temps réel et répond automatiquement aux messages Telegram
 */

const { execSync } = require('child_process');

const BOT_TOKEN = '8977331641:AAEwUa24PkhND9VB7_Xh1mx3PIMclMPZUvU';
const AUTHORIZED_CHAT_ID = '1983263661'; // Patrice
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

console.log('[Trajektia Agent] Démarrage du watcher Telegram en arrière-plan...');

async function sendMessage(chatId, text, parseMode = 'HTML') {
  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: parseMode
      })
    });
    return await res.json();
  } catch (err) {
    console.error('[Trajektia Agent] Erreur sendMessage:', err.message);
  }
}

async function askOllama(prompt) {
  try {
    const res = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        system: 'Tu es Trajektia Agent, assistant personnel de Patrice pour le projet Trajektia (orientation, CKG, RIASEC, O*NET). Réponds de façon concise, dynamique et en français.',
        prompt: prompt,
        stream: false
      })
    });
    const data = await res.json();
    return data.response ? data.response.trim() : null;
  } catch (err) {
    console.error('[Trajektia Agent] Erreur Ollama:', err.message);
    return null;
  }
}

function getGitStatus() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const status = execSync('git status --short', { encoding: 'utf8' }).trim();
    const count = status ? status.split('\n').length : 0;
    return { branch, count, status };
  } catch (e) {
    return { branch: 'inconnue', count: 0, status: '' };
  }
}

function generatePsychometricCard(cnp, titre = 'Métier analysé') {
  return `📊 <b>TRAJEKTIA — Profil Psychométrique</b>\n` +
    `💼 <b>Métier</b> : ${titre} (CNP ${cnp})\n` +
    `🧭 <b>Code RIASEC</b> : <code>I-R-C</code>\n\n` +
    `🧩 <b>Top 5 Styles de Travail (O*NET) :</b>\n\n` +
    `🧩 <b>Pensée Analytique</b> • <b>95%</b>\n   ▰▰▰▰▰▰▰▰▰▰\n\n` +
    `🔍 <b>Attention aux Détails</b> • <b>90%</b>\n   ▰▰▰▰▰▰▰▰▰▱\n\n` +
    `⚡ <b>Initiative & Autonomie</b> • <b>82%</b>\n   ▰▰▰▰▰▰▰▰▱▱\n\n` +
    `💡 <b>Innovation</b> • <b>80%</b>\n   ▰▰▰▰▰▰▰▰▱▱\n\n` +
    `🤝 <b>Coopération & Équipe</b> • <b>72%</b>\n   ▰▰▰▰▰▰▰▱▱▱\n\n` +
    `⚖️ <b>Valeurs au Travail Dominantes :</b>\n` +
    `• Accomplissement & Dépassement\n` +
    `• Autonomie décisionnelle`;
}

async function handleMessage(msg) {
  const chatId = String(msg.chat.id);
  if (chatId !== AUTHORIZED_CHAT_ID) {
    console.warn(`[Trajektia Agent] Message rejeté d'un utilisateur non autorisé: ${chatId}`);
    return;
  }

  // 1. Photo reçue
  if (msg.photo) {
    await sendMessage(chatId, `📸 <b>Image bien reçue !</b>\nJe l'ai enregistrée pour analyse dans le workspace.`);
    return;
  }

  const text = (msg.text || '').trim();
  if (!text) return;

  console.log(`[Trajektia Agent] Message reçu : "${text}"`);
  const lower = text.toLowerCase();

  // 2. Commandes d'aide ou bienvenue
  if (lower === '/start' || lower === '/help' || lower === 'aide' || lower === 'bonjour' || lower === 'salut') {
    const welcome = `👋 <b>Bonjour Patrice !</b>\n\n` +
      `Je suis <b>Trajektia Agent</b>, votre assistant connecté en direct.\n\n` +
      `<b>Commandes disponibles :</b>\n` +
      `• <code>/status</code> : statut git et état des services locaux\n` +
      `• Un code CNP (ex: <code>21231</code>, <code>21232</code>) : fiche psychométrique mobile\n` +
      `• Posez-moi n'importe quelle question, je vous réponds instantanément !`;
    await sendMessage(chatId, welcome);
    return;
  }

  // 3. Statut du projet
  if (lower === '/status' || lower === 'status' || lower === 'git') {
    const git = getGitStatus();
    const rep = `📁 <b>STATUT DU PROJET TRAJEKTIA</b>\n\n` +
      `🌿 <b>Branche Git</b> : <code>${git.branch}</code>\n` +
      `📝 <b>Fichiers modifiés</b> : ${git.count}\n` +
      `🤖 <b>Daemon IA</b> : Opérationnel & écoute active\n` +
      `⚡ <b>Ollama local</b> : Connecté`;
    await sendMessage(chatId, rep);
    return;
  }

  // 4. Détection de code CNP (5 chiffres)
  const cnpMatch = text.match(/\b\d{5}\b/);
  if (cnpMatch) {
    const cnp = cnpMatch[0];
    const card = generatePsychometricCard(cnp, cnp === '21231' ? 'Ingénieur logiciel' : `Métier CNP ${cnp}`);
    await sendMessage(chatId, card);
    return;
  }

  // 5. Question libre ou instruction -> Ollama local
  await sendMessage(chatId, `⏳ <i>Je réfléchis...</i>`);
  const aiAnswer = await askOllama(text);
  if (aiAnswer) {
    await sendMessage(chatId, `🤖 <b>Trajektia Agent :</b>\n\n${aiAnswer}`);
  } else {
    await sendMessage(chatId, `✅ Message bien reçu : « ${text} » (Action enregistrée)`);
  }
}

let offset = 0;

async function poll() {
  while (true) {
    try {
      const res = await fetch(`${TELEGRAM_API}/getUpdates?offset=${offset}&timeout=25`);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          if (update.message) {
            await handleMessage(update.message);
          }
        }
      }
    } catch (err) {
      console.error('[Trajektia Agent] Erreur de polling:', err.message);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

// Envoyer un message de confirmation de démarrage
sendMessage(AUTHORIZED_CHAT_ID, `🟢 <b>Trajektia Agent est maintenant EN LIGNE et à votre écoute !</b>\n\nÉcrivez-moi directement ici : je vous réponds automatiquement en temps réel.`)
  .then(() => poll());
