'use client';
import { useState } from 'react';

const SECTIONS = [
  "食事パターン","食事パターン","食事パターン","食事パターン","食事パターン",
  "便の状態","便の状態","便の状態","便の状態","便の状態",
  "生活習慣","生活習慣","生活習慣","生活習慣","生活習慣",
  "体の反応・ダイエット経験","体の反応・ダイエット経験","体の反応・ダイエット経験","体の反応・ダイエット経験","体の反応・ダイエット経験"
];

type Scores = { gas: number; con: number; dia: number; mix: number };

const QUESTIONS: { q: string; choices: string[]; scores: Scores[] }[] = [
  { q:"食後、お腹がふくらんだり重く感じることはありますか？", choices:["よくある（週3回以上）","時々ある（週1〜2回）","たまにある","ほとんどない"], scores:[{gas:3,con:0,dia:0,mix:1},{gas:2,con:0,dia:0,mix:1},{gas:1,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0}] },
  { q:"パン・麺類・甘いものをよく食べますか？", choices:["ほぼ毎日食べる","週4〜5回は食べる","週2〜3回程度","あまり食べない"], scores:[{gas:2,con:2,dia:0,mix:1},{gas:1,con:2,dia:0,mix:1},{gas:1,con:1,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0}] },
  { q:"野菜・海藻・きのこ類をどのくらい食べますか？", choices:["ほとんど食べない","週1〜2回程度","週3〜4回は食べる","毎日意識して食べている"], scores:[{gas:0,con:3,dia:0,mix:1},{gas:0,con:2,dia:0,mix:1},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0}] },
  { q:"乳製品（牛乳・ヨーグルト・チーズ）を食べた後、お腹が張ったりガスが増えませんか？", choices:["よくなる","時々なる","あまりならない","全くならない"], scores:[{gas:3,con:0,dia:1,mix:1},{gas:2,con:0,dia:0,mix:1},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0}] },
  { q:"水分（水・お茶）を1日どのくらい飲みますか？", choices:["500ml以下（少ない）","500ml〜1L程度","1〜1.5L程度","1.5L以上（多め）"], scores:[{gas:0,con:3,dia:0,mix:1},{gas:0,con:2,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0}] },
  { q:"1週間の排便回数は平均どのくらいですか？", choices:["週2回以下（少ない）","週3〜5回（普通）","ほぼ毎日ある","1日2回以上（多め）"], scores:[{gas:0,con:3,dia:0,mix:1},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:1,mix:1},{gas:0,con:0,dia:2,mix:1}] },
  { q:"便の形はどれに近いですか？", choices:["硬くてコロコロ（うさぎのような形）","普通のバナナ状","やわらかい・泥状のことが多い","日によってバラバラ"], scores:[{gas:0,con:3,dia:0,mix:1},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:2,mix:1},{gas:0,con:0,dia:0,mix:3}] },
  { q:"排便後、すっきりした感じがありますか？", choices:["残便感がある（出し切れない）","だいたいすっきりする","すっきりすることとしないことがある","いつもすっきりする"], scores:[{gas:1,con:3,dia:0,mix:1},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:2},{gas:0,con:0,dia:0,mix:0}] },
  { q:"お腹にガスがたまる・おならが気になることはありますか？", choices:["よくある","時々ある","あまりない","ほとんどない"], scores:[{gas:4,con:0,dia:0,mix:1},{gas:2,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0}] },
  { q:"ダイエット中に体重が急に止まる・リバウンドしやすいと感じますか？", choices:["とてもそう思う","少しそう思う","あまりそう思わない","そう思わない"], scores:[{gas:1,con:1,dia:0,mix:3},{gas:1,con:1,dia:0,mix:2},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0}] },
  { q:"睡眠の質はどうですか？", choices:["寝つきが悪い・眠りが浅い","途中で起きることが多い","まあまあ眠れている","ぐっすり眠れている"], scores:[{gas:0,con:0,dia:2,mix:2},{gas:0,con:0,dia:2,mix:2},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0}] },
  { q:"ストレスを感じると食欲はどう変わりますか？", choices:["食欲が増す・甘いものが欲しくなる","食欲がなくなる","お腹が痛くなる・下痢になる","特に変化しない"], scores:[{gas:0,con:1,dia:2,mix:1},{gas:0,con:0,dia:1,mix:1},{gas:0,con:0,dia:3,mix:1},{gas:0,con:0,dia:0,mix:0}] },
  { q:"運動習慣はありますか？", choices:["ほとんどしない","週1回程度","週2〜3回している","週4回以上している"], scores:[{gas:0,con:2,dia:0,mix:1},{gas:0,con:1,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0}] },
  { q:"食事の時間は規則正しいですか？", choices:["バラバラ・食事を抜くことが多い","不規則なことが多い","だいたい決まった時間に食べる","毎日規則正しく食べている"], scores:[{gas:0,con:1,dia:1,mix:3},{gas:0,con:1,dia:1,mix:2},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0}] },
  { q:"発酵食品（納豆・味噌・ヨーグルト・キムチなど）をどのくらい食べますか？", choices:["ほとんど食べない","週1〜2回程度","週3〜4回は食べる","毎日食べている"], scores:[{gas:0,con:2,dia:1,mix:2},{gas:0,con:1,dia:1,mix:1},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0}] },
  { q:"食べる量を減らしても体重が落ちにくいと感じますか？", choices:["強くそう思う","少しそう思う","あまり感じない","感じない"], scores:[{gas:1,con:2,dia:1,mix:2},{gas:1,con:2,dia:1,mix:1},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0}] },
  { q:"朝起きたとき、顔や体がむくんでいると感じますか？", choices:["よくある","時々ある","あまりない","ほとんどない"], scores:[{gas:2,con:2,dia:0,mix:1},{gas:1,con:1,dia:0,mix:1},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0}] },
  { q:"肌荒れ・吹き出もの・くすみが気になりますか？", choices:["よく気になる","時々気になる","あまり気にならない","気にならない"], scores:[{gas:1,con:2,dia:1,mix:2},{gas:1,con:1,dia:1,mix:1},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0}] },
  { q:"午後になると疲れやすい・眠くなることはありますか？", choices:["ほぼ毎日ある","週3〜4回ある","たまにある","あまりない"], scores:[{gas:2,con:1,dia:1,mix:1},{gas:1,con:1,dia:1,mix:1},{gas:0,con:0,dia:0,mix:0},{gas:0,con:0,dia:0,mix:0}] },
  { q:"これまでのダイエット経験で最も当てはまるのはどれですか？", choices:["カロリー制限したのに痩せなかった","運動しても続かなかった・効果がなかった","食事制限→リバウンドを繰り返した","特にダイエットで困ったことはない"], scores:[{gas:0,con:2,dia:0,mix:2},{gas:0,con:1,dia:1,mix:1},{gas:0,con:0,dia:0,mix:3},{gas:0,con:0,dia:0,mix:0}] },
];

