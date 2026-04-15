import Web3 from "web3";
import "./studio-refresh.css";

document.querySelector("#app").innerHTML = `
  <div class="page-shell">
    <div class="page-noise" aria-hidden="true"></div>
    <div class="page-glow glow-a" aria-hidden="true"></div>
    <div class="page-glow glow-b" aria-hidden="true"></div>

    <header class="topbar">
      <div>
        <p class="eyebrow">Updated Web3 Workspace</p>
        <h1>Blockchain Studio Dashboard</h1>
        <p class="intro">
          Localhost kontraktlarini bitta boshqaruv panelidan kuzating, yozing va transaction oqimini real vaqtda nazorat qiling.
        </p>
      </div>
      <div class="topbar-actions">
        <button id="connect-wallet" class="btn btn-primary" type="button">Wallet ulash</button>
        <button id="add-network" class="btn btn-secondary" type="button">31337 tarmoq qo'shish</button>
      </div>
    </header>

    <section class="status-grid" aria-label="Holat paneli">
      <article class="status-card accent-blue">
        <span class="status-label">Wallet</span>
        <strong id="wallet-status" class="status-value">Ulanmagan</strong>
        <p>MetaMask hisobini ulab yozish funksiyalarini faollashtiring.</p>
      </article>
      <article class="status-card accent-orange">
        <span class="status-label">Tarmoq</span>
        <strong id="network-status" class="status-value">Tekshirilmagan</strong>
        <p>Hardhat localhost va MetaMask sinxron holatini kuzating.</p>
      </article>
      <article class="status-card accent-green">
        <span class="status-label">Deploy</span>
        <strong id="deploy-status" class="status-value">Kutilmoqda</strong>
        <p><code>contracts.json</code> fayli yuklangach kontraktlar tayyor bo'ladi.</p>
      </article>
      <article class="status-card accent-purple">
        <span class="status-label">Nomzodlar</span>
        <strong id="candidate-count" class="status-value">0</strong>
        <p>Voting kontraktidagi joriy nomzodlar soni shu yerda ko'rinadi.</p>
      </article>
    </section>

    <section class="workflow-strip">
      <div class="workflow-step">
        <span>01</span>
        <p><code>npm run node</code> ni ishga tushiring</p>
      </div>
      <div class="workflow-step">
        <span>02</span>
        <p><code>deploy:localhost</code> orqali kontraktlarni joylang</p>
      </div>
      <div class="workflow-step">
        <span>03</span>
        <p>MetaMask ni ulang va dashboard orqali test qiling</p>
      </div>
    </section>

    <div id="app-toast" class="toast" hidden>
      <span id="toast-icon" class="toast-icon"></span>
      <p id="toast-text"></p>
      <button id="toast-close" class="toast-close" type="button">x</button>
    </div>

    <main class="main-grid">
      <section class="workspace-column">
        <article class="panel hero-panel">
          <div class="panel-head">
            <div>
              <p class="panel-kicker">Greeting Contract</p>
              <h2>Xabarlar laboratoriyasi</h2>
            </div>
          </div>
          <div class="metric-box">
            <span>Joriy xabar</span>
            <strong id="greeting-current">Yuklanmoqda...</strong>
          </div>
          <label class="field">
            <span>Yangi xabar</span>
            <input id="greeting-input" type="text" placeholder="Masalan: Assalomu alaykum, blockchain">
          </label>
          <div class="action-row">
            <button id="greeting-refresh" class="btn btn-secondary" type="button">Call qilish</button>
            <button id="greeting-set" class="btn btn-primary" type="button">Send qilish</button>
          </div>
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <p class="panel-kicker">Student Registry</p>
              <h2>Talabalar bazasi</h2>
            </div>
          </div>
          <div class="field-split">
            <label class="field">
              <span>ID</span>
              <input id="student-id" type="number" min="1" placeholder="1">
            </label>
            <label class="field">
              <span>Yosh</span>
              <input id="student-age" type="number" min="1" placeholder="20">
            </label>
          </div>
          <label class="field">
            <span>Ism</span>
            <input id="student-name" type="text" placeholder="Ali Valiyev">
          </label>
          <div class="action-row">
            <button id="student-add" class="btn btn-primary" type="button">Talaba qo'shish</button>
          </div>
          <div class="divider"></div>
          <label class="field">
            <span>Qidirish uchun ID</span>
            <input id="student-search-id" type="number" min="1" placeholder="1">
          </label>
          <div class="action-row">
            <button id="student-get" class="btn btn-secondary" type="button">Talabani topish</button>
          </div>
          <div class="metric-box soft">
            <span>Natija</span>
            <strong id="student-result">Hozircha ma'lumot yo'q</strong>
          </div>
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <p class="panel-kicker">Voting Contract</p>
              <h2>Ovoz boshqaruvi</h2>
            </div>
          </div>
          <label class="field">
            <span>Nomzod ismi</span>
            <input id="candidate-name" type="text" placeholder="Ali">
          </label>
          <div class="action-row">
            <button id="candidate-add" class="btn btn-primary" type="button">Nomzod qo'shish</button>
          </div>
          <div class="divider"></div>
          <label class="field">
            <span>Ovoz uchun candidate ID</span>
            <input id="vote-candidate-id" type="number" min="0" placeholder="0">
          </label>
          <div class="action-row">
            <button id="vote-submit" class="btn btn-primary" type="button">Ovoz berish</button>
            <button id="winner-refresh" class="btn btn-secondary" type="button">G'olibni yangilash</button>
          </div>
          <div class="metric-box warm">
            <span>G'olib</span>
            <strong id="winner-result">Hozircha aniqlanmagan</strong>
          </div>
        </article>
      </section>

      <aside class="sidebar-column">
        <article class="panel">
          <div class="panel-head">
            <div>
              <p class="panel-kicker">Gas Tuning</p>
              <h2>Transaction sozlamalari</h2>
            </div>
          </div>
          <label class="field">
            <span>Gas Limit</span>
            <input id="gas-limit" type="number" min="21000" step="1000" placeholder="300000">
          </label>
          <label class="field">
            <span>Gas Price (Gwei)</span>
            <input id="gas-price" type="number" min="0" step="0.1" placeholder="20">
          </label>
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <p class="panel-kicker">Activity Feed</p>
              <h2>Konsol yozuvlari</h2>
            </div>
            <button id="console-clear" class="btn btn-ghost" type="button">Tozalash</button>
          </div>
          <div id="console-output" class="log-output">
            <p class="console-placeholder">View yoki send ishga tushgach loglar shu yerda chiqadi.</p>
          </div>
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <p class="panel-kicker">Safety Layer</p>
              <h2>Xatoliklar paneli</h2>
            </div>
            <button id="error-clear" class="btn btn-ghost" type="button">Tozalash</button>
          </div>
          <div id="error-output" class="log-output error-surface">
            <p class="error-placeholder">Xatolik yuz bersa, turi va vaqti bilan shu yerda ko'rsatiladi.</p>
          </div>
        </article>
      </aside>
    </main>
  </div>
`;

