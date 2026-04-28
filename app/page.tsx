'use client'

import { useState } from 'react'



// ─── Types ───────────────────────────────────
type TypeKey = 'fukurami' | 'tamekami' | 'binkan' | 'kimagure'

interface Answer { value: number; label: string; scores: Partial<Record<TypeKey, number>> }
interface Question {
  id: number
  text: string
  options: Answer[]
}

// ─── Questions (20問 Rome IV基準) ────────────
const QUESTIONS: Question[] = [
  // Q1〜5：基本的な排便パターン
  {
    id: 1,
    text: '1週間の排便回数はどのくらいですか？',
    options: [
      { value: 0, label: '週7回以上（毎日以上）', scores: {} },
      { value: 1, label: '週1〜2回（少ない）', scores: { tamekami: 2 } },
      { value: 2, label: '週3〜4回（やや少ない）', scores: { fukurami: 1 } },
      { value: 3, label: '週5〜6回（ほぼ毎日）', scores: { binkan: 1, kimagure: 1 } },
      { value: 4, label: '毎日または不規則（多いときと少ないときがある）', scores: { binkan: 2 } },
    ],
  },
  {
    id: 2,
    text: '便の形・硬さはどれに近いですか？',
    options: [
      { value: 0, label: '普通（バナナ状・柔らかい）', scores: {} },
      { value: 1, label: 'コロコロ・硬い（ウサギのふんのよう）', scores: { tamekami: 3 } },
      { value: 2, label: '柔らかすぎる・泥状', scores: { binkan: 2 } },
      { value: 3, label: '水様・液状に近い', scores: { binkan: 3 } },
      { value: 4, label: '硬いときと柔らかいときが交互に来る', scores: { kimagure: 3 } },
    ] as Answer[],
  },
  {
    id: 3,
    text: '排便のときに「いきみ」が必要ですか？',
    options: [
      { value: 0, label: 'ほとんどない', scores: {} },
      { value: 1, label: 'ときどきある', scores: { tamekami: 1 } },
      { value: 2, label: 'よくある（4回に1回以上）', scores: { tamekami: 2 } },
      { value: 3, label: 'ほぼ毎回いきまないと出ない', scores: { tamekami: 3 } },
    ] as Answer[],
  },
  {
    id: 4,
    text: '排便後に「残っている感じ（残便感）」がありますか？',
    options: [
      { value: 0, label: 'ほとんどない', scores: {} },
      { value: 1, label: 'ときどきある', scores: { tamekami: 1, fukurami: 1 } },
      { value: 2, label: 'よくある', scores: { tamekami: 2, kimagure: 1 } },
      { value: 3, label: 'ほぼ毎回ある', scores: { tamekami: 3, kimagure: 2 } },
    ] as Answer[],
  },
  {
    id: 5,
    text: '急にトイレに行きたくなる「切迫感」はありますか？',
    options: [
      { value: 0, label: 'ほとんどない', scores: {} },
      { value: 1, label: 'ときどきある', scores: { binkan: 1 } },
      { value: 2, label: '週に2〜3回ある', scores: { binkan: 2 } },
      { value: 3, label: 'ほぼ毎日ある', scores: { binkan: 3, kimagure: 1 } },
    ] as Answer[],
  },
  // Q6〜10：お腹の症状
  {
    id: 6,
    text: '食後にお腹が「張る・膨らむ」感覚はありますか？',
    options: [
      { value: 0, label: 'ほとんどない', scores: {} },
      { value: 1, label: 'ときどきある（週1〜2回）', scores: { fukurami: 1 } },
      { value: 2, label: 'よくある（週3〜4回）', scores: { fukurami: 2 } },
      { value: 3, label: 'ほぼ毎食後にある', scores: { fukurami: 3 } },
    ] as Answer[],
  },
  {
    id: 7,
    text: 'お腹のガス（おなら・げっぷ）の量はどうですか？',
    options: [
      { value: 0, label: '特に気にならない', scores: {} },
      { value: 1, label: 'やや多い気がする', scores: { fukurami: 1 } },
      { value: 2, label: 'かなり多い・気になる', scores: { fukurami: 2 } },
      { value: 3, label: 'とても多く日常生活に影響する', scores: { fukurami: 3 } },
    ] as Answer[],
  },
  {
    id: 8,
    text: 'お腹の痛み・不快感はありますか？',
    options: [
      { value: 0, label: 'ほとんどない', scores: {} },
      { value: 1, label: 'ときどきある', scores: { binkan: 1, fukurami: 1 } },
      { value: 2, label: '週に2〜3回ある', scores: { binkan: 2, kimagure: 1 } },
      { value: 3, label: 'ほぼ毎日ある', scores: { binkan: 3, kimagure: 2 } },
    ] as Answer[],
  },
  {
    id: 9,
    text: 'お腹の痛みは排便すると楽になりますか？',
    options: [
      { value: 0, label: 'お腹の痛みがない', scores: {} },
      { value: 1, label: '排便後に楽になる', scores: { binkan: 2 } },
      { value: 2, label: '排便しても変わらない', scores: { tamekami: 1, kimagure: 1 } },
      { value: 3, label: '排便後にかえって悪化することがある', scores: { kimagure: 2 } },
    ] as Answer[],
  },
  {
    id: 10,
    text: 'お腹の症状は1日の中でどの時間帯に多いですか？',
    options: [
      { value: 0, label: '特定の時間はない', scores: {} },
      { value: 1, label: '朝起きたとき', scores: { binkan: 1 } },
      { value: 2, label: '食後（特に昼〜夜）', scores: { fukurami: 2 } },
      { value: 3, label: 'ストレスがかかったとき', scores: { binkan: 2 } },
      { value: 4, label: '不規則・いつでも起きる', scores: { kimagure: 2 } },
    ] as Answer[],
  },
  // Q11〜15：食事との関係
  {
    id: 11,
    text: '豆類・玉ねぎ・小麦（パン・パスタ）を食べると症状が悪化しますか？',
    options: [
      { value: 0, label: '特に感じない', scores: {} },
      { value: 1, label: 'ときどき悪化する気がする', scores: { fukurami: 1 } },
      { value: 2, label: 'よく悪化する', scores: { fukurami: 3 } },
      { value: 3, label: 'これらを食べると必ず悪化する', scores: { fukurami: 3, kimagure: 1 } },
    ] as Answer[],
  },
  {
    id: 12,
    text: '牛乳・乳製品（ヨーグルト・チーズ）を摂ると不調になりますか？',
    options: [
      { value: 0, label: '特に問題ない', scores: {} },
      { value: 1, label: 'ときどき不調になる', scores: { fukurami: 1, binkan: 1 } },
      { value: 2, label: 'よく不調になる', scores: { fukurami: 2, binkan: 1 } },
    ] as Answer[],
  },
  {
    id: 13,
    text: '1日の水分摂取量はどのくらいですか？',
    options: [
      { value: 0, label: '2L以上（十分に飲んでいる）', scores: {} },
      { value: 1, label: '1〜1.5L程度', scores: {} },
      { value: 2, label: '0.5〜1L（あまり飲まない）', scores: { tamekami: 2 } },
      { value: 3, label: 'ほとんど飲まない', scores: { tamekami: 3 } },
    ] as Answer[],
  },
  {
    id: 14,
    text: '野菜・海藻・発酵食品をどのくらい食べていますか？',
    options: [
      { value: 0, label: '毎日しっかり食べている', scores: {} },
      { value: 1, label: '週3〜4回は食べている', scores: { tamekami: 1 } },
      { value: 2, label: 'あまり食べていない', scores: { tamekami: 2, kimagure: 1 } },
      { value: 3, label: 'ほとんど食べていない', scores: { tamekami: 3, kimagure: 2 } },
    ] as Answer[],
  },
  {
    id: 15,
    text: '食事の時間は規則正しいですか？',
    options: [
      { value: 0, label: '毎日ほぼ同じ時間に食べている', scores: {} },
      { value: 1, label: 'だいたい同じ時間', scores: {} },
      { value: 2, label: 'バラバラなことが多い', scores: { kimagure: 1, binkan: 1 } },
      { value: 3, label: '食べる時間が毎日全然違う', scores: { kimagure: 2, binkan: 1 } },
    ] as Answer[],
  },
  // Q16〜20：ストレス・生活習慣
  {
    id: 16,
    text: 'ストレスを感じるとお腹の調子が悪くなりますか？',
    options: [
      { value: 0, label: 'ほとんど関係ない', scores: {} },
      { value: 1, label: 'ときどき影響する', scores: { binkan: 1 } },
      { value: 2, label: 'よく影響する', scores: { binkan: 2 } },
      { value: 3, label: 'ストレス→即お腹が痛くなる', scores: { binkan: 3 } },
    ] as Answer[],
  },
  {
    id: 17,
    text: '睡眠は十分に取れていますか？',
    options: [
      { value: 0, label: '7〜8時間しっかり寝られている', scores: {} },
      { value: 1, label: '6時間程度（やや不足）', scores: { binkan: 1 } },
      { value: 2, label: '5時間以下（かなり不足）', scores: { binkan: 2, tamekami: 1 } },
      { value: 3, label: '睡眠が浅く・夜中に目が覚める', scores: { binkan: 2, kimagure: 1 } },
    ] as Answer[],
  },
  {
    id: 18,
    text: '運動習慣はありますか？',
    options: [
      { value: 0, label: '週3回以上（定期的に運動している）', scores: {} },
      { value: 1, label: '週1〜2回', scores: {} },
      { value: 2, label: 'ほとんど運動していない', scores: { tamekami: 1, kimagure: 1 } },
      { value: 3, label: '座りっぱなしの生活が多い', scores: { tamekami: 2, kimagure: 1 } },
    ] as Answer[],
  },
  {
    id: 19,
    text: 'ダイエットを試みたことはありますか？その結果は？',
    options: [
      { value: 0, label: 'ダイエットをしたことがない', scores: {} },
      { value: 1, label: '試したが続かなかった（挫折）', scores: { binkan: 1, kimagure: 1 } },
      { value: 2, label: '一時的に成功したがリバウンドした', scores: { kimagure: 2 } },
      { value: 3, label: '何度やっても体重が変わらなかった', scores: { tamekami: 2, fukurami: 1 } },
    ] as Answer[],
  },
  {
    id: 20,
    text: '現在もっとも気になる体の悩みは何ですか？',
    options: [
      { value: 0, label: '食後のお腹の張り・ガスが気になる', scores: { fukurami: 2 } },
      { value: 1, label: '便秘がちで体が重い', scores: { tamekami: 2 } },
      { value: 2, label: 'ストレスでお腹を壊しやすい', scores: { binkan: 2 } },
      { value: 3, label: '便秘と下痢を繰り返す', scores: { kimagure: 2 } },
      { value: 4, label: '体重がなかなか落ちない', scores: { tamekami: 1, fukurami: 1, kimagure: 1 } },
    ] as Answer[],
  },
]

