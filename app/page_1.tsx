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

const LINE_URL = "https://line.me/R/ti/p/XXXXXXXXXX";
type Screen = 'start' | 'question' | 'loading' | 'result';

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

  const total = scores.gas + scores.con + scores.dia + scores.mix || 1;
  const pGas = Math.round(scores.gas / total * 100);
  const pCon = Math.round(scores.con / total * 100);
  const pDia = Math.round(scores.dia / total * 100);
  const pMix = Math.round(scores.mix / total * 100);

  return (
    <div className="min-h-screen" style={{background:'#F9F5EF',fontFamily:"'Noto Sans JP',sans-serif"}}>
      <header className="bg-white sticky top-0 z-50 border-b-2" style={{borderColor:'#B7E4C7'}}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{background:'#2D6A4F'}}>🌰</div>
          <div>
            <div className="font-bold text-sm" style={{color:'#2D6A4F'}}>腸内タイプ診断</div>
            <div className="text-xs" style={{color:'#6B6B6B'}}>くるみの腸活ラボ</div>
          </div>
        </div>
        {screen === 'question' && (
          <div className="px-4 pb-3">
            <div className="flex justify-between text-xs mb-1" style={{color:'#6B6B6B'}}>
              <span>{current+1} / 20問</span><span>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{background:'#B7E4C7'}}>
              <div className="h-full rounded-full transition-all duration-500" style={{width:`${pct}%`,background:'linear-gradient(90deg,#52B788,#2D6A4F)'}}/>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 pb-20">

        {screen === 'start' && (
          <div>
            <div className="text-center py-8">
              <div className="text-7xl mb-4">🌰</div>
              <h1 className="text-2xl font-bold mb-3 leading-snug" style={{color:'#2D6A4F'}}>あなたの腸内タイプは<br/>どれですか？</h1>
              <p className="text-sm leading-relaxed mb-6" style={{color:'#6B6B6B'}}>「食べる量を減らしても痩せない」のは<br/>腸内環境のタイプが原因かもしれません。<br/>20問の質問でタイプを特定します。</p>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[['📝','20問','質問数'],['⏱','約5分','所要時間'],['🔬','4タイプ','判定結果']].map(([icon,val,label])=>(
                <div key={label} className="bg-white rounded-2xl p-3 text-center shadow-sm">
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="font-bold text-sm" style={{color:'#2D6A4F'}}>{val}</div>
                  <div className="text-xs" style={{color:'#6B6B6B'}}>{label}</div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-3 text-xs leading-relaxed mb-6" style={{background:'#FFF8E7',border:'1px solid #E9C46A',color:'#7A5C00'}}>
              ⚠️ この診断は医療診断ではありません。症状が重い・長引く場合は必ず医療機関にご相談ください。
            </div>
            <button onClick={()=>{setScreen('question');setCurrent(0);}}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:-translate-y-0.5"
              style={{background:'#2D6A4F',boxShadow:'0 4px 16px rgba(44,106,79,0.3)'}}>
              診断をはじめる →
            </button>
          </div>
        )}

        {screen === 'question' && (
          <div key={current}>
            <div className="text-xs font-bold mb-2 tracking-widest" style={{color:'#52B788'}}>第{current+1}問 ／ {SECTIONS[current]}</div>
            <p className="text-lg font-bold leading-snug mb-6" style={{color:'#2C2C2C'}}>{QUESTIONS[current].q}</p>
            <div className="flex flex-col gap-2.5 mb-7">
              {QUESTIONS[current].choices.map((c,i)=>(
                <button key={i} onClick={()=>selectChoice(i)}
                  className="flex items-center gap-3 text-left rounded-2xl px-4 py-4 transition-all border-2"
                  style={{background:answers[current]===i?'#E8F5EE':'#FFFFFF',borderColor:answers[current]===i?'#2D6A4F':'#B7E4C7',color:answers[current]===i?'#2D6A4F':'#2C2C2C',fontWeight:answers[current]===i?500:400,transform:answers[current]===i?'translateX(4px)':'none',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
                  <span className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{background:answers[current]===i?'#2D6A4F':'transparent',border:`2px solid ${answers[current]===i?'#2D6A4F':'#B7E4C7'}`,color:answers[current]===i?'white':'transparent'}}>✓</span>
                  <span className="text-sm leading-relaxed">{c}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {current > 0 && <button onClick={()=>setCurrent(c=>c-1)} className="flex-1 py-3.5 rounded-2xl border-2 text-sm" style={{borderColor:'#B7E4C7',color:'#6B6B6B',background:'#FFFFFF'}}>← 戻る</button>}
              <button onClick={goNext} className="py-3.5 rounded-2xl text-sm font-bold transition-all" style={{flex:2,background:answers[current]!==-1?'#2D6A4F':'#B7E4C7',color:'white',cursor:answers[current]!==-1?'pointer':'not-allowed'}}>
                {current===19?'結果を見る ✓':'次へ →'}
              </button>
            </div>
          </div>
        )}

        {screen === 'loading' && (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-full border-4 mx-auto mb-4 animate-spin" style={{borderColor:'#B7E4C7',borderTopColor:'#2D6A4F'}}/>
            <p className="text-sm" style={{color:'#6B6B6B'}}>腸内タイプを分析中...</p>
          </div>
        )}

        {screen === 'result' && result && (()=>{
          const r = RESULTS[result];
          const bars: [string,string,number][] = [['💨','膨らみ型',pGas],['🧱','ためこみ型',pCon],['🌊','敏感型',pDia],['🔄','気まぐれ型',pMix]];
          return (
            <div>
              <div className="bg-white rounded-3xl overflow-hidden shadow-md mb-4">
                <div className="text-center px-6 py-7">
                  <span className="inline-block text-xs font-bold px-4 py-1 rounded-full text-white mb-3" style={{background:'#2D6A4F'}}>{r.badge}</span>
                  <div className="text-6xl mb-3">{r.icon}</div>
                  <h2 className="text-2xl font-bold mb-2" style={{color:'#2D6A4F'}}>あなたは「{r.name}」です</h2>
                  <p className="text-sm leading-relaxed" style={{color:'#6B6B6B'}}>{r.sub.split('\n').map((line,i)=><span key={i}>{line}<br/></span>)}</p>
                </div>
                <div className="px-6 pb-6">
                  <div className="text-xs font-bold tracking-widest mb-3 pb-2 border-b-2" style={{color:'#2D6A4F',borderColor:'#B7E4C7'}}>このタイプについて</div>
                  <p className="text-sm leading-relaxed mb-5">{r.desc}</p>
                  <div className="text-xs font-bold tracking-widest mb-3 pb-2 border-b-2" style={{color:'#2D6A4F',borderColor:'#B7E4C7'}}>タイプスコア</div>
                  <div className="space-y-2.5 mb-5">
                    {bars.map(([icon,label,val])=>(
                      <div key={label} className="flex items-center gap-2.5">
                        <span className="text-sm w-20 flex-shrink-0">{icon} {label}</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{background:'#B7E4C7'}}>
                          <div className="h-full rounded-full transition-all duration-1000" style={{width:`${val}%`,background:'#2D6A4F'}}/>
                        </div>
                        <span className="text-xs w-9 text-right flex-shrink-0" style={{color:'#6B6B6B'}}>{val}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-bold tracking-widest mb-3 pb-2 border-b-2" style={{color:'#2D6A4F',borderColor:'#B7E4C7'}}>今すぐできる改善ポイント</div>
                  <div className="space-y-2.5">
                    {r.actions.map((a,i)=>(
                      <div key={i} className="flex items-start gap-3 rounded-xl p-3" style={{background:'#F0FAF4'}}>
                        <span className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{background:'#2D6A4F'}}>{i+1}</span>
                        <span className="text-sm leading-relaxed">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl p-6 text-center mb-4" style={{background:'linear-gradient(135deg,#2D6A4F 0%,#1A4D35 100%)'}}>
                <div className="text-4xl mb-3">🌿</div>
                <h3 className="text-xl font-bold text-white mb-2 leading-snug">「{r.name}」に合った<br/>詳しい実践PDFを受け取る</h3>
                <p className="text-sm mb-4 leading-relaxed" style={{color:'rgba(255,255,255,0.8)'}}>公式LINEに登録すると、あなたのタイプに特化した腸活改善ガイドPDFを無料でお届けします。</p>
                <div className="space-y-2 mb-5 text-left">
                  {[r.pdf,'タイプ別 食材リスト＆避けるべき食品','1週間の腸活スターターロードマップ'].map(f=>(
                    <div key={f} className="flex items-center gap-2 text-sm text-white">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{background:'#52B788'}}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <a href={LINE_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-white text-base"
                  style={{background:'#06C755',boxShadow:'0 4px 16px rgba(6,199,85,0.35)'}}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2C6.03 2 2 5.69 2 10.22c0 3.01 1.9 5.65 4.74 7.15-.21.74-.76 2.68-.87 3.1-.13.52.19.51.4.37.16-.11 2.14-1.45 3.01-2.04.57.08 1.15.12 1.72.12 4.97 0 9-3.69 9-8.22C20 5.69 15.97 2 11 2z" fill="white"/></svg>
                  LINEで無料PDFを受け取る
                </a>
              </div>
              <p className="text-xs text-center leading-relaxed px-4" style={{color:'#6B6B6B'}}>※ この診断は医療診断ではありません。<br/>症状が重い・長引く場合は医療機関にご相談ください。</p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