const $ = (sel) => document.querySelector(sel);

const el = {
  connectWallet: $("#connect-wallet"),
  addNetwork: $("#add-network"),
  walletStatus: $("#wallet-status"),
  networkStatus: $("#network-status"),
  deployStatus: $("#deploy-status"),
  toast: $("#app-toast"),
  toastIcon: $("#toast-icon"),
  toastText: $("#toast-text"),
  toastClose: $("#toast-close"),
  consoleOutput: $("#console-output"),
  consoleClear: $("#console-clear"),
  errorOutput: $("#error-output"),
  errorClear: $("#error-clear"),
  gasLimit: $("#gas-limit"),
  gasPrice: $("#gas-price"),
  greetingCurrent: $("#greeting-current"),
  greetingInput: $("#greeting-input"),
  greetingRefresh: $("#greeting-refresh"),
  greetingSet: $("#greeting-set"),
  studentId: $("#student-id"),
  studentAge: $("#student-age"),
  studentName: $("#student-name"),
  studentAdd: $("#student-add"),
  studentSearchId: $("#student-search-id"),
  studentGet: $("#student-get"),
  studentResult: $("#student-result"),
  candidateName: $("#candidate-name"),
  candidateAdd: $("#candidate-add"),
  voteCandidateId: $("#vote-candidate-id"),
  voteSubmit: $("#vote-submit"),
  winnerRefresh: $("#winner-refresh"),
  candidateCount: $("#candidate-count"),
  winnerResult: $("#winner-result"),
};

