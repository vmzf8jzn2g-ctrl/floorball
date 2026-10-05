const matches = [
  {date:"2026-10-04", opponent:"Pixbo IBF", score:"5–3", type:"Seriespel", event:"P13 Västra"},
  {date:"2026-09-27", opponent:"FBC Kalmarsund", score:"2–4", type:"Cup", event:"Gothia Innebandy Cup"},
  {date:"2026-09-26", opponent:"Warberg IC", score:"6–6", type:"Cup", event:"Gothia Innebandy Cup"},
  {date:"2026-09-26", opponent:"Lindås IBK", score:"4–2", type:"Cup", event:"Gothia Innebandy Cup"},
  {date:"2026-09-13", opponent:"Helsingborg IBF", score:"7–1", type:"Seriespel", event:"P13 Västra"},
  {date:"2026-09-06", opponent:"Malmö FBC", score:"3–5", type:"Seriespel", event:"P13 Västra"}
];

const $ = id => document.getElementById(id);
const resultClass = s => {
  const [a,b] = s.split("–").map(Number);
  return a>b ? "win" : a<b ? "loss" : "draw";
};
const fmt = d => new Intl.DateTimeFormat("sv-SE",{day:"numeric",month:"short",year:"numeric"}).format(new Date(d+"T12:00:00"));

function render(){
  const q=$("search").value.trim().toLowerCase(), type=$("type").value, year=$("year").value;
  const filtered=matches.filter(m =>
    (!q || `${m.opponent} ${m.event} ${m.type} ${m.date}`.toLowerCase().includes(q)) &&
    (!type || m.type===type) &&
    (!year || m.date.startsWith(year))
  ).sort((a,b)=>b.date.localeCompare(a.date));

  $("matches").innerHTML = filtered.length ? filtered.map(m => `
    <tr>
      <td>${fmt(m.date)}</td>
      <td><strong>${m.opponent}</strong></td>
      <td class="result ${resultClass(m.score)}">${m.score}</td>
      <td><span class="badge">${m.type}</span></td>
      <td>${m.event}</td>
    </tr>`).join("") :
    `<tr><td colspan="5" class="empty">Inga matcher hittades.</td></tr>`;

  const wins=filtered.filter(m=>resultClass(m.score)==="win").length;
  const draws=filtered.filter(m=>resultClass(m.score)==="draw").length;
  const losses=filtered.filter(m=>resultClass(m.score)==="loss").length;
  $("stats").innerHTML=[
    ["Matcher",filtered.length],["Vinster",wins],["Oavgjorda",draws],["Förluster",losses]
  ].map(x=>`<div class="stat"><b>${x[1]}</b><span>${x[0]}</span></div>`).join("");
}

[...new Set(matches.map(m=>m.date.slice(0,4)))].sort().reverse().forEach(y=>{
  const o=document.createElement("option"); o.value=y; o.textContent=y; $("year").appendChild(o);
});
["search","type","year"].forEach(id=>$(id).addEventListener("input",render));
render();