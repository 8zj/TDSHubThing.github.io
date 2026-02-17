
const TOWER_LIST = [
    "Scout", "Sniper", "Paintballer", "Demoman", "Hunter",
    "Soldier", "Freezer", "Ace Pilot", "Medic", "Pyromancer",
    "Militant", "Shotgunner", "Farm", "Military Base", "Crook Boss",
    "Electroshocker", "Rocketeer", "Commander", "DJ Booth", "Minigunner",
    "Ranger", "Turret", "Mortar", "Pursuit", "Accelerator",
    "Engineer", "Gladiator", "Sledger", "Executioner", "Toxic Gunner",
    "Swarmer", "Frost Blaster", "Archer", "Commando", "Slasher",
    "Elf Camp", "Necromancer", "Mercenary Base", "Gatling Gun"
].sort();

let currentLoadout = [null, null, null, null, null];
let selectedTower = null;

const towerGrid = document.getElementById('tower-grid');
const loadoutContainer = document.getElementById('loadout-container');
const toast = document.getElementById('toast');
const modal = document.getElementById('equip-modal');

function init() {
    renderTowers(TOWER_LIST);
    setupEventListeners();
    updateLoadoutUI();
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
            
            item.classList.add('active');
            const viewId = item.getAttribute('data-view');
            document.getElementById(viewId).classList.add('active');
        });
    });
}

function renderTowers(towers) {
    towerGrid.innerHTML = '';
    towers.forEach(tower => {
        const el = document.createElement('div');
        el.className = 'tower-item';
        el.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">${tower}</div>
            <div style="font-size: 0.8rem; color: #aaa;">Tower</div>
        `;
        el.onclick = () => openEquipModal(tower);
        towerGrid.appendChild(el);
    });
}

function updateLoadoutUI() {
    loadoutContainer.innerHTML = '';
    currentLoadout.forEach((tower, index) => {
        const slot = document.createElement('div');
        slot.className = 'loadout-slot';
        slot.textContent = tower || `Slot ${index + 1}`;
        if (tower) {
            slot.style.borderColor = '#5865F2';
            slot.style.color = '#fff';
        }
        slot.onclick = () => {
            if (tower) {
                if(confirm(`Remove ${tower} from slot ${index+1}?`)) {
                    currentLoadout[index] = null;
                    updateLoadoutUI();
                }
            } else {
                document.querySelector('[data-view="towers"]').click();
            }
        };
        loadoutContainer.appendChild(slot);
    });
}

function openEquipModal(tower) {
    selectedTower = tower;
    document.getElementById('modal-tower-name').textContent = tower;
    modal.style.display = 'flex';
}

function closeEquipModal() {
    modal.style.display = 'none';
    selectedTower = null;
}

function equipToSlot(slotIndex) {
    if (selectedTower) {
        currentLoadout[slotIndex] = selectedTower;
        updateLoadoutUI();
        closeEquipModal();
        showToast(`Equipped ${selectedTower} to Slot ${slotIndex + 1}`, 'success');
    }
}

function generateCode() {
    const config = {
        Automation: {
            AutoChain: document.getElementById('autochain').checked,
            AutoDJ: document.getElementById('autodj').checked,
            AutoNecro: document.getElementById('autonecro').checked,
            AutoAPC: document.getElementById('autoapc').checked,
            AutoMilitary: document.getElementById('automilitary').checked,
            AutoMercenary: document.getElementById('automercenary').checked
        },
        Visuals: {
            PlayerESP: document.getElementById('pesp').checked,
            ZombieESP: document.getElementById('zesp').checked,
            WorldEnabled: document.getElementById('world-enabled').checked,
            ClockTime: parseFloat(document.getElementById('world-time').value)
        },
        Loadout: currentLoadout.filter(t => t !== null)
    };

    const json = JSON.stringify(config);
    const b64 = btoa(json);
    
    const output = document.getElementById('config-output');
    output.value = b64;
    output.select();
    showToast("Code Generated!", "success");
}

function attemptLogin() {
    const input = document.getElementById('access-code');
    const status = document.getElementById('login-status');
    const overlay = document.getElementById('login-overlay');
    const code = input.value.trim();

    if (!code) {
        status.textContent = "Please enter a code.";
        status.style.color = "var(--danger)";
        return;
    }

    status.textContent = "Verifying...";
    status.style.color = "var(--text-secondary)";
    input.disabled = true;

    setTimeout(() => {
        if (code.length >= 4) { 
            status.textContent = "Success! Logging in...";
            status.style.color = "var(--success)";
            
            setTimeout(() => {
                overlay.style.opacity = '0';
                overlay.querySelector('.login-box').style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 500);
            }, 800);
        } else {
            status.textContent = "Invalid Code. Please try again.";
            status.style.color = "var(--danger)";
            input.disabled = false;
            input.value = "";
            input.focus();
        }
    }, 1500);
}

function copyCode() {
    const output = document.getElementById('config-output');
    if (!output.value) return;
    output.select();
    document.execCommand('copy');
    showToast("Copied to Clipboard!", "success");
}

function showToast(msg, type = 'info') {
    toast.textContent = msg;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

function setupEventListeners() {
    document.getElementById('search-input').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = TOWER_LIST.filter(t => t.toLowerCase().includes(term));
        renderTowers(filtered);
    });

    document.getElementById('close-modal').onclick = closeEquipModal;
    window.onclick = (e) => {
        if (e.target === modal) closeEquipModal();
    };
}

init();
