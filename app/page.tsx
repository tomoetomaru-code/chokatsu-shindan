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
  icon:string; name:string; badge:string; sub:string; desc:string; actions:string[];
  demerits:{title:string;detail:string}[];
  improvements:{title:string;detail:string}[];
}> = {
  gas: {
    icon:"🫧", name:"膨らみ型", badge:"食後のガス・むくみが痩せにくさの原因",
    sub:"食後にお腹が張りやすく、ガスやむくみが気になるタイプ。\nFODMAPを多く含む食品が腸内でガスを発生させ、代謝を下げている可能性があります。",
    desc:"腸内細菌がFODMAP（発酵性の糖質）を分解する際に大量のガスが発生し、お腹の張りやむくみにつながっています。このタイプは食べるものの「種類」を見直すことが、ダイエット成功への最短ルートです。",
    actions:["FODMAP食品（玉ねぎ・小麦・豆類・牛乳）を2週間控えてみる","消化を助ける食品（大根・パパイヤ・キウイ）を毎食プラスする","食事をゆっくりよく噛んで食べる（空気の飲み込みを減らす）"],
    demerits:[
      {title:"FODMAPへの感受性がどんどん高まる",detail:"FODMAP（発酵性の糖質）に対する腸の過敏反応は、放置すると感受性が高まる一方です。今は豆類やパンでお腹が張る程度でも、次第に野菜・果物まで反応が広がり、食べられるものが減っていくリスクがあります。研究では、腸内の悪玉菌がFODMAPを発酵させてガスを産生し続けることで、腸壁への慢性的な圧力が高まることが示されています。"},
      {title:"腸内細菌のバランスが崩れ、脂肪が燃えにくい体になる",detail:"膨らみ型の方はメタン産生菌が増えやすい傾向があります。このメタン産生菌が増えると腸の動きが遅くなり、同じ食事でも通常より多くカロリーが吸収されることが複数の研究で示されています。「少し食べただけなのに太る」という状態が加速していきます。"},
      {title:"腸のバリア機能が低下し、リーキーガットのリスクが上昇する",detail:"腸内でガスが産生され続けると、腸壁への慢性的な刺激となり「腸漏れ（リーキーガット）」が起きやすくなります。腸のバリアが破れると、本来吸収されないはずの毒素が血流に乗って全身を回り、慢性的な炎症・疲労感・肌荒れの原因となります。"},
      {title:"ストレスホルモンが増加し、腹部に脂肪がつきやすくなる",detail:"お腹の不快感・痛みが続くと、脳がそれをストレスとして認識し、コルチゾール（ストレスホルモン）の分泌が増加します。コルチゾールが慢性的に高い状態では、内臓脂肪の蓄積が促進されることがわかっています。"},
      {title:"セロトニン産生が低下し、甘いものへの欲求が強まる",detail:"腸内環境の悪化はセロトニン（幸福ホルモン）の産生にも影響します。セロトニンの約90%は腸で作られており、腸内フローラが乱れると産生量が低下します。セロトニンが不足すると脳が甘い物・脂質を強く求めるようになり、食欲コントロールがさらに難しくなります。"},
    ],
    improvements:[
      {title:"FODMAP食品を2週間だけ一時的に控えてみる",detail:"豆類・小麦・玉ねぎ・乳製品など高FODMAP食品を短期間減らします。腸内のガス産生が落ち着き、張りや不快感が改善します。長期的な禁止ではなく「腸をリセットする期間」として取り組むのがポイントです。"},
      {title:"消化酵素を意識した食べ方に変える",detail:"一口30回以上噛む・食事は落ち着いた環境でゆっくり食べる・大根おろしや生姜など消化酵素を含む食品を添えるなど、腸への負担を減らす食べ方を習慣にします。"},
      {title:"水溶性食物繊維を中心に腸内環境を整える",detail:"オクラ・昆布・わかめ・大麦など水溶性食物繊維は善玉菌のエサになり、ガス産生が少ない腸内環境を作ります。不溶性食物繊維より水溶性から始めるのがこのタイプには適しています。"},
      {title:"食後15分のウォーキングで腸の動きを促す",detail:"食後すぐ横になる習慣はガスを腸内に留める原因になります。軽いウォーキングで腸の蠕動運動を促し、ガスの排出をスムーズにすることができます。"},
      {title:"腸マッサージで腸内のガスを流す習慣をつける",detail:"就寝前に仰向けになり、おへその周りを時計回りに優しく押さえるマッサージを行います。腸のガスが動き、膨満感が和らぎます。継続することで腸の動きが活発になり、朝の排便リズムが整ってきます。"},
    ],
  },
  con: {
    icon:"🪨", name:"ためこみ型", badge:"老廃物のためこみが痩せにくさの原因",
    sub:"腸の動きが遅く、老廃物や余分な脂質をためこみやすいタイプ。\n短鎖脂肪酸が不足して脂肪燃焼スイッチが入りにくい状態です。",
    desc:"腸の蠕動運動が低下し、食物繊維と水分が不足していることが多いです。善玉菌のエサとなる水溶性食物繊維を増やすことで短鎖脂肪酸が産生され、脂肪燃焼しやすい体質に変わっていきます。",
    actions:["水溶性食物繊維（昆布・わかめ・オクラ・りんご）を毎日1品プラスする","1日1.5L以上の水分補給を意識する（朝一番に常温水を1杯）","食後30分以内に10分歩く（腸の蠕動運動を刺激する）"],
    demerits:[
      {title:"有害物質が腸内で再吸収され続ける",detail:"便が腸内に長時間留まると、本来排出されるはずの毒素・老廃物・腸内細菌の代謝産物が再吸収されます。「腸肝循環」と呼ばれるこの現象は、肝臓への負担を増やし、慢性的な疲労・肌荒れ・体臭の原因となります。腸内滞留時間が長いほどリスクが高まることが研究で示されています。"},
      {title:"短鎖脂肪酸が不足し、脂肪燃焼効率が下がる",detail:"腸内の善玉菌が食物繊維を発酵させて作る「短鎖脂肪酸（酪酸・酢酸・プロピオン酸）」は、脂肪細胞への脂肪蓄積を抑制し、脂肪燃焼を促すシグナルを送ります。ためこみ型の方は善玉菌が少ないため短鎖脂肪酸の産生が低下し、「食べていないのに痩せない」状態が続きます。"},
      {title:"腸内フローラの多様性が失われ、代謝が低下する",detail:"便秘が続くと腸内の細菌多様性が低下します。腸内フローラの多様性が低い人ほど肥満リスクが高く、インスリン感受性が低下することが複数の研究で示されています。悪玉菌が優位な状態が続くことで代謝システム全体が低下します。"},
      {title:"腸内の慢性炎症が全身に広がる",detail:"悪玉菌が産生するLPS（リポポリサッカライド）という毒素が腸壁から血液中に入り込むと、全身性の慢性炎症が起きます。この炎症が続くと免疫機能が低下し、脂肪の燃焼を妨げるインスリン抵抗性が高まります。「なんとなく体が重い」という感覚はこの慢性炎症のサインです。"},
      {title:"食欲調整ホルモンが乱れ、食べ過ぎやすくなる",detail:"腸内環境が悪化すると、食欲を抑えるレプチンが働きにくくなり、食欲を高めるグレリンが過剰に分泌されるようになります。食べても満足感が得にくい・つい間食してしまうという状態が腸内環境の悪化によって引き起こされている場合があります。"},
    ],
    improvements:[
      {title:"朝起きてすぐにコップ1杯の水を飲む",detail:"起床直後の空腹時に常温または温かい水を200ml飲みます。これだけで腸の蠕動運動が刺激され「胃結腸反射」が促されます。朝の排便リズムを作る最も手軽なアクションです。まず1週間続けることで変化を感じられます。"},
      {title:"水溶性食物繊維を毎食1品プラスする",detail:"オクラ・昆布・わかめ・りんご・大麦など水溶性食物繊維が豊富な食品を毎食1品追加します。水溶性食物繊維は善玉菌のエサになり短鎖脂肪酸を産生します。同時に水分もしっかり摂ることが重要です。"},
      {title:"植物性発酵食品で善玉菌を毎日補充する",detail:"納豆・味噌・ぬか漬けなど植物性乳酸菌を含む和の発酵食品を毎日1品取り入れます。植物性乳酸菌は腸への定着率が高く、継続することで腸内フローラが整い始めます。"},
      {title:"マグネシウムを含む食品を意識して摂る",detail:"マグネシウムは腸内に水分を引き込み、便を柔らかくする作用があります。ナッツ類・豆類・豆腐・ほうれん草・バナナなどに豊富です。便が硬くてなかなか出ないという方に特に効果的なアプローチです。"},
      {title:"座り時間を意識的に減らして腸を動かす",detail:"長時間座った状態は腸の動きを鈍らせます。1時間に1回は立ち上がって歩く・食後は5〜10分だけ外を歩くなど、腸を動かす機会を意識的に作ります。運動習慣がなくても「座りすぎを減らす」だけで腸の蠕動運動が改善します。"},
    ],
  },
  dia: {
    icon:"🌊", name:"敏感型", badge:"ストレス過食が痩せにくさの原因",
    sub:"ストレスが食欲や腸に直結しやすいタイプ。\nセロトニン不足で甘いものへの欲求が強まり、代謝が乱れやすい状態です。",
    desc:"腸と脳は「腸脳軸」でつながっており、ストレスが食欲増加や腸の乱れを引き起こしています。セロトニンの95%は腸で作られるため、腸を整えることで食欲が安定し、自然と痩せやすい状態になっていきます。",
    actions:["ストレスケアを最優先に（深呼吸・入浴・睡眠の質を上げる）","腸粘膜を修復する食品（鶏肉・卵・味噌・ぬか漬け）を積極的に摂る","カフェイン・アルコール・揚げ物を控えて腸の過敏を落ち着かせる"],
    demerits:[
      {title:"腸脳軸の過敏が慢性化し、ストレス反応が増幅される",detail:"腸と脳は迷走神経・ホルモン・免疫システムを通じて「腸脳軸」でつながっています。敏感型の方はこの腸脳軸が過敏になっており、ストレスを感じると腸が即座に反応します。放置すると過敏反応がどんどん増幅され、以前は問題なかった食事や状況でも腸が反応するようになっていきます。"},
      {title:"セロトニン産生が乱れ、気分の安定が保ちにくくなる",detail:"セロトニンの約90%は腸で産生されます。敏感型の方は腸の状態が不安定なためセロトニン産生が乱れやすく、気分の浮き沈み・不安感・集中力の低下として現れます。さらにセロトニン不足は甘い物・脂質への強い欲求を生み出し、食欲コントロールを困難にします。"},
      {title:"腸粘膜が傷つき続け、栄養の吸収効率が下がる",detail:"慢性的なストレスと腸の過敏反応は、腸粘膜のバリア機能を低下させます。腸粘膜が傷つくと本来吸収されないはずの物質が体内に入り込む「リーキーガット」が起き、全身性の炎症・アレルギー反応が増えます。食べても栄養が体に届きにくい状態が続きます。"},
      {title:"コルチゾールが慢性的に高まり、内臓脂肪がつきやすくなる",detail:"ストレスによってコルチゾール（ストレスホルモン）の分泌が増えると、内臓脂肪の蓄積が促進されます。特に腹部への脂肪蓄積と直接関係しており、「ストレスで太る」というのは医学的に根拠があります。敏感型の方がストレスを放置し続けると、ダイエットの効果が出にくくなる一方です。"},
      {title:"免疫機能が低下し、慢性的な炎症が続く",detail:"腸は全免疫細胞の約70%が集まる場所です。腸の過敏状態が続くと免疫システムが誤作動し、慢性的な低レベルの炎症が全身で起きます。この慢性炎症は代謝を低下させ、脂肪燃焼効率を下げます。疲れやすい・風邪を引きやすいという症状もこの炎症から来ている場合があります。"},
    ],
    improvements:[
      {title:"ストレスケアを食事改善より先に取り組む",detail:"敏感型の場合、食事をどれだけ改善しても、ストレスが解消されなければ腸は落ち着きません。深呼吸（4秒吸って8秒吐く）・ぬるめのお風呂・好きな音楽を聴く時間など、副交感神経を優位にする習慣を1日1回必ず取り入れることが最重要です。"},
      {title:"グルタミンを含む食品で腸粘膜を修復する",detail:"グルタミンは腸粘膜の主要なエネルギー源で、傷ついた腸壁を修復する作用があります。鶏むね肉・卵・キャベツ・大豆製品に豊富です。毎日の食事にこれらを意識的に取り入れることで、腸粘膜のバリア機能が回復していきます。"},
      {title:"食事を決まった時間に取り、腸のリズムを安定させる",detail:"腸は規則正しいリズムが最も得意です。毎日同じ時間に食事を摂ることで、腸の動きが予測可能になり、過敏反応が減っていきます。食事時間の乱れは自律神経を乱し、腸脳軸の過敏を悪化させます。"},
      {title:"発酵食品は少量から慎重に始める",detail:"敏感型の方が発酵食品を急に大量に増やすと、腸が過敏反応を起こすことがあります。まずは少量（味噌汁1杯・納豆半パック程度）から始め、腸の反応を見ながら徐々に量を増やします。「少しずつ・ゆっくり」が敏感型のキーワードです。"},
      {title:"睡眠7時間の確保を腸活の基本にする",detail:"睡眠中に腸は修復・再生を行います。睡眠不足は腸脳軸の過敏を直接悪化させることがわかっています。22時〜23時就寝・7時間睡眠を目標に、まず就寝時間を30分早めることから始めてみてください。"},
    ],
  },
  mix: {
    icon:"🎲", name:"気まぐれ型", badge:"腸内フローラの不安定さが痩せにくさの原因",
    sub:"体重・便通・体調が日によってバラつきやすいタイプ。\n腸内フローラの多様性が低く、代謝が安定しにくい状態です。",
    desc:"腸内フローラの多様性が低下すると、腸の反応が不安定になり体重も増えたり減ったりを繰り返します。発酵食品と食物繊維をセットで摂り続けることで善玉菌の種類が増え、代謝が安定してきます。",
    actions:["発酵食品×食物繊維のセット摂取（納豆＋海藻・味噌汁＋野菜）を毎食意識する","食事・睡眠・起床の時間を一定にして腸のリズムを整える","植物性発酵食品（納豆・味噌・ぬか漬け）を毎日1種類は食べる"],
    demerits:[
      {title:"腸内フローラの多様性が失われ続け、代謝が不安定になる",detail:"気まぐれ型の方は腸内細菌の種類（多様性）が低下している傾向があります。腸内フローラの多様性が低い人ほど肥満・糖尿病リスクが高いことが研究で示されています。多様性が下がると短鎖脂肪酸の産生が不安定になり、代謝が一定に保てなくなります。"},
      {title:"便秘と下痢を繰り返すことで腸粘膜が慢性ダメージを受ける",detail:"便秘時のいきみは腸壁に物理的な圧力をかけ、下痢時の急激な腸の収縮は腸粘膜を傷つけます。この繰り返しが腸粘膜の修復を追いつかなくさせ、リーキーガットの状態が慢性化します。どんな食事をしても栄養の吸収が不安定になります。"},
      {title:"栄養吸収が不規則になり、体重管理が困難になる",detail:"腸の状態が日によって違うため、同じ食事をしても吸収されるカロリーや栄養素が変動します。「今日は食べていないのに体重が増えた」という不規則な変動は、腸の吸収率の変動が原因であることが多いです。"},
      {title:"慢性的な炎症が免疫機能を低下させる",detail:"腸内環境の不安定さは免疫細胞が集まる腸内リンパ組織に影響し、慢性的な低レベル炎症が続きます。この慢性炎症はインスリン感受性を下げ、脂肪が燃えにくい体内環境を作ります。風邪を引きやすい・アレルギーが出やすいという症状もこの炎症と関係しています。"},
      {title:"ホルモンバランスが乱れ、食欲コントロールがさらに難しくなる",detail:"腸内環境の不安定さは食欲ホルモン（レプチン・グレリン）の分泌を乱します。また女性ホルモンの代謝にも腸内細菌が関わっているため、気まぐれ型の方はPMS症状が悪化しやすいリスクがあります。ホルモンバランスの乱れが食欲の波を作り、ダイエットの継続をさらに難しくします。"},
    ],
    improvements:[
      {title:"発酵食品×食物繊維をセットで毎日摂る",detail:"善玉菌（プロバイオティクス）と善玉菌のエサ（プレバイオティクス）を同時に摂ることが腸内フローラの多様性回復に最も効果的です。例：味噌汁（発酵食品）＋わかめ・豆腐（食物繊維）を毎日1杯。これだけで腸内の環境が整い始めます。"},
      {title:"生活リズムを整え、腸の動きを一定にする",detail:"起床・食事・睡眠の時間を毎日同じにすることで、腸の蠕動運動リズムが安定します。腸は体内時計と連動しており、リズムが乱れると便秘と下痢を交互に繰り返す原因になります。まず「起床時間を毎日同じにする」だけから始めてみてください。"},
      {title:"多様な食品を少量ずつ取り入れる",detail:"腸内フローラの多様性を上げるには、食品の多様性が重要です。「週に20種類以上の食材を食べる」という目標を持つだけで、腸内細菌の種類が増えやすくなります。一種類の食品を大量に食べるより、少量の様々な食品を組み合わせることが重要です。"},
      {title:"冷たい食べ物・飲み物を控え、温かい食事を中心にする",detail:"冷たい食べ物は腸の動きを急激に変化させ、不安定さを増幅させます。常温以上の飲み物・温かいスープや鍋料理など、腸に優しい温度の食事を意識することで腸の動きが穏やかに安定していきます。"},
      {title:"1種類のサプリより多様な発酵食品をローテーションで摂る",detail:"気まぐれ型の方に特に重要なのは「多様性」です。単一のプロバイオティクスサプリを高用量で続けるより、納豆・味噌・キムチ・甘酒・ぬか漬けなど様々な発酵食品を少量ずつローテーションで取り入れる方が、腸内フローラの多様性回復に効果的です。"},
    ],
  },
};

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

  const ranked = (['gas','con','dia','mix'] as ResultType[]).sort((a,b)=>scores[b]-scores[a]);
  const subType = ranked[1];
  const topScore = scores[ranked[0]] || 0;
  const subScore = scores[subType] || 0;
  const showSub = result !== null && subScore > 0 && (topScore - subScore) < topScore * 0.4;

  const SUBTYPE_MSG: Record<string,string> = {
    gas_con:'食後のガスに加え、腸の動きが遅い傾向もあります。',gas_dia:'食後のガスに加え、ストレスの影響も受けやすい傾向があります。',gas_mix:'食後のガスに加え、体調のばらつきも気になります。',
    con_gas:'腸のためこみに加え、ガスやむくみも起きやすい傾向があります。',con_dia:'腸のためこみに加え、ストレスで食欲が乱れやすい傾向もあります。',con_mix:'腸のためこみに加え、体重が安定しにくい傾向もあります。',
    dia_gas:'ストレス過食に加え、食後のガスも気になる傾向があります。',dia_con:'ストレス過食に加え、腸の動きが遅い傾向もあります。',dia_mix:'ストレス過食に加え、体調のばらつきも気になります。',
    mix_gas:'体調のばらつきに加え、食後のガスも気になる傾向があります。',mix_con:'体調のばらつきに加え、腸のためこみも見られます。',mix_dia:'体調のばらつきに加え、ストレスの影響も受けやすい傾向があります。',
  };

  const total = scores.gas + scores.con + scores.dia + scores.mix || 1;
  const pGas = Math.round(scores.gas / total * 100);
  const pCon = Math.round(scores.con / total * 100);
  const pDia = Math.round(scores.dia / total * 100);
  const pMix = Math.round(scores.mix / total * 100);

  const WalnutSVG = ({size=28}:{size?:number}) => (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <ellipse cx="36" cy="42" rx="24" ry="21" fill="#C8955A"/>
      <path d="M36 21C36 21 24 24 21 33C18 42 21 54 27 58" stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M36 21C36 21 48 24 51 33C54 42 51 54 45 58" stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M36 21L36 58" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round"/>
      <path d="M22 38C27 35.5 33 37 36 39C39 37 45 35.5 50 38" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <ellipse cx="36" cy="19" rx="5" ry="3" fill="#7AB648"/>
      <ellipse cx="39" cy="17" rx="3" ry="2" fill="#5C8A3C"/>
    </svg>
  );

  if (screen === 'start') return (
    <div style={{minHeight:'100vh',background:CREAM,fontFamily:"'Noto Sans JP',sans-serif"}}>
      <div style={{background:GREEN,padding:'14px 16px',display:'flex',alignItems:'center',gap:12}}>
        <WalnutSVG size={32}/>
        <div><div style={{color:'white',fontWeight:700,fontSize:15}}>腸内タイプ診断</div><div style={{color:'rgba(255,255,255,0.75)',fontSize:12}}>くるみの腸活ラボ</div></div>
      </div>
      <div style={{maxWidth:520,margin:'0 auto',padding:'32px 20px 60px'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <WalnutSVG size={80}/>
          <div style={{height:16}}/>
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
        <button onClick={()=>{setScreen('question');setCurrent(0);}} style={{width:'100%',padding:'18px',background:GREEN,color:'white',border:'none',borderRadius:14,fontSize:18,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 16px rgba(44,106,79,0.35)'}}>
          診断をはじめる →
        </button>
      </div>
    </div>
  );

  if (screen === 'question') return (
    <div style={{minHeight:'100vh',background:CREAM,fontFamily:"'Noto Sans JP',sans-serif"}}>
      <div style={{background:'white',boxShadow:'0 1px 0 #B7E4C7',position:'sticky',top:0,zIndex:50}}>
        <div style={{background:GREEN,padding:'12px 16px',display:'flex',alignItems:'center',gap:12}}>
          <WalnutSVG size={28}/><div style={{color:'white',fontWeight:700,fontSize:14}}>腸内タイプ診断</div>
        </div>
        <div style={{padding:'10px 16px 12px'}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#666',marginBottom:6}}>
            <span style={{fontWeight:600}}>{current+1} / 20問</span><span>{pct}%</span>
          </div>
          <div style={{height:8,background:GREEN_LIGHT,borderRadius:99,overflow:'hidden'}}>
            <div style={{height:'100%',background:GREEN,borderRadius:99,width:`${pct}%`,transition:'width 0.4s ease'}}/>
          </div>
        </div>
      </div>
      <div key={current} style={{maxWidth:520,margin:'0 auto',padding:'24px 16px 100px'}}>
        <div style={{fontSize:12,fontWeight:700,color:GREEN_MID,letterSpacing:'0.08em',marginBottom:8}}> 第{current+1}問 ／ {SECTIONS[current]}</div>
        <p style={{fontSize:18,fontWeight:700,color:'#222',lineHeight:1.6,marginBottom:24}}>{QUESTIONS[current].q}</p>
        <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:24}}>
          {QUESTIONS[current].choices.map((c,i)=>{
            const sel = answers[current]===i;
            return (
              <button key={i} onClick={()=>selectChoice(i)} style={{display:'flex',alignItems:'center',gap:14,textAlign:'left',width:'100%',background:sel?'#E8F5EE':'white',border:`2px solid ${sel?GREEN:GREEN_LIGHT}`,borderRadius:14,padding:'16px 18px',fontSize:15,color:sel?GREEN:'#333',fontWeight:sel?600:400,cursor:'pointer',boxShadow:sel?`0 0 0 1px ${GREEN}`:'0 2px 8px rgba(0,0,0,0.04)',transition:'all 0.15s',minHeight:60}}>
                <span style={{width:24,height:24,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,background:sel?GREEN:'transparent',border:`2px solid ${sel?GREEN:GREEN_LIGHT}`,color:sel?'white':'transparent'}}>✓</span>
                <span style={{lineHeight:1.5}}>{c}</span>
              </button>
            );
          })}
        </div>
        <div style={{display:'flex',gap:10,position:'fixed',bottom:0,left:0,right:0,padding:'12px 16px 20px',background:'white',boxShadow:'0 -2px 12px rgba(0,0,0,0.08)',maxWidth:520,margin:'0 auto'}}>
          <button onClick={()=>{ if(current>0) setCurrent(c=>c-1); }} disabled={current===0} style={{flex:1,padding:'15px 0',background:'white',border:`2px solid ${current===0?'#E0E0E0':GREEN_LIGHT}`,borderRadius:12,fontSize:15,fontWeight:600,color:current===0?'#CCC':'#555',cursor:current===0?'not-allowed':'pointer'}}>← 戻る</button>
          <button onClick={goNext} disabled={answers[current]===-1} style={{flex:2,padding:'15px 0',background:answers[current]!==-1?GREEN:GREEN_LIGHT,border:'none',borderRadius:12,fontSize:15,fontWeight:700,color:'white',cursor:answers[current]!==-1?'pointer':'not-allowed'}}>
            {current===19?'結果を見る ✓':'次へ →'}
          </button>
        </div>
      </div>
    </div>
  );

  if (screen === 'loading') return (
    <div style={{minHeight:'100vh',background:CREAM,fontFamily:"'Noto Sans JP',sans-serif",display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:52,height:52,border:`5px solid ${GREEN_LIGHT}`,borderTopColor:GREEN,borderRadius:'50%',margin:'0 auto 16px',animation:'spin 0.8s linear infinite'}}/>
        <p style={{color:'#777',fontSize:14}}>腸内タイプを分析中...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (screen === 'result' && result) {
    const r = RESULTS[result];
    const maxScore = Math.max(pGas,pCon,pDia,pMix) || 1;
    const getBarColor = (key: ResultType) => { if(result===key) return GREEN; if(showSub&&ranked[1]===key) return GREEN_MID; return GREEN_LIGHT; };
    const bars: [string,string,number,ResultType][] = [['🫧','膨らみ型',pGas,'gas'],['🪨','ためこみ型',pCon,'con'],['🌊','敏感型',pDia,'dia'],['🎲','気まぐれ型',pMix,'mix']];
    const subMsg = showSub ? SUBTYPE_MSG[`${result}_${subType}`] : '';

    return (
      <div style={{minHeight:'100vh',background:CREAM,fontFamily:"'Noto Sans JP',sans-serif"}}>
        <div style={{background:GREEN,padding:'14px 16px',display:'flex',alignItems:'center',gap:12}}>
          <WalnutSVG size={28}/><div style={{color:'white',fontWeight:700,fontSize:14}}>腸内タイプ診断 結果</div>
        </div>
        <div style={{maxWidth:520,margin:'0 auto',padding:'24px 16px 60px'}}>

          {/* タイプ結果カード */}
          <div style={{background:'white',borderRadius:20,overflow:'hidden',boxShadow:'0 4px 20px rgba(44,106,79,0.1)',marginBottom:16}}>
            <div style={{background:`linear-gradient(135deg,${GREEN} 0%,#1A4D35 100%)`,padding:'32px 24px',textAlign:'center'}}>
              <div style={{display:'inline-block',background:'rgba(255,255,255,0.2)',borderRadius:99,padding:'4px 16px',fontSize:12,fontWeight:700,color:'white',marginBottom:12}}>{r.badge}</div>
              <div style={{fontSize:64,marginBottom:12}}>{r.icon}</div>
              <h2 style={{fontSize:26,fontWeight:800,color:'white',marginBottom:8}}>あなたは「{r.name}」です</h2>
              <p style={{fontSize:14,color:'rgba(255,255,255,0.85)',lineHeight:1.7}}>{r.sub.split('\n').map((line,i)=><span key={i}>{line}<br/></span>)}</p>
              {showSub&&<div style={{display:'inline-block',marginTop:12,background:'rgba(255,255,255,0.2)',borderRadius:99,padding:'5px 14px',fontSize:13,fontWeight:700,color:'white'}}>＋ {RESULTS[subType].name}の傾向あり</div>}
            </div>
            <div style={{padding:'20px 20px 24px'}}>
              {showSub&&subMsg&&<div style={{background:'#FFF8E7',borderRadius:10,padding:'10px 14px',fontSize:13,color:'#7A5C00',lineHeight:1.7,marginBottom:16}}>🔍 {subMsg}</div>}
              <div style={{fontSize:12,fontWeight:700,color:GREEN,letterSpacing:'0.08em',borderBottom:`2px solid ${GREEN_LIGHT}`,paddingBottom:8,marginBottom:14}}>このタイプについて</div>
              <p style={{fontSize:14,lineHeight:1.8,marginBottom:20,color:'#333'}}>{r.desc}</p>
              <div style={{fontSize:12,fontWeight:700,color:GREEN,letterSpacing:'0.08em',borderBottom:`2px solid ${GREEN_LIGHT}`,paddingBottom:8,marginBottom:14}}>タイプスコア</div>
              <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
                {bars.map(([icon,label,val,key])=>(
                  <div key={label} style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{width:84,fontSize:13,flexShrink:0,fontWeight:label===r.name?700:400,color:label===r.name?GREEN:'#444'}}>{icon} {label}</span>
                    <div style={{flex:1,height:10,background:'#E8F5EE',borderRadius:99,overflow:'hidden'}}>
                      <div style={{height:'100%',background:getBarColor(key),borderRadius:99,width:`${Math.round(val/maxScore*100)}%`,transition:'width 1s ease'}}/>
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

          {/* デメリット5つ */}
          <div style={{background:'white',borderRadius:20,overflow:'hidden',boxShadow:'0 4px 20px rgba(0,0,0,0.06)',marginBottom:16}}>
            <div style={{background:'#DC2626',padding:'14px 20px'}}>
              <div style={{fontWeight:700,fontSize:14,color:'white'}}>⚠️ このままの生活を続けると起こりうること</div>
            </div>
            <div style={{padding:'20px'}}>
              {r.demerits.map((d,i)=>(
                <div key={i}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:8}}>
                    <span style={{width:26,height:26,background:'#DC2626',color:'white',borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,marginTop:1}}>{i+1}</span>
                    <span style={{fontSize:14,fontWeight:700,color:'#991B1B',lineHeight:1.5}}>{d.title}</span>
                  </div>
                  <p style={{fontSize:13,lineHeight:1.8,color:'#555',marginLeft:38,marginBottom:0}}>{d.detail}</p>
                  {i<r.demerits.length-1&&<div style={{borderTop:'1px solid #FEE2E2',margin:'16px 0'}}/>}
                </div>
              ))}
            </div>
          </div>

          {/* 改善方法5つ */}
          <div style={{background:'white',borderRadius:20,overflow:'hidden',boxShadow:'0 4px 20px rgba(0,0,0,0.06)',marginBottom:16}}>
            <div style={{background:GREEN,padding:'14px 20px'}}>
              <div style={{fontWeight:700,fontSize:14,color:'white'}}>✅ 今の状態を改善し、痩せやすい身体を作るための方法5つ</div>
            </div>
            <div style={{padding:'20px'}}>
              {r.improvements.map((imp,i)=>(
                <div key={i}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:8}}>
                    <span style={{width:26,height:26,background:GREEN,color:'white',borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,marginTop:1}}>{i+1}</span>
                    <span style={{fontSize:14,fontWeight:700,color:GREEN,lineHeight:1.5}}>{imp.title}</span>
                  </div>
                  <p style={{fontSize:13,lineHeight:1.8,color:'#555',marginLeft:38,marginBottom:0}}>{imp.detail}</p>
                  {i<r.improvements.length-1&&<div style={{borderTop:`1px solid ${GREEN_LIGHT}`,margin:'16px 0'}}/>}
                </div>
              ))}
            </div>
          </div>

          {/* 30日プログラム CTA */}
          <div style={{background:`linear-gradient(135deg,${GREEN} 0%,#1A4D35 100%)`,borderRadius:20,padding:'28px 20px',marginBottom:14}}>
            <div style={{textAlign:'center',fontSize:36,marginBottom:14}}>🌟</div>
            <p style={{fontSize:14,color:'rgba(255,255,255,0.92)',lineHeight:2,marginBottom:14,textAlign:'center'}}>
              今までダイエットを頑張っても続かなかった。<br/>
              食事制限が辛くてできなかった。<br/>
              運動習慣がなくダイエットがうまくいかなかった。<br/>
              <br/>
              <strong style={{fontSize:16,color:'white'}}>そんな方でも大丈夫！</strong><br/>
              <br/>
              ムリな運動、食事制限は必要なし！<br/>
              自分の腸のタイプにあった方法を知って、<br/>
              今までよりも簡単に無理なく痩せられたら…<br/>
              <strong style={{color:'#B7E4C7'}}>最高じゃないですか？</strong>
            </p>
            <p style={{fontSize:14,color:'rgba(255,255,255,0.9)',lineHeight:1.9,marginBottom:18,textAlign:'center'}}>
              今までダイエットがうまくいかなかったのは、<br/>
              <strong style={{color:'white'}}>あなたの意思のせいじゃないんです。</strong><br/>
              ちょっと方法が違っただけ。
            </p>
            <div style={{background:'rgba(255,255,255,0.15)',borderRadius:14,padding:'16px',marginBottom:20,textAlign:'center'}}>
              <p style={{fontWeight:800,fontSize:17,color:'white',lineHeight:1.6,margin:0}}>３０日プログラムで<br/>今年こそは変化を起こしましょう！</p>
            </div>
            <div style={{background:'white',borderRadius:14,padding:'16px'}}>
              <p style={{fontSize:11,color:'#888',fontWeight:700,textAlign:'center',marginBottom:6}}>腸からやせる30日間プログラム</p>
              <p style={{fontSize:13,color:'#222',fontWeight:700,textAlign:'center',marginBottom:12,lineHeight:1.5}}>腸内フローラを根本から整えながら<br/>脂肪燃焼体質を作る30日間</p>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {['タイプ別動画3本（合計55〜60分）','タイプ別改善プランPDF付き','自分のタイプに特化した実践内容','買い切り・期限なし・いつでも視聴OK'].map(f=>(
                  <div key={f} style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'#333'}}>
                    <span style={{width:18,height:18,background:GREEN,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'white',flexShrink:0}}>✓</span>{f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{textAlign:'center',marginBottom:24}}>
            <button onClick={()=>{setScreen('start');setCurrent(0);setAnswers(new Array(20).fill(-1));setResult(null);setScores({gas:0,con:0,dia:0,mix:0});}} style={{background:'none',border:'none',fontSize:13,color:'#999',textDecoration:'underline',cursor:'pointer'}}>
              もう一度診断する
            </button>
          </div>
          <p style={{fontSize:12,textAlign:'center',color:'#888',lineHeight:1.7}}>※ この診断は医療診断ではありません。<br/>症状が重い・長引く場合は医療機関にご相談ください。</p>
        </div>
      </div>
    );
  }
  return null;
}