type ResultType = 'gas' | 'con' | 'dia' | 'mix';

const RESULTS: Record<ResultType, { icon:string; name:string; badge:string; sub:string; desc:string; actions:string[]; pdf:string }> = {
  gas: { icon:"🫧", name:"膨らみ型", badge:"食後のガス・むくみが痩せにくさの原因", sub:"食後にお腹が張りやすく、ガスやむくみが気になるタイプ。\nFODMAPを多く含む食品が腸内でガスを発生させ、代謝を下げている可能性があります。", desc:"腸内細菌がFODMAP（発酵性の糖質）を分解する際に大量のガスが発生し、お腹の張りやむくみにつながっています。このタイプは食べるものの「種類」を見直すことが、ダイエット成功への最短ルートです。", actions:["FODMAP食品（玉ねぎ・小麦・豆類・牛乳）を2週間控えてみる","消化を助ける食品（大根・パパイヤ・キウイ）を毎食プラスする","食事をゆっくりよく噛んで食べる（空気の飲み込みを減らす）"], pdf:"膨らみ型専用 腸活改善ガイドPDF" },
  con: { icon:"🪨", name:"ためこみ型", badge:"老廃物のためこみが痩せにくさの原因", sub:"腸の動きが遅く、老廃物や余分な脂質をためこみやすいタイプ。\n短鎖脂肪酸が不足して脂肪燃焼スイッチが入りにくい状態です。", desc:"腸の蠕動運動が低下し、食物繊維と水分が不足していることが多いです。善玉菌のエサとなる水溶性食物繊維を増やすことで短鎖脂肪酸が産生され、脂肪燃焼しやすい体質に変わっていきます。", actions:["水溶性食物繊維（昆布・わかめ・オクラ・りんご）を毎日1品プラスする","1日1.5L以上の水分補給を意識する（朝一番に常温水を1杯）","食後30分以内に10分歩く（腸の蠕動運動を刺激する）"], pdf:"ためこみ型専用 腸活改善ガイドPDF" },
  dia: { icon:"🌊", name:"敏感型", badge:"ストレス過食が痩せにくさの原因", sub:"ストレスが食欲や腸に直結しやすいタイプ。\nセロトニン不足で甘いものへの欲求が強まり、代謝が乱れやすい状態です。", desc:"腸と脳は「腸脳軸」でつながっており、ストレスが食欲増加や腸の乱れを引き起こしています。セロトニンの95%は腸で作られるため、腸を整えることで食欲が安定し、自然と痩せやすい状態になっていきます。", actions:["ストレスケアを最優先に（深呼吸・入浴・睡眠の質を上げる）","腸粘膜を修復する食品（鶏肉・卵・味噌・ぬか漬け）を積極的に摂る","カフェイン・アルコール・揚げ物を控えて腸の過敏を落ち着かせる"], pdf:"敏感型専用 腸活改善ガイドPDF" },
  mix: { icon:"🎲", name:"気まぐれ型", badge:"腸内フローラの不安定さが痩せにくさの原因", sub:"体重・便通・体調が日によってバラつきやすいタイプ。\n腸内フローラの多様性が低く、代謝が安定しにくい状態です。", desc:"腸内フローラの多様性が低下すると、腸の反応が不安定になり体重も増えたり減ったりを繰り返します。発酵食品と食物繊維をセットで摂り続けることで善玉菌の種類が増え、代謝が安定してきます。", actions:["発酵食品×食物繊維のセット摂取（納豆＋海藻・味噌汁＋野菜）を毎食意識する","食事・睡眠・起床の時間を一定にして腸のリズムを整える","植物性発酵食品（納豆・味噌・ぬか漬け）を毎日1種類は食べる"], pdf:"気まぐれ型専用 腸活改善ガイドPDF" },
};