// ─── Result Data ──────────────────────────────
const RESULTS: Record<TypeKey, {
  emoji: string
  name: string
  subtitle: string
  description: string
  demerits: { title: string; detail: string }[]
  improvements: { title: string; detail: string }[]
}> = {
  fukurami: {
    emoji: '💨',
    name: '膨らみ型',
    subtitle: '食後にお腹が張る・ガスが多い',
    description: 'FODMAPと呼ばれる発酵性の糖質に腸が過敏に反応するタイプです。善玉菌と悪玉菌のバランスが崩れ、腸内でガスが過剰産生されています。このタイプは「正しい食べ方」を知るだけで、お腹の張りが改善し、自然と体重が落ちやすい環境が整っていきます。',
    demerits: [
      {
        title: 'FODMAPへの感受性がどんどん高まる',
        detail: 'FODMAP（発酵性の糖質）に対する腸の過敏反応は、放置すると感受性が高まる一方です。今は豆類やパンでお腹が張る程度でも、次第に野菜・果物まで反応が広がり、食べられるものが減っていくリスクがあります。研究では、腸内の悪玉菌がFODMAPを発酵させてガスを産生し続けることで、腸壁への圧力が慢性化することが示されています。',
      },
      {
        title: '腸内細菌のバランスが崩れ、脂肪が燃えにくい体になる',
        detail: '膨らみ型の方はメタン産生菌（Methanobrevibacter smithii）が増えやすい傾向があります。このメタン産生菌が増えると腸の動きが遅くなり、カロリー吸収効率が上がることが複数の研究で示されています。つまり「少し食べただけなのに太る」という状態が加速していきます。',
      },
      {
        title: '腸のバリア機能が低下し、リーキーガットのリスクが上昇する',
        detail: '腸内でガスが産生され続けると、腸壁への慢性的な刺激となり「腸漏れ（リーキーガット）」が起きやすくなります。腸のバリアが破れると、本来吸収されないはずの毒素や未消化物が血流に乗って全身を回り、慢性的な炎症・疲労感・肌荒れの原因となります。',
      },
      {
        title: 'ストレスホルモンが増加し、腹部に脂肪がつきやすくなる',
        detail: 'お腹の不快感・痛みが続くと、脳がそれをストレスとして認識し、コルチゾール（ストレスホルモン）の分泌が増加します。コルチゾールが慢性的に高い状態では、内臓脂肪が蓄積されやすくなることがわかっています。「お腹が張るだけ」と思っていても、体重管理に直接影響しているのです。',
      },
      {
        title: 'セロトニン産生が低下し、甘いものへの欲求が強まる',
        detail: '腸内環境の悪化はセロトニン（幸福ホルモン）の産生にも影響します。セロトニンの約90%は腸で作られており、腸内フローラが乱れるとその産生量が低下します。セロトニンが不足すると脳が甘い物・脂質を強く求めるようになり、食欲コントロールがさらに難しくなります。',
      },
    ],
    improvements: [
      {
        title: 'FODMAP食品を2週間だけ控えてみる',
        detail: '豆類・小麦・玉ねぎ・乳製品・りんごなどFODMAPの多い食品を一時的に減らします。腸内のガス産生が落ち着き、張りや不快感が改善します。長期的な禁止ではなく「腸をリセットする期間」として取り組むのがポイントです。',
      },
      {
        title: '消化酵素を意識した食べ方に変える',
        detail: '一口30回以上噛む・食事は落ち着いた環境でゆっくり食べる・消化酵素を含む大根おろしや生姜を添えるなど、腸への負担を減らす食べ方を習慣にします。',
      },
      {
        title: '水溶性食物繊維を中心に腸内環境を整える',
        detail: 'オクラ・昆布・わかめ・大麦など水溶性食物繊維は善玉菌のエサになり、ガス産生が少ない腸内環境を作ります。不溶性食物繊維（ごぼう・玄米）より水溶性から始めるのがこのタイプには適しています。',
      },
      {
        title: '食後15分のウォーキングで腸の動きを促す',
        detail: '食後すぐ横になる習慣はガスを腸内に留める原因になります。軽いウォーキングで腸の蠕動運動を促し、ガスの排出をスムーズにすることができます。',
      },
      {
        title: '腸マッサージで腸内のガスを流す',
        detail: '就寝前に仰向けになり、おへその周りを時計回りに優しく押さえるマッサージを行います。腸のガスが動き、膨満感が和らぎます。継続することで腸の動きが活発になり、朝の排便リズムが整ってきます。',
      },
    ],
  },

  tamekami: {
    emoji: '🪨',
    name: 'ためこみ型',
    subtitle: '排便が少ない・コロコロ便が続く',
    description: '腸の蠕動運動が弱く、腸内で便が長時間滞留しているタイプです。短鎖脂肪酸の産生が低下しており、脂肪燃焼のスイッチが入りにくい状態です。このタイプは腸の動きを取り戻すことで、体が軽くなる感覚を最も早く実感しやすいタイプでもあります。',
    demerits: [
      {
        title: '有害物質が腸内で再吸収され続ける',
        detail: '便が腸内に長時間留まると、本来排出されるはずの毒素・老廃物・腸内細菌の代謝産物が再吸収されます。「腸肝循環」と呼ばれるこの現象は、肝臓への負担を増やし、慢性的な疲労・肌荒れ・体臭の原因となります。腸内滞留時間が長いほどリスクが高まることが研究で示されています。',
      },
      {
        title: '短鎖脂肪酸が不足し、脂肪燃焼効率が下がる',
        detail: '腸内の善玉菌が食物繊維を発酵させて作る「短鎖脂肪酸（酪酸・酢酸・プロピオン酸）」は、脂肪細胞への脂肪蓄積を抑制し、脂肪燃焼を促すシグナルを送ります。ためこみ型の方は腸内の善玉菌が少ないため短鎖脂肪酸の産生が低下し、「食べていないのに痩せない」状態が続きます。',
      },
      {
        title: '腸内フローラの多様性が失われ、代謝が低下する',
        detail: '便秘が続くと腸内の細菌多様性が低下します。ハーバード大学の研究では、腸内フローラの多様性が低い人ほど肥満リスクが高く、インスリン感受性が低下することが示されています。悪玉菌が優位な状態が続くことで代謝システム全体が低下します。',
      },
      {
        title: '腸内の慢性炎症が全身に広がる',
        detail: '悪玉菌が産生するLPS（リポポリサッカライド）という毒素が腸壁から血液中に入り込むと、全身性の慢性炎症が起きます。この炎症が続くと免疫機能が低下し、脂肪の燃焼を妨げるインスリン抵抗性が高まります。「なんとなく体が重い」という感覚はこの慢性炎症のサインです。',
      },
      {
        title: '腸と脳の連絡が乱れ、食欲調整が機能しなくなる',
        detail: '腸は「第2の脳」と呼ばれ、満腹感・空腹感を制御するホルモン（レプチン・グレリン）と密接に関係しています。腸内環境が悪化すると、食欲を抑えるレプチンが働きにくくなり、食欲を高めるグレリンが過剰に分泌されるようになります。食べても満足感が得にくい状態が続きます。',
      },
    ],
    improvements: [
      {
        title: '朝起きてすぐに水を1杯飲む',
        detail: '起床直後の空腹時に常温または温かい水を200ml飲みます。これだけで腸の蠕動運動が刺激され、「胃結腸反射」が促されます。朝の排便リズムを作る最も手軽なアクションです。まず1週間続けることで変化を感じられます。',
      },
      {
        title: '水溶性食物繊維を毎食プラスする',
        detail: 'オクラ・昆布・わかめ・りんご・大麦など水溶性食物繊維が豊富な食品を毎食1品足します。水溶性食物繊維は腸内の善玉菌のエサになり短鎖脂肪酸を産生します。同時に水分もしっかり摂ることが重要（水分不足のまま食物繊維だけ増やすと逆効果になることがあります）。',
      },
      {
        title: '発酵食品で善玉菌を毎日補充する',
        detail: '納豆・味噌・ぬか漬けなど植物性乳酸菌を含む和の発酵食品を毎日1品取り入れます。植物性乳酸菌は腸への定着率が高く、継続することで腸内フローラが整い始めます。ヨーグルトより和の発酵食品の方がこのタイプには効果的です。',
      },
      {
        title: 'マグネシウムを意識して摂る',
        detail: 'マグネシウムは腸内に水分を引き込み、便を柔らかくする作用があります。ナッツ類・豆類・豆腐・ほうれん草・バナナなどに豊富です。便が硬くてなかなか出ないという方に特に効果的なアプローチです。',
      },
      {
        title: '座り時間を意識的に減らす',
        detail: '長時間座った状態は腸の動きを鈍らせます。1時間に1回は立ち上がって歩く・食後は5〜10分だけ外を歩くなど、腸を動かす機会を意識的に作ります。運動習慣がなくても「座りすぎを減らす」だけで腸の蠕動運動が改善します。',
      },
    ],
  },

  binkan: {
    emoji: '⚡',
    name: '敏感型',
    subtitle: 'ストレスでお腹が痛くなる・下痢になりやすい',
    description: '腸脳軸（腸と脳をつなぐ神経ネットワーク）が過敏になっているタイプです。ストレスが腸に直撃しやすく、腸粘膜のバリア機能が低下しています。このタイプはまず「食事より先にストレスを減らす」ことが最も重要で、それだけで腸の状態が大きく変わります。',
    demerits: [
      {
        title: '腸脳軸の過敏が慢性化し、ストレス反応が増幅される',
        detail: '腸と脳は迷走神経・ホルモン・免疫システムを通じて「腸脳軸」でつながっています。敏感型の方はこの腸脳軸が過敏になっており、ストレスを感じると腸が即座に反応します。放置すると過敏反応がどんどん増幅され、以前は問題なかった食事や状況でも腸が反応するようになっていきます。',
      },
      {
        title: 'セロトニン産生が乱れ、気分の安定が保ちにくくなる',
        detail: 'セロトニンの約90%は腸で産生されます。敏感型の方は腸の状態が不安定なためセロトニン産生が乱れやすく、気分の浮き沈み・不安感・集中力の低下として現れます。さらにセロトニン不足は甘い物・脂質への強い欲求を生み出し、食欲コントロールを困難にします。',
      },
      {
        title: '腸粘膜が傷つき続け、栄養の吸収効率が下がる',
        detail: '慢性的なストレスと腸の過敏反応は、腸粘膜のバリア機能を低下させます。腸粘膜が傷つくと本来吸収されないはずの物質が体内に入り込む「リーキーガット」が起き、全身性の炎症・アレルギー反応が増えます。食べても栄養が体に届きにくい状態が続きます。',
      },
      {
        title: 'コルチゾールが慢性的に高まり、内臓脂肪がつきやすくなる',
        detail: 'ストレスによってコルチゾール（ストレスホルモン）の分泌が増えると、内臓脂肪の蓄積が促進されます。特に腹部への脂肪蓄積と直接関係しており、「ストレスで太る」というのは医学的に根拠があります。敏感型の方がストレスを放置し続けると、ダイエットの効果が出にくくなる一方です。',
      },
      {
        title: '免疫機能が低下し、慢性的な炎症が続く',
        detail: '腸は全免疫細胞の約70%が集まる場所です。腸の過敏状態が続くと免疫システムが誤作動し、慢性的な低レベルの炎症が全身で起きます。この慢性炎症は代謝を低下させ、脂肪燃焼効率を下げます。疲れやすい・風邪を引きやすいという症状もこの免疫の乱れから来ている場合があります。',
      },
    ],
    improvements: [
      {
        title: 'ストレスケアを最優先にする（食事より先）',
        detail: '敏感型の場合、食事をどれだけ改善しても、ストレスが解消されなければ腸は落ち着きません。深呼吸（4秒吸って8秒吐く）・ぬるめのお風呂・好きな音楽を聴く時間など、副交感神経を優位にする習慣を1日1回必ず取り入れることが最重要です。',
      },
      {
        title: 'グルタミンを含む食品で腸粘膜を修復する',
        detail: 'グルタミンは腸粘膜の主要なエネルギー源で、傷ついた腸壁を修復する作用があります。鶏むね肉・卵・キャベツ・大豆製品に豊富です。毎日の食事にこれらを意識的に取り入れることで、腸粘膜のバリア機能が回復していきます。',
      },
      {
        title: '食事を決まった時間に取り、腸のリズムを安定させる',
        detail: '腸は規則正しいリズムが最も得意です。毎日同じ時間に食事を摂ることで、腸の動きが予測可能になり、過敏反応が減っていきます。食事時間の乱れは自律神経を乱し、腸脳軸の過敏を悪化させます。',
      },
      {
        title: 'プロバイオティクスを少量から慎重に始める',
        detail: '敏感型の方が発酵食品を急に大量に増やすと、腸が過敏反応を起こすことがあります。まずは少量（味噌汁1杯・納豆半パック程度）から始め、腸の反応を見ながら徐々に量を増やします。「少しずつ・ゆっくり」が敏感型のキーワードです。',
      },
      {
        title: '睡眠を7時間確保することを腸活の基本にする',
        detail: '睡眠中に腸は修復・再生を行います。睡眠不足は腸脳軸の過敏を直接悪化させることがわかっています。22時〜23時就寝・7時間睡眠を目標に、まず就寝時間を30分早めることから始めてみてください。',
      },
    ],
  },

  kimagure: {
    emoji: '🌀',
    name: '気まぐれ型',
    subtitle: '便秘と下痢を繰り返す・腸の状態が不安定',
    description: '腸内フローラの多様性が低下し、腸の動きが不安定なタイプです。便秘と下痢を繰り返すことで腸粘膜に慢性的なダメージが蓄積されています。このタイプは「多様性を取り戻す」ことが鍵で、複数のアプローチを組み合わせることで腸が安定していきます。',
    demerits: [
      {
        title: '腸内フローラの多様性が失われ続け、代謝が不安定になる',
        detail: '気まぐれ型の方は腸内細菌の種類（多様性）が低下している傾向があります。欧米の大規模研究では、腸内フローラの多様性が低い人ほど肥満・糖尿病・心疾患リスクが高いことが示されています。多様性が下がると短鎖脂肪酸の産生が不安定になり、代謝が一定に保てなくなります。',
      },
      {
        title: '便秘と下痢を繰り返すことで腸粘膜が慢性ダメージを受ける',
        detail: '便秘時のいきみは腸壁に物理的な圧力をかけ、下痢時の急激な腸の収縮は腸粘膜を傷つけます。この繰り返しが腸粘膜の修復を追いつかなくさせ、リーキーガットの状態が慢性化します。腸粘膜が正常に機能しないと、どんな食事をしても栄養の吸収が不安定になります。',
      },
      {
        title: '栄養吸収が不規則になり、体重管理が困難になる',
        detail: '腸の状態が日によって違うため、同じ食事をしても吸収されるカロリーや栄養素が変動します。「今日は食べていないのに増えた」「昨日より体重が落ちた理由がわからない」という体重の不規則な変動は、腸の吸収率の変動が原因であることが多いです。',
      },
      {
        title: '慢性的な炎症が免疫機能を低下させる',
        detail: '腸内環境の不安定さは免疫細胞が集まる腸内リンパ組織に影響し、慢性的な低レベル炎症が続きます。この慢性炎症はインスリン感受性を下げ、脂肪が燃えにくい体内環境を作ります。風邪を引きやすい・アレルギーが出やすいという症状もこの炎症と関係しています。',
      },
      {
        title: 'ホルモンバランスが乱れ、食欲コントロールがさらに難しくなる',
        detail: '腸内環境の不安定さは食欲ホルモン（レプチン・グレリン）の分泌を乱します。また女性ホルモンの代謝にも腸内細菌が関わっているため、気まぐれ型の方はPMS・更年期症状が悪化しやすいリスクがあります。ホルモンバランスの乱れが食欲の波を作り、ダイエットの継続をさらに難しくします。',
      },
    ],
    improvements: [
      {
        title: '発酵食品×食物繊維をセットで毎日摂る',
        detail: '善玉菌（プロバイオティクス）と善玉菌のエサ（プレバイオティクス）を同時に摂ることが腸内フローラの多様性回復に最も効果的です。例：味噌汁（発酵食品）＋わかめ・豆腐（食物繊維・大豆タンパク）を毎日1杯。これだけで腸内の環境が整い始めます。',
      },
      {
        title: '生活リズムを整え、腸の動きを一定にする',
        detail: '起床・食事・睡眠の時間を毎日同じにすることで、腸の蠕動運動リズムが安定します。腸は体内時計と連動しており、リズムが乱れると便秘と下痢を交互に繰り返す原因になります。まず「起床時間を毎日同じにする」だけから始めてみてください。',
      },
      {
        title: '多様な食品を少量ずつ取り入れる',
        detail: '腸内フローラの多様性を上げるには、食品の多様性が重要です。「週に20種類以上の食材を食べる」という目標を持つだけで、腸内細菌の種類が増えやすくなります。一種類の食品を大量に食べるより、少量の様々な食品を組み合わせることが気まぐれ型には特に重要です。',
      },
      {
        title: '冷たい食べ物・飲み物を控え、温かい食事中心にする',
        detail: '冷たい食べ物は腸の動きを急激に変化させ、不安定さを増幅させます。常温以上の飲み物・温かいスープや鍋料理など、腸に優しい温度の食事を意識することで腸の動きが穏やかに安定していきます。',
      },
      {
        title: '1種類のサプリより多様な食品から菌を補充する',
        detail: '気まぐれ型の方に特に重要なのは「多様性」です。単一のプロバイオティクスサプリを高用量で続けるより、納豆・味噌・キムチ・甘酒・ぬか漬けなど様々な発酵食品を少量ずつローテーションで取り入れる方が、腸内フローラの多様性回復に効果的です。',
      },
    ],
  },
}

