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

const RESULTS: Record<ResultType, {
  icon:string; name:string; badge:string; sub:string; desc:string;
  demerits:{title:string;detail:string}[];
}> = {
  gas: {
    icon:"🫧", name:"膨らみ型", badge:"食後のガス・むくみが痩せにくさの原因",
    sub:"食後にお腹が張りやすく、ガスやむくみが気になるタイプ。FODMAPを多く含む食品が腸内でガスを発生させ、代謝を下げている可能性があります。",
    desc:"腸内細菌がFODMAP（発酵性の糖質）を分解する際に大量のガスが発生し、お腹の張りやむくみにつながっています。このタイプは食べるものの「種類」を見直すことが、ダイエット成功への最短ルートです。",
    demerits:[
      {title:"FODMAPへの感受性がどんどん高まる",detail:"FODMAP（発酵性の糖質）に対する腸の過敏反応は、放置すると感受性が高まる一方です。今は豆類やパンでお腹が張る程度でも、次第に野菜・果物まで反応が広がり、食べられるものが減っていくリスクがあります。"},
      {title:"腸内細菌のバランスが崩れ、脂肪が燃えにくい体になる",detail:"膨らみ型の方はメタン産生菌が増えやすい傾向があります。このメタン産生菌が増えると腸の動きが遅くなり、同じ食事でも通常より多くカロリーが吸収されることが研究で示されています。"},
      {title:"腸のバリア機能が低下し、全身の慢性炎症につながる",detail:"腸内でガスが産生され続けると腸壁への慢性的な刺激となり「腸漏れ（リーキーガット）」が起きやすくなります。腸のバリアが破れると毒素が血流に乗って全身を回り、疲労感・肌荒れの原因となります。"},
      {title:"ストレスホルモンが増加し、腹部に脂肪がつきやすくなる",detail:"お腹の不快感が続くと脳がストレスとして認識し、コルチゾール（ストレスホルモン）の分泌が増加します。コルチゾールが慢性的に高い状態では内臓脂肪の蓄積が促進されます。"},
      {title:"代謝が低下し、少食でも太りやすい体質が定着する",detail:"腸内環境の悪化は短鎖脂肪酸の産生低下につながります。短鎖脂肪酸は脂肪細胞への脂肪蓄積を抑制するはたらきがあり、これが減ると少量の食事でも脂肪として蓄えられやすい体質になっていきます。"},
    ],
  },
  con: {
    icon:"🪨", name:"ためこみ型", badge:"腸の動きが遅く、毒素をためこんでいる状態",
    sub:"便秘がちで、お腹に便がたまりやすいタイプ。腸の蠕動運動が弱く、腸内に毒素がたまりやすい状態です。",
    desc:"腸の蠕動運動が低下し、腸内容物がゆっくり移動することで水分が過剰に吸収され、便が硬くなっています。このタイプは「腸を動かす」食事と生活習慣の改善が優先事項です。",
    demerits:[
      {title:"腸内に毒素がたまり続け、慢性的な全身疲労が起きる",detail:"便が腸内に長時間とどまると、腸内細菌が産生するアンモニアや硫化水素などの毒素が腸壁から吸収されやすくなります。これが血流に乗って全身を回り、慢性的な疲労感・頭重感・集中力低下につながります。"},
      {title:"短鎖脂肪酸が産生されず、脂肪燃焼スイッチが入らない",detail:"腸内環境が悪化すると、善玉菌が食物繊維から短鎖脂肪酸を産生する力が落ちます。短鎖脂肪酸は脂肪細胞への脂肪蓄積を抑制するはたらきがあり、これが減ることでカロリー制限しても痩せにくい体になっていきます。"},
      {title:"腸内フローラの多様性が低下し、免疫機能が落ちる",detail:"便秘が続くと腸内の悪玉菌が優勢になり、腸内フローラの多様性が低下します。腸には体の免疫細胞の約70%が集中しており、腸内環境の悪化は風邪・アレルギー・慢性炎症のリスクを高めます。"},
      {title:"肌荒れ・くすみが悪化し、老け見えが加速する",detail:"腸内の毒素が血流を通じて皮膚に届くと、ニキビ・くすみ・乾燥として現れます。いくらスキンケアを変えても根本の腸内環境が改善しない限り、肌荒れはくり返します。"},
      {title:"セロトニン産生が低下し、気分の落ち込み・食欲異常が起きる",detail:"セロトニン（幸福ホルモン）の約90%は腸で作られます。腸内環境が乱れてセロトニン産生が落ちると、気分の落ち込みや甘いものへの強い欲求が起きやすくなり、ダイエットが続かなくなります。"},
    ],
  },
  dia: {
    icon:"🌊", name:"敏感型", badge:"脳腸相関の乱れが痩せにくさを作っている",
    sub:"ストレスでお腹が痛くなりやすく、下痢や軟便が多いタイプ。腸と脳が過敏に反応し合っている状態です。",
    desc:"腸脳軸（ガット・ブレイン・アクシス）の過敏な反応により、ストレスが腸の動きに直接影響しています。このタイプはストレスケアを最優先にしながら、腸粘膜を修復する食事アプローチが効果的です。",
    demerits:[
      {title:"コルチゾール過剰で内臓脂肪がどんどん蓄積される",detail:"慢性的なストレス状態ではコルチゾール（ストレスホルモン）が常に高い状態になります。コルチゾールは内臓脂肪の蓄積を直接促進するホルモンであり、食事を制限しても内臓脂肪が落ちにくい体になっていきます。"},
      {title:"腸粘膜が傷つき、リーキーガットが起きやすくなる",detail:"腸の過敏な収縮・弛緩がくり返されると腸粘膜のバリア機能が低下します。リーキーガット（腸漏れ）が起きると未消化のタンパク質や毒素が血流に入り込み、全身性の慢性炎症・アレルギー反応が起きやすくなります。"},
      {title:"セロトニン異常で食欲コントロールができなくなる",detail:"敏感型は腸内のセロトニン代謝が乱れやすく、過剰なセロトニン放出が腸の痙攣・下痢を引き起こします。同時に脳へのセロトニン供給が不安定になり、気分の波・衝動食い・夜間の過食につながります。"},
      {title:"栄養の吸収が不安定になり、代謝が落ちる",detail:"下痢が頻繁に起きると食事から摂った栄養が十分に吸収されません。ミネラル・ビタミンの慢性的な不足が基礎代謝の低下につながり、食べる量を減らしても体重が落ちない悪循環が生まれます。"},
      {title:"腸脳軸の過敏化が進み、ストレスへの耐性がどんどん落ちる",detail:"腸の過敏状態が続くと脳側のストレス応答システムも過敏化していきます。小さなストレスでも腸が反応するようになり、腸の症状→ストレス→さらに腸が悪化という悪循環が深まっていきます。"},
    ],
  },
  mix: {
    icon:"🔄", name:"気まぐれ型", badge:"腸内フローラの多様性低下が根本原因",
    sub:"便秘と下痢を繰り返し、体調が安定しないタイプ。腸内フローラの多様性が低下している状態です。",
    desc:"腸内細菌の種類と量のバランスが崩れているため、日によって腸の動きが正反対になります。このタイプは特定の善玉菌を補充するより、腸内フローラの多様性を上げることが優先事項です。",
    demerits:[
      {title:"腸内フローラの多様性低下が加速し、回復が難しくなる",detail:"気まぐれ型は腸内細菌の種類が少ない状態です。多様性の低い腸内フローラは外部からのダメージ（食事の乱れ・抗生物質・ストレス）に弱く、一度崩れると元に戻りにくくなります。研究では、腸内フローラの多様性が低い人は体重管理が困難なケースが多いことが示されています。"},
      {title:"体重の増減が不安定になり、リバウンドをくり返す",detail:"腸内フローラが不安定だと、エネルギー代謝も不安定になります。食事を制限すると急激に体重が落ちる一方、少し食べ過ぎるとすぐリバウンドするという「体重の乱高下」が起きやすくなります。"},
      {title:"慢性的な低栄養状態が続き、疲労・抜け毛・肌荒れが悪化する",detail:"便秘と下痢をくり返す状態では、栄養の吸収が常に不安定です。タンパク質・ミネラル・ビタミンが慢性的に不足し、疲れやすさ・抜け毛・肌の乾燥として現れやすくなります。"},
      {title:"免疫の過剰反応が起きやすくなり、アレルギーが悪化する",detail:"腸内フローラの多様性が低いと免疫の調整機能が弱まります。免疫が過剰反応を起こしやすくなり、花粉症・食物アレルギー・アトピーが悪化するリスクが高まります。"},
      {title:"腸内の炎症が全身に波及し、老化を加速させる",detail:"気まぐれ型の方は腸内で慢性的な低レベルの炎症が起きていることが多いです。この「サイレントな炎症」が血流を通じて全身に広がり、細胞の老化促進・代謝低下・体型の変化につながります。"},
    ],
  },
};

