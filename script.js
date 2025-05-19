/* ===== データ ===== */
const FOODS = [
  "マメミート","とくせんリンゴ","げきからハーブ","モーモーミルク",
  "あまいミツ","ワカクサ大豆","ワカクサコーン","めざましコーヒー",
];
const SKILLS = [
  "睡眠EXPボーナス","おてつだいボーナス","げんき回復ボーナス","ゆめのかけらボーナス",
  "リサーチEXPボーナス","きのみの数S","スキルレベルアップM","スキルレベルアップS",
  "最大所持数アップL","最大所持数アップM","おてつだいスピードM","食材確率アップM",
  "スキル確率アップM","最大所持数アップS","おてつだいスピードS","食材確率アップS",
  "スキル確率アップS",
];

/* ===== DOM取得 ===== */
const foodArea = document.getElementById("food-slots");
const skillArea = document.getElementById("skill-slots");
const seedCountEl = document.getElementById("seed-count");
const resetBtn = document.getElementById("reset-btn");
const shareBtn = document.getElementById("share-btn");
const toast = document.getElementById("toast");
const modal = document.getElementById("modal");
const optionGrid = document.getElementById("option-grid");
const modalTitle = document.getElementById("modal-title");
const closeModalBtn = document.getElementById("close-modal");

let seedCount = 0;
let currentEditTarget = null;   // 編集中スロットDOM
let currentType = "";           // "food" or "skill"

/* ===== スロット生成 ===== */
function createSlot(type){
  const slot=document.createElement("div");
  slot.className="slot";
  if(type==="skill")slot.classList.add("skill");

  const span=document.createElement("span");
  span.textContent="";

  // reroll
  const roll=document.createElement("button");
  roll.className="roll-btn";
  roll.textContent="↻";
  roll.title="reroll";
  roll.addEventListener("click",()=>reroll(span,type));

  // edit
  const edit=document.createElement("button");
  edit.className="edit-btn";
  edit.textContent="✎";
  edit.title="手動選択";
  edit.addEventListener("click",()=>{
    openModal(span,type);
  });

  slot.append(span,roll,edit);
  return slot;
}
for(let i=0;i<3;i++) foodArea.appendChild(createSlot("food"));
for(let i=0;i<5;i++) skillArea.appendChild(createSlot("skill"));

/* ===== 機能 ===== */
function reroll(span,type){
  const list=type==="food"?FOODS:SKILLS;
  const prev=span.textContent;
  let next;
  do{ next=list[Math.floor(Math.random()*list.length)]; }while(next===prev);
  span.textContent=next;
  seedCount++; seedCountEl.value=seedCount;
}

function resetAll(){
  document.querySelectorAll(".slot span").forEach(s=>s.textContent="");
  seedCount=0; seedCountEl.value=0;
}

function shareState(){
  const foods=[...foodArea.querySelectorAll("span")].map(s=>s.textContent||"―");
  const skills=[...skillArea.querySelectorAll("span")].map(s=>s.textContent||"―");
  const text=`【ひらめきのたねシュミレーター】\n使用回数：${seedCount}\n\n🧄食材\n1:${foods[0]} 2:${foods[1]} 3:${foods[2]}\n\n🔧サブスキル\n10:${skills[0]}\n25:${skills[1]}\n50:${skills[2]}\n75:${skills[3]}\n100:${skills[4]}\n`;
  if(navigator.share){
    navigator.share({title:"ひらめきのたねシュミレーター",text})
      .catch(()=>showToast("共有をキャンセルしました"));
  }else{
    copyToClipboard(text);
    showToast("内容をコピーしました！");
  }
}
function copyToClipboard(str){
  navigator.clipboard?.writeText(str).catch(()=>{
    const ta=document.createElement("textarea"); ta.value=str;
    document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
  });
}
function showToast(msg){
  toast.textContent=msg; toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2500);
}

/* ===== モーダル：手動選択 ===== */
function openModal(span,type){
  currentEditTarget=span;
  currentType=type;
  optionGrid.innerHTML="";
  const list=type==="food"?FOODS:SKILLS;
  modalTitle.textContent=type==="food"?"食材を選択":"サブスキルを選択";
  list.forEach(item=>{
    const btn=document.createElement("button");
    btn.className="option-btn";
    btn.textContent=item;
    btn.addEventListener("click",()=>{
      span.textContent=item;
      closeModal();
    });
    optionGrid.appendChild(btn);
  });
  modal.classList.add("show");
}
function closeModal(){ modal.classList.remove("show"); currentEditTarget=null; }

/* ===== イベント ===== */
resetBtn.addEventListener("click",resetAll);
shareBtn.addEventListener("click",shareState);
closeModalBtn.addEventListener("click",closeModal);
modal.addEventListener("click",e=>{ if(e.target===modal) closeModal(); }); // 背景タップで閉じる