const CHAIN_ID = 31337;
const CHAIN_ID_HEX = "0x7a69";

const state = {
  config: null,
  web3Read: null,
  web3Write: null,
  readContracts: null,
  writeContracts: null,
  account: null,
};

function shortAddr(addr) {
  if (!addr) return "-";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function timeNow() {
  return new Date().toLocaleTimeString("uz-UZ", { hour12: false });
}

function showToast(text, tone = "info") {
  const icons = { success: "OK", error: "ERR", info: "INFO" };
  el.toastIcon.textContent = icons[tone] || "INFO";
  el.toastText.textContent = text;
  el.toast.hidden = false;
  el.toast.dataset.tone = tone;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    el.toast.hidden = true;
  }, 8000);
}

function logConsole(msg, tag = "info") {
  const placeholder = el.consoleOutput.querySelector(".console-placeholder");
  if (placeholder) placeholder.remove();

  const line = document.createElement("p");
  line.className = "console-line";
  line.innerHTML = `
    <span class="timestamp">${timeNow()}</span>
    <span class="tag tag-${tag}">${tag}</span>
    <span class="msg">${msg}</span>
  `;
  el.consoleOutput.appendChild(line);
  el.consoleOutput.scrollTop = el.consoleOutput.scrollHeight;
  console.log(`[${tag.toUpperCase()}] ${msg}`);
}

function handleError(error, context = "Noma'lum") {
  const placeholder = el.errorOutput.querySelector(".error-placeholder");
  if (placeholder) placeholder.remove();

  let errorMessage = "";
  let errorType = "Error";

  if (typeof error === "string") {
    errorMessage = error;
  } else if (error?.data?.message) {
    errorMessage = error.data.message;
    errorType = "ContractError";
  } else if (error?.message?.includes("execution reverted")) {
    errorMessage = error.message;
    errorType = "RevertError";
    const match = error.message.match(/reason string "(.+?)"/);
    if (match) errorMessage = match[1];
  } else if (error?.code === 4001) {
    errorMessage = "Foydalanuvchi tranzaksiyani rad etdi (MetaMask)";
    errorType = "UserRejected";
  } else if (error?.code === -32603) {
    errorMessage = error?.data?.message || error.message || "Internal RPC xatoligi";
    errorType = "RPCError";
  } else if (error?.code === -32002) {
    errorMessage = "MetaMask allaqachon so'rovni qayta ishlamoqda";
    errorType = "PendingRequest";
  } else if (error?.code === 4902) {
    errorMessage = "Bu tarmoq MetaMask ga qo'shilmagan";
    errorType = "ChainError";
  } else {
    errorMessage = error?.reason || error?.message || String(error);
  }

  const line = document.createElement("div");
  line.className = "error-line";
  line.innerHTML = `
    <span class="err-type">${errorType} | ${context}</span>
    <span class="err-msg">${errorMessage}</span>
    <span class="err-time">${timeNow()}</span>
  `;
  el.errorOutput.appendChild(line);
  el.errorOutput.scrollTop = el.errorOutput.scrollHeight;

  showToast(`${context}: ${errorMessage}`, "error");
  console.error(`[${errorType}] (${context})`, error);
}

function getGasOptions() {
  const opts = {};
  const limitVal = el.gasLimit.value.trim();
  if (limitVal && Number(limitVal) > 0) {
    opts.gas = String(Number(limitVal));
    logConsole(`Gas limit qo'lda belgilandi: ${opts.gas}`, "info");
  }

  const priceVal = el.gasPrice.value.trim();
  if (priceVal && Number(priceVal) > 0) {
    opts.gasPrice = Web3.utils.toWei(priceVal, "gwei");
    logConsole(`Gas price belgilandi: ${priceVal} Gwei`, "info");
  }

  return opts;
}

