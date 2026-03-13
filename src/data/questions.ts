import type { Question } from '../types';

export const initialQuestions: Question[] = [
  { id: 1, category: "旧約書名", problemText: "ジェット機がプシュー！みたいな響きだけど…", fixedShuffled: "シュツエジプトキ", answer: "シュツエジプトキ", reading: "しゅつえじぷとき", hints: ["奴隷からの脱出", "モーセ", "十戒"] },
  { id: 2, category: "旧約書名", problemText: "計算機（ソロバン）を使いそうな書名？", fixedShuffled: "レビキ", answer: "レビキ", reading: "れびき", hints: ["祭儀の規定", "聖別の教え", "五書の一つ"] },
  { id: 3, category: "旧約書名", problemText: "王様たちがたくさん出てくる記録", fixedShuffled: "レツオウキ", answer: "レツオウキ", reading: "れつおうき", hints: ["ソロモン王", "イスラエル分裂", "エリヤとエリシャ"] },
  { id: 4, category: "旧約書名", problemText: "最初の一歩、始まりの物語", fixedShuffled: "ソウセイキ", answer: "ソウセイキ", reading: "そうせいき", hints: ["天地創造", "アダムとエバ", "ノアの箱舟"] },
  { id: 5, category: "旧約書名", problemText: "竪琴を弾きながら歌いたい…", fixedShuffled: "シヘン", answer: "シヘン", reading: "しへん", hints: ["ダビデの歌", "150篇", "賛美と祈り"] },
  
  { id: 6, category: "人物名", problemText: "海を二つに割った指導者", fixedShuffled: "モーセ", answer: "モーセ", reading: "もーせ", hints: ["アロンの弟", "燃える柴", "約束の地を目前に"] },
  { id: 7, category: "人物名", problemText: "巨人を石一つで倒した少年王", fixedShuffled: "ダビデ", answer: "ダビデ", reading: "だびで", hints: ["ベツレヘム出身", "ゴリアテ", "最高の詩人"] },
  { id: 8, category: "人物名", problemText: "知恵の王として有名、神殿を建てた", fixedShuffled: "ソロモン", answer: "ソロモン", reading: "そろもん", hints: ["ダビデの息子", "シバの女王", "伝道の書の著者"] },
  { id: 9, category: "人物名", problemText: "イエスの家族、大工の父", fixedShuffled: "ヨセフ", answer: "ヨセフ", reading: "よせふ", hints: ["マリアの夫", "エジプトへ避難", "ナザレの人"] },
  { id: 10, category: "人物名", problemText: "信仰の父、星の数ほどの子孫", fixedShuffled: "アブラハム", answer: "アブラハム", reading: "あぶらはむ", hints: ["ウルから出発", "イサクの父", "供え物の山"] },

  { id: 11, category: "重要フレーズ", problemText: "神様が最初に造られたもの（創世記より）", fixedShuffled: "ヒカリ", answer: "ヒカリ", reading: "ひかり", hints: ["闇の反対", "あれ！と言われた", "第一日目"] },
  { id: 12, category: "重要フレーズ", problemText: "神に愛されること、無償の贈り物", fixedShuffled: "メグミ", answer: "メグミ", reading: "めぐみ", hints: ["福音の核", "信仰によって受ける", "ギリシャ語でカリス"] },
  { id: 13, category: "重要フレーズ", problemText: "イエスがよく使った「平和」を意味する挨拶（ヘブライ語）", fixedShuffled: "シャローム", answer: "シャローム", reading: "しゃろーむ", hints: ["ヘブライ語", "欠けのない状態", "イスラエルの挨拶"] },
  { id: 14, category: "重要フレーズ", problemText: "神のことば、世界の始まり", fixedShuffled: "ロゴス", answer: "ロゴス", reading: "ろごす", hints: ["ヨハネの福音書", "ギリシャ語", "真理"] },
  { id: 15, category: "重要フレーズ", problemText: "祈りの最後に「本当にそうです」", fixedShuffled: "アメン", answer: "アメン", reading: "あめん", hints: ["確認の言葉", "礼拝で唱える", "誠に"] },

  { id: 16, category: "預言者", problemText: "魚の腹の中に三日間いた預言者", fixedShuffled: "ヨナ", answer: "ヨナ", reading: "よな", hints: ["ニネベへ行け", "暴風雨", "大きな魚"] },
  { id: 17, category: "預言者", problemText: "火の戦車で天に上げられた預言者", fixedShuffled: "エリヤ", answer: "エリヤ", reading: "えりや", hints: ["カルメル山", "バアルの預言者と対決", "ホレブ山での沈黙"] },
  { id: 18, category: "預言者", problemText: "「苦難の下僕」を預言した四大預言者の一人", fixedShuffled: "イザヤ", answer: "イザヤ", reading: "いざや", hints: ["メシア預言", "唇を炭で清める", "ヒゼキヤ王の時代"] },
  { id: 19, category: "預言者", problemText: "涙の預言者、神殿の崩壊を悲しんだ", fixedShuffled: "エレミヤ", answer: "エレミヤ", reading: "エレミヤ", hints: ["新しい契約", "粘土細工", "哀歌"] },
  { id: 20, category: "新約書名", problemText: "最後にある、神の勝利の記録", fixedShuffled: "ヨハネノモクシロク", answer: "ヨハネノモクシロク", reading: "よはねのもくしろく", hints: ["パトモス島", "七つの燭台", "新しいエルサレム"] },
];
