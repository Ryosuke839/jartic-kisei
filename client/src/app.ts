let map: google.maps.Map;

const names = new Map([
  ['1', '歩行者用道路'],
  ['2', '自転車用道路'],
  ['3', '自転車及び歩行者用道路'],
  ['4', '通行止め'],
  ['5', '車両通行止め'],
  ['6', '大型自動二輪車及び普通自動二輪車二人乗り通行禁止'],
  ['7', '車両通行止め(踏切)'],
  ['8', '歩行者通行止め'],
  ['9', '重量制限'],
  ['10', '高さ制限'],
  ['11', '一方通行'],
  ['12', '指定方向外進行禁止'],
  ['13', '車両進入禁止'],
  ['14', '歩行者横断禁止'],
  ['15', '中央線'],
  ['16', '中央線の変移'],
  ['17', '追越しのための右側部分はみ出し通行禁止'],
  ['19', '立入り禁止部分'],
  ['20', '車両通行帯'],
  ['21', '車両通行区分'],
  ['24', '路線バス等優先通行帯'],
  ['27', '軌道敷内通行可'],
  ['49', '最低速度'],
  ['50', '車両横断禁止'],
  ['51', '転回禁止'],
  ['52', '進路変更禁止'],
  ['53', '追越し禁止'],
  ['54', '優先道路'],
  ['55', '原動機付自転車の右折方法(二段階)'],
  ['56', '原動機付自転車の右折方法(小回り)'],
  ['57', '右左折の方法'],
  ['58', '進行方向別通行区分'],
  ['60', '進行方向'],
  ['61', '徐行'],
  ['62', '前方優先道路'],
  ['63', '一時停止'],
  ['64', '優先本線車道'],
  ['65', '駐停車禁止'],
  ['69', '駐車余地'],
  ['70', '駐車可'],
  ['71', '停車可'],
  ['72', '時間制限駐車区間'],
  ['76', '停止禁止部分'],
  ['77', '警笛鳴らせ及び警笛区間'],
  ['81', '普通自転車歩道通行可'],
  ['82', '普通自転車の歩道通行部分'],
  ['83', '普通自転車の交差点進入禁止'],
  ['84', '並進可'],
  ['85', '横断歩道'],
  ['86', '斜め横断可'],
  ['87', '自転車横断帯'],
  ['88', '安全地帯'],
  ['90', '導流帯'],
  ['91', '路面電車停留場'],
  ['92', '停止線'],
  ['93', '二段停止線'],
  ['94', '左折可'],
  ['98', '信号機'],
  ['100', '高齢運転者等標章自動車駐車可'],
  ['101', '高齢運転者等標章自動車停車可'],
  ['102', '高齢運転者等専用時間制限駐車区間'],
  ['106', '環状の交差点における右回り通行'],
  ['107', '車両通行帯及び車両通行区分(組合せ)'],
  ['110', '普通自転車専用通行帯'],
  ['111', '専用通行帯(普通自転車専用通行帯を除く。)'],
  ['112', '最高速度(区間)'],
  ['113', '最高速度可変(区間)'],
  ['114', '最高速度(区域)'],
  ['115', '駐車禁止'],
  ['116', '駐車方法の指定'],
  ['117', '路側帯'],
  ['118', '車両通行帯及び進行方向別通行区分(組合せ)'],
  ['119', '車両通行帯・進行方向別通行区分・進路変更禁止(組合せ)'],
]);
const codeMap = new Map([
  [1, new Map([ // 都道府県コード
    ['1', '北海道'],
    ['2', '青森'],
    ['3', '岩手'],
    ['4', '宮城'],
    ['5', '秋田'],
    ['6', '山形'],
    ['7', '福島'],
    ['8', '警視庁'],
    ['9', '茨城'],
    ['10', '栃木'],
    ['11', '群馬'],
    ['12', '埼玉'],
    ['13', '千葉'],
    ['14', '神奈川'],
    ['15', '新潟'],
    ['16', '山梨'],
    ['17', '長野'],
    ['18', '静岡'],
    ['19', '富山'],
    ['20', '石川'],
    ['21', '福井'],
    ['22', '岐阜'],
    ['23', '愛知'],
    ['24', '三重'],
    ['25', '滋賀'],
    ['26', '京都'],
    ['27', '大阪'],
    ['28', '兵庫'],
    ['29', '奈良'],
    ['30', '和歌山'],
    ['31', '鳥取'],
    ['32', '島根'],
    ['33', '岡山'],
    ['34', '広島'],
    ['35', '山口'],
    ['36', '徳島'],
    ['37', '香川'],
    ['38', '愛媛'],
    ['39', '高知'],
    ['40', '福岡'],
    ['41', '佐賀'],
    ['42', '長崎'],
    ['43', '熊本'],
    ['44', '大分'],
    ['45', '宮崎'],
    ['46', '鹿児島'],
    ['47', '沖縄'],
  ])],
  [2, names], // 共通規制種別コード
  [3, new Map([ // 点・線・面コード
    ['1', '点規制'],
    ['2', '線規制'],
    ['3', '面規制'],
  ])],
  [4, new Map([ // 実施機関コード
    ['1', '公安委員会'],
    ['2', '警察署長'],
    ['3', '高速道路交通警察隊長'],
    ['99', 'その他'],
  ])],
  [5, new Map([ // データ更新区分コード
    ['1', '新規'],
    ['2', '改正'],
    ['3', '廃止'],
    ['4', '修正'],
    ['5', '変更なし'],
  ])],
  [6, new Map([ // 面規制の外周道路有無コード
    ['1', '有'],
    ['2', '無'],
  ])],
  [7, new Map([ // 道路種別コード
    ['1', '一般道'],
    ['2', '高速自動車国道'],
    ['3', '自動車専用道路'],
    ['99', 'その他'],
  ])],
  [8, new Map([ // 指定・禁止方向の別コード
    ['1', '禁止'],
    ['2', '指定'],
  ])],
  [9, new Map([ // 曜日コード
    ['1', '土曜・日曜'],
    ['2', '土曜・日曜・休日'],
    ['3', '日曜・休日'],
    ['4', '土曜日'],
    ['5', '日曜日'],
    ['6', '休日'],
    ['99', 'その他'],
  ])],
  [10, new Map([ // 対象コード
  ])],
  [11, new Map([ // 片側・両側コード
    ['1', '無し'],
    ['2', '片側'],
    ['3', '両側'],
  ])],
  [12, new Map([ // 方位コード
    ['1', '北'],
    ['2', '北東'],
    ['3', '東'],
    ['4', '南東'],
    ['5', '南'],
    ['6', '南西'],
    ['7', '西'],
    ['8', '北西'],
    ['9', '左'],
    ['10', '右'],
    ['99', 'その他'],
  ])],
  [13, new Map([ // ゾーン 30・ゾーン 30 プラス指定コード
    ['1', 'ゾーン30'],
    ['2', 'ゾーン30プラス'],
  ])],
  [14, new Map([ // 最高速度可変区分コード
    ['1', '(法)-(50)km/h'],
    ['2', '(法)-(40)km/h'],
    ['3', '(法)-(30)km/h'],
    ['4', '(60)-(50)km/h'],
    ['5', '(50)-(40)km/h'],
    ['6', '(50)-(30)km/h'],
    ['7', '(50)-(60)km/h'],
    ['8', '(40)-(50)km/h'],
    ['9', '(30)-(40)km/h'],
    ['99', 'その他'],
  ])],
  [15, new Map([ // 交差点形状名コード
    ['1', '3差路(T形)'],
    ['2', '3差路(Y形)'],
    ['3', '3差路(その他)'],
    ['4', '4差路(X形)'],
    ['5', '4差路(その他)'],
    ['6', '5差路'],
    ['7', '6差路'],
    ['8', '6差路以上'],
    ['9', '環状'],
    ['99', 'その他'],
  ])],
  [16, new Map([ // 右左折の区別コード
    ['1', '左折'],
    ['2', '右折'],
    ['3', '右左折'],
  ])],
  [17, new Map([ // 右左折方法コード
    ['1', '道路標示等に従って通行する'],
    ['2', '小回り'],
    ['3', '内小回り'],
    ['4', '外小回り'],
    ['5', 'ロータリー外小回り'],
    ['99', 'その他'],
  ])],
  [18, new Map([ // 交差点・単路の別コード
    ['1', '交差点'],
    ['2', '単路'],
    ['99', 'その他'],
  ])],
  [19, new Map([ // 信号の有無コード
    ['1', '有'],
    ['2', '無'],
  ])],
  [20, new Map([ // 種別(横断歩道)コード
    ['1', '一般用'],
    ['2', '学童用'],
    ['3', '信号用'],
  ])],
  [21, new Map([ // 駐車方法コード
    ['1', '平行駐車'],
    ['2', '直角駐車'],
    ['3', '斜め駐車'],
  ])],
  [22, new Map([ // 停車方法コード
    ['1', '右側停車'],
    ['2', '左側停車'],
    ['3', '直角停車'],
  ])],
  [23, new Map([ // 側指定コード
    ['1', '北側'],
    ['2', '南側'],
    ['3', '東側'],
    ['4', '西側'],
    ['5', '北側、東側'],
    ['6', '北側、南側'],
    ['7', '北側、西側'],
    ['8', '東側、南側'],
    ['9', '東側、西側'],
    ['10', '南側、西側'],
    ['11', '北東側'],
    ['12', '南東側'],
    ['13', '南西側'],
    ['14', '北西側'],
    ['15', '北側部分東側'],
    ['16', '北側部分南側'],
    ['17', '北側部分西側'],
    ['18', '東側部分北側'],
    ['19', '東側部分南側'],
    ['20', '東側部分西側'],
    ['21', '南側部分北側'],
    ['22', '南側部分東側'],
    ['23', '南側部分西側'],
    ['24', '西側部分北側'],
    ['25', '西側部分東側'],
    ['26', '西側部分南側'],
    ['27', '北側(駐車方法標示線内に限る)'],
    ['28', '南側(駐車方法標示線内に限る)'],
    ['29', '東側(駐車方法標示線内に限る)'],
    ['30', '西側(駐車方法標示線内に限る)'],
    ['31', '北側(時間制限駐車区間)'],
    ['32', '南側(時間制限駐車区間)'],
    ['33', '東側(時間制限駐車区間)'],
    ['34', '西側(時間制限駐車区間)'],
    ['35', '北側に道路標示により区画された部分'],
    ['36', '東側に道路標示により区画された部分'],
    ['37', '西側に道路標示により区画された部分'],
    ['38', '南側に道路標示により区画された部分'],
    ['39', '片側'],
    ['40', '左側'],
    ['41', '右側'],
    ['42', '両側'],
    ['43', '左側(区画線内に限る)'],
    ['44', '右側(区画線内に限る)'],
    ['45', '左側縦列駐車'],
    ['46', '右側縦列駐車'],
    ['47', '一方通行道路の左側'],
    ['48', '一方通行道路の右側'],
    ['49', '一方通行道路の両側'],
    ['50', '道路左側区間内の道路標示で示した部分'],
    ['51', '道路右側区間内の道路標示で示した部分'],
    ['52', '二輪専用パーキングチケット区間'],
    ['53', '高齢運転者等専用駐車区間'],
    ['54', '高齢運転者等専用駐車区間(標章車専用、枠内に限る)'],
    ['55', '歩道の車道側部分'],
    ['56', '公園側部分'],
    ['57', '道路標示により区画した部分'],
    ['58', '道路の側端に沿って道路標示により区画した部分'],
    ['59', '分離帯の側端に沿って道路標示により区画した部分'],
    ['60', '北側を除く'],
    ['61', '北東側を除く'],
    ['62', '東側を除く'],
    ['63', '南東側を除く'],
    ['64', '南側を除く'],
    ['65', '南西側を除く'],
    ['66', '西側を除く'],
    ['67', '北西側を除く'],
    ['999', 'その他'],
  ])],
  [24, new Map([ // 摘要 指定部分コード
    ['1', '道路の東側'],
    ['2', '道路の西側'],
    ['3', '道路の南側'],
    ['4', '道路の北側'],
    ['5', '道路の南東側'],
    ['6', '道路の南西側'],
    ['7', '道路の北東側'],
    ['8', '道路の北西側'],
    ['9', '道路の両側'],
    ['10', '道路の片側'],
    ['99', 'その他'],
  ])],
  [25, new Map([ // 路側帯の種類コード
    ['1', '駐停車禁止用'],
    ['2', '歩行者用'],
    ['3', '一般用'],
  ])],
]);
const columns = [
  ["拡張版標準フォーマット種別・バージョン", 0],
  ["都道府県コード", 1],
  ["警察署コード", 0],
  ["関連警察署コード 1", 0],
  ["関連警察署コード 2", 0],
  ["関連警察署コード 3", 0],
  ["関連警察署コード 4", 0],
  ["関連警察署コード 5", 0],
  ["関連警察署コード 6", 0],
  ["関連警察署コード 7", 0],
  ["関連警察署コード 8", 0],
  ["共通規制種別コード", 2],
  ["点・線・面コード", 3],
  ["県別規制種別名称", 0],
  ["実施機関コード", 4],
  ["意思決定日(新規)", 0],
  ["意思決定改正日", 0],
  ["意思決定廃止日", 0],
  ["データ更新日", 0],
  ["データ更新区分コード", 5],
  ["ユニークキー", 0],
  ["意思決定番号", 0],
  ["枝番号", 0],
  ["規制場所の経度緯度", 0],
  ["規制場所始点", 0],
  ["規制場所終点", 0],
  ["交差点名称(踏切名含む)", 0],
  ["経由地点または規制区域", 0],
  ["除外区間及び区域", 0],
  ["除外区間及び区域の経度緯度", 0],
  ["面規制の外周道路有無コード", 6],
  ["道路種別コード", 7],
  ["路線名(代表)", 0],
  ["進入方向(文字)", 0],
  ["進入方向(座標)", 0],
  ["禁止する方向(文字)", 0],
  ["禁止する方向(座標)", 0],
  ["指定する方向(文字)", 0],
  ["指定する方向(座標)", 0],
  ["指定・禁止方向の別コード", 8],
  ["対象期間 1_開始", 0],
  ["対象期間 1_終了", 0],
  ["規制時間 1_開始", 0],
  ["規制時間 1_終了", 0],
  ["規制曜日コード 1", 9],
  ["対象車両コード 1_A", 0],
  ["対象車両コード 1_B", 0],
  ["対象車両コード 1_C", 0],
  ["対象車両コード 1_D", 0],
  ["対象期間 2_開始", 0],
  ["対象期間 2_終了", 0],
  ["規制時間 2_開始", 0],
  ["規制時間 2_終了", 0],
  ["規制曜日コード 2", 9],
  ["対象車両コード 2_A", 0],
  ["対象車両コード 2_B", 0],
  ["対象車両コード 2_C", 0],
  ["対象車両コード 2_D", 0],
  ["対象期間 3_開始", 0],
  ["対象期間 3_終了", 0],
  ["規制時間 3_開始", 0],
  ["規制時間 3_終了", 0],
  ["規制曜日コード 3", 9],
  ["対象車両コード 3_A", 0],
  ["対象車両コード 3_B", 0],
  ["対象車両コード 3_C", 0],
  ["対象車両コード 3_D", 0],
  ["対象期間 4_開始", 0],
  ["対象期間 4_終了", 0],
  ["規制時間 4_開始", 0],
  ["規制時間 4_終了", 0],
  ["規制曜日コード 4", 9],
  ["対象車両コード 4_A", 0],
  ["対象車両コード 4_B", 0],
  ["対象車両コード 4_C", 0],
  ["対象車両コード 4_D", 0],
  ["対象期間 5_開始", 0],
  ["対象期間 5_終了", 0],
  ["規制時間 5_開始", 0],
  ["規制時間 5_終了", 0],
  ["規制曜日コード 5", 9],
  ["対象車両コード 5_A", 0],
  ["対象車両コード 5_B", 0],
  ["対象車両コード 5_C", 0],
  ["対象車両コード 5_D", 0],
  ["除外期間 1_開始", 0],
  ["除外期間 1_終了", 0],
  ["除外時間 1_開始", 0],
  ["除外時間 1_終了", 0],
  ["除外曜日コード 1", 9],
  ["除外車両コード 1_A", 0],
  ["除外車両コード 1_B", 0],
  ["除外車両コード 1_C", 0],
  ["除外車両コード 1_D", 0],
  ["除外期間 2_開始", 0],
  ["除外期間 2_終了", 0],
  ["除外時間 2_開始", 0],
  ["除外時間 2_終了", 0],
  ["除外曜日コード 2", 9],
  ["除外車両コード 2_A", 0],
  ["除外車両コード 2_B", 0],
  ["除外車両コード 2_C", 0],
  ["除外車両コード 2_D", 0],
  ["除外期間 3_開始", 0],
  ["除外期間 3_終了", 0],
  ["除外時間 3_開始", 0],
  ["除外時間 3_終了", 0],
  ["除外曜日コード 3", 9],
  ["除外車両コード 3_A", 0],
  ["除外車両コード 3_B", 0],
  ["除外車両コード 3_C", 0],
  ["除外車両コード 3_D", 0],
  ["除外期間 4_開始", 0],
  ["除外期間 4_終了", 0],
  ["除外時間 4_開始", 0],
  ["除外時間 4_終了", 0],
  ["除外曜日コード 4", 9],
  ["除外車両コード 4_A", 0],
  ["除外車両コード 4_B", 0],
  ["除外車両コード 4_C", 0],
  ["除外車両コード 4_D", 0],
  ["除外期間 5_開始", 0],
  ["除外期間 5_終了", 0],
  ["除外時間 5_開始", 0],
  ["除外時間 5_終了", 0],
  ["除外曜日コード 5", 9],
  ["除外車両コード 5_A", 0],
  ["除外車両コード 5_B", 0],
  ["除外車両コード 5_C", 0],
  ["除外車両コード 5_D", 0],
  ["規制条件", 0],
  ["規制内容", 0],
  ["距離・延長", 0],
  ["面積", 0],
  ["制限重量", 0],
  ["片側・両側コード", 11],
  ["方位コード", 12],
  ["速度", 0],
  ["ゾーン 30・ゾーン 30 プラス指定コード", 13],
  ["最高速度可変区分コード", 14],
  ["車両通行帯数", 0],
  ["通行帯の指定", 0],
  ["通行帯内容", 0],
  ["中央線の指定", 0],
  ["進行方向別通行区分", 0],
  ["交差点形状名コード", 15],
  ["停止線本数", 0],
  ["普通自転車の交差点進入禁止設置箇所数", 0],
  ["右左折の区別コード", 16],
  ["右左折方法 1", 17],
  ["右左折方法 2", 17],
  ["右左折方法 3", 17],
  ["通行方法", 0],
  ["交差点・単路の別コード", 18],
  ["横断歩道設置本数", 0],
  ["自転車横断帯設置本数", 0],
  ["信号の有無コード", 19],
  ["種別(横断歩道)コード", 20],
  ["信号機設置管理者(委任)", 0],
  ["駐車可台数", 0],
  ["駐車方法コード", 21],
  ["停車方法コード", 22],
  ["パーキングメーター基数", 0],
  ["パーキングチケット発給設", 0],
  ["指定時間", 0],
  ["側指定コード", 23],
  ["摘要 指定部分コード", 24],
  ["路側帯の種類コード", 25],
  ["規制理由", 0],
  ["備考", 0],
] as [string, number][];
const visible_kisei = new Map(Array.from(names.keys()).map(k => [k, true]));
let transparent_kisei = true;
const visible_vehicle = new Array(60).fill(true);
const visible_day = {weekday: true, saturday: true, sunday: true, holiday: true};
let visible_time_center = 1179.5;
let visible_time_delta = 2359;
function speedSign(row: string[]): string {
  const sp = Number(row[137]);
  if (row[137] == '120' || sp >= 120) return '28_120';
  if (row[137] == '110' || sp >= 110) return '28_110';
  if (sp >= 100) return '28';
  if (sp >= 80) return '29';
  if (sp >= 70) return '30';
  if (sp >= 60) return '31';
  if (sp >= 50) return '32';
  if (sp >= 40) return '33';
  if (sp >= 30) return '34';
  return '35';
}
function getIcon(row: string[], iconSize: number): google.maps.Icon | undefined {
  const signs = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '19', '21', '24', '27', '49', '50', '51', '53', '54', '55', '56', '57', '58', '60', '61', '62', '63', '65', '70', '71', '72', '76', '77', '81', '82', '83', '84', '85', '86', '87', '88', '90', '92', '93', '94', '97', '98', '100', '103', '106', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119']);
  const ident = (row: string[]) => row[11];
  const check = (row: string[], offset: number, types: number[]): boolean => {
    const bits = types.map((_, i) => row
      .slice(offset + i, offset + i + 45)
      .filter((_, i) => i % 9 === 0)
      .map(s => parseInt(s || '0', 2))
      .reduce((a, b) => a | b, 0));
    if (bits.every(bit => bit == 0)) {
      return false;
    }
    return bits.every((bit, i) => (bit & (i == 3 ? 0b11111111111111 : 0b111111111111111) & ~types[i]) == 0) && bits.some((bit, i) => (bit & types[i]) != 0);
  };
  const prohibit = (row: string[]) => {
    if (check(row, 45, [0, 0, 0, 0b100000]))
      if (check(row, 90, [0, 0, 0, 0b1000000100]))
        return '5_cart';
    if (check(row, 45, [0b10, 0, 0, 0b1000])) {
      if (check(row, 90, [0b1000000000, 0, 0b10000000, 0b11]))
        return '5_car';
      if (check(row, 45, [0, 0, 0, 0b1000]))
        return '5_motorcycle';
      return '5_motor';
    }
    if (check(row, 45, [0b1000000000, 0, 0, 0]))
      return '5_car';
    if (check(row, 45, [0b110000000, 0b1111111, 0b101111101, 0]))
      if (check(row, 45, [0, 0, 0b101111101, 0]))
        return '5_truck';
      else
        return '5_heavy';
    if (check(row, 90, [0, 0, 0b10000000, 0b1000101100]))
      return '5_motor';
    if (check(row, 90, [0, 0, 0b10000000, 0b101111]))
      return '5_car';
      if (check(row, 45, [0, 0, 0, 0b1000000100]))
      return '5_bicycle';
    if (check(row, 45, [0, 0, 0, 0b1001100100]))
      return '5_light';
    if (check(row, 90, [0, 0, 0, 0b101010]))
      return '5_car';
    if (check(row, 45, [0, 0, 0, 0b1011]))
      return '5_motorcycle';
    return '5';
  };
  const trans = new Map<string, (row: string[]) => string>([
    ['4', (row: string[]) => {
      if (row[45] == '' && row[46] == '' && row[47] == '' && row[48] == '' && row[90] == '' && row[91] == '' && row[92] == '' && row[93] == '')
        return '4';
      else
        return prohibit(row);
    }],
    ['5', prohibit],
    ['7', prohibit],
    ['100', (_) => '70'],
    ['101', (_) => '71'],
    ['102', (_) => '72'],
    ['103', (_) => '71'],
    ['110', (_) => '22_bicycle'],
    ['111', (row: string[]) => {
      if (check(row, 45, [0, 0, 0, 0b100]))
        return '22_bicycle';
      for (let i = 0; i < 45; i += 9) {
        const b = Number(row[46 + i] || '0');
        if ([1000, 10000, 1000000].some(bit => Math.floor(b / bit) % 10 === 1))
          return '23';
      }
      return '22';
    }],
    ['112', speedSign],
    ['113', speedSign],
    ['114', (row: string[]) => {
      if (row[137] == '' || row[137] == '-1')
        return '34';
      return speedSign(row);
    }],
    ['115', (_) => '66'],
    ['116', (row: string[]) => {
      if (row[160] == '2') return '74';
      if (row[160] == '3') return '75';
      return '73';
    }],
    ['117', (row: string[]) => {
      if (row[167] == '1') return '79';
      if (row[167] == '2') return '78';
      return '80';
    }],
    ['118', (_) => '59'],
    ['119', (_) => '59'],
  ]);
  if (signs.has(row[11])) {
    return {
      url: `signs/${(trans.get(row[11]) || ident)(row)}.svg`,
      anchor: new google.maps.Point(iconSize / 2, iconSize / 2),
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
  }
  return undefined;
}
function speedColor(row: string[]): string {
  const sp = Number(row[137]);
  if (sp >= 100) return '#00FFFF';
  if (sp >= 80) return '#00FFC0';
  if (sp >= 70) return '#00FFA0';
  if (sp >= 60) return '#00FF80';
  if (sp >= 50) return '#00FF60';
  if (sp >= 40) return '#00FF40';
  if (sp >= 30) return '#00FF20';
  return '#00FF00';
}
function getColor(row: string[]): string {
  const type = row[11];
  if (type == '112' || type == '113' || type == '114') {
    if ((type == '114') && (row[137] == '' || row[137] == '-1')) {
      return '#00FF20';
    }
    return speedColor(row);
  }
  const colors = new Map([
    ['1', '#0000FF'], // 歩行者用道路
    ['2', '#0000FF'], // 自転車用道路
    ['3', '#0000FF'], // 自転車及び歩行者用道路
    ['4', '#400000'], // 通行止め
    ['5', '#800000'], // 車両通行止め
    ['6', '#800000'], // 大型自動二輪車及び普通自動二輪車二人乗り通行禁止
    ['7', '#800000'], // 車両通行止め(踏切)
    ['8', '#800000'], // 歩行者通行止め
    ['9', '#FF0000'], // 重量制限
    ['10', '#FF0000'], // 高さ制限
    ['11', '#0000FF'], // 一方通行
    ['12', '#0000FF'], // 指定方向外進行禁止
    ['13', '#FF0000'], // 車両進入禁止
    ['14', '#FF0000'], // 歩行者横断禁止
    ['15', '#FF7B00'], // 中央線
    ['16', '#FF7B00'], // 中央線の変移
    ['17', '#FF7B00'], // 追越しのための右側部分はみ出し通行禁止
    ['18', '#FF0000'], // 右側通行
    ['19', '#FF0000'], // 立入り禁止部分
    ['20', '#404040'], // 車両通行帯
    ['21', '#FF0000'], // 車両通行区分
    ['24', '#FF0000'], // 路線バス等優先通行帯
    ['25', '#FF0000'], // 牽引自動車の自動車専用道路第一通行帯通行指定区間
    ['26', '#FF0000'], // 車線境界線
    ['27', '#FF0000'], // 軌道敷内通行可
    ['49', '#00FFFF'], // 最低速度
    ['50', '#FF0000'], // 車両横断禁止
    ['51', '#FF0000'], // 転回禁止
    ['52', '#FF7B00'], // 進路変更禁止
    ['53', '#FF7B00'], // 追越し禁止
    ['54', '#0000FF'], // 優先道路
    ['55', '#FF0000'], // 原動機付自転車の右折方法(二段階)
    ['56', '#FF0000'], // 原動機付自転車の右折方法(小回り)
    ['57', '#FF0000'], // 右左折の方法
    ['58', '#0000FF'], // 進行方向別通行区分
    ['60', '#FF0000'], // 進行方向
    ['61', '#FF0000'], // 徐行
    ['62', '#FF0000'], // 前方優先道路
    ['63', '#FF0000'], // 一時停止
    ['64', '#FF0000'], // 優先本線車道
    ['65', '#800040'], // 駐停車禁止
    ['69', '#0080FF'], // 駐車余地
    ['70', '#0080FF'], // 駐車可
    ['71', '#004080'], // 停車可
    ['72', '#0080FF'], // 時間制限駐車区間
    ['76', '#800040'], // 停止禁止部分
    ['77', '#FF0000'], // 警笛鳴らせ及び警笛区間
    ['81', '#0000FF'], // 普通自転車歩道通行可
    ['82', '#0000FF'], // 普通自転車の歩道通行部分
    ['83', '#FF0000'], // 普通自転車の交差点進入禁止
    ['84', '#FF0000'], // 並進可
    ['85', '#0000FF'], // 横断歩道
    ['86', '#0000FF'], // 斜め横断可
    ['87', '#0000FF'], // 自転車横断帯
    ['88', '#FF0000'], // 安全地帯
    ['89', '#FF0000'], // 安全地帯又は路上障害物接近
    ['90', '#FF0000'], // 導流帯
    ['91', '#FF0000'], // 路面電車停留場
    ['92', '#FF0000'], // 停止線
    ['93', '#FF0000'], // 二段停止線
    ['94', '#0000FF'], // 左折可
    ['95', '#FF0000'], // 危険物積載車両通行止め
    ['96', '#FF0000'], // 最大幅
    ['97', '#0000FF'], // 自動車専用
    ['98', '#FF0000'], // 信号機
    ['100', '#0000FF'], // 高齢運転者等標章自動車駐車可
    ['101', '#0000FF'], // 高齢運転者等標章自動車停車可
    ['102', '#0000FF'], // 高齢運転者等専用時間制限駐車区間
    ['103', '#0000FF'], // 停車方法指定
    ['106', '#0000FF'], // 環状の交差点における右回り通行
    ['107', '#404040'], // 車両通行帯及び車両通行区分(組合せ)
    ['109', '#800040'], // 停車・駐車禁止交差点
    ['110', '#FF0000'], // 普通自転車専用通行帯
    ['111', '#FF0000'], // 専用通行帯(普通自転車専用通行帯を除く。)
    ['115', '#FF0080'], // 駐車禁止
    ['116', '#0080FF'], // 駐車方法の指定
    ['117', '#FF0000'], // 路側帯
    ['118', '#FF7B00'], // 車両通行帯及び進行方向別通行区分(組合せ)
    ['119', '#FF7B00'], // 車両通行帯・進行方向別通行区分・進路変更禁止(組合せ)
  ]);
  return colors.get(type) || '#FF0000';
}

function rowToSubjects(row: string[]): string[] {
  let result: string[] = [];
  for (let i = 40; i < 130; i += 9) {
    let subject = '';
    if (row[i] != '' && !(row[i].padStart(4, '0') == '0101' && row[i + 1] == '1231')) {
      subject += ` ${Number(row[i].padStart(4, '0').substring(0, 2))}月${Number(row[i].padStart(4, '0').substring(2, 4))}日`;
    }
    if (row[i + 1] != '' && row[i + 1] != row[i] && !(row[i].padStart(4, '0') == '0101' && row[i + 1] == '1231')) {
      subject += '〜'
      if (!row[i].startsWith(row[i + 1].padStart(4, '0').substring(0, 2))) {
        subject += `${Number(row[i + 1].padStart(4, '0').substring(0, 2))}月`;
      }
      subject += `${Number(row[i + 1].padStart(4, '0').substring(2, 4))}日`;
    }
    if (row[i + 4]) {
      const days = new Map([['1', '土曜、日曜'], ['2', '土曜・日曜・休日'], ['3', '日曜・休日'], ['4', '競輪開催日'], ['5', '競馬開催日'], ['6', '場内馬券発売日'], ['7', '競艇開催日'], ['8', '工事実施日']]);
      subject += ` ${days.get(row[i + 4]) || row[i + 4]}`;
    }
    if (row[i + 2] != '' && row[i + 3] && !(row[i + 2].padStart(4, '0') == '0000' && (row[i + 3].padStart(4, '0') == '0000' || row[i + 3].padStart(4, '0') == '2400'))) {
      subject += ` ${Number(row[i + 2].padStart(4, '0').substring(0, 2))}`;
      if (row[i + 2].padStart(4, '0').substring(2, 4) != '00') {
        subject += `.${row[i + 2].padStart(4, '0').substring(2, 4)}`;
      }
      subject += `-`;
      if (row[i + 3].padStart(4, '0') < row[i + 2].padStart(4, '0')) {
        subject += `翌`
      }
      subject += `${Number(row[i + 3].padStart(4, '0').substring(0, 2))}`;
      if (row[i + 3].padStart(4, '0').substring(2, 4) != '00') {
        subject += `.${row[i + 3].padStart(4, '0').substring(2, 4)}`;
      }
    }
    const types = [
      ['車両', '自動車', '乗用', '普乗', '普通', '中乗', '中型', '特定中乗', '特定中型', '軽', '準中乗', '準中型', 'タクシー', '標章車', 'タイヤチェーンを取り付けていない車両'],
      ['大型', '大乗', '大型等', '大型バス', 'バス', 'マイクロ', '路線バス', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15'],
      ['貨物', '普貨', '特定中貨物', '中貨', '大貨等', '大貨', '準中貨', '小特', '大特', 'けん引', 'C11', 'C12', 'C13', 'C14', 'C15'],
      ['二輪', '自二輪', '自転車', '原付', '小二輪', '軽車両', '歩行者', '遠隔小型', '移動小型', '特定原付', '特例特定原付', 'その他', 'D13', 'D14', 'その他'],
    ];
    let t: string[] = [];
    for (let j = 0; j < 4; ++j) {
      if (row[i + 5 + j] != '') {
        let bits = Number(row[i + 5 + j]);
        for (let k = 0; k < types[j].length && bits >= 1; ++k) {
          if (bits % 10 == 1) {
            t.push(types[j][k]);
          }
          bits = Math.floor(bits / 10);
        }
      }
    }
    if (t.length > 0 && t.join('・') != '車両') {
      subject += ` ${t.join('・')}`;
    }
    if (subject != '') {
      if (i >= 85) {
        subject += 'を除く';
      }
      result.push(subject);
    }
  }
  if (row[130] != '') {
    result.push(row[130]);
  }
  return result;
}

interface KiseiResponse {
  id: string;
  row: string[];
  coords: {lat: number, lng: number}[];
  offsets: number[];
}

interface Opacity {
  opacity: number;
}

let currentWindow: google.maps.InfoWindow | null = null;
let currentMarkers = new Map<string, Array<google.maps.Marker | null>>();
let currentPolylines = new Map<string, Array<google.maps.Polyline>>();
let currentPolygons = new Map<string, google.maps.Polygon>();

const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

let kiseis: KiseiResponse[] = [];

let lastCenter: google.maps.LatLng;
let lastZoom: number;
let lastSuffix = '';
function updateUrl(center?: google.maps.LatLng, zoom?: number, suffix?: string) {
  if (center != undefined) {
    lastCenter = center;
  }
  if (zoom != undefined) {
    lastZoom = zoom;
  }
  if (suffix != undefined) {
    if (suffix != lastSuffix) {
      lastSuffix = suffix;
      history.pushState(null, '', `${location.origin}${location.pathname.split('@')[0]}@${lastCenter.lat()},${lastCenter.lng()},${lastZoom}z${lastSuffix}`);
    }
  } else {
    history.pushState(null, '', `${location.origin}${location.pathname.split('@')[0]}@${lastCenter.lat()},${lastCenter.lng()},${lastZoom}z${lastSuffix}`);
  }
}

let visibleKeys = new Map<string, number>();
let currentKeys: [string, number][] = [];
function showInfo(key: string | undefined, e: google.maps.MapMouseEvent) {
  if (currentWindow != null) {
    currentWindow.close();
    currentKeys = [];
  }
  if (currentKeys.length > 0) {
    return;
  }
  if (key == undefined || e.latLng == null) {
    updateUrl(undefined, undefined, '');
    return;
  }
  const ks = [key];
  for (const [k, objs] of currentPolylines) {
    for (const obj of objs) {
      if (k != key && obj != null && google.maps.geometry.poly.isLocationOnEdge(e.latLng, obj, 10 * Math.pow(2, -lastZoom))) {
        ks.push(k);
        break;
      }
    }
  }
  for (const [k, obj] of currentPolygons) {
    if (k != key && google.maps.geometry.poly.containsLocation(e.latLng, obj)) {
      ks.push(k);
    }
  }
  currentKeys = ks.map(k => [k, visibleKeys.get(k) || 0] as [string, number]).sort((a, b) => b[1] - a[1]);
  const keys = new Map(kiseis.map(r => [r.id, r]));
  const element = document.createElement('div');
  let content = '';
  for (const [k, o] of currentKeys) {
    const kisei = keys.get(k);
    if (kisei != undefined) {
      const url = getIcon(kisei.row, 0)?.url;
      content += '<div style="' + (url ? `background-image: url(${url}); background-repeat: no-repeat; background-size: 4.5em; ` : '') + 'padding-inline-start: 5em; min-height: 4.5em; margin-bottom: 0.5em;">';
      if (currentPolylines.has(kisei.id)) {
        content += `<span style="width: 5em; display: inline-block; margin: .5em 0 .5em 0; border: 1.5px solid ${getColor(kisei.row)}; opacity: ${o};"></span><br>`;
      } else if (currentPolygons.has(kisei.id)) {
        content += `<span style="width: 5em; height: 1em; display: inline-block; border: 2px solid ${getColor(kisei.row)}; background-color: ${getColor(kisei.row)}80; opacity: ${o};"></span><br>`;
      } else {
        content += `<span style="display: inline-block; margin: .5em; border: 1.5px solid; opacity: ${o};"></span><br>`;
      }
      content += (kisei.row[13] || names.get(kisei.row[11])) + '<br>' + rowToSubjects(kisei.row).join('<br>');
      content += '</div>';
    }
  }
  element.innerHTML = content;
  const a = document.createElement('a');
  a.href = 'javascript: void(0);';
  a.onclick = () => showDetail();
  a.innerText = '詳細…';
  element.appendChild(a);
  currentWindow = new google.maps.InfoWindow({
    content: element,
    ariaLabel: "Uluru",
    position: e.latLng,
  });
  currentWindow.open(map);
  currentWindow.addListener('closeclick', (_: any) => showInfo(undefined, e));
  updateUrl(undefined, undefined, `#${key}@${e.latLng.lat()},${e.latLng.lng()}`);
}

function showDetail() {
  if (currentWindow != null) {
    currentWindow.close();
    currentWindow = null;
  }
  if (currentKeys.length == 0) {
    return;
  }
  const keys = new Map(kiseis.map(r => [r.id, r]));
  let content = '';
  for (const [k, o] of currentKeys) {
    const kisei = keys.get(k);
    if (kisei != undefined) {
      const url = getIcon(kisei.row, 0)?.url;
      content += '<div style="' + (url ? `background-image: url(${url}); background-repeat: no-repeat; background-size: 4.5em; ` : '') + 'padding-inline-start: 5em; min-height: 4.5em;' + (k != currentKeys[0][0] ? ' margin-top: 0.5em;' : '') + '">';
      if (currentPolylines.has(kisei.id)) {
        content += `<span style="width: 5em; display: inline-block; margin: .5em 0 .5em 0; border: 1.5px solid ${getColor(kisei.row)}; opacity: ${o};"></span><br>`;
      } else if (currentPolygons.has(kisei.id)) {
        content += `<span style="width: 5em; height: 1em; display: inline-block; border: 2px solid ${getColor(kisei.row)}; background-color: ${getColor(kisei.row)}80; opacity: ${o};"></span><br>`;
      } else {
        content += `<span style="display: inline-block; margin: .5em; border: 1.5px solid; opacity: ${o};"></span><br>`;
      }
      content += (kisei.row[13] || names.get(kisei.row[11])) + '<br>' + rowToSubjects(kisei.row).join('<br>');
      content += '<br>' + kisei.row.map((v, i) => (columns[i][0] != null && v != '' && i != 34 && i != 36 && i != 38) ? `[${i + 1} ${columns[i][0]}] ${v}${codeMap.get(columns[i][1])?.has(v) ? ` (${codeMap.get(columns[i][1])?.get(v)})` : ''}<br>` : '').join('');
      content += '</div>';
    }
  }
  const width = window.innerWidth / parseFloat(getComputedStyle(document.body).fontSize);
  const container = document.getElementById('map-container')!!;
  const detail = document.getElementById('detail')!!;
  const detail_content = document.getElementById('detail-content')!!;
  if (width >= 60) {
    container.style.flexDirection = 'row-reverse';
    detail.style.width = '30em';
    detail.style.height = '';
  } else {
    container.style.flexDirection = 'column';
    detail.style.width = '100%';
    detail.style.height = '50%';
  }
  detail.style.display = 'block';
  if (history.state != 'detail') {
    history.pushState('detail', '');
  }
  detail_content.innerHTML = content;
  const bounds = new google.maps.LatLngBounds();
  for (const [key, objs] of currentMarkers) {
    if (currentKeys.some(([k, _]) => k == key)) {
      for (const obj of objs) {
        if (obj != null) {
          const latlng = obj.getPosition();
          if (latlng != null) {
            bounds.extend(latlng);
          }
        }
      }
    }
  }
  for (const [key, objs] of currentPolylines) {
    if (currentKeys.some(([k, _]) => k == key)) {
      for (const obj of objs) {
        if (obj != null) {
          for (const latlng of obj.getPath().getArray()) {
            bounds.extend(latlng);
          }
        }
      }
    }
  }
  for (const [key, obj] of currentPolygons) {
    if (currentKeys.some(([k, _]) => k == key)) {
      for (const latlng of obj.getPath().getArray()) {
        bounds.extend(latlng);
      }
    }
  }
  map.fitBounds(bounds);
}

function getDistance(coord1: {lat: number, lng: number}, coord2: {lat: number, lng: number}): number {
  return Math.sqrt((coord2.lat - coord1.lat) * (coord2.lat - coord1.lat) + (coord2.lng - coord1.lng) * (coord2.lng - coord1.lng) * 0.64);
}

let rendering = false;
let first = true;
function render(bounds: google.maps.LatLngBounds, zoom: number, filterKeys: [string, number][] | null = null): void {
  while (rendering);
  rendering = true;
  const iconSize = Math.pow(2, Math.max((zoom ? zoom : 0) - 17, 0) / 2) * 16;
  const keys = new Map<string, KiseiResponse & Opacity>(filterKeys ?
    kiseis.map(r => [r.id, {...r, opacity: filterKeys.find(([k, _]) => k == r.id)?.[1] || 0}] as [string, KiseiResponse & Opacity]).filter(([_, r]) => r.opacity > 0) :
    kiseis.filter(r => visible_kisei.get(r.row[11])).map((r): [string, KiseiResponse & Opacity] => [r.id, {...r, opacity: ((r: KiseiResponse) => {
      const match = (row_slice: string[], negate: boolean): [boolean, boolean] => {
        let any = false;
        return [(() => {
          if (negate) {
            let i;
            for (i = 0; i < 60; ++i) {
              if (!visible_vehicle[i]) {
                break;
              }
            }
            if (i == 60) {
              return true;
            }
          }
          for (let i = 0; i < 4; ++i) {
            if (row_slice[5 + i] != '') {
              any = true;
              let bits = Number(row_slice[5 + i]);
              for (let j = 0; j < 15 && bits >= 1; ++j) {
                if (bits % 10 == 1 && visible_vehicle[i * 15 + j]) {
                  return true;
                }
                bits = Math.floor(bits / 10);
              }
            }
          }
          return !any;
        })() && (() => {
          if (row_slice[4] != '') {
            any = true;
            if (negate) {
              switch (row_slice[4]) {
                case '1':
                  return !(visible_day.weekday || visible_day.holiday);
                case '2':
                  return !visible_day.weekday;
                case '3':
                  return !(visible_day.weekday || visible_day.saturday);
              }
            } else {
              switch (row_slice[4]) {
                case '1':
                  return visible_day.saturday || visible_day.sunday;
                case '2':
                  return visible_day.saturday || visible_day.sunday || visible_day.holiday;
                case '3':
                  return visible_day.sunday || visible_day.holiday;
              }
            }
            return !negate;
          }
          return true;
        })() && (() => {
          if (row_slice[2] != '' && row_slice[3] && !(row_slice[2].padStart(4, '0') == '0000' && (row_slice[3].padStart(4, '0') == '0000' || row_slice[3].padStart(4, '0') == '2400'))) {
            any = true;
            let start = Number(row_slice[2]);
            let end = Number(row_slice[3]) - 1;
            if (end < start) {
              end += 2400;
            }
            let center = (start + end) / 2;
            if (center >= 2400) {
              center -= 2400;
            }
            let delta = end - start;
            let dist = Math.abs(center - visible_time_center);
            if (dist >= 1200) {
              dist = 2400 - dist;
            }
            if (negate) {
              return dist <= (delta - visible_time_delta) / 2;
            } else {
              return dist <= (delta + visible_time_delta) / 2;
            }
          }
          return true;
        })() && (!negate || any), any];
      };
      let any = false;
      for (let i = 85; i < 130; i += 9) {
        const [res, any_local] = match(r.row.slice(i, i + 9), true);
        if (res && any_local) {
          return false;
        }
        any = any || any_local;
      }
      for (let i = 40; i < 85; i += 9) {
        const [res, any_local] = match(r.row.slice(i, i + 9), false);
        if (res && any_local) {
          return true;
        }
        any = any || any_local;
      }
      const include = new Map<string, string>([
        ['6', '000000000002000'],
        ['8', '000000000000100'],
        ['14', '000000000000100'],
        ['25', '000000000100000'],
        ['55', '000000000000800'],
        ['56', '000000000000800'],
        ['81', '000000000001000'],
        ['82', '000000000001000'],
        ['83', '000000000001000'],
        ['84', '000000000001000'],
      ]);
      if (include.has(r.row[11])) {
        any = true;
        for (let i = 0; i < 15; ++i) {
          let digit = parseInt(include.get(r.row[11])!![i], 16);
          for (let j = 0; j < 4; ++j) {
            if ((digit & 8) != 0 && visible_vehicle[i * 4 + j]) {
              return true;
            }
            digit <<= 1;
          }
        }
      }
      return !any && visible_vehicle[0];
    })(r) ? 1.0 : 0.5}]).filter(r => transparent_kisei || r[1].opacity == 1.0));
  for (const [key, objs] of currentMarkers) {
    const r = keys.get(key);
    if (r) {
      for (const obj of objs) {
        if (obj != null) {
          obj.setOpacity(keys.get(key)!!.opacity);
        }
      }
    } else {
      for (const obj of objs) {
        if (obj != null) {
          obj.setMap(null);
        }
      }
      currentMarkers.delete(key);
    }
  }
  for (const [key, objs] of currentPolylines) {
    const r = keys.get(key);
    const zoomDependent = r && (r.coords.length == 1 || r.row[11] == '12' || r.row[11] == '13' || r.row[11] == '63');
    if (r && !(zoom < 17 && zoomDependent)) {
      for (const obj of objs) {
        if (obj != null) {
          obj.setOptions({
            strokeOpacity: 0.5 * r.opacity,
          });
        }
      }
    } else {
      for (const obj of objs) {
        if (obj != null) {
          obj.setMap(null);
        }
      }
      currentPolylines.delete(key);
    }
  }
  for (const [key, obj] of currentPolygons) {
    const r = keys.get(key);
    if (r) {
      obj.setOptions({
        fillOpacity: 0.25 * r.opacity,
        strokeOpacity: 0.5 * r.opacity,
      });
    } else {
      obj.setMap(null);
      currentPolygons.delete(key);
    }
  }
  for (const [key, r] of keys) {
    const icon = getIcon(r.row, iconSize);
    const color = getColor(r.row);
    if (r.coords.length == 1 || r.row[11] == '12' || r.row[11] == '13' || r.row[11] == '63') {
      if (!currentMarkers.has(key)) {
        const marker = new google.maps.Marker({
          clickable: true,
          position: r.coords[0],
          icon: icon,
          map: map,
          opacity: r.opacity,
        });
        currentMarkers.set(key, [marker]);
        marker.addListener('click', (e: google.maps.MapMouseEvent) => showInfo(key, e));
        if (zoom >= 17 && (r.coords.length > 1 || r.row[34] || r.row[36] || r.row[38]) && !currentPolylines.has(key)) {
          const polylines = new Array<google.maps.Polyline>;
          if (r.row[11] == '12' && r.row[1] == '8') {
            const path = [r.coords[0]];
            for (let i = 1; i < r.coords.length; ++i) {
              path.push(r.coords[i]);
              if (i + 1 < r.coords.length && getDistance(r.coords[0], r.coords[i + 1]) > getDistance(r.coords[0], r.coords[i]) * 0.7) {
                continue;
              }
              const polyline = new google.maps.Polyline({
                clickable: true,
                path: path,
                strokeColor: color,
                strokeOpacity: 0.5 * r.opacity,
                strokeWeight: 3,
                icons: [{
                  icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  },
                }],
                map: map,
              });
              polylines.push(polyline);
              polyline.addListener('click', (e: google.maps.MapMouseEvent) => showInfo(key, e));
              path.splice(1);
            }
          } else {
            for (let i = 1; i < r.coords.length; ++i) {
              const polyline = new google.maps.Polyline({
                clickable: true,
                path: [r.coords[0], r.coords[i]],
                strokeColor: color,
                strokeOpacity: 0.5 * r.opacity,
                strokeWeight: 3,
                icons: [{
                  icon: {
                    path: r.row[11] == '12' && i > 1 ? google.maps.SymbolPath.FORWARD_CLOSED_ARROW : google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                  },
                }],
                map: map,
              });
              polylines.push(polyline);
              polyline.addListener('click', (e: google.maps.MapMouseEvent) => showInfo(key, e));
            }
          }
          for (let i = 34; i < 40; i += 2) {
            r.row[i].split(';').map(c => c.split(' ').map(Number)).forEach(coord => {
              const polyline = new google.maps.Polyline({
                clickable: true,
                path: [r.coords[0], {lat: coord[1], lng: coord[0]}],
                strokeColor: color,
                strokeOpacity: 0.5 * r.opacity,
                strokeWeight: 3,
                icons: [{
                  icon: {
                    path: i == 34 ? google.maps.SymbolPath.BACKWARD_CLOSED_ARROW : i == 36 ? "M -2,-2 2,2 M -2,2 2,-2" : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  },
                }],
                map: map,
              });
              polylines.push(polyline);
              polyline.addListener('click', (e: google.maps.MapMouseEvent) => showInfo(key, e));
            });
          }
          currentPolylines.set(key, polylines);
        }
      }
    } else {
      if (r.coords.at(0)?.lat == r.coords.at(-1)?.lat && r.coords.at(0)?.lng == r.coords.at(-1)?.lng) {
        if (!currentPolygons.has(key)) {
          const polygon = new google.maps.Polygon({
            clickable: true,
            paths: r.coords.slice(undefined, -1),
            fillColor: color,
            fillOpacity: 0.25 * r.opacity,
            strokeColor: color,
            strokeOpacity: 0.5 * r.opacity,
            strokeWeight: 2,
            map: map,
          });
          currentPolygons.set(key, polygon);
          polygon.addListener('click', (e: google.maps.MapMouseEvent) => showInfo(key, e));
        }
      } else {
        if (!currentPolylines.has(key)) {
          const polyline = new google.maps.Polyline({
            clickable: true,
            path: r.coords,
            strokeColor: color,
            strokeOpacity: 0.5 * r.opacity,
            strokeWeight: 3,
            icons: r.row[11] == '11' ? [{
              icon: {
                path: r.row[39] == '2' ? google.maps.SymbolPath.FORWARD_CLOSED_ARROW : google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              },
              offset: '24px',
              repeat: '48px',
            }] : undefined,
            map: map,
          });
          currentPolylines.set(key, [polyline]);
          polyline.addListener('click', (e: google.maps.MapMouseEvent) => showInfo(key, e));
        }
      }
      const lastMarkers = currentMarkers.get(key);
      const markers = new Array<google.maps.Marker | null>;
      if (r.row[11] != '20' && r.row[11] != '52' && r.row[11] != '107') {
        const step = 0.001 * Math.pow(2, Math.max(18 - (zoom || 18), 0) / 2);
        let next = ((parseInt(key.substring(20, 24).split('').reverse().join('')) + parseInt(key.substring(24, 28).split('').reverse().join('')) + parseInt(key.substring(28, 32).split('').reverse().join(''))) % 10000) / 10000 * (r.offsets[r.offsets.length - 1] < step ? r.offsets[r.offsets.length - 1] : step);
        let last = 0;
        for (let i = 1; i < r.offsets.length; ++i) {
          while (next < r.offsets[i]) {
            const int = (next - last) / (r.offsets[i] - last);
            const position = {lat: r.coords[i - 1].lat * (1 - int) + r.coords[i].lat * int, lng: r.coords[i - 1].lng * (1 - int) + r.coords[i].lng * int};
            if (bounds.contains(position)) {
              const marker = lastMarkers?.at(markers.length) ?? (() => {
                const marker = new google.maps.Marker({
                  clickable: true,
                  position,
                  icon: icon,
                  map: map,
                  opacity: r.opacity,
                });
                marker.addListener('click', (e: google.maps.MapMouseEvent) => showInfo(key, e));
                return marker;
              })();
              markers.push(marker);
            } else {
              if (lastMarkers) {
                const marker = lastMarkers[markers.length];
                if (marker != null) {
                  marker.setMap(null);
                }
              }
              markers.push(null);
            }
            next += step;
          }
          last = r.offsets[i];
        }
        if (lastMarkers) {
          for (let i = markers.length; i < lastMarkers.length; ++i) {
            const marker = lastMarkers[i];
            if (marker != null) {
              marker.setMap(null);
            }
          }
        }
      }
      currentMarkers.set(key, markers);
    }
  }
  visibleKeys = new Map(Array.from(keys.entries()).map(([k, r]) => [k, r.opacity]));
  rendering = false;
  if (first) {
    if (lastSuffix != '') {
      readState();
    }
    first = false;
  }
}

let renderLast = () => {};

function initMap(): void {
  const params = location.pathname.match(/\/@(-?[\d.]+),(-?[\d.]+),(-?[\d.]+)z(?:\/(\w+)\/(\w+)\/(-?[\d.]+),(-?[\d.]+))?$/);
  lastCenter = new google.maps.LatLng(params ? Number(params[1]) : 35.7, params ? Number(params[2]) : 139.7);
  lastZoom = params ? Number(params[3]) : 9;
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: lastCenter,
    zoom: lastZoom,
    minZoom: 5,
    mapId: '3370b5d2a2f454b2',
    restriction: {latLngBounds: {east: 145.82, north: 45.53, south: 24.04, west: 122.93}},
    gestureHandling: 'greedy',
    noClear: true,
  });
  lastSuffix = location.hash;

  let lastBounds: google.maps.LatLngBounds | undefined;
  let executing = false;
  let waiting = false;

  renderLast = () => {
    if (lastBounds && lastZoom) {
      render(lastBounds, lastZoom);
    }
  };

  const finish_impl = () => {
    executing = false;
    if (waiting) {
      waiting = false;
      update_impl();
    }
  };

  const update_impl = () => {
    if (executing) {
      waiting = true;
      return;
    }
    executing = true;
    const zoom = map.getZoom();
    if (!zoom) {
      finish_impl();
      return;
    }
    const last_zoom = lastZoom;
    const center = map.getCenter();
    if (!center) {
      finish_impl();
      return;
    }
    const bounds = map.getBounds();
    if (history.state != null && history.state != 'detail') {
      history.back();
    }
    if (history.state != 'detail') {
      updateUrl(center, zoom);
    }
    const iconSize = Math.pow(2, Math.max((zoom ? zoom : 0) - 17, 0) / 2) * 16;

    if (zoom != last_zoom) {
      for (const [key, objs] of currentMarkers) {
        for (const obj of objs) {
          if (obj != null) {
            const icon = obj.getIcon();
            if (icon !== null && typeof icon === 'object' && 'url' in icon) {
              obj.setIcon({
                ...icon,
                anchor: new google.maps.Point(iconSize / 2, iconSize / 2),
                origin: null,
                scaledSize: new google.maps.Size(iconSize, iconSize),
                size: null,
              });
            }
          }
        }
      }
    }
    if (zoom < 15 || zoom != last_zoom) {
      while (rendering);
      rendering = true;
      for (const [key, objs] of currentMarkers) {
        for (const obj of objs) {
          if (obj != null) {
            obj.setMap(null);
          }
        }
      }
      currentMarkers.clear();
      rendering = false;
      if (zoom < 15 && document.getElementById('detail')!.style.display == 'none') {
        lastBounds = new google.maps.LatLngBounds;
        kiseis = [];
        document.getElementById('requireZoom')!.style.display = 'block';
        render(lastBounds, zoom);
        finish_impl();
        return;
      }
    }
    if (!bounds) {
      finish_impl();
      return;
    }
    if (document.getElementById('detail')!.style.display != 'none') {
      lastBounds = undefined;
      render(bounds, zoom, currentKeys);
      finish_impl();
      return;
    }
    if (lastBounds && lastBounds.contains(bounds.getSouthWest()) && lastBounds.contains(bounds.getNorthEast())) {
      if (zoom != last_zoom) {
        render(lastBounds, zoom);
      }
      finish_impl();
      return;
    }
    let params: any = { minlat: String(bounds.getSouthWest().lat()), maxlat: String(bounds.getNorthEast().lat()), minlng: String(bounds.getSouthWest().lng()), maxlng: String(bounds.getNorthEast().lng()) };
    if (lastBounds) {
      params = { ...params, last_minlat: String(lastBounds.getSouthWest().lat()), last_maxlat: String(lastBounds.getNorthEast().lat()), last_minlng: String(lastBounds.getSouthWest().lng()), last_maxlng: String(lastBounds.getNorthEast().lng()) };
    }
    const old_kiseis = new Map(kiseis.map(kisei => [kisei.id, kisei]));
    lastBounds = bounds;
    const query = new URLSearchParams(params);
    (async function() {
      const responses: KiseiResponse[] | undefined = await fetch(`${location.origin}${location.pathname.split('@')[0]}api?${query}`).then(async (response) => {
        if (!response.ok) {
          if (response.status == 429) {
            return undefined;
          }
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        return await response.json();
      });
      if (responses == undefined) {
        lastBounds = new google.maps.LatLngBounds;
        document.getElementById('requireZoom')!.style.display = 'block';
        render(bounds, zoom);
        finish_impl();
        return;
      }
      document.getElementById('requireZoom')!.style.display = 'none';
      kiseis = responses;
      for (const kisei of kiseis) {
        if (kisei.row != null && kisei.coords != null && kisei.offsets != null) {
          continue;
        }
        const k = old_kiseis.get(kisei.id);
        if (!k) {
          lastBounds = undefined;
          waiting = true;
          finish_impl();
          return;
        }
        kisei.row = k.row;
        kisei.coords = k.coords;
        kisei.offsets = k.offsets;
      }
      render(bounds, zoom);
      finish_impl();
    }());
  };

  const update = debounce(update_impl, 200);
 
  map.addListener('bounds_changed', update);
  map.addListener('zoom_changed', update);
  map.addListener('click', (e: google.maps.MapMouseEvent) => showInfo(undefined, e));
  update_impl();
};