function createContract(web3Instance, abi, address) {
  return new web3Instance.eth.Contract(abi, address);
}

function buildContracts(web3Instance) {
  const { contracts } = state.config;
  return {
    greeting: createContract(web3Instance, contracts.Greeting.abi, contracts.Greeting.address),
    studentRegistry: createContract(web3Instance, contracts.StudentRegistry.abi, contracts.StudentRegistry.address),
    voting: createContract(web3Instance, contracts.Voting.abi, contracts.Voting.address),
  };
}

async function loadConfig() {
  try {
    const resp = await fetch("/contracts.json", { cache: "no-store" });
    if (!resp.ok) throw new Error("contracts.json faylini topib bo'lmadi");

    const config = await resp.json();
    if (!config.deployed) throw new Error("Kontraktlar hali deploy qilinmagan");

    state.config = config;
    state.web3Read = new Web3(new Web3.providers.HttpProvider(config.rpcUrl));
    state.readContracts = buildContracts(state.web3Read);

    logConsole(`Web3 localhost providerga ulandi: ${config.rpcUrl}`, "info");
    logConsole(
      `Greeting ${shortAddr(config.contracts.Greeting.address)}, Student ${shortAddr(config.contracts.StudentRegistry.address)}, Voting ${shortAddr(config.contracts.Voting.address)}`,
      "info"
    );

    el.deployStatus.textContent = "Tayyor";
    el.networkStatus.textContent = "Localhost 31337";
    showToast("Kontraktlar muvaffaqiyatli yuklandi", "success");
  } catch (err) {
    el.deployStatus.textContent = "Topilmadi";
    handleError(err, "Config yuklash");
    throw err;
  }
}

async function addLocalhostNetwork() {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask topilmadi. Brauzerga MetaMask o'rnating.");
    }

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: CHAIN_ID_HEX,
        chainName: "Hardhat Localhost",
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: ["http://127.0.0.1:8545"],
      }],
    });

    logConsole("Localhost tarmoq MetaMask ga qo'shildi", "info");
    showToast("Localhost tarmoq qo'shildi", "success");
  } catch (err) {
    handleError(err, "Tarmoq qo'shish");
  }
}

async function switchToLocalhost() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_ID_HEX }],
    });
  } catch (switchErr) {
    if (switchErr.code === 4902) {
      await addLocalhostNetwork();
    } else {
      throw switchErr;
    }
  }
}

async function connectWallet() {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask topilmadi. Kengaytmani o'rnating.");
    }

    if (!state.config) {
      await loadConfig();
    }

    await switchToLocalhost();
    state.web3Write = new Web3(window.ethereum);

    const accounts = await state.web3Write.eth.requestAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error("MetaMask dan account olinmadi");
    }

    state.account = accounts[0];

    const chainId = await state.web3Write.eth.getChainId();
    if (Number(chainId) !== CHAIN_ID) {
      throw new Error(`Noto'g'ri tarmoq. Kutilgan ${CHAIN_ID}, hozirgi ${chainId}`);
    }

    state.writeContracts = buildContracts(state.web3Write);
    el.walletStatus.textContent = shortAddr(state.account);
    el.networkStatus.textContent = "MetaMask + Localhost";
    setWriteButtonsEnabled(true);

    logConsole(`Wallet ulandi: ${state.account}`, "info");

    const balanceWei = await state.web3Write.eth.getBalance(state.account);
    const balanceEth = Web3.utils.fromWei(balanceWei, "ether");
    logConsole(`Balans: ${Number(balanceEth).toFixed(4)} ETH`, "info");
    showToast("Wallet muvaffaqiyatli ulandi", "success");
  } catch (err) {
    handleError(err, "Wallet ulash");
  }
}

function setWriteButtonsEnabled(enabled) {
  [el.greetingSet, el.studentAdd, el.candidateAdd, el.voteSubmit].forEach((btn) => {
    btn.disabled = !enabled;
  });
}

