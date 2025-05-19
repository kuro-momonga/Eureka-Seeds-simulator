/* ========= master data ========= */
const FOODS = [
  { name:"マメミート",      img:"img/マメミート.png" },
  { name:"とくせんリンゴ",  img:"img/とくせんリンゴ.png" },
  { name:"げきからハーブ",  img:"img/げきからハーブ.png" },
  { name:"モーモーミルク",  img:"img/モーモーミルク.png" },
  { name:"あまいミツ",      img:"img/あまいミツ.png" },
  { name:"ワカクサ大豆",    img:"img/ワカクサ大豆.png" },
  { name:"ワカクサコーン",  img:"img/ワカクサコーン.png" },
  { name:"めざましコーヒー",img:"img/めざましコーヒー.png" }
];

const YELLOW = [
  "睡眠EXPボーナス","おてつだいボーナス","げんき回復ボーナス",
  "ゆめのかけらボーナス","リサーチEXPボーナス","きのみの数S",
  "スキルレベルアップM"
];
const BLUE = [
  "スキルレベルアップS","最大所持数アップL","最大所持数アップM",
  "おてつだいスピードM","食材確率アップM","スキル確率アップM"
];
const SKILLS = [...YELLOW, ...BLUE];                  // ← 白背景スキルは存在しないので、色付けなしで OK

/* ========= dom ========= */
const seedCountEl = document.getElementById("seed-count");
const toast = document.getElementById("toast");
const modal = document.getElementById("modal");
const slotTabs = document.getElementById("slot-tabs");
const optionGrid = document.getElementById("option-grid");
const closeModalBtn = document.getElementById("close-modal");

const foodImgs  = [...document.querySelectorAll(".food-slot img")];
const foodNames = [...document.querySelectorAll(".food-slot p")];
const skillSpans= [...document.querySelectorAll(".skill-slot span")];
const skillSlots= [...document.querySelectorAll(".skill-slot")];

let seedCount = 0;
let editType  = "food";   // or "skill"
let currentIdx = 0;

/* ========= helpers ========= */
const showToast = msg => {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"), 2200);
};
const randExcept = (list, set) => {
  let v;
  do{ v = list[Math.floor(Math.random()*list.length)]; }while(set.has(v));
  return v;
};
const incSeed = () => { seedCount++; seedCountEl.value = seedCount; };
const setSkill = (idx, name) => {
  skillSpans[idx].textContent = name;
  skillSlots[idx].classList.remove("yellow","blue");
  if (YELLOW.includes(name)) skillSlots[idx].classList.add("yellow");
  else if (BLUE.includes(name)) skillSlots[idx].classList.add("blue");
};

/* ========= roll buttons ========= */
document.querySelectorAll(".roll-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const type = btn.dataset.type;
    const idx  = +btn.dataset.idx;

    if(type==="food"){
      const prev = foodImgs[idx].dataset.name || "";
      const choiceName = randExcept(FOODS.map(f=>f.name), new Set([prev]));
      const obj = FOODS.find(f=>f.name===choiceName);
      foodImgs[idx].src = obj.img;
      foodImgs[idx].dataset.name = obj.name;
      foodNames[idx].textContent = obj.name;

    }else{ // skill
      const used = new Set(skillSpans.map(s=>s.textContent));
      const prev = skillSpans[idx].textContent;
      used.delete(prev);
      const choice = randExcept([...SKILLS, ""], used); // 空白も出る
      setSkill(idx, choice);
    }
    incSeed();
  });
});

/* ========= section-edit buttons ========= */
document.querySelectorAll(".section-edit").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    editType = btn.dataset.type;
    currentIdx = 0;
    buildModal();
    modal.classList.add("show");
  });
});

/* ========= modal ========= */
function buildTabs(count, labels){
  slotTabs.innerHTML="";
  labels.forEach((lab,i)=>{
    const b=document.createElement("button");
    b.textContent=lab;
    b.className="slot-tab-btn"+(i===0?" active":"");
    b.addEventListener("click", ()=>{
      currentIdx=i;
      [...slotTabs.children].forEach((c,idx)=>c.classList.toggle("active", idx===i));
      renderOptions();
    });
    slotTabs.appendChild(b);
  });
}
function buildModal(){
  optionGrid.innerHTML="";
  if(editType==="food"){
    buildTabs(3, ["第1","第2","第3"]);
  }else{
    buildTabs(5, ["10","25","50","75","100"]);
  }
  renderOptions();
}
function renderOptions(){
  optionGrid.innerHTML="";
  if(editType==="food"){
    FOODS.forEach(f=>{
      const b=document.createElement("button");
      b.className="option-btn";
      b.textContent = f.name;
      b.addEventListener("click", ()=>{
        foodImgs[currentIdx].src = f.img;
        foodImgs[currentIdx].dataset.name = f.name;
        foodNames[currentIdx].textContent = f.name;
        modal.classList.remove("show");
      });
      optionGrid.appendChild(b);
    });
  }else{ // skill
    const used = new Set(skillSpans.map(s=>s.textContent));
    used.delete(skillSpans[currentIdx].textContent);
    [...SKILLS, ""].forEach(sk=>{
      const b=document.createElement("button");
      b.className="option-btn";
      if(YELLOW.includes(sk)) b.classList.add("yellow");
      else if(BLUE.includes(sk)) b.classList.add("blue");
      b.textContent = sk || "(なし)";
      if(used.has(sk)) b.disabled = true;
      b.addEventListener("click", ()=>{
        setSkill(currentIdx, sk);
        modal.classList.remove("show");
      });
      optionGrid.appendChild(b);
    });
  }
}
closeModalBtn.addEventListener("click", ()=>modal.classList.remove("show"));
modal.addEventListener("click", e=>{ if(e.target===modal) modal.classList.remove("show"); });

/* ========= reset & share ========= */
document.getElementById("reset-btn").addEventListener("click", ()=>{
  foodImgs.forEach(i=>{ i.src=""; i.dataset.name=""; });
  foodNames.forEach(p=>p.textContent="");
  skillSpans.forEach(s=>s.textContent="");
  skillSlots.forEach(sl=>sl.classList.remove("yellow","blue"));
  seedCount = 0;
  seedCountEl.value = 0;
});

document.getElementById("share-btn").addEventListener("click", ()=>{
  const foods  = foodImgs.map(i=>i.dataset.name||"―");
  const skills = skillSpans.map(s=>s.textContent||"―");
  const text =
`【ひらめきのたねシュミレーター】
回数:${seedCount}

🧄食材
1:${foods[0]} 2:${foods[1]} 3:${foods[2]}

🔧サブスキル
10:${skills[0]} 25:${skills[1]} 50:${skills[2]}
75:${skills[3]} 100:${skills[4]}
`;
  if(navigator.share){
    navigator.share({title:"ひらめきのたねシュミレーター",text}).catch(()=>{});
  }else{
    navigator.clipboard?.writeText(text).then(()=>showToast("コピーしました！"));
  }
});