const LINE_URL = "https://lin.ee/TzDjpAxf";
type Screen = 'start' | 'question' | 'loading' | 'result';

const GREEN = '#2D6A4F';
const GREEN_MID = '#52B788';
const GREEN_LIGHT = '#B7E4C7';
const CREAM = '#F9F5EF';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('start');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(20).fill(-1));
  const [result, setResult] = useState<ResultType | null>(null);
  const [scores, setScores] = useState<Scores>({ gas:0, con:0, dia:0, mix:0 });

  const pct = Math.round(((current + 1) / 20) * 100);

  function selectChoice(i: number) {
    const next = [...answers]; next[current] = i; setAnswers(next);
  }

  function goNext() {
    if (answers[current] === -1) return;
    if (current < 19) { setCurrent(c => c + 1); }
    else { calcResult(); }
  }

  function calcResult() {
    setScreen('loading');
    const s: Scores = { gas:0, con:0, dia:0, mix:0 };
    QUESTIONS.forEach((q, qi) => {
      const ai = answers[qi];
      if (ai >= 0) { s.gas += q.scores[ai].gas; s.con += q.scores[ai].con; s.dia += q.scores[ai].dia; s.mix += q.scores[ai].mix; }
    });
    setScores(s);
    const mx = Math.max(s.gas, s.con, s.dia, s.mix);
    let t: ResultType = 'mix';
    if (s.gas === mx) t = 'gas'; else if (s.con === mx) t = 'con'; else if (s.dia === mx) t = 'dia';
    setResult(t);
    setTimeout(() => setScreen('result'), 2000);
  }

  // サブタイプ計算
  const ranked = (['gas','con','dia','mix'] as ResultType[]).sort((a,b)=>scores[b]-scores[a]);
  const subType = ranked[1];
  const topScore = scores[ranked[0]] || 0;
  const subScore = scores[subType] || 0;
  const showSub = result !== null && subScore > 0 && (topScore - subScore) < topScore * 0.4;

  const SUBTYPE_MSG: Record<string,string> = {
    gas_con:'食後のガスに加え、腸の動きが遅い傾向もあります。',
    gas_dia:'食後のガスに加え、ストレスの影響も受けやすい傾向があります。',
    gas_mix:'食後のガスに加え、体調のばらつきも気になります。',
    con_gas:'腸のためこみに加え、ガスやむくみも起きやすい傾向があります。',
    con_dia:'腸のためこみに加え、ストレスで食欲が乱れやすい傾向もあります。',
    con_mix:'腸のためこみに加え、体重が安定しにくい傾向もあります。',
    dia_gas:'ストレス過食に加え、食後のガスも気になる傾向があります。',
    dia_con:'ストレス過食に加え、腸の動きが遅い傾向もあります。',
    dia_mix:'ストレス過食に加え、体調のばらつきも気になります。',
    mix_gas:'体調のばらつきに加え、食後のガスも気になる傾向があります。',
    mix_con:'体調のばらつきに加え、腸のためこみも見られます。',
    mix_dia:'体調のばらつきに加え、ストレスの影響も受けやすい傾向があります。',
  };

  const total = scores.gas + scores.con + scores.dia + scores.mix || 1;
  const pGas = Math.round(scores.gas / total * 100);
  const pCon = Math.round(scores.con / total * 100);
  const pDia = Math.round(scores.dia / total * 100);
  const pMix = Math.round(scores.mix / total * 100);

  // ===== スタート画面 =====
  if (screen === 'start') return (
    <div style={{minHeight:'100vh',background:CREAM,fontFamily:"'Noto Sans JP',sans-serif"}}>
      <div style={{background:GREEN,padding:'14px 16px',display:'flex',alignItems:'center',gap:12}}>
        <svg width="32" height="32" viewBox="0 0 72 72" fill="none"><ellipse cx="36" cy="42" rx="24" ry="21" fill="#C8955A"/><path d="M36 21C36 21 24 24 21 33C18 42 21 54 27 58" stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M36 21C36 21 48 24 51 33C54 42 51 54 45 58" stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M36 21L36 58" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round"/><path d="M22 38C27 35.5 33 37 36 39C39 37 45 35.5 50 38" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" fill="none"/><ellipse cx="36" cy="19" rx="5" ry="3" fill="#7AB648"/><ellipse cx="39" cy="17" rx="3" ry="2" fill="#5C8A3C"/></svg>
        <div>
          <div style={{color:'white',fontWeight:700,fontSize:15}}>腸内タイプ診断</div>
          <div style={{color:'rgba(255,255,255,0.75)',fontSize:12}}>くるみの腸活ラボ</div>
        </div>
      </div>
      <div style={{maxWidth:520,margin:'0 auto',padding:'32px 20px 60px'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <svg width="80" height="80" viewBox="0 0 72 72" fill="none" style={{margin:'0 auto 16px'}}><ellipse cx="36" cy="42" rx="24" ry="21" fill="#C8955A"/><path d="M36 21C36 21 24 24 21 33C18 42 21 54 27 58" stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M36 21C36 21 48 24 51 33C54 42 51 54 45 58" stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M36 21L36 58" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round"/><path d="M22 38C27 35.5 33 37 36 39C39 37 45 35.5 50 38" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" fill="none"/><ellipse cx="36" cy="19" rx="5" ry="3" fill="#7AB648"/><ellipse cx="39" cy="17" rx="3" ry="2" fill="#5C8A3C"/></svg>
          <h1 style={{fontSize:26,fontWeight:800,color:GREEN,lineHeight:1.4,marginBottom:12}}>あなたが痩せにくい原因は<br/>腸のタイプにあった</h1>
          <p style={{fontSize:15,color:'#555',lineHeight:1.8}}>食べる量を減らしても痩せないのは<br/>意志の問題じゃありません。<br/>20問で「あなたの腸タイプ」を特定します。</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:24}}>
          {[['📝','20問','質問数'],['⏱','約5分','所要時間'],['🔬','4タイプ','判定結果']].map(([icon,val,label])=>(
            <div key={label} style={{background:'white',borderRadius:16,padding:'14px 8px',textAlign:'center',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:26,marginBottom:4}}>{icon}</div>
              <div style={{fontWeight:700,fontSize:15,color:GREEN}}>{val}</div>
              <div style={{fontSize:12,color:'#888',marginTop:2}}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{background:'#FFF8E7',border:'1px solid #E9C46A',borderRadius:12,padding:'12px 16px',fontSize:13,color:'#7A5C00',lineHeight:1.7,marginBottom:28}}>
          ⚠️ この診断は医療診断ではありません。症状が重い・長引く場合は必ず医療機関にご相談ください。
        </div>
        <button
          onClick={()=>{setScreen('question');setCurrent(0);}}
          style={{width:'100%',padding:'18px',background:GREEN,color:'white',border:'none',borderRadius:14,fontSize:18,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 16px rgba(44,106,79,0.35)'}}>
          診断をはじめる →
        </button>
      </div>
    </div>
  );

  // ===== 質問画面 =====
  if (screen === 'question') return (
    <div style={{minHeight:'100vh',background:CREAM,fontFamily:"'Noto Sans JP',sans-serif"}}>
      {/* ヘッダー＋プログレス */}
      <div style={{background:'white',boxShadow:'0 1px 0 #B7E4C7',position:'sticky',top:0,zIndex:50}}>
        <div style={{background:GREEN,padding:'12px 16px',display:'flex',alignItems:'center',gap:12}}>
          <svg width="28" height="28" viewBox="0 0 72 72" fill="none"><ellipse cx="36" cy="42" rx="24" ry="21" fill="#C8955A"/><path d="M36 21C36 21 24 24 21 33C18 42 21 54 27 58" stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M36 21C36 21 48 24 51 33C54 42 51 54 45 58" stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M36 21L36 58" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round"/><path d="M22 38C27 35.5 33 37 36 39C39 37 45 35.5 50 38" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" fill="none"/><ellipse cx="36" cy="19" rx="5" ry="3" fill="#7AB648"/><ellipse cx="39" cy="17" rx="3" ry="2" fill="#5C8A3C"/></svg>
          <div style={{color:'white',fontWeight:700,fontSize:14}}>腸内タイプ診断</div>
        </div>
        <div style={{padding:'10px 16px 12px'}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#666',marginBottom:6}}>
            <span style={{fontWeight:600}}>{current+1} / 20問</span>
            <span>{pct}%</span>
          </div>
          <div style={{height:8,background:GREEN_LIGHT,borderRadius:99,overflow:'hidden'}}>
            <div style={{height:'100%',background:GREEN,borderRadius:99,width:`${pct}%`,transition:'width 0.4s ease'}}/>
          </div>
        </div>
      </div>

      <div key={current} style={{maxWidth:520,margin:'0 auto',padding:'24px 16px 100px'}}>
        {/* セクション＋問番号 */}
        <div style={{fontSize:12,fontWeight:700,color:GREEN_MID,letterSpacing:'0.08em',marginBottom:8,textTransform:'uppercase'}}>
          第{current+1}問 ／ {SECTIONS[current]}
        </div>
        {/* 質問文 */}
        <p style={{fontSize:18,fontWeight:700,color:'#222',lineHeight:1.6,marginBottom:24}}>
          {QUESTIONS[current].q}
        </p>
        {/* 選択肢 */}
        <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:24}}>
          {QUESTIONS[current].choices.map((c,i)=>{
            const selected = answers[current] === i;
            return (
              <button key={i} onClick={()=>selectChoice(i)} style={{
                display:'flex',alignItems:'center',gap:14,
                textAlign:'left',width:'100%',
                background: selected ? '#E8F5EE' : 'white',
                border: `2px solid ${selected ? GREEN : GREEN_LIGHT}`,
                borderRadius:14,padding:'16px 18px',
                fontSize:15,color: selected ? GREEN : '#333',
                fontWeight: selected ? 600 : 400,
                cursor:'pointer',
                boxShadow: selected ? `0 0 0 1px ${GREEN}` : '0 2px 8px rgba(0,0,0,0.04)',
                transition:'all 0.15s',
                minHeight:60,
              }}>
                <span style={{
                  width:24,height:24,borderRadius:'50%',flexShrink:0,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:13,fontWeight:700,
                  background: selected ? GREEN : 'transparent',
                  border: `2px solid ${selected ? GREEN : GREEN_LIGHT}`,
                  color: selected ? 'white' : 'transparent',
                }}>✓</span>
                <span style={{lineHeight:1.5}}>{c}</span>
              </button>
            );
          })}
        </div>
        {/* ナビゲーションボタン */}
        <div style={{display:'flex',gap:10,position:'fixed',bottom:0,left:0,right:0,padding:'12px 16px 20px',background:'white',boxShadow:'0 -2px 12px rgba(0,0,0,0.08)',maxWidth:520,margin:'0 auto'}}>
          <button
            onClick={()=>{ if(current>0) setCurrent(c=>c-1); }}
            disabled={current===0}
            style={{
              flex:1,padding:'15px 0',
              background:'white',border:`2px solid ${current===0?'#E0E0E0':GREEN_LIGHT}`,
              borderRadius:12,fontSize:15,fontWeight:600,
              color: current===0 ? '#CCC' : '#555',
              cursor: current===0 ? 'not-allowed' : 'pointer',
            }}>
            ← 戻る
          </button>
          <button
            onClick={goNext}
            disabled={answers[current]===-1}
            style={{
              flex:2,padding:'15px 0',
              background: answers[current]!==-1 ? GREEN : GREEN_LIGHT,
              border:'none',borderRadius:12,fontSize:15,fontWeight:700,
              color:'white',
              cursor: answers[current]!==-1 ? 'pointer' : 'not-allowed',
            }}>
            {current===19 ? '結果を見る ✓' : '次へ →'}
          </button>
        </div>
      </div>
    </div>
  );

  // ===== ローディング画面 =====
  if (screen === 'loading') return (
    <div style={{minHeight:'100vh',background:CREAM,fontFamily:"'Noto Sans JP',sans-serif",display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:52,height:52,border:`5px solid ${GREEN_LIGHT}`,borderTopColor:GREEN,borderRadius:'50%',margin:'0 auto 16px',animation:'spin 0.8s linear infinite'}}/>
        <p style={{color:'#777',fontSize:14}}>腸内タイプを分析中...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  // ===== 結果画面 =====
  if (screen === 'result' && result) {
    const r = RESULTS[result];
    const maxScore = Math.max(pGas,pCon,pDia,pMix) || 1;
    const getBarColor = (key: ResultType) => {
      if (result === key) return GREEN;
      if (showSub && ranked[1] === key) return GREEN_MID;
      return GREEN_LIGHT;
    };
    const bars: [string,string,number][] = [
      ['🫧','膨らみ型',pGas],
      ['🪨','ためこみ型',pCon],
      ['🌊','敏感型',pDia],
      ['🎲','気まぐれ型',pMix],
    ];
    const subMsg = showSub ? SUBTYPE_MSG[`${result}_${subType}`] : '';
    const typeKey: ResultType[] = ['gas','con','dia','mix'];

    return (
      <div style={{minHeight:'100vh',background:CREAM,fontFamily:"'Noto Sans JP',sans-serif"}}>
        <div style={{background:GREEN,padding:'14px 16px',display:'flex',alignItems:'center',gap:12}}>
          <svg width="28" height="28" viewBox="0 0 72 72" fill="none"><ellipse cx="36" cy="42" rx="24" ry="21" fill="#C8955A"/><path d="M36 21C36 21 24 24 21 33C18 42 21 54 27 58" stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M36 21C36 21 48 24 51 33C54 42 51 54 45 58" stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M36 21L36 58" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round"/><path d="M22 38C27 35.5 33 37 36 39C39 37 45 35.5 50 38" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" fill="none"/><ellipse cx="36" cy="19" rx="5" ry="3" fill="#7AB648"/><ellipse cx="39" cy="17" rx="3" ry="2" fill="#5C8A3C"/></svg>
          <div style={{color:'white',fontWeight:700,fontSize:14}}>腸内タイプ診断 結果</div>
        </div>
        <div style={{maxWidth:520,margin:'0 auto',padding:'24px 16px 60px'}}>
          {/* 結果カード */}
          <div style={{background:'white',borderRadius:20,overflow:'hidden',boxShadow:'0 4px 20px rgba(44,106,79,0.1)',marginBottom:16}}>
            <div style={{background:`linear-gradient(135deg,${GREEN} 0%,#1A4D35 100%)`,padding:'32px 24px',textAlign:'center'}}>
              <div style={{display:'inline-block',background:'rgba(255,255,255,0.2)',borderRadius:99,padding:'4px 16px',fontSize:12,fontWeight:700,color:'white',marginBottom:12}}>
                {r.badge}
              </div>
              <div style={{fontSize:64,marginBottom:12}}>{r.icon}</div>
              <h2 style={{fontSize:26,fontWeight:800,color:'white',marginBottom:8}}>あなたは「{r.name}」です</h2>
              <p style={{fontSize:14,color:'rgba(255,255,255,0.85)',lineHeight:1.7}}>
                {r.sub.split('\n').map((line,i)=><span key={i}>{line}<br/></span>)}
              </p>
              {showSub && (
                <div style={{display:'inline-block',marginTop:12,background:'rgba(255,255,255,0.2)',borderRadius:99,padding:'5px 14px',fontSize:13,fontWeight:700,color:'white'}}>
                  ＋ {RESULTS[subType].name}の傾向あり
                </div>
              )}
            </div>
            <div style={{padding:'20px 20px 24px'}}>
              {showSub && subMsg && (
                <div style={{background:'#FFF8E7',borderRadius:10,padding:'10px 14px',fontSize:13,color:'#7A5C00',lineHeight:1.7,marginBottom:16}}>
                  🔍 {subMsg}
                </div>
              )}
              <div style={{fontSize:12,fontWeight:700,color:GREEN,letterSpacing:'0.08em',borderBottom:`2px solid ${GREEN_LIGHT}`,paddingBottom:8,marginBottom:14}}>このタイプについて</div>
              <p style={{fontSize:14,lineHeight:1.8,marginBottom:20,color:'#333'}}>{r.desc}</p>

              <div style={{fontSize:12,fontWeight:700,color:GREEN,letterSpacing:'0.08em',borderBottom:`2px solid ${GREEN_LIGHT}`,paddingBottom:8,marginBottom:14}}>タイプスコア</div>
              <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
                {bars.map(([icon,label,val],idx)=>(
                  <div key={label} style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{width:84,fontSize:13,flexShrink:0,fontWeight:label===r.name?700:400,color:label===r.name?GREEN:'#444'}}>{icon} {label}</span>
                    <div style={{flex:1,height:10,background:'#E8F5EE',borderRadius:99,overflow:'hidden'}}>
                      <div style={{height:'100%',background:getBarColor(typeKey[idx]),borderRadius:99,width:`${Math.round(val/maxScore*100)}%`,transition:'width 1s ease'}}/>
                    </div>
                    <span style={{fontSize:12,width:34,textAlign:'right',flexShrink:0,fontWeight:label===r.name?700:400,color:label===r.name?GREEN:'#888'}}>{val}%</span>
                  </div>
                ))}
              </div>

              <div style={{fontSize:12,fontWeight:700,color:GREEN,letterSpacing:'0.08em',borderBottom:`2px solid ${GREEN_LIGHT}`,paddingBottom:8,marginBottom:14}}>今すぐできる改善ポイント</div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {r.actions.map((a,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'flex-start',gap:12,background:'#F0FAF4',borderRadius:12,padding:'12px 14px'}}>
                    <span style={{width:26,height:26,background:GREEN,color:'white',borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700}}>{i+1}</span>
                    <span style={{fontSize:14,lineHeight:1.6,color:'#333'}}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LINE CTA */}
          <div style={{background:`linear-gradient(135deg,${GREEN} 0%,#1A4D35 100%)`,borderRadius:20,padding:'28px 20px',textAlign:'center',marginBottom:14}}>
            <div style={{fontSize:40,marginBottom:10}}>🌿</div>
            <h3 style={{fontSize:20,fontWeight:700,color:'white',marginBottom:8,lineHeight:1.5}}>「{r.name}」に合った<br/>詳しい実践PDFを受け取る</h3>
            <p style={{fontSize:14,color:'rgba(255,255,255,0.8)',lineHeight:1.7,marginBottom:18}}>公式LINEに登録すると、あなたのタイプに特化した腸活改善ガイドPDFを無料でお届けします。</p>
            <div style={{textAlign:'left',marginBottom:18,display:'flex',flexDirection:'column',gap:8}}>
              {[r.pdf,'タイプ別 食材リスト＆避けるべき食品','1週間の腸活スターターロードマップ'].map(f=>(
                <div key={f} style={{display:'flex',alignItems:'center',gap:8,fontSize:14,color:'white'}}>
                  <span style={{width:20,height:20,background:GREEN_MID,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,flexShrink:0}}>✓</span>{f}
                </div>
              ))}
            </div>
            <a href={LINE_URL} target="_blank" rel="noopener noreferrer" style={{
              display:'flex',alignItems:'center',justifyContent:'center',gap:8,
              width:'100%',padding:'16px',background:'#06C755',
              border:'none',borderRadius:14,fontSize:17,fontWeight:700,color:'white',
              textDecoration:'none',boxShadow:'0 4px 16px rgba(6,199,85,0.4)',
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2C6.03 2 2 5.69 2 10.22c0 3.01 1.9 5.65 4.74 7.15-.21.74-.76 2.68-.87 3.1-.13.52.19.51.4.37.16-.11 2.14-1.45 3.01-2.04.57.08 1.15.12 1.72.12 4.97 0 9-3.69 9-8.22C20 5.69 15.97 2 11 2z" fill="white"/></svg>
              LINEで無料PDFを受け取る
            </a>
          </div>
          <p style={{fontSize:12,textAlign:'center',color:'#888',lineHeight:1.7}}>※ この診断は医療診断ではありません。<br/>症状が重い・長引く場合は医療機関にご相談ください。</p>
        </div>
      </div>
    );
  }

  return null;
}
