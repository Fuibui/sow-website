// pfp pixelizada muito foda SEXOOOOOO
function drawNormalImage(img) {
    const canvas = document.getElementById('ascii-canvas');
    const ctx = canvas.getContext('2d');
    

    canvas.width = 32;
    canvas.height = 32;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

const pfpSrc = document.getElementById('pfpSrc');
pfpSrc.onload = () => drawNormalImage(pfpSrc);
if (pfpSrc.complete) drawNormalImage(pfpSrc);


// lanyarddddddddddaids
(function lanyardConnect() {
    const WS = 'wss://api.lanyard.rest/socket';
    const statusColors = { online:'#57F287', idle:'#FEE75C', dnd:'#ED4245', offline:'#52555B' };
    const socket = new WebSocket(WS);
    let hb;
    socket.onopen = () => {
        socket.send(JSON.stringify({ op:2, d:{ subscribe_to_id:'616731583386353665' } }));
        hb = setInterval(() => socket.send(JSON.stringify({ op:3 })), 30000);
    };
    socket.onmessage = ({ data }) => {
        const { t, d } = JSON.parse(data);
        if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
            const pfp = document.getElementById('pfpSrc');
            const newSrc = `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png?size=256`;
            if (pfp.src !== newSrc) { pfp.src = newSrc; }
            document.getElementById('discordUser').textContent = '@' + d.discord_user.username;
            const dot = document.getElementById('statusDot');
            dot.style.background = statusColors[d.discord_status] || '#52555B';
        }
    };
    socket.onclose = () => { clearInterval(hb); setTimeout(lanyardConnect, 3000); };
})();


// steam games
async function loadGames() {
    const tree = document.getElementById('gamesTree');
    try {
       const res = await fetch('https://steamapi.sowisgone.workers.dev/');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const games = await res.json();

        if (!games.length) { 
            tree.innerHTML = '<span class="error-line">no games found.</span>'; 
            return; 
        }

        tree.innerHTML = ''; 

        games.forEach((g, i) => {
            const isLast = i === games.length - 1;
            const branch = document.createElement('div');
            branch.className = 'branch';
            branch.innerHTML = `
                <div class="game-line">
                    <span class="tree-icon">${isLast ? '└─' : '├─'}</span>
                    <span class="game-name" title="${g.name}">${g.name}</span>
                    <span class="game-stats">${g.hours}h &nbsp;|&nbsp; ${g.done}/${g.total} 🏆︎</span>
                </div>
                <div class="bar-wrap">
                    <div class="bar-bg" style="flex:1">
                        <div class="bar-fill" style="width:${g.pct}%"></div>
                    </div>
                    <span class="bar-pct">${g.pct}%</span>
                </div>`;
            tree.appendChild(branch);
        });
    } catch(e) {
        tree.innerHTML = `<span class="error-line">error: ${e.message}</span>`;
    }
}
loadGames();