/* ===== master data ===== */
const FOODS=[{"name":"マメミート","img":"img/マメミート.png"},{"name":"とくせんリンゴ","img":"img/とくせんリンゴ.png"},{"name":"げきからハーブ","img":"img/げきからハーブ.png"},{"name":"モーモーミルク","img":"img/モーモーミルク.png"},{"name":"あまいミツ","img":"img/あまいミツ.png"},{"name":"ワカクサ大豆","img":"img/ワカクサ大豆.png"},{"name":"ワカクサコーン","img":"img/ワカクサコーン.png"},{"name":"めざましコーヒー","img":"img/めざましコーヒー.png"}];
const YELLOW=["睡眠EXPボーナス","おてつだいボーナス","げんき回復ボーナス","ゆめのかけらボーナス","リサーチEXPボーナス","きのみの数S","スキルレベルアップM"];
const BLUE=["スキルレベルアップS","最大所持数アップL","最大所持数アップM","おてつだいスピードM","食材確率アップM","スキル確率アップM"];
const SKILLS=[...YELLOW,...BLUE];

/* ===== dom ===== */
const seedCountEl=document.getElementById("seed-count");
const toast=document.getElementById("toast");
const modal=document.getElementById("modal");
const slotTabs=document.getElementById("slot-tabs");
const optionGrid=document.getElementById("option-grid");
const closeModalBtn=document.getElementById("close-modal");

const foodSlots=[...document.querySelectorAll(".food-slot")];
const foodImgs=[...document.querySelectorAll(".food-slot img")];
const foodNames=[...document.querySelectorAll(".food-slot p")];
const skillSpans=[...document.querySelectorAll(".skill-slot span")];
const skillSlots=[...document.querySelectorAll(".skill-slot")];

let seedCount=0;
let editType="food"; // or "skill"
let currentSlotIdx=0;

/* ===== helpers ===== */
const showToast=msg=>{toast.textContent=msg;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2200);};
const randExcept=(list,set)=>{let v;do{v=list[Math.floor(Math.random()*list.length)];}while(set.has(v));return v;};
const incSeed=()=>{seedCount++;seedCountEl.value=seedCount;};
const applySkill=(idx,name)=>{
  skillSpans[idx].textContent=name;
  skillSlots[idx].classList.remove("yellow","blue");
  if(YELLOW.includes(name)) skillSlots[idx].classList.add("yellow");
  else if(BLUE.includes(name)) skillSlots[idx].classList.add("blue");
};

/* ===== roll buttons ===== */
document.querySelectorAll(".roll-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const type=btn.dataset.type;const idx=+btn.dataset.idx;
    if(type==="food"){
      const prev=foodImgs[idx].dataset.name||"";
      const choice=FOODS.find(f=>f.name===randExcept(FOODS.map(f=>f.name),new Set([prev])));
      foodImgs[idx].src=choice.img;foodImgs[idx].dataset.name=choice.name;foodNames[idx].textContent=choice.name;
    }else{
      const used=new Set(skillSpans.map(s=>s.textContent));
      const prev=skillSpans[idx].textContent;used.delete(prev);
      const choice=randExcept(SKILLS,used);
      applySkill(idx,choice);
    }
    incSeed();
  });
});

/* ===== section‑edit buttons ===== */
document.querySelectorAll(".section-edit").forEach(btn=>{
  btn.addEventListener("click",()=>{
    editType=btn.dataset.type;currentSlotIdx=0;openModal();
  });
});

/* ===== modal builder ===== */
function openModal(){
  modal.classList.add("show");slotTabs.innerHTML="";optionGrid.innerHTML="";
  if(editType==="food") buildTabs(3,["第1","第2","第3"],switchFoodTab);
  else buildTabs(5,["10","25","50","75","100"],switchSkillTab);
  renderOptions();
}
function buildTabs(n,labels,handler){
  labels.forEach((lab,i)=>{
    const b=document.createElement("button");b.textContent=lab;b.className="slot-tab-btn";if(i===0) b.classList.add("active");b.addEventListener("click",()=>handler(i));slotTabs.appendChild(b);
  });
}
function switchFoodTab(i){currentSlotIdx=i;setActiveTab(i);renderOptions();}
function switchSkillTab(i){currentSlotIdx=i;setActiveTab(i);renderOptions();}
function setActiveTab(i){[...slotTabs.children].forEach((c,idx)=>c.classList.toggle("active",idx===i));}

function renderOptions(){
  optionGrid.innerHTML="";
  if(editType==="food"){
    FOODS.forEach(f=>{
      const b=document.createElement("button");b.className="option-btn";b.textContent=f.name;
      b.addEventListener("click",()=>{foodImgs[currentSlotIdx].src=f.img;foodImgs[currentSlotIdx].dataset.name=f.name;foodNames[currentSlotIdx].textContent=f.name;modal.classList.remove("show");});
      optionGrid.appendChild(b);
    });
  }else{
    const used=new Set(skillSpans.map(s=>s.textContent));used.delete(skillSpans[currentSlotIdx].textContent);
    SKILLS.forEach(sk=>{
      const b=document.createElement("button");b.className="option-btn";if(YELLOW.includes(sk)) b.classList.add("yellow");else if(BLUE.includes(sk)) b.classList.add("blue");
      b.textContent=sk;if(used.has(sk)) b.disabled=true;
      b.addEventListener("click",()=>{applySkill(currentSlotIdx,sk);modal.classList.remove("show");});
      optionGrid.appendChild(b);
    });
  }
}

closeModalBtn.addEventListener("click",()=>modal.classList.remove("show"));
modal.addEventListener("click",e=>{if(e.target===modal) modal.classList.remove("show");});

/* ===== reset & share ===== */
document.getElementById("reset-btn").addEventListener("click",()=>{
  foodImgs.forEach(i=>{i.src="";i.dataset.name=""});foodNames.forEach(p=>p.textContent="");skillSpans.forEach(s=>s.textContent="");skillSlots.forEach(sl=>sl.classList.remove("yellow","blue"));seedCount=0;seedCountEl.value=0;
});

document.getElementById("share-btn").addEventListener("click",()=>{
  const foods=foodImgs.map(i=>i.dataset.name||"―");const skills=skillSpans.map(s=>s.textContent||"―");
  const txt=`【ひらめきのたねシュミレーター】\n回数:${seedCount}\n🧄食材\n1:${foods[0]} 2:${foods[1]} 3:${foods[2]}\n🔧スキル\n10:${skills[0]} 25:${skills[1]} 50:${skills[2]} 75:${skills[3]} 100:${skills[4]}\n`;
  if(navigator.share){navigator.share({title:"ひらめきのたねシュミレーター",text:txt}).catch(()=>{});}else{navigator.clipboard?.writeText(txt).then(()=>showToast("コピーしました！"));}
});
