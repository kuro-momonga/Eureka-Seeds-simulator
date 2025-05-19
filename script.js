/* ===== データ ===== */
const FOODS = [
  { name:"マメミート",      img:"img/マメミート.png" },
  { name:"とくせんリンゴ",  img:"img/とくせんリンゴ.png" },
  { name:"げきからハーブ",  img:"img/げきからハーブ.png" },
  { name:"モーモーミルク",  img:"img/モーモーミルク.png" },
  { name:"あまいミツ",      img:"img/あまいミツ.png" },
  { name:"ワカクサ大豆",    img:"img/ワカクサ大豆.png" },
  { name:"ワカクサコーン",  img:"img/ワカクサコーン.png" },
  { name:"めざましコーヒー",img:"img/めざましコーヒー.png" },
];

const YELLOW_SKILLS = [
  "睡眠EXPボーナス","おてつだいボーナス","げんき回復ボーナス","ゆめのかけらボーナス",
  "リサーチEXPボーナス","きのみの数S","スキルレベルアップM"
];
const BLUE_SKILLS = [
  "スキルレベルアップS","最大所持数アップL","最大所持数アップM","おてつだいスピードM",
  "食材確率アップM","スキル確率アップM"
];
const SKILLS = [...YELLOW_SKILLS, ...BLUE_SKILLS];

/* ===== DOM ===== */
const seedCountEl = document.getElementById("seed-count");
const toast = document.getElementById("toast");
const modal = document.getElementById("modal");
const optionGrid = document.getElementById("option-grid");
const closeModalBtn = document.getElementById("close-modal");

let seedCount = 0;

/* ===== 共通 ===== */
function showToast(msg){
  toast.textContent=msg; toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2500);
}
function incSeed(){ seedCount++; seedCountEl.value = seedCount; }

/* ===== スロット取得ヘルパ ===== */
const foodImgs = document.querySelectorAll(".food-slot img");
const foodNames = document.querySelectorAll(".food-slot p");
const rollBtns  = document.querySelectorAll(".roll-btn");
const editBtns  = document.querySelectorAll(".edit-btn");
const skillSpans= document.querySelectorAll(".skill-slot span");
const skillSlots= document.querySelectorAll(".skill-slot");

/* ===== 抽選ロジック ===== */
function randExcept(list, exceptSet){
  let choice;
  do{ choice=list[Math.floor(Math.random()*list.length)]; }while(exceptSet.has(choice));
  return choice;
}

/* --- food reroll --- */
rollBtns.forEach(btn=>{
  btn.addEventListener("click",()=>{
    const idx = +btn.dataset.idx;
    if(btn.dataset.type!=="food") return; // スキル用は別で処理
    const prev = foodImgs[idx].dataset.name||"";
    const choice = randExcept(FOODS.map(f=>f.name), new Set([prev]));
    const obj = FOODS.find(f=>f.name===choice);
    foodImgs[idx].src=obj.img; foodImgs[idx].dataset.name=obj.name;
    foodNames[idx].textContent=obj.name;
    incSeed();
  });
});

/* --- skill reroll & 背景色付与 / 重複禁止 --- */
function applySkill(slotIdx, skillName){
  skillSpans[slotIdx].textContent=skillName;
  skillSlots[slotIdx].classList.toggle("yellow", YELLOW_SKILLS.includes(skillName));
  skillSlots[slotIdx].classList.toggle("blue",   BLUE_SKILLS.includes(skillName));
  skillSlots[slotIdx].classList.remove("yellow","blue"); // まず外してから再付与
  if(YELLOW_SKILLS.includes(skillName)) skillSlots[slotIdx].classList.add("yellow");
  else if(BLUE_SKILLS.includes(skillName)) skillSlots[slotIdx].classList.add("blue");
}

rollBtns.forEach(btn=>{
  if(btn.dataset.type!=="skill") return;
  btn.addEventListener("click",()=>{
    const idx = +btn.dataset.idx;
    const used = new Set([...skillSpans].map(s=>s.textContent));
    const prev = skillSpans[idx].textContent;
    used.delete(prev); // その枠の現スキルは除外
    const choice = randExcept(SKILLS, used);
    applySkill(idx, choice);
    incSeed();
  });
});

/* ===== 食材 手動選択 ===== */
let currentFoodIdx=0;
document.querySelectorAll(".food-select").forEach(btn=>{
  btn.addEventListener("click",()=>{
    currentFoodIdx=+btn.dataset.idx;
    openFoodModal();
  });
});
editBtns.forEach(btn=>{
  btn.addEventListener("click",()=>{
    currentFoodIdx=+btn.dataset.idx;
    openFoodModal();
  });
});
function openFoodModal(){
  optionGrid.innerHTML="";
  FOODS.forEach(f=>{
    const ob=document.createElement("button");
    ob.className="option-btn";
    ob.textContent=f.name;
    ob.addEventListener("click",()=>{
      foodImgs[currentFoodIdx].src=f.img;
      foodImgs[currentFoodIdx].dataset.name=f.name;
      foodNames[currentFoodIdx].textContent=f.name;
      modal.classList.remove("show");
    });
    optionGrid.appendChild(ob);
  });
  modal.classList.add("show");
}
function closeModal(){ modal.classList.remove("show"); }
closeModalBtn.addEventListener("click",closeModal);
modal.addEventListener("click",e=>{ if(e.target===modal) closeModal(); });

/* ===== Reset & Share ===== */
document.getElementById("reset-btn").addEventListener("click",()=>{
  foodImgs.forEach(i=>{ i.src=""; i.dataset.name=""; });
  foodNames.forEach(p=>p.textContent="");
  skillSpans.forEach(s=>s.textContent="");
  skillSlots.forEach(sl=>sl.classList.remove("yellow","blue"));
  seedCount=0; seedCountEl.value=0;
});
document.getElementById("share-btn").addEventListener("click",()=>{
  const foods=[...foodImgs].map(i=>i.dataset.name||"―");
  const skills=[...skillSpans].map(s=>s.textContent||"―");
  const text=`【ひらめきのたねシュミレーター】\n使用回数：${seedCount}\n\n🧄食材\n1:${foods[0]} 2:${foods[1]} 3:${foods[2]}\n\n🔧サブスキル\n10:${skills[0]}\n25:${skills[1]}\n50:${skills[2]}\n75:${skills[3]}\n100:${skills[4]}\n`;
  if(navigator.share){ navigator.share({title:"ひらめきのたねシュミレーター",text}).catch(()=>{}); }
  else{ navigator.clipboard?.writeText(text).then(()=>showToast("内容をコピーしました！")); }
});