async function refreshGreeting() {
  if (!state.readContracts) {
    handleError("Kontraktlar hali yuklanmagan", "Greeting o'qish");
    return;
  }

  try {
    const message = await state.readContracts.greeting.methods.getMessage().call();
    el.greetingCurrent.textContent = message;
    logConsole(`getMessage() => "${message}"`, "call");
  } catch (err) {
    el.greetingCurrent.textContent = "O'qib bo'lmadi";
    handleError(err, "Greeting o'qish");
  }
}

async function setGreeting() {
  const newMsg = el.greetingInput.value.trim();
  if (!newMsg) {
    handleError("Yangi xabar maydoni bo'sh", "Greeting yozish");
    return;
  }
  if (!state.writeContracts || !state.account) {
    handleError("Avval wallet ulang", "Greeting yozish");
    return;
  }

  el.greetingSet.disabled = true;
  el.greetingSet.classList.add("loading");

  try {
    const receipt = await state.writeContracts.greeting.methods.setMessage(newMsg).send({
      from: state.account,
      ...getGasOptions(),
    });

    logConsole(
      `setMessage muvaffaqiyatli. Tx ${shortAddr(receipt.transactionHash)}, block ${receipt.blockNumber}, gas ${receipt.gasUsed}`,
      "send"
    );
    el.greetingInput.value = "";
    showToast("Xabar yangilandi", "success");
    await refreshGreeting();
  } catch (err) {
    handleError(err, "Greeting yozish");
  } finally {
    el.greetingSet.disabled = false;
    el.greetingSet.classList.remove("loading");
  }
}

async function addStudent() {
  const id = el.studentId.value;
  const name = el.studentName.value.trim();
  const age = el.studentAge.value;

  if (!id || !name || !age) {
    handleError("ID, ism va yoshni to'ldiring", "Student qo'shish");
    return;
  }
  if (!state.writeContracts || !state.account) {
    handleError("Avval wallet ulang", "Student qo'shish");
    return;
  }

  el.studentAdd.disabled = true;
  el.studentAdd.classList.add("loading");

  try {
    const receipt = await state.writeContracts.studentRegistry.methods.addStudent(id, name, age).send({
      from: state.account,
      ...getGasOptions(),
    });

    logConsole(
      `addStudent muvaffaqiyatli. Tx ${shortAddr(receipt.transactionHash)}, block ${receipt.blockNumber}, gas ${receipt.gasUsed}`,
      "send"
    );
    el.studentId.value = "";
    el.studentName.value = "";
    el.studentAge.value = "";
    showToast("Talaba qo'shildi", "success");
  } catch (err) {
    handleError(err, "Student qo'shish");
  } finally {
    el.studentAdd.disabled = false;
    el.studentAdd.classList.remove("loading");
  }
}

async function getStudent() {
  const id = el.studentSearchId.value;
  if (!id) {
    handleError("Qidirish uchun ID kiriting", "Student qidirish");
    return;
  }
  if (!state.readContracts) {
    handleError("Kontraktlar yuklanmagan", "Student qidirish");
    return;
  }

  try {
    const result = await state.readContracts.studentRegistry.methods.getStudent(id).call();
    const display = `ID: ${result[0]} | Ism: ${result[1]} | Yosh: ${result[2]}`;
    el.studentResult.textContent = display;
    logConsole(`getStudent(${id}) => ${display}`, "call");
    showToast("Talaba ma'lumoti olindi", "success");
  } catch (err) {
    el.studentResult.textContent = "Topilmadi";
    handleError(err, "Student qidirish");
  }
}

async function refreshVoting() {
  if (!state.readContracts) return;

  try {
    const count = await state.readContracts.voting.methods.getCandidateCount().call();
    el.candidateCount.textContent = count.toString();
    logConsole(`getCandidateCount() => ${count}`, "call");
  } catch {
    el.candidateCount.textContent = "0";
  }

  try {
    const winner = await state.readContracts.voting.methods.getWinner().call();
    const display = `ID: ${winner[0]} | ${winner[1]} | Ovozlar: ${winner[2]}`;
    el.winnerResult.textContent = display;
    logConsole(`getWinner() => ${display}`, "call");
  } catch {
    el.winnerResult.textContent = "Hozircha g'olib yo'q";
  }
}