function calcResult(scores: Scores): ResultType {
  const entries = Object.entries(scores) as [ResultType, number][];
  return entries.reduce((a, b) => a[1] >= b[1] ? a : b)[0];
}

const GREEN = '#2D6A4F';
const LINE_URL = 'https://lin.ee/TzDjpAxf'; // ← ここにLINE公式アカウントURLを入力

export default function App() {
  const [screen, setScreen] = useState<'start' | 'quiz' | 'loading' | 'result'>('start');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(20).fill(-1));
  const [scores, setScores] = useState<Scores>({ gas: 0, con: 0, dia: 0, mix: 0 });
  const [result, setResult] = useState<ResultType | null>(null);

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);

    const q = QUESTIONS[current];
    const s = q.scores[idx];
    const newScores = {
      gas: scores.gas + s.gas,
      con: scores.con + s.con,
      dia: scores.dia + s.dia,
      mix: scores.mix + s.mix,
    };
    setScores(newScores);

    if (current + 1 < QUESTIONS.length) {
      setCurrent(current + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setScreen('loading');
      setTimeout(() => {
        setResult(calcResult(newScores));
        setScreen('result');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000);
    }
  };

  // ── START ──
  if (screen === 'start') return (
    <div style={{ minHeight: '100vh', background: '#f9f6f0', fontFamily: "'Hiragino Sans','Noto Sans JP',sans-serif" }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 40px' }}>
        <div style={{ background: GREEN, color: 'white', textAlign: 'center', padding: '32px 20px 28px' }}>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 8 }}>くるみ｜腸からやせる研究家</div>
          <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.4, marginBottom: 12 }}>
            腸内タイプ診断
          </div>
          <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.7 }}>
            20問・約5分で<br />あなたの腸タイプがわかります
          </div>
        </div>

        <div style={{ background: 'white', margin: '16px 0', padding: '20px', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8, margin: 0 }}>
            「食べる量を減らしているのに痩せない」<br />
            その原因、腸内環境にあるかもしれません。<br /><br />
            腸内タイプは4種類あり、<strong>タイプが違うと同じ腸活でも逆効果になることがあります。</strong><br /><br />
            まずあなたのタイプを知ることが、最短ルートです。
          </p>
        </div>

        <div style={{ background: '#fff8f0', border: '1px solid #f0d9b5', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#b45309', fontWeight: 700, marginBottom: 8 }}>診断について</div>
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: '#78716c', lineHeight: 2 }}>
            <li>全20問・約5分で完了</li>
            <li>Rome IV基準をもとに設計</li>
            <li>4タイプ（膨らみ型・ためこみ型・敏感型・気まぐれ型）</li>
            <li>医療診断ではありません</li>
          </ul>
        </div>

        <button
          onClick={() => setScreen('quiz')}
          style={{ display: 'block', width: '100%', background: GREEN, color: 'white', fontWeight: 700, fontSize: 16, padding: '16px', borderRadius: 14, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(45,106,79,0.3)' }}
        >
          診断をスタートする →
        </button>
      </div>
    </div>
  );

  // ── QUIZ ──
  if (screen === 'quiz') {
    const q = QUESTIONS[current];
    const section = SECTIONS[current];
    const prevSection = current > 0 ? SECTIONS[current - 1] : null;
    const showSection = section !== prevSection;

    return (
      <div style={{ minHeight: '100vh', background: '#f9f6f0', fontFamily: "'Hiragino Sans','Noto Sans JP',sans-serif" }}>
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 40px' }}>
          <div style={{ background: GREEN, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: 'white', fontSize: 13 }}>Q{current + 1} / {QUESTIONS.length}</span>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>{section}</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 4, height: 6 }}>
              <div style={{ background: 'white', borderRadius: 4, height: 6, width: `${((current + 1) / QUESTIONS.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
          </div>

          {showSection && current > 0 && (
            <div style={{ background: '#e8f5e9', padding: '10px 16px', textAlign: 'center', fontSize: 13, color: GREEN, fontWeight: 700, borderBottom: '1px solid #c8e6c9' }}>
              次のセクション：{section}
            </div>
          )}

          <div style={{ padding: '24px 0 16px' }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#1c1917', lineHeight: 1.6, marginBottom: 24 }}>
              {q.q}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.choices.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  style={{ background: 'white', border: '2px solid #e7e5e4', borderRadius: 12, padding: '14px 16px', fontSize: 14, color: '#1c1917', textAlign: 'left', cursor: 'pointer', lineHeight: 1.5, transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = GREEN; (e.target as HTMLButtonElement).style.background = '#f0faf4'; }}
                  onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = '#e7e5e4'; (e.target as HTMLButtonElement).style.background = 'white'; }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── LOADING ──
  if (screen === 'loading') return (
    <div style={{ minHeight: '100vh', background: '#f9f6f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Hiragino Sans','Noto Sans JP',sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: 'spin 1s linear infinite' }}>🌿</div>
        <p style={{ fontSize: 16, color: GREEN, fontWeight: 700 }}>診断結果を分析しています…</p>
        <p style={{ fontSize: 13, color: '#78716c', marginTop: 8 }}>あなたの腸タイプを判定中</p>
      </div>
    </div>
  );

  // ── RESULT ──
  if (screen === 'result' && result) {
    const R = RESULTS[result];
    const total = scores.gas + scores.con + scores.dia + scores.mix;

    return (
      <div style={{ minHeight: '100vh', background: '#f9f6f0', fontFamily: "'Hiragino Sans','Noto Sans JP',sans-serif" }}>
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 40px' }}>

          {/* ヘッダー */}
          <div style={{ background: GREEN, color: 'white', textAlign: 'center', padding: '28px 20px 24px' }}>
            <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 12 }}>診断結果</div>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{R.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>あなたは<span style={{ fontSize: 28 }}>「{R.name}」</span>です</div>
            <div style={{ fontSize: 13, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '6px 16px', display: 'inline-block', marginTop: 4 }}>
              {R.badge}
            </div>
          </div>

          {/* 根本原因ヘッダー */}
          <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 12, padding: '16px', margin: '16px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#856404', fontWeight: 700, marginBottom: 4 }}>あなたが痩せなかった根本原因</div>
            <div style={{ fontSize: 16, color: '#533f03', fontWeight: 700, lineHeight: 1.5 }}>
              「{R.name}」の腸にありました
            </div>
          </div>

          {/* タイプ説明 */}
          <div style={{ background: 'white', borderRadius: 12, padding: '20px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 14, color: '#44403c', lineHeight: 1.9, margin: '0 0 12px' }}>{R.sub}</p>
            <p style={{ fontSize: 14, color: '#57534e', lineHeight: 1.9, margin: 0 }}>{R.desc}</p>
          </div>

          {/* スコアバー */}
          <div style={{ background: 'white', borderRadius: 12, padding: '20px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#44403c', marginBottom: 14 }}>タイプ別スコア</div>
            {(['gas','con','dia','mix'] as ResultType[]).map(k => {
              const labels: Record<ResultType,string> = { gas:'膨らみ型', con:'ためこみ型', dia:'敏感型', mix:'気まぐれ型' };
              const pct = total > 0 ? Math.round((scores[k] / total) * 100) : 0;
              return (
                <div key={k} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#78716c', marginBottom: 4 }}>
                    <span style={{ fontWeight: k === result ? 700 : 400, color: k === result ? GREEN : '#78716c' }}>{labels[k]}{k === result ? ' ◀ あなた' : ''}</span>
                    <span>{pct}%</span>
                  </div>
                  <div style={{ background: '#f5f5f4', borderRadius: 4, height: 8 }}>
                    <div style={{ background: k === result ? GREEN : '#d6d3d1', borderRadius: 4, height: 8, width: `${pct}%`, transition: 'width 0.5s' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* このままにしておくと… */}
          <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 12, padding: '20px', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#dc2626', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              ⚠️ このままにしておくと起こりうること
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {R.demerits.map((d, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 10, padding: '14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', marginBottom: 6 }}>
                    {i + 1}. {d.title}
                  </div>
                  <p style={{ fontSize: 12, color: '#57534e', lineHeight: 1.8, margin: 0 }}>{d.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* お試し版＋30日プログラム予告 */}
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 12, padding: '18px', marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#166534', marginBottom: 6, fontWeight: 700 }}>📋 この診断はお試し版です</div>
            <p style={{ fontSize: 13, color: '#166534', lineHeight: 1.8, margin: 0 }}>
              さらに詳しい診断は<br />
              <strong>30日間プログラムの中でご案内しています。</strong><br />
              まずは腸活ガイドブックを受け取ってください。
            </p>
          </div>

          {/* 腸活ガイドブック無料プレゼント */}
          <div style={{ background: 'white', border: '2px solid ' + GREEN, borderRadius: 16, padding: '24px 20px', marginBottom: 20, boxShadow: '0 4px 16px rgba(45,106,79,0.15)' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 11, background: GREEN, color: 'white', borderRadius: 20, padding: '4px 12px', display: 'inline-block', marginBottom: 10, fontWeight: 700 }}>
                🎁 無料プレゼント
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1c1917', lineHeight: 1.4 }}>
                腸活ガイドブック
              </div>
              <div style={{ fontSize: 13, color: '#57534e', marginTop: 6 }}>
                あなたの腸タイプに合った<br />腸活の始め方をまとめました
              </div>
            </div>

            <a
              href={LINE_URL}
              style={{ display: 'block', width: '100%', background: GREEN, color: 'white', fontWeight: 700, fontSize: 16, padding: '16px', borderRadius: 14, border: 'none', textAlign: 'center', textDecoration: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(45,106,79,0.3)' }}
            >
              無料で受け取る →
            </a>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <button
              onClick={() => { setScreen('start'); setCurrent(0); setAnswers(new Array(20).fill(-1)); setResult(null); setScores({ gas: 0, con: 0, dia: 0, mix: 0 }); }}
              style={{ background: 'none', border: 'none', fontSize: 13, color: '#999', textDecoration: 'underline', cursor: 'pointer' }}
            >
              もう一度診断する
            </button>
          </div>

          <p style={{ fontSize: 12, textAlign: 'center', color: '#888', lineHeight: 1.7 }}>
            ※ この診断は医療診断ではありません。<br />心身ともに健康な方を対象としています。その他の方は医療機関にご相談ください。
          </p>
        </div>
      </div>
    );
  }

  return null;
}
