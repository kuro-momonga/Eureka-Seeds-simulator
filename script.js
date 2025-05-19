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

const YELLOW = [
  "睡眠EXPボーナス","おてつだいボーナス","げんき回復ボーナス",
  "ゆめのかけらボーナス","リサーチEXPボーナス","きのみの数S",
  "スキルレベルアップM"
];
const BLUE = [
  "スキルレベルアップS","最大所持数アップL","最大所持数アップM",
  "おてつだいスピードM","食材確率アップM","スキル確率アップM"
];
const SKILLS = [...YELLOW, ...BLUE];

/* ===== DOM ===== */
const seedCountEl = document.getElementById("seed-count");
const toast = document.getElementById("toast");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const optionGrid = document.getElementById("option-grid");
const closeModalBtn = document.getElementById("close-modal");

const foodImgs  = document.querySelectorAll(".food-slot img");
const foodNames = document.querySelectorAll(".food-slot p");
const skillSpans= document.querySelectorAll(".skill-slot span");
const skillSlots= document.querySelectorAll(".skill-slot");

/* ===== 変数 ===== */
let seedCount = 0;
let currentType = "";   // "food" or "skill"
let currentIdx  = 0;

/* ===== 共通ヘルパ ===== */
const showToast = msg =>{
  toast.textContent=msg; toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2500);
};
const randExcept = (list, exceptSet)=>{
  let v; do{ v=list[Math.floor(Math.random()*list.length)]; }while(exceptSet.has(v));
  return v;
};
const incSeed = ()=>{ seedCount++; seedCountEl.value=seedCount; };

/* ===== ボタンイベント ===== */
document.querySelectorAll(".roll-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const type=btn.dataset.type;
    const idx = +btn.dataset.idx;

    if(type==="food"){
      const prev = foodImgs[idx].dataset.name||"";
      const choice = FOODS.find(f=>f.name===randExcept(FOODS.map(f=>f.name), new Set([prev])));
      foodImgs[idx].src=choice.img; foodImgs[idx].dataset.name=choice.name;
      foodNames[idx].textContent=choice.name;
    }else{
      const used = new Set([...skillSpans].map(s=>s.textContent)); // 重複禁止
      const prev = skillSpans[idx].textContent;
      used.delete(prev);
      const choice = randExcept(SKILLS, used);
      setSkill(idx, choice);
    }
    incSeed();
  });
});

document.querySelectorAll(".edit-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    currentType = btn.dataset.type;
    currentIdx  = +btn.dataset.idx;
    openModal();
  });
});

/* ===== モーダル ===== */
const openModal = ()=>{
  optionGrid.innerHTML="";
  if(currentType==="food"){
    modalTitle.textContent="食材を選択";
    FOODS.forEach(f=>{
      const b=document.createElement("button");
      b.className="option-btn";
      b.textContent=f.name;
      b.addEventListener("click",()=>{
        foodImgs[currentIdx].src=f.img;
        foodImgs[currentIdx].dataset.name=f.name;
        foodNames[currentIdx].textContent=f.name;
        modal.classList.remove("show");
      });
      optionGrid.appendChild(b);
    });
  }else{
    modalTitle.textContent="サブスキルを選択";
    const used = new Set([...skillSpans].map(s=>s.textContent));
    used.delete(skillSpans[currentIdx].textContent); // 自枠は除外
    SKILLS.forEach(sk=>{
      const b=document.createElement("button");
      b.className="option-btn";
      b.textContent=sk;
      if(used.has(sk)) b.disabled=true;
      b.addEventListener("click",()=>{
        setSkill(currentIdx, sk);
        modal.classList.remove("show");
      });
      optionGrid.appendChild(b);
    });
  }
  modal.classList.add("show");
};
const setSkill = (idx,name)=>{
  skillSpans[idx].textContent=name;
  skillSlots[idx].classList.remove("yellow","blue");
  if(YELLOW.includes(name)) skillSlots[idx].classList.add("yellow");
  else if(BLUE.includes(name)) skillSlots[idx].classList.add("blue");
};
closeModalBtn.addEventListener("click",()=>modal.classList.remove("show"));
modal.addEventListener("click",e=>{ if(e.target===modal) modal.classList.remove("show"); });

/* ===== リセット & シェア ===== */
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