async function addCandidate() {
  const name = el.candidateName.value.trim();
  if (!name) {
    handleError("Nomzod ismini kiriting", "Nomzod qo'shish");
    return;
  }
  if (!state.writeContracts || !state.account) {
    handleError("Avval wallet ulang", "Nomzod qo'shish");
    return;
  }

  el.candidateAdd.disabled = true;
  el.candidateAdd.classList.add("loading");

  try {
    const receipt = await state.writeContracts.voting.methods.addCandidate(name).send({
      from: state.account,
      ...getGasOptions(),
    });

    logConsole(
      `addCandidate muvaffaqiyatli. Tx ${shortAddr(receipt.transactionHash)}, block ${receipt.blockNumber}, gas ${receipt.gasUsed}`,
      "send"
    );
    el.candidateName.value = "";
    showToast("Nomzod qo'shildi", "success");
    await refreshVoting();
  } catch (err) {
    handleError(err, "Nomzod qo'shish");
  } finally {
    el.candidateAdd.disabled = false;
    el.candidateAdd.classList.remove("loading");
  }
}

async function vote() {
  const candidateId = el.voteCandidateId.value;
  if (candidateId === "") {
    handleError("Candidate ID kiriting", "Ovoz berish");
    return;
  }
  if (!state.writeContracts || !state.account) {
    handleError("Avval wallet ulang", "Ovoz berish");
    return;
  }

  el.voteSubmit.disabled = true;
  el.voteSubmit.classList.add("loading");

  try {
    const receipt = await state.writeContracts.voting.methods.vote(candidateId).send({
      from: state.account,
      ...getGasOptions(),
    });

    logConsole(
      `vote muvaffaqiyatli. Tx ${shortAddr(receipt.transactionHash)}, block ${receipt.blockNumber}, gas ${receipt.gasUsed}`,
      "send"
    );
    showToast("Ovoz muvaffaqiyatli berildi", "success");
    await refreshVoting();
  } catch (err) {
    handleError(err, "Ovoz berish");
  } finally {
    el.voteSubmit.disabled = false;
    el.voteSubmit.classList.remove("loading");
  }
}

function registerEvents() {
  el.connectWallet.addEventListener("click", connectWallet);
  el.addNetwork.addEventListener("click", addLocalhostNetwork);
  el.toastClose.addEventListener("click", () => {
    el.toast.hidden = true;
  });
  el.consoleClear.addEventListener("click", () => {
    el.consoleOutput.innerHTML = '<p class="console-placeholder">Konsol tozalandi.</p>';
  });
  el.errorClear.addEventListener("click", () => {
    el.errorOutput.innerHTML = '<p class="error-placeholder">Xatoliklar tozalandi.</p>';
  });
  el.greetingRefresh.addEventListener("click", refreshGreeting);
  el.greetingSet.addEventListener("click", setGreeting);
  el.studentAdd.addEventListener("click", addStudent);
  el.studentGet.addEventListener("click", getStudent);
  el.candidateAdd.addEventListener("click", addCandidate);
  el.voteSubmit.addEventListener("click", vote);
  el.winnerRefresh.addEventListener("click", refreshVoting);

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      logConsole(`Account o'zgardi: ${accounts[0] || "Ulanmagan"}`, "info");
      window.location.reload();
    });
    window.ethereum.on("chainChanged", (chainId) => {
      logConsole(`Chain o'zgardi: ${chainId}`, "info");
      window.location.reload();
    });
  }
}

async function bootstrap() {
  logConsole("Blockchain Studio Dashboard ishga tushirilmoqda...", "info");
  setWriteButtonsEnabled(false);
  registerEvents();

  try {
    await loadConfig();
    await refreshGreeting();
    await refreshVoting();
  } catch {
    el.greetingCurrent.textContent = "Deploy kutilmoqda";
    el.studentResult.textContent = "Deploy kutilmoqda";
    el.winnerResult.textContent = "Deploy kutilmoqda";
  }
}

bootstrap();
