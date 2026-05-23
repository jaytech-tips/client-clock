const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  await page.goto('https://jaytech-tips.github.io/bilang/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Seed local storage and dismiss modals
  await page.evaluate(() => {
    localStorage.setItem('bilang_terms', '1');
    localStorage.setItem('bilang_tutorial', '1');
    localStorage.setItem('client_clock_data', JSON.stringify({
      sessions: [
        { id:'s1', client:'Maria Santos Design', rate:15, timestamp:'2026-05-20T09:00:00', start:1716181200, end:1716184800, duration:3600, status:'completed', notes:'Logo revision' },
        { id:'s2', client:'James Corp', rate:25, timestamp:'2026-05-20T14:00:00', start:1716199200, end:1716206400, duration:7200, status:'completed', notes:'Data entry' },
        { id:'s3', client:'Maria Santos Design', rate:15, timestamp:'2026-05-21T08:30:00', start:1716265800, end:1716271200, duration:5400, status:'completed', notes:'Social media graphics' },
        { id:'s4', client:'TechFlow Solutions', rate:20, timestamp:'2026-05-21T13:00:00', start:1716282000, end:1716289200, duration:7200, status:'completed' },
        { id:'s5', client:'James Corp', rate:25, timestamp:'2026-05-22T09:30:00', start:1716355800, end:1716361200, duration:5400, status:'completed', notes:'Report formatting' }
      ],
      settings: { defaultRate: 15, currency: '₱', darkMode: false, businessName: 'Jayvee Garcia', businessEmail: '' },
      clientRates: { 'Maria Santos Design': 15, 'James Corp': 25, 'TechFlow Solutions': 20 },
      presets: []
    }));
  });

  await page.goto('https://jaytech-tips.github.io/bilang/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  
  // Dismiss modals
  await page.evaluate(() => {
    document.querySelectorAll('.modal-overlay.active').forEach(el => el.classList.remove('active'));
  });
  await page.waitForTimeout(500);

  // Light screenshot
  await page.screenshot({ path: path.join(__dirname, 'bilang-light.png'), fullPage: false });
  console.log('Light saved');

  // Dark screenshot
  await page.evaluate(() => { toggleDark(); });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(__dirname, 'bilang-dark.png'), fullPage: false });
  console.log('Dark saved');

  // Generate invoice HTML, save to file, open with playwright
  const invoiceHtml = await page.evaluate(() => {
    const client = 'Maria Santos Design';
    const from = new Date('2026-05-18');
    const to = new Date('2026-05-23');
    to.setHours(23,59,59,999);
    const data = JSON.parse(localStorage.getItem('client_clock_data'));
    const sessions = data.sessions
      .filter(s => s.client===client && s.status!=='cancelled')
      .filter(s => {const d=new Date(s.timestamp); return d>=from && d<=to})
      .sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
    const cur = '₱';
    const bizName = 'Jayvee Garcia';
    const totalSec = sessions.reduce((t,s)=>t+s.duration,0);
    const totalAmt = sessions.reduce((t,s)=>t+(s.duration/3600)*s.rate,0);
    const invNum = 'INV-' + Date.now().toString(36).toUpperCase();
    const invDate = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
    const fDate = from.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    const tDate = to.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    const esc = s => {const d=document.createElement('div');d.textContent=s;return d.innerHTML};
    const fmtDec = s => {const h=Math.floor(s/3600),m=Math.floor((s%3600)/60);return h+'h '+m+'m'};
    const rows = sessions.map((s,i)=>{
      const d=new Date(s.timestamp).toLocaleDateString('en-US',{month:'short',day:'numeric'});
      const hrs=fmtDec(s.duration);
      const amt=((s.duration/3600)*s.rate).toFixed(2);
      const note=s.notes?` — ${esc(s.notes)}`:'';
      const lastRow=i===sessions.length-1?' style="border-bottom:2px solid #333"':'';
      return `<tr${lastRow}><td>${d}</td><td>${esc(s.client)}${note}</td><td style="text-align:center">${hrs}</td><td style="text-align:right">${cur}${s.rate.toFixed(2)}</td><td style="text-align:right">${cur}${amt}</td></tr>`;
    }).join('');
    const dueText = 'Payment due within 15 days';
    const t = s => esc(s);
    const h = (s,...v) => s.reduce((a,c,i)=>a+c+(v[i]||''),'');
    
    const html = h`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Invoice - ${t(client)}</title>
<style>@page{margin:20mm 15mm}*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Helvetica Neue',Arial,sans-serif;color:#222;font-size:11pt;line-height:1.5;padding:40px;max-width:800px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:start;margin-bottom:40px;padding-bottom:20px;border-bottom:3px solid #4361ee}.header .brand h1{font-size:22pt;color:#4361ee;margin-bottom:2px}.header .inv-info{text-align:right}.header .inv-info h2{font-size:16pt;color:#333;margin-bottom:4px}.header .inv-info p{font-size:9pt;color:#666}
.billing{display:flex;justify-content:space-between;margin-bottom:30px}.billing div{font-size:10pt}.billing .label{color:#888;font-size:8pt;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}.billing .val{font-weight:600}
table{width:100%;border-collapse:collapse;margin-bottom:20px;font-size:10pt}th{text-align:left;color:#888;font-size:8pt;text-transform:uppercase;letter-spacing:1px;padding:8px 4px;border-bottom:2px solid #ddd}td{padding:8px 4px;border-bottom:1px solid #eee}td:last-child,th:last-child{text-align:right}
.totals{margin-left:auto;width:280px;margin-top:10px}.totals .row{display:flex;justify-content:space-between;padding:6px 0;font-size:10pt}.totals .row.total{border-top:2px solid #333;padding-top:8px;margin-top:4px;font-size:13pt;font-weight:700}
.footer{margin-top:40px;padding-top:20px;border-top:1px solid #ddd;font-size:8pt;color:#888;text-align:center}.footer p{margin-bottom:2px}
@media print{body{padding:0} .no-print{display:none}}</style></head><body>
<div class="header"><div class="brand"><h1>${t(bizName)}</h1></div><div class="inv-info"><h2>INVOICE</h2><p>${invNum}</p><p>${invDate}</p></div></div>
<div class="billing"><div><div class="label">Bill To</div><div class="val">${t(client)}</div></div><div><div class="label">Period</div><div class="val">${fDate} — ${tDate}</div></div></div>
<table><thead><tr><th style="width:70px">Date</th><th>Description</th><th style="width:60px;text-align:center">Hours</th><th style="width:70px;text-align:right">Rate</th><th style="width:80px;text-align:right">Amount</th></tr></thead><tbody>${rows}</tbody></table>
<div class="totals"><div class="row"><span>Total Hours</span><span>${fmtDec(totalSec)}</span></div><div class="row total"><span>Total Due</span><span>${cur}${totalAmt.toFixed(2)}</span></div></div>
<div class="footer"><p>Thank you for your business!</p><p>${dueText}</p></div></body></html>`;
    
    return html;
  });

  if (invoiceHtml) {
    const invoicePath = path.join(__dirname, 'temp-invoice.html');
    fs.writeFileSync(invoicePath, invoiceHtml);
    console.log('Invoice HTML saved');
    
    // Open in new page and screenshot
    const invPage = await ctx.newPage();
    await invPage.goto('file://' + invoicePath, { waitUntil: 'networkidle' });
    await invPage.setViewportSize({ width: 800, height: 1100 });
    await invPage.waitForTimeout(500);
    await invPage.screenshot({ path: path.join(__dirname, 'bilang-invoice.png'), fullPage: true });
    await invPage.close();
    console.log('Invoice screenshot saved');
  }

  await browser.close();
})();