// ─── Scoring ──────────────────────────────────
function calcResult(answers: Record<number, number>): TypeKey {
  const scores: Record<TypeKey, number> = { fukurami: 0, tamekami: 0, binkan: 0, kimagure: 0 }
  QUESTIONS.forEach((q) => {
    const selectedValue = answers[q.id]
    if (selectedValue === undefined) return
    const option = q.options.find((o) => o.value === selectedValue)
    if (!option) return
    Object.entries(option.scores).forEach(([k, v]) => {
      scores[k as TypeKey] += v as number
    })
  })
  return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]) as TypeKey
}

// ─── App ─────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<'top' | 'quiz' | 'result'>('top')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [result, setResult] = useState<TypeKey | null>(null)
  const [selected, setSelected] = useState<number | null>(null)

  const reset = () => {
    setScreen('top')
    setCurrentQ(0)
    setAnswers({})
    setResult(null)
    setSelected(null)
  }

  const handleAnswer = (value: number) => setSelected(value)

  const handleNext = () => {
    if (selected === null) return
    const newAnswers = { ...answers, [QUESTIONS[currentQ].id]: selected }
    setAnswers(newAnswers)
    setSelected(null)
    if (currentQ + 1 < QUESTIONS.length) {
      setCurrentQ(currentQ + 1)
    } else {
      const type = calcResult(newAnswers)
      setResult(type)
      setScreen('result')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // ── TOP SCREEN ──
  if (screen === 'top') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
              🌰 くるみの腸活ラボ
            </div>
            <h1 className="text-2xl font-bold text-stone-800 leading-snug mb-3">
              あなたが痩せにくい原因は<br />
              <span className="text-amber-700">腸のタイプ</span>にあった
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed">
              食べる量を減らしても痩せないのは<br />
              意志の問題じゃありません。<br />
              20問で「あなたの腸タイプ」を特定します。
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[['📝', '20問', '質問数'], ['⏱', '約5分', '所要時間'], ['🔬', '4タイプ', '判定結果']].map(([e, v, l]) => (
              <div key={l} className="bg-white rounded-2xl p-4 text-center shadow-sm">
                <div className="text-2xl mb-1">{e}</div>
                <div className="font-bold text-stone-800 text-sm">{v}</div>
                <div className="text-xs text-stone-400">{l}</div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
            <p className="text-xs text-amber-700 text-center">
              ⚠️ この診断は医療診断ではありません。症状が重い・長引く場合は必ず医療機関にご相談ください。
            </p>
          </div>

          <button
            onClick={() => setScreen('quiz')}
            className="w-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all shadow-md"
          >
            診断をはじめる →
          </button>
        </div>
      </div>
    )
  }

  // ── QUIZ SCREEN ──
  if (screen === 'quiz') {
    const q = QUESTIONS[currentQ]
    const progress = ((currentQ) / QUESTIONS.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-stone-500 mb-2">
              <span>質問 {currentQ + 1} / {QUESTIONS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
            <p className="text-stone-800 font-bold text-base leading-relaxed">{q.text}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all text-sm font-medium ${
                  selected === opt.value
                    ? 'border-amber-500 bg-amber-50 text-amber-800'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-amber-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={handleNext}
            disabled={selected === null}
            className={`w-full font-bold py-4 px-6 rounded-2xl text-base transition-all ${
              selected !== null
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            {currentQ + 1 < QUESTIONS.length ? '次の質問へ →' : '結果を見る →'}
          </button>
        </div>
      </div>
    )
  }

  // ── RESULT SCREEN ──
  if (screen === 'result' && result) {
    const r = RESULTS[result]

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-50 pb-16">
        <div className="max-w-md mx-auto px-4 pt-8">

          {/* Type reveal */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
              🌰 くるみの腸活ラボ｜診断結果
            </div>
            <div className="text-6xl mb-3">{r.emoji}</div>
            <div className="inline-block bg-amber-600 text-white font-bold text-lg px-6 py-2 rounded-full mb-2">
              あなたは <span className="text-xl">{r.name}</span>
            </div>
            <p className="text-stone-600 text-sm mt-2">{r.subtitle}</p>
          </div>

          {/* Type description */}
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
            <h2 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
              <span className="text-amber-600">●</span> {r.name}とは？
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed">{r.description}</p>
          </div>

          {/* DEMERITS */}
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-2xl overflow-hidden">
              <div className="bg-red-500 px-5 py-3">
                <h2 className="text-white font-bold text-sm">
                  ⚠️ このままの生活を続けると起こりうること
                </h2>
              </div>
              <div className="p-5 space-y-5">
                {r.demerits.map((d, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-3 mb-2">
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="font-bold text-red-800 text-sm">{d.title}</p>
                    </div>
                    <p className="text-stone-600 text-xs leading-relaxed ml-8">{d.detail}</p>
                    {i < r.demerits.length - 1 && <div className="border-b border-red-100 mt-4" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* IMPROVEMENTS */}
          <div className="mb-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl overflow-hidden">
              <div className="bg-emerald-600 px-5 py-3">
                <h2 className="text-white font-bold text-sm">
                  ✅ 今の状態を改善し、痩せやすい身体を作るための方法5つ
                </h2>
              </div>
              <div className="p-5 space-y-5">
                {r.improvements.map((imp, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-3 mb-2">
                      <span className="bg-emerald-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="font-bold text-emerald-800 text-sm">{imp.title}</p>
                    </div>
                    <p className="text-stone-600 text-xs leading-relaxed ml-8">{imp.detail}</p>
                    {i < r.improvements.length - 1 && <div className="border-b border-emerald-100 mt-4" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA SECTION */}
          <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-6 mb-6 text-white">
            <div className="text-center mb-4">
              <span className="text-3xl">🌟</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              今までダイエットを頑張っても続かなかった。<br />
              食事制限が辛くてできなかった。<br />
              運動習慣がなくダイエットがうまくいかなかった。<br /><br />
              <strong>そんな方でも大丈夫！</strong><br /><br />
              ムリな運動、食事制限は必要なし！<br />
              自分の腸のタイプにあった方法を知って、<br />
              今までよりも簡単に無理なく痩せられたら…<br />
              <span className="text-amber-200 font-bold">最高じゃないですか？</span>
            </p>
            <p className="text-sm leading-relaxed mb-4">
              今までダイエットがうまくいかなかったのは、<br />
              <strong>あなたの意思のせいじゃないんです。</strong><br />
              ちょっと方法が違っただけ。
            </p>
            <div className="bg-white/20 rounded-xl p-4 mb-5 text-center">
              <p className="font-bold text-lg">
                ３０日プログラムで<br />今年こそは変化を起こしましょう！
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 mb-4">
              <p className="text-xs text-stone-500 font-bold mb-1 text-center">腸からやせる30日間プログラム</p>
              <p className="text-stone-800 font-bold text-center text-sm mb-1">
                腸内フローラを根本から整えながら<br />脂肪燃焼体質を作る30日間
              </p>
              <ul className="text-xs text-stone-600 space-y-1 mt-3">
                <li>◎ タイプ別動画3本（合計55〜60分）</li>
                <li>◎ タイプ別改善プランPDF付き</li>
                <li>◎ 自分のタイプに特化した実践内容</li>
                <li>◎ 買い切り・期限なし・いつでも視聴OK</li>
              </ul>
            </div>

            <div className="block w-full bg-white text-amber-700 text-center font-bold py-4 px-6 rounded-2xl shadow-md text-sm">
              🌿 30日間プログラムの詳細はLINEでご案内しています
            </div>
          </div>

          {/* Retry */}
          <div className="text-center mb-8">
            <button
              onClick={reset}
              className="text-sm text-stone-400 hover:text-stone-600 underline transition-colors"
            >
              もう一度診断する
            </button>
          </div>

          <p className="text-center text-xs text-stone-400 px-4">
            ※この診断は医療診断ではありません。症状が重い・長引く場合は必ず医療機関にご相談ください。
          </p>
        </div>
      </div>
    )
  }

  return null
}
