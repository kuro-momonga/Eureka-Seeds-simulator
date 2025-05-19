/* ===== データ ===== */
/* 画像は /img/ に同名 PNG を置く前提 */
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

const SKILLS = [
  "睡眠EXPボーナス","おてつだいボーナス","げんき回復ボーナス","ゆめのかけらボーナス",
  "リサーチEXPボーナス","きのみの数S","スキルレベルアップM","スキルレベルアップS",
  "最大所持数アップL","最大所持数アップM","おてつだいスピードM","食材確率アップM",
  "スキル確率アップM","最大所持数アップS","おてつだいスピードS","食材確率アップS",
  "スキル確率アップS",
];

/* ===== DOM ===== */
const seedCountEl = document.getElementById("seed-count");
const toast = document.getElementById("toast");
const modal = document.getElementById("modal");
const optionGrid = document.getElementById("option-grid");
const modalTitle = document.getElementById("modal-title");
const closeModalBtn = document.getElementById("close-modal");

let seedCount = 0;

/* ===== ヘルパ ===== */
function showToast(msg){
  toast.textContent=msg; toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2500);
}
function incrementSeed(){ seedCount++; seedCountEl.value = seedCount; }

/* ===== Reroll ===== */
document.querySelectorAll(".roll-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const type=btn.dataset.type;
    const idx = Number(btn.dataset.idx);
    if(type==="food"){
      const slot = document.querySelectorAll(".food-slot img")[idx];
      const prev = slot.dataset.name||"";
      let choice;
      do{ choice=FOODS[Math.floor(Math.random()*FOODS.length)]; }while(choice.name===prev);
      slot.src=choice.img; slot.dataset.name=choice.name;
    }else{
      const span=document.querySelectorAll(".skill-slot span")[idx];
      const prev=span.textContent;
      let next;
      do{ next=SKILLS[Math.floor(Math.random()*SKILLS.length)]; }while(next===prev);
      span.textContent=next;
    }
    incrementSeed();
  });
});

/* ===== 食材 手動選択 ===== */
let currentFoodIdx=0;
document.querySelectorAll(".food-select").forEach(btn=>{
  btn.addEventListener("click",()=>{
    currentFoodIdx = Number(btn.dataset.idx);
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
      const slotImg=document.querySelectorAll(".food-slot img")[currentFoodIdx];
      slotImg.src=f.img; slotImg.dataset.name=f.name;
      closeModal();
    });
    optionGrid.appendChild(ob);
  });
  modalTitle.textContent="食材を選択";
  modal.classList.add("show");
}
function closeModal(){ modal.classList.remove("show"); }
closeModalBtn.addEventListener("click",closeModal);
modal.addEventListener("click",e=>{ if(e.target===modal) closeModal(); });

/* ===== Reset & Share ===== */
document.getElementById("reset-btn").addEventListener("click",()=>{
  document.querySelectorAll(".food-slot img").forEach(i=>{ i.src=""; i.dataset.name=""; });
  document.querySelectorAll(".skill-slot span").forEach(s=>s.textContent="");
  seedCount=0; seedCountEl.value=0;
});

document.getElementById("share-btn").addEventListener("click",()=>{
  const foods=[...document.querySelectorAll(".food-slot img")].map(i=>i.dataset.name||"―");
  const skills=[...document.querySelectorAll(".skill-slot span")].map(s=>s.textContent||"―");
  const text=`【ひらめきのたねシュミレーター】\n使用回数：${seedCount}\n\n🧄食材\n1:${foods[0]} 2:${foods[1]} 3:${foods[2]}\n\n🔧サブスキル\n10:${skills[0]}\n25:${skills[1]}\n50:${skills[2]}\n75:${skills[3]}\n100:${skills[4]}\n`;
  if(navigator.share){
    navigator.share({title:"ひらめきのたねシュミレーター",text})
      .catch(()=>showToast("共有をキャンセルしました"));
  }else{
    navigator.clipboard?.writeText(text).then(()=>showToast("内容をコピーしました！"));
  }
});
