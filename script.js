/* ========== master data ========== */
const FOODS=[
  {name:"マメミート",img:"img/マメミート.png"},
  {name:"とくせんリンゴ",img:"img/とくせんリンゴ.png"},
  {name:"げきからハーブ",img:"img/げきからハーブ.png"},
  {name:"モーモーミルク",img:"img/モーモーミルク.png"},
  {name:"あまいミツ",img:"img/あまいミツ.png"},
  {name:"ワカクサ大豆",img:"img/ワカクサ大豆.png"},
  {name:"ワカクサコーン",img:"img/ワカクサコーン.png"},
  {name:"めざましコーヒー",img:"img/めざましコーヒー.png"}
];

const YELLOW=[
  "睡眠EXPボーナス","おてつだいボーナス","げんき回復ボーナス",
  "ゆめのかけらボーナス","リサーチEXPボーナス","きのみの数S",
  "スキルレベルアップM"
];
const BLUE=[
  "スキルレベルアップS","最大所持数アップL","最大所持数アップM",
  "おてつだいスピードM","食材確率アップM","スキル確率アップM"
];
const WHITE=[
  "最大所持数アップS","おてつだいスピードS",
  "食材確率アップS","スキル確率アップS"
];
const SKILLS=[...YELLOW,...BLUE,...WHITE]; // 全 22 種

/* ========== dom ========== */
const seedCountEl=document.getElementById("seed-count");
const toast=document.getElementById("toast");
const modal=document.getElementById("modal");
const slotTabs=document.getElementById("slot-tabs");
const optionGrid=document.getElementById("option-grid");
const closeModalBtn=document.getElementById("close-modal");

const foodImgs=[...document.querySelectorAll(".food-slot img")];
const foodNames=[...document.querySelectorAll(".food-slot p")];
const skillSpans=[...document.querySelectorAll(".skill-slot span")];
const skillSlots=[...document.querySelectorAll(".skill-slot")];

let seedCount=0;
let editType="food";
let currentIdx=0;

/* ========== helpers ========== */
const showToast=msg=>{
  toast.textContent=msg;toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2200);
};
const randExcept=(arr,ban)=>{
  let v;
  do{v=arr[Math.floor(Math.random()*arr.length)]}while(ban.has(v));
  return v;
};
const incSeed=()=>{seedCount++;seedCountEl.value=seedCount};
const setSkill=(idx,name)=>{
  skillSpans[idx].textContent=name;
  skillSlots[idx].classList.remove("yellow","blue");
  if(YELLOW.includes(name)) skillSlots[idx].classList.add("yellow");
  else if(BLUE.includes(name)) skillSlots[idx].classList.add("blue");
};

/* ========== roll buttons ========== */
document.querySelectorAll(".roll-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const type=btn.dataset.type,idx=+btn.dataset.idx;

    if(type==="food"){
      const prev=foodImgs[idx].dataset.name||"";
      const next=randExcept(FOODS.map(f=>f.name),new Set([prev]));
      const obj=FOODS.find(f=>f.name===next);
      foodImgs[idx].src=obj.img;foodImgs[idx].dataset.name=obj.name;foodNames[idx].textContent=obj.name;

    }else{
      const used=new Set(skillSpans.map(s=>s.textContent));
      const prev=skillSpans[idx].textContent;used.delete(prev);
      const next=randExcept([...SKILLS,""],used); // 空文字も候補
      setSkill(idx,next);
    }
    incSeed();
  });
});

/* ========== section-edit ========== */
document.querySelectorAll(".section-edit").forEach(btn=>{
  btn.addEventListener("click",()=>{
    editType=btn.dataset.type;currentIdx=0;buildModal();modal.classList.add("show");
  });
});

function buildTabs(labels){
  slotTabs.innerHTML="";
  labels.forEach((lab,i)=>{
    const b=document.createElement("button");
    b.textContent=lab;b.className="slot-tab-btn"+(i===0?" active":"");
    b.onclick=()=>{currentIdx=i;[...slotTabs.children].forEach((c,j)=>c.classList.toggle("active",j===i));renderOptions();};
    slotTabs.appendChild(b);
  });
}
function buildModal(){
  editType==="food"?
    buildTabs(["第1","第2","第3"]) :
    buildTabs(["10","25","50","75","100"]);
  renderOptions();
}
function renderOptions(){
  optionGrid.innerHTML="";
  if(editType==="food"){
    FOODS.forEach(f=>{
      const b=document.createElement("button");
      b.className="option-btn";b.textContent=f.name;
      b.onclick=()=>{foodImgs[currentIdx].src=f.img;foodImgs[currentIdx].dataset.name=f.name;foodNames[currentIdx].textContent=f.name;modal.classList.remove("show");};
      optionGrid.appendChild(b);
    });
  }else{
    const used=new Set(skillSpans.map(s=>s.textContent));
    used.delete(skillSpans[currentIdx].textContent);
    [...SKILLS,""].forEach(sk=>{
      const b=document.createElement("button");
      b.className="option-btn";
      if(YELLOW.includes(sk)) b.classList.add("yellow");
      else if(BLUE.includes(sk)) b.classList.add("blue");
      b.textContent=sk||"(なし)";
      if(used.has(sk)) b.disabled=true;
      b.onclick=()=>{setSkill(currentIdx,sk);modal.classList.remove("show");};
      optionGrid.appendChild(b);
    });
  }
}
closeModalBtn.onclick=()=>modal.classList.remove("show");
modal.addEventListener("click",e=>{if(e.target===modal) modal.classList.remove("show")});

/* ========== reset & share ========== */
document.getElementById("reset-btn").onclick=()=>{
  foodImgs.forEach(i=>{i.src="";i.dataset.name=""});
  foodNames.forEach(p=>p.textContent="");
  skillSpans.forEach(s=>s.textContent="");
  skillSlots.forEach(sl=>sl.classList.remove("yellow","blue"));
  seedCount=0;seedCountEl.value=0;
};

document.getElementById("share-btn").onclick=()=>{
  const f=foodImgs.map(i=>i.dataset.name||"―"),s=skillSpans.map(t=>t.textContent||"―");
  const txt=`【ひらめきのたねシュミレーター】\\n回数:${seedCount}\\n\\n🧄食材\\n1:${f[0]} 2:${f[1]} 3:${f[2]}\\n\\n🔧サブスキル\\n10:${s[0]} 25:${s[1]} 50:${s[2]} 75:${s[3]} 100:${s[4]}\\n`;
  if(navigator.share){navigator.share({title:"ひらめきのたねシュミレーター",text:txt}).catch(()=>{});}
  else{navigator.clipboard?.writeText(txt).then(()=>showToast("コピーしました！"));}
};
