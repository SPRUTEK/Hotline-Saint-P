const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const data = await p.evaluate(() => {
    const S = 64, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d');
    const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    // фон: скруглённый квадрат, ночное небо
    g.save(); g.beginPath(); g.roundRect(1, 1, 62, 62, 10); g.clip();
    const sky = g.createLinearGradient(0, 0, 0, 64); sky.addColorStop(0, '#12052e'); sky.addColorStop(.7, '#5a1070'); sky.addColorStop(.72, '#0a0418'); sky.addColorStop(1, '#1a0630');
    R(0, 0, 64, 64, sky);
    // звёзды и луна
    [[8,6],[14,14],[50,9],[57,20],[6,24],[44,4],[24,8]].forEach(([x,y])=>R(x,y,1,1,'#ffd6f5'));
    g.fillStyle = '#ff9ee0'; g.beginPath(); g.arc(50, 14, 6, 0, 7); g.fill(); g.fillStyle = '#ffc8ee'; g.beginPath(); g.arc(49, 13, 4, 0, 7); g.fill();
    
    const H = 46, body = '#1d0a3d', N1 = '#00f0ff', N2 = '#ff2fa8', GOLD = '#ffd23f', G2 = '#fff3a0';
    const out = (x, y, w, h, col) => { R(x, y, w, 1, col); R(x, y, 1, h, col); R(x + w - 1, y, 1, h, col); };
    // собор: длинный корпус влево, колокольня справа от центра
    R(6, 38, 26, H - 38, body); out(6, 38, 26, H - 38, N2);
    g.fillStyle = body; g.beginPath(); g.moveTo(6, 38); g.lineTo(13, 34); g.lineTo(20, 38); g.fill();
    R(7, 37, 1, 1, N2); R(9, 36, 1, 1, N2); R(11, 35, 1, 1, N2); R(13, 34, 1, 1, N2); R(15, 35, 1, 1, N2); R(17, 36, 1, 1, N2); R(19, 37, 1, 1, N2);
    // малый купол с крестом
    g.fillStyle = body; g.beginPath(); g.arc(24, 38, 4, Math.PI, 0); g.fill(); R(24, 31, 1, 3, GOLD); R(23, 32, 3, 1, GOLD);
    // колокольня
    R(30, 30, 12, H - 30, body); out(30, 30, 12, H - 30, N1);
    R(32, 25, 8, 5, body); out(32, 25, 8, 5, N2);
    R(33, 21, 6, 4, body); out(33, 21, 6, 4, N1);
    [32, 35, 38].forEach(x => R(x, 33, 2, 5, '#ff7ad9'));
    [34, 37].forEach(x => R(x, 26, 1, 3, '#7ff9ff'));
    // золотая главка и длинная игла
    R(34, 18, 4, 3, GOLD); R(35, 17, 2, 1, GOLD);
    g.shadowColor = '#ffb000'; g.shadowBlur = 3;
    R(35, 8, 2, 9, GOLD); R(35, 8, 1, 9, G2);
    g.shadowBlur = 0;
    // ангел с крестом
    R(35, 5, 2, 3, G2); R(34, 6, 4, 1, G2); R(36, 4, 1, 1, G2);
    // набережная
    R(0, H, 64, 1, N2); R(0, H + 1, 64, 1, '#7a1f8f');
    // отражение в Неве
    for (let y = H + 3; y < 64; y += 2) {
      const t = (y - H) / (64 - H), wob = ((y >> 1) % 2) ? 1 : -1;
      g.globalAlpha = .7 * (1 - t);
      R(35 + wob, y, 2, 1, GOLD);
      g.globalAlpha = .45 * (1 - t);
      R(30 + wob, y, 12, 1, N1); R(6 - wob, y, 26, 1, N2);
    }
g.globalAlpha = 1;
    g.restore();
    // неоновая рамка
    g.lineWidth = 2; g.strokeStyle = '#ff2fa8'; g.shadowColor = '#ff2fa8'; g.shadowBlur = 3; g.beginPath(); g.roundRect(1, 1, 62, 62, 10); g.stroke();
    const o = document.createElement('canvas'); o.width = o.height = 512; const og = o.getContext('2d'); og.imageSmoothingEnabled = false; og.drawImage(c, 0, 0, 512, 512);
    return o.toDataURL('image/png');
  });
  require('fs').writeFileSync(process.argv[2], Buffer.from(data.split(',')[1], 'base64')); await b.close();
})();