function readState() {
  if (currentKeys.length > 0) {
    currentKeys = [];
    updateUrl(undefined, undefined, '');
    map.panTo(lastCenter);
    map.setZoom(lastZoom);
    lastZoom = 100;
    return;
  }
  const match = /^#([0-9a-f]+)(?:@([0-9.]+),([0-9.]+))?$/.exec(location.hash);
  if (match == null) {
    showInfo(undefined, { domEvent: new Event('dummy'), latLng: null, stop: () => { } });
  } else {
    if (match.length == 4) {
      showInfo(match[1], { domEvent: new Event('dummy'), latLng: new google.maps.LatLng(parseFloat(match[2]), parseFloat(match[3])), stop: () => { } });
      if (history.state == 'detail') {
        showDetail();
      }
    }
  }
}

addEventListener('popstate', readState);

addEventListener('change', e => {
  const check = e.target;
  if (!(check instanceof HTMLElement) || !check.closest('#option') || check.parentNode == null) {
    return;
  }

  if (check.closest('#kisei-types')) {
    const parent = check.closest('#kisei-types');
    if (check instanceof HTMLInputElement) {
      if (check.name) {
        visible_kisei.set(check.name, check.checked);
      }

      check.closest('li')?.querySelector('ul')?.querySelectorAll('input').forEach(child => {
        child.checked = check.checked
        child.indeterminate = false;
        if (child.name) {
          visible_kisei.set(child.name, child.checked);
        }
      });

      let current = check;
      while (current) {
        const parent = current.closest('ul')?.parentNode;
        const next = parent?.querySelector('input');
        if (!parent || !next) {
          break;
        }
        if (current === next) {
          break;
        }
        current = next;
        const children = parent.querySelector('ul')?.querySelectorAll('input');
        if (!children) {
          continue;
        }
        const checkStatus = Array.from(children).map(e => e.checked);
        const every  = checkStatus.every(Boolean);
        const some = checkStatus.some(Boolean);
        next.checked = every;   
        next.indeterminate = !every && every != some;
      }

      renderLast();
    }

    (parent?.querySelector('span.summary') as HTMLSpanElement).innerText = [...visible_kisei.values()].filter(v => v).length + '/' + visible_kisei.size;
  }

  if (check instanceof HTMLInputElement && check.name == 'display' && check.checked) {
    transparent_kisei = check.value == 'transparent';

    renderLast();
  }

  if (check.closest('#vehicle-types')) {
    const parent = check.closest('#vehicle-types');
    if (check instanceof HTMLInputElement) {
      visible_vehicle[Number(check.name)] = check.checked;

      let types = '';
      for (let i = 0; i < 15; ++i) {
        let sum = 0;
        for (let j = 0; j < 4; ++j) {
          const e = parent?.querySelector(`input[name="${i * 4 + j}"]`);
          sum <<= 1;
          sum |= (e as HTMLInputElement)?.checked ? 1 : 0;
        }
        types += sum.toString(16);
      }

      const select = document.getElementById('vehicle-preset') as HTMLSelectElement;
      const option = select.options.namedItem(types);
      select.options.selectedIndex = option?.index ?? select.options.length - 1;

      renderLast();
    }
    if (check instanceof HTMLSelectElement) {
      if (check.value != '') {
        for (let i = 0; i < 15; ++i) {
          let digit = parseInt(check.value[i], 16);
          for (let j = 0; j < 4; ++j) {
            const e = parent?.querySelector(`input[name="${i * 4 + j}"]`);
            (e as HTMLInputElement).checked = (digit & 8) != 0;
            visible_vehicle[i * 4 + j] = (digit & 8) != 0;
            digit <<= 1;
          }
        }
      }

      renderLast();
    }

    (parent?.querySelector('span.summary') as HTMLSpanElement).innerText = (document.getElementById('vehicle-preset') as HTMLSelectElement).selectedOptions.item(0)!.innerText;
  }

  if (check.closest('#day-and-time')) {
    const parent = check.closest('#day-and-time');
    if (check instanceof HTMLInputElement) {
      if (check.type == 'checkbox') {
        visible_day[check.name.substring(4) as keyof typeof visible_day] = check.checked;
      }
      if (check.type == 'time') {
        const start = Number((parent?.querySelector('input[name="time_from"]') as HTMLInputElement).value.replace(':', ''));
        let end = Number((parent?.querySelector('input[name="time_to"]') as HTMLInputElement).value.replace(':', ''));
        if (end < start) {
          end += 2400;
        }
        visible_time_center = (start + end) / 2;
        if (visible_time_center >= 2400) {
          visible_time_center -= 2400;
        }
        visible_time_delta = end - start;
      }

      renderLast();
    }

    const names = new Map<string, string>([['weekday', '平日'], ['saturday', '土曜'], ['sunday', '日曜'], ['holiday', '休日']]);
    (parent?.querySelector('span.summary') as HTMLSpanElement).innerText =
      (Object.entries(visible_day).every(([_, v]) => v) ? '全日' : Object.entries(visible_day).filter(([_, v]) => v).map(([k, _]) => names.get(k as keyof typeof visible_day)).join('・')) + ' ' +
      (visible_time_delta >= 2359 ? '終日' : (parent?.querySelector('input[name="time_from"]') as HTMLInputElement).value + (visible_time_delta == 0 ? '' : '〜' + (parent?.querySelector('input[name="time_to"]') as HTMLInputElement).value));
  }
})

window.initMap = initMap;
