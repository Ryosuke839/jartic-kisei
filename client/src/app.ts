let map: google.maps.Map;

const names = new Map([['1', '歩行者用道路'], ['2', '自転車用道路'], ['3', '自転車及び歩行者用道路'], ['4', '通行止め'], ['5', '車両通行止め'], ['6', '大型自動二輪車及び普通自動二輪車二人乗り通行禁止'], ['7', '車両通行止め(踏切)'], ['8', '歩行者通行止め'], ['9', '重量制限'], ['10', '高さ制限'], ['11', '一方通行'], ['12', '指定方向外進行禁止'], ['13', '車両進入禁止'], ['14', '歩行者横断禁止'], ['15', '中央線'], ['16', '中央線の変移'], ['17', '追越しのための右側部分はみ出し通行禁止'], ['18', '右側通行'], ['19', '立ち入り禁止部分'], ['20', '車両通行帯'], ['21', '車両通行区分'], ['22', '専用通行帯'], ['23', '路線バス等の専用通行帯'], ['24', '路線バス等優先通行帯'], ['25', '牽引自動車の自動車専用道路第一通行帯通行指定区間'], ['26', '車線境界線'], ['27', '軌道敷内通行可'], ['28', '最高速度100km/h'], ['29', '最高速度80km/h'], ['30', '最高速度70km/h'], ['31', '最高速度60km/h'], ['32', '最高速度50km/h'], ['33', '最高速度40km/h'], ['34', '最高速度30km/h'], ['35', '最高速度30km/h未満'], ['36', '最高速度可変(法)－(50)km/h'], ['37', '最高速度可変(法)－(40)km/h'], ['38', '最高速度可変(法)－(30)km/h'], ['39', '最高速度可変(60)－(50)km/h'], ['40', '最高速度可変(50)－(40)km/h'], ['41', '最高速度可変(50)－(40･30)km/h'], ['42', '最高速度可変(50)－(30)km/h'], ['43', '最高速度可変(50)－(60)km/h'], ['44', '最高速度可変(40)－(50)km/h'], ['45', '最高速度可変(30)－(40)km/h'], ['46', '最高速度区域40km/h'], ['47', '最高速度区域30km/h'], ['48', '最高速度区域20km/h'], ['49', '最低速度'], ['50', '車両横断禁止'], ['51', '転回禁止'], ['52', '進路変更禁止'], ['53', '追越し禁止'], ['54', '優先道路'], ['55', '原動機付自転車の右折方法(二段階)'], ['56', '原動機付自転車の右折方法(小回り)'], ['57', '右左折の方法'], ['58', '進行方向別通行区分'], ['59', '車両通行帯･進行方向別通行区分･(進路変更禁止)組合せ'], ['60', '進行方向'], ['61', '徐行'], ['62', '前方優先道路'], ['63', '一時停止'], ['64', '優先本線車道'], ['65', '駐停車禁止'], ['66', '駐車禁止区間'], ['67', '駐車禁止区域'], ['68', '車輪止め装置取付け区間'], ['69', '駐車余地'], ['70', '駐車可'], ['71', '停車可'], ['72', '時間制限駐車区間'], ['73', '駐車の方法(平行駐車)'], ['74', '駐車の方法(直角駐車)'], ['75', '駐車の方法(斜め駐車)'], ['76', '停止禁止部分'], ['77', '警音器'], ['78', '歩行者用路側帯'], ['79', '駐停車禁止路側帯'], ['80', '路側帯(一般)'], ['81', '普通自転車歩道通行可'], ['82', '普通自転車の歩道通行部分'], ['83', '普通自転車の交差点進入禁止'], ['84', '並進可'], ['85', '横断歩道'], ['86', '斜め横断可'], ['87', '自転車横断帯'], ['88', '安全地帯'], ['89', '安全地帯又は路上障害物接近'], ['90', '導流帯'], ['91', '路面電車停留場'], ['92', '停止線'], ['93', '二段停止線'], ['94', '左折可'], ['95', '危険物積載車両通行止め'], ['96', '最大幅'], ['97', '自動車専用'], ['98', '信号機'], ['99', 'ゾーン30'], ['100', '高齢運転者等標章自動車駐車可'], ['101', '高齢運転者等標章自動車停車可'], ['102', '高齢運転者等専用時間制限駐車区間'], ['103', '停車方法指定'], ['104', 'PM（パーキングメータ）'], ['105', 'PT（パーキングチケット）'], ['106', '環状の交差点における右回り通行'], ['107', '車両通行帯及び通行区分'], ['108', '信号機の設置及び管理の委任'], ['109', '停車・駐車禁止交差点'],]);
const columns = ["都道府県コード", "警察署コード", "関連警察署コード1", "関連警察署コード2", "関連警察署コード3", "関連警察署コード4", "関連警察署コード5", "関連警察署コード6", "関連警察署コード7", "関連警察署コード8", "共通規制種別コード", "点・線・面コード", "県別規制種別名称", "規制決定年月日", "都道府県別ユニークキー", "規制番号", "番号", null, "規制場所始点", "規制場所終点", "住所", "交差点名称", "区間または区域", "場所・区間1", "場所・区間2", "場所・区間3", "経由場所・区間", "1-路線1", "1-路線1(コード)", "1-路線2", "1-路線2(コード)", "1-路線3", "1-路線4", "バイパス名", "進入方向", "禁止する方向1", "禁止する方向2", "指定する方向1", "指定する方向2", "指定する方向3", "指定する方向4", "指定・禁止方向の別コード", "方向1_1", "方向1", "一時解除始", "一時解除終", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "関連規制1", "関連規制2", "方向・規制内容等", "既規制等", "規制台帳インデックス", "規制場所始点2", "規制場所始点3", "規制場所終点2", "規制場所終点3", "進路変更禁止区間・地点1", "距離･延長", "距離・延長2", "面積", "速度1", "速度2", "速度3", "速度4", "最低速度", "片側・両側コード", "信号の有無コード", "車両通行帯数", "車両通行帯　指定番号", "中央線の指定", "歩道数", "駐車可台数", "通行方法", "車両の通行区分を指定", "進行方向別通行区分", "道路状況", "側の指定", "側指定コード", "横断歩道設置本数", "停止線本数", "通行帯の指定", "車線数", "対象通行帯1", "対象通行帯2", "対象通行帯3", "対象通行帯4", "信号機種別", "交差点・単路の別", "通行帯内容", "指定通行帯", "専用通行帯", "鉄道路線名", "踏切名称", "踏切種別コード", "車道幅員", "停止禁止幅員", "交差点ID", "右左折の別コード", "右左折方向1コード", "右左折方向2コード", "右左折方向3コード", "右左折方法1コード", "右左折方法2コード", "右左折方法3コード", "左折できる方向コード", "指定区分", "指定方法", "通行区分", "通行方法2", "通行方法3", "駐車方法コード", "停車方法コード", "方位コード", "方法（但し書き)", "歩道通行部分コード", "パーキングメーター基数", "区別（高齢運転者等標章自動車）コード", "交差点形状名コード", "指定区間＿通行帯位置", "指定時間", "種別（横断歩道）コード", "信号機設置管理者（委任）", "制限重量", "設置する通行帯", "停止位置コード", "停止禁止部分コード", "停止禁止面積＿横", "停止禁止面積＿縦", "摘要 禁止する方向", "摘要 指定部分コード", "歩道状況　歩道切り下げコード", "路側帯の種類コード", "更新理由", "区間（備考）1", "備考"];
const onewayDir = new Map([['2', true], ['3', false], ['4', true], ['6', false], ['7', false], ['8', false], ['9', false], ['10', true], ['11', true], ['12', true], ['13', true], ['14', true], ['15', false], ['16', true], ['20', true], ['21', false], ['22', true], ['23', true], ['24', false], ['25', false], ['26', false], ['27', false], ['28', false], ['29', false], ['30', false], ['32', true], ['33', false], ['34', true], ['35', false], ['36', false], ['37', false], ['38', false], ['39', true], ['40', false], ['41', false], ['42', true], ['44', false], ['45', false], ['46', true], ['47', true]]);
const visible_kisei = new Map(Array.from(names.keys()).map(k => [k, true]));
const visible_vehicle = new Array(48).fill(true);
function getIcon(row: string[], iconSize: number): google.maps.Icon | undefined {
  const signs = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '19', '21', '22', '23', '24', '27', '28', '29', '30', '31', '32', '33', '34', '35', '46', '47', '48', '49', '50', '51', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '65', '66', '67', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '90', '92', '93', '94', '97', '98', '99', '100', '103', '106', '108']);
  const ident = (row: string[]) => row[10];
  const check = (row: string[], offset: number, types: string[]): boolean => {
    if (row[offset] == '' && row[offset + 1] == '' && row[offset + 2] == '' && row[offset + 3] == '') {
      return false;
    }
    for (let i = 0; i < 45; i += 9) {
      if (row[i + offset] == '' && row[i + offset + 1] == '' && row[i + offset + 2] == '' && row[i + offset + 3] == '') {
        break;
      }
      if ((row[i + offset] || '0') != types[0] || (row[i + offset + 1] || '0') != types[1] || (row[i + offset + 2] || '0') != types[2] || (row[i + offset + 3] || '0') != types[3]) {
        return false;
      }
    }
    return true;
  };
  const prohibit = (row: string[]) => {
    if (check(row, 51, ['0', '0', '0', '100000']))
      if (check(row, 96, ['0', '0', '0', '100']))
        return '5_cart';
    if (check(row, 51, ['10', '0', '0', '0'])) {
      if (check(row, 96, ['0', '0', '10000000', '10']))
        return '5_car';
      if (check(row, 96, ['0', '0', '0', '10']))
        return '5_car';
      return '5_motor';
    }
    if (check(row, 51, ['10', '0', '0', '1000']))
      return '5_motor';
    if (check(row, 96, ['0', '0', '0', '100']))
      return '5_motor';
    if (check(row, 96, ['0', '0', '0', '100000']))
      return '5_motor';
    if (check(row, 96, ['0', '0', '0', '101']))
      return '5_car';
    if (check(row, 51, ['0', '0', '0', '100']))
      return '5_bicycle';
    if (check(row, 51, ['0', '0', '0', '100000000100']))
      return '5_bicycle';
    if (check(row, 51, ['0', '0', '0', '100000']))
      return '5_light';
    if (check(row, 51, ['0', '0', '0', '100100']))
      return '5_light';
    if (check(row, 51, ['0', '0', '0', '100000100000']))
      return '5_light';
    if (check(row, 96, ['0', '0', '0', '101010']))
      return '5_car';
    if (check(row, 96, ['0', '0', '0', '100001']))
      return '5_car';
    if (check(row, 96, ['0', '0', '10000000','100001']))
      return '5_car';
    if (check(row, 51, ['0', '0', '0', '1010']))
      return '5_motorcycle';
    if (check(row, 51, ['0', '0', '0', '1000']))
      return '5_motorcycle';
    if (check(row, 51, ['0', '0', '0', '10']))
      return '5_motorcycle';
    if (check(row, 51, ['0', '0', '0', '1']))
      return '5_motorcycle';
    if (check(row, 51, ['0', '0', '100100100', '100000000000']))
      return '5_truck';
    if (check(row, 51, ['0', '0', '100100100', '0']))
      return '5_truck';
    if (check(row, 51, ['0', '0', '101101100', '0']))
      return '5_truck';
    if (check(row, 51, ['0', '0', '10000', '0']))
      return '5_truck';
    if (check(row, 51, ['0', '10', '100100100', '0']))
      return '5_heavy';
    if (check(row, 51, ['0', '1000', '10000', '0']))
      return '5_heavy';
    if (check(row, 51, ['100000000', '1', '100000000', '0']))
      return '5_heavy';
    if (check(row, 51, ['100000000', '1', '0', '0']))
      return '5_heavy';
    if (check(row, 51, ['0', '1', '100000000', '0']))
      return '5_heavy';
    if (check(row, 51, ['0', '1', '100001000', '0']))
      return '5_heavy';
    if (check(row, 51, ['0', '1', '0', '0']))
      return '5_heavy';
    if (check(row, 51, ['0', '100', '0', '0']))
      return '5_heavy';
    if (check(row, 51, ['100000000','1','101001000','0']))
      return '5_heavy';
    if (check(row, 51, ['100000000','101','100000000','0']))
      return '5_heavy';
    if (check(row, 51, ['10000000','10','100100100','0']))
      return '5_heavy';
    if (check(row, 51, ['100000000','1','100010000','0']))
      if (check(row, 96, ['10000000','10','0','0']))
        return '5_truck';
    if (check(row, 51, ['100000000','1001','100010000','0']))
      if (check(row, 96, ['10000000','10','0','0']))
        return '5_truck';
    return '5';
  };
  const trans = new Map<string, (row: string[]) => string>([
    ['4', (row: string[]) => {
      if (row[51] == '' && row[52] == '' && row[53] == '' && row[54] == '' && row[96] == '' && row[97] == '' && row[98] == '' && row[99] == '')
        return '4';
      else
        return prohibit(row);
    }],
    ['5', prohibit],
    ['7', prohibit],
    ['22', (row: string[]) => {
      if (check(row, 51, ['0', '0', '0', '100']))
        return '22_bicycle';
      return '22';
    }],
    ['28', (row: string[]) => {
      if (row[149] == '120')
        return '28_120';
      if (row[149] == '110')
        return '28_110';
      return '28';
    }],
    ['46', (_) => '33'],
    ['47', (_) => '34'],
    ['48', (_) => '35'],
    ['99', (_) => '34'],
    ['100', (_) => '70'],
    ['101', (_) => '71'],
    ['102', (_) => '72'],
    ['103', (_) => '71'],
    ['108', (_) => '98'],
  ]);
  if (signs.has(row[10])) {
    return {
      url: `signs/${(trans.get(row[10]) || ident)(row)}.svg`,
      anchor: new google.maps.Point(iconSize / 2, iconSize / 2),
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
  }
  return undefined;
}
function getColor(type: string): string {
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
    ['19', '#FF0000'], // 立ち入り禁止部分
    ['20', '#404040'], // 車両通行帯
    ['21', '#FF0000'], // 車両通行区分
    ['22', '#FF0000'], // 専用通行帯
    ['23', '#FF0000'], // 路線バス等の専用通行帯
    ['24', '#FF0000'], // 路線バス等優先通行帯
    ['25', '#FF0000'], // 牽引自動車の自動車専用道路第一通行帯通行指定区間
    ['26', '#FF0000'], // 車線境界線
    ['27', '#FF0000'], // 軌道敷内通行可
    ['28', '#00FFFF'], // 最高速度100km/h
    ['29', '#00FFC0'], // 最高速度80km/h
    ['30', '#00FFA0'], // 最高速度70km/h
    ['31', '#00FF80'], // 最高速度60km/h
    ['32', '#00FF60'], // 最高速度50km/h
    ['33', '#00FF40'], // 最高速度40km/h
    ['34', '#00FF20'], // 最高速度30km/h
    ['35', '#00FF00'], // 最高速度30km/h未満
    ['36', '#00FF70'], // 最高速度可変(法)－(50)km/h
    ['37', '#00FF60'], // 最高速度可変(法)－(40)km/h
    ['38', '#00FF50'], // 最高速度可変(法)－(30)km/h
    ['39', '#00FF70'], // 最高速度可変(60)－(50)km/h
    ['40', '#00FF50'], // 最高速度可変(50)－(40)km/h
    ['41', '#00FF40'], // 最高速度可変(50)－(40･30)km/h
    ['42', '#00FF40'], // 最高速度可変(50)－(30)km/h
    ['43', '#00FF70'], // 最高速度可変(50)－(60)km/h
    ['44', '#00FF50'], // 最高速度可変(40)－(50)km/h
    ['45', '#00FF30'], // 最高速度可変(30)－(40)km/h
    ['46', '#00FF40'], // 最高速度区域40km/h
    ['47', '#00FF20'], // 最高速度区域30km/h
    ['48', '#00FF00'], // 最高速度区域20km/h
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
    ['59', '#FF7B00'], // 車両通行帯･進行方向別通行区分･(進路変更禁止)組合せ
    ['60', '#FF0000'], // 進行方向
    ['61', '#FF0000'], // 徐行
    ['62', '#FF0000'], // 前方優先道路
    ['63', '#FF0000'], // 一時停止
    ['64', '#FF0000'], // 優先本線車道
    ['65', '#800040'], // 駐停車禁止
    ['66', '#FF0080'], // 駐車禁止区間
    ['67', '#FF0080'], // 駐車禁止区域
    ['68', '#FF0080'], // 車輪止め装置取付け区間
    ['69', '#0080FF'], // 駐車余地
    ['70', '#0080FF'], // 駐車可
    ['71', '#004080'], // 停車可
    ['72', '#0080FF'], // 時間制限駐車区間
    ['73', '#0080FF'], // 駐車の方法(平行駐車)
    ['74', '#0080FF'], // 駐車の方法(直角駐車)
    ['75', '#0080FF'], // 駐車の方法(斜め駐車)
    ['76', '#800040'], // 停止禁止部分
    ['77', '#FF0000'], // 警音器
    ['78', '#FF0000'], // 歩行者用路側帯
    ['79', '#FF0000'], // 駐停車禁止路側帯
    ['80', '#FF0000'], // 路側帯(一般)
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
    ['99', '#00FF20'], // ゾーン30
    ['100', '#0000FF'], // 高齢運転者等標章自動車駐車可
    ['101', '#0000FF'], // 高齢運転者等標章自動車停車可
    ['102', '#0000FF'], // 高齢運転者等専用時間制限駐車区間
    ['103', '#0000FF'], // 停車方法指定
    ['104', '#0080FF'], // PM（パーキングメータ）
    ['105', '#0080FF'], // PT（パーキングチケット）
    ['106', '#0000FF'], // 環状の交差点における右回り通行
    ['107', '#404040'], // 車両通行帯及び通行区分
    ['108', '#FF0000'], // 信号機の設置及び管理の委任
    ['109', '#800040'], // 停車・駐車禁止交差点
  ]);
  return colors.get(type) || '#FF0000';
}

function rowToSubjects(row: string[]): string[] {
  let result: string[] = [];
  for (let i = 46; i < 136; i += 9) {
    let subject = '';
    if (row[i] != '') {
      subject += ` ${Number(row[i].padStart(4, '0').substring(0, 2))}月${Number(row[i].padStart(4, '0').substring(2, 4))}日`;
    }
    if (row[i + 1] != '' && row[i + 1] != row[i]) {
      subject += '〜'
      if (!row[i].startsWith(row[i + 1].padStart(4, '0').substring(0, 2))) {
        subject += `${Number(row[i + 1].padStart(4, '0').substring(0, 2))}月`;
      }
      subject += `${Number(row[i + 1].padStart(4, '0').substring(2, 4))}日`;
    }
    if (row[i + 4]) {
      const days = new Map([['1', '土曜、日曜'], ['2', '土曜・日曜・休日'], ['3', '日曜・休日'], ['3', '日曜・祭日'], ['4', '競輪開催日'], ['5', '競馬開催日'], ['6', '場内馬券発売日'], ['7', '競艇開催日'], ['8', '工事実施日']]);
      subject += ` ${days.get(row[i + 4]) || row[i + 4]}`;
    }
    if (row[i + 2] != '' && row[i + 3]) {
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
      ['車両', '自動車', '乗用', '普乗', '普通', '中乗', '中型', '特定中乗', '特定中型', '軽', '準中乗', '準中型'],
      ['大型', '大乗', '大型等', '大型バス', 'バス', 'マイクロ', '路線バス', '', '', '', '', ''],
      ['貨物', '普貨', '特定中貨物', '中貨', '大貨等', '大貨', '準中貨', '小特', '大特', '', '', ''],
      ['二輪', '自二輪', '自転車', '原付', '小二輪', '軽車両', 'タクシー', '標章車', 'けん引', '', '', 'その他'],
    ];
    let t: string[] = [];
    for (let j = 0; j < 4; ++j) {
      if (row[i + 5 + j] != '') {
        let bits = Number(row[i + 5 + j]);
        for (let k = 0; k < 12 && bits >= 1; ++k) {
          if (bits % 10 == 1) {
            t.push(types[j][k]);
          }
          bits = Math.floor(bits / 10);
        }
      }
    }
    if (t.length > 0) {
      subject += ` ${t.join('・')}`;
    }
    if (subject != '') {
      if (i >= 91) {
        subject += 'を除く';
      }
      result.push(subject);
    }
  }
  return result;
}

interface KiseiResponse {
  id: string;
  row: string[];
  coords: {lat: number, lng: number}[];
  offsets: number[];
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

let currentKeys: string[] = [];
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
  const contents = new Map<string, string>();
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
  currentKeys = ks;
  const keys = new Map(kiseis.map(r => [r.id, r]));
  const element = document.createElement('div');
  let content = '';
  for (const k of ks) {
    const kisei = keys.get(k);
    if (kisei != undefined) {
      const url = getIcon(kisei.row, 0)?.url;
      content += '<div style="' + (url ? `background-image: url(${url}); background-repeat: no-repeat; background-size: 4.5em; ` : '') + 'padding-inline-start: 5em; min-height: 4.5em; margin-bottom: 0.5em;">';
      if (currentPolylines.has(kisei.id)) {
        content += `<span style="width: 5em; display: inline-block; margin: .5em 0 .5em 0; border: 1.5px solid ${getColor(kisei.row[10])};"></span><br>`;
      } else if (currentPolygons.has(kisei.id)) {
        content += `<span style="width: 5em; height: 1em; display: inline-block; border: 2px solid ${getColor(kisei.row[10])}; background-color: ${getColor(kisei.row[10])}80;"></span><br>`;
      } else {
        content += `<span style="display: inline-block; margin: .5em; border: 1.5px solid;"></span><br>`;
      }
      content += names.get(kisei.row[10]) + '<br>' + rowToSubjects(kisei.row).join('<br>');
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
  for (const k of currentKeys) {
    const kisei = keys.get(k);
    if (kisei != undefined) {
      const url = getIcon(kisei.row, 0)?.url;
      content += '<div style="' + (url ? `background-image: url(${url}); background-repeat: no-repeat; background-size: 4.5em; ` : '') + 'padding-inline-start: 5em; min-height: 4.5em;' + (k != currentKeys[0] ? ' margin-top: 0.5em;' : '') + '">';
      if (currentPolylines.has(kisei.id)) {
        content += `<span style="width: 5em; display: inline-block; margin: .5em 0 .5em 0; border: 1.5px solid ${getColor(kisei.row[10])};"></span><br>`;
      } else if (currentPolygons.has(kisei.id)) {
        content += `<span style="width: 5em; height: 1em; display: inline-block; border: 2px solid ${getColor(kisei.row[10])}; background-color: ${getColor(kisei.row[10])}80;"></span><br>`;
      } else {
        content += `<span style="display: inline-block; margin: .5em; border: 1.5px solid;"></span><br>`;
      }
      content += names.get(kisei.row[10]) + '<br>' + rowToSubjects(kisei.row).join('<br>');
      content += '<br>' + kisei.row.map((v, i) => (columns[i] != null && v != '') ? `[${i} ${columns[i]}] ${v}<br>` : '').join('');
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
    if (currentKeys.includes(key)) {
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
    if (currentKeys.includes(key)) {
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
    if (currentKeys.includes(key)) {
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
function render(bounds: google.maps.LatLngBounds, zoom: number, filterKeys: string[] | null = null): void {
  while (rendering);
  rendering = true;
  const iconSize = Math.pow(2, Math.max((zoom ? zoom : 0) - 17, 0) / 2) * 16;
  const keys = new Map(kiseis.filter(r => !filterKeys || filterKeys.includes(r.id)).filter(r => visible_kisei.get(r.row[10])).filter(r => {
    let any = false;
    const include = new Map<string, string>([
      ['6', '000000000400'],
      ['8', '000000000001'],
      ['14', '000000000001'],
      ['25', '000000000008'],
      ['55', '000000000100'],
      ['56', '000000000100'],
      ['81', '000000000200'],
      ['82', '000000000200'],
      ['83', '000000000200'],
      ['84', '000000000200'],
    ]);
    for (let i = 91; i < 136; i += 9) {
      for (let j = 0; j < 4; ++j) {
        if (r.row[i + 5 + j] != '') {
          any = true;
          let bits = Number(r.row[i + 5 + j]);
          for (let k = 0; k < 12 && bits >= 1; ++k) {
            if (bits % 10 == 1 && visible_vehicle[j * 12 + k]) {
              return false;
            }
            bits = Math.floor(bits / 10);
          }
        }
      }
    }
    if (include.has(r.row[10])) {
      any = true;
      for (let i = 0; i < 12; ++i) {
        let digit = parseInt(include.get(r.row[10])!![i], 16);
        for (let j = 0; j < 4; ++j) {
          if ((digit & 8) != 0 && visible_vehicle[i * 4 + j]) {
            return true;
          }
          digit <<= 1;
        }
      }
    }
    for (let i = 46; i < 91; i += 9) {
      for (let j = 0; j < 4; ++j) {
        if (r.row[i + 5 + j] != '') {
          any = true;
          let bits = Number(r.row[i + 5 + j]);
          for (let k = 0; k < 12 && bits >= 1; ++k) {
            if (bits % 10 == 1 && visible_vehicle[j * 12 + k]) {
              return true;
            }
            bits = Math.floor(bits / 10);
          }
        }
      }
    }
    return !any && visible_vehicle[0];
  }).map(r => [r.id, r]));
  for (const [key, objs] of currentMarkers) {
    if (!keys.has(key)) {
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
    if (!r || zoom < 17 && (r.row[10] == '12' || r.row[10] == '13' || r.row[10] == '63')) {
      for (const obj of objs) {
        if (obj != null) {
          obj.setMap(null);
        }
      }
      currentPolylines.delete(key);
    }
  }
  for (const [key, obj] of currentPolygons) {
    if (!keys.has(key)) {
      obj.setMap(null);
      currentPolygons.delete(key);
    }
  }
  for (const [key, r] of keys) {
    const icon = getIcon(r.row, iconSize);
    const color = getColor(r.row[10]);
    if (r.coords.length == 1 || r.row[10] == '12' || r.row[10] == '13' || r.row[10] == '63') {
      if (!currentMarkers.has(key)) {
        const marker = new google.maps.Marker({
          clickable: true,
          position: r.coords[0],
          icon: icon,
          map: map,
        });
        currentMarkers.set(key, [marker]);
        marker.addListener('click', (e: google.maps.MapMouseEvent) => showInfo(key, e));
        if (zoom >= 17 && r.coords.length > 1 && !currentPolylines.has(key)) {
          const polylines = new Array<google.maps.Polyline>;
          if (r.row[10] == '12' && r.row[0] == '8') {
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
                strokeOpacity: 0.5,
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
                strokeOpacity: 0.5,
                strokeWeight: 3,
                icons: [{
                  icon: {
                    path: r.row[10] == '12' && i > 1 ? google.maps.SymbolPath.FORWARD_CLOSED_ARROW : google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                  },
                }],
                map: map,
              });
              polylines.push(polyline);
              polyline.addListener('click', (e: google.maps.MapMouseEvent) => showInfo(key, e));
            }
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
            fillOpacity: 0.25,
            strokeColor: color,
            strokeOpacity: 1.0,
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
            strokeOpacity: 0.5,
            strokeWeight: 3,
            icons: r.row[10] == '11' && onewayDir.has(r.row[0]) || r.row[10] == '94' || r.row[10] == '106' ? [{
              icon: {
                path: onewayDir.get(r.row[0]) || r.row[10] == '94' || r.row[10] == '106' ? google.maps.SymbolPath.FORWARD_CLOSED_ARROW : google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
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
      if (r.row[10] != '20' && r.row[10] != '52' && r.row[10] != '107') {
        const step = 0.001 * Math.pow(2, Math.max(18 - (zoom || 18), 0) / 2);
        let next = parseInt(key.substring(28), 16) / 65536 * (r.offsets[r.offsets.length - 1] < step ? r.offsets[r.offsets.length - 1] : step);
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
  }

  if (check.closest('#vehicle-types')) {
    const parent = check.closest('#vehicle-types');
    if (check instanceof HTMLInputElement) {
      visible_vehicle[Number(check.name)] = check.checked;

      let types = '';
      for (let i = 0; i < 12; ++i) {
        let sum = 0;
        for (let j = 0; j < 4; ++j) {
          const e = parent?.querySelector(`input[name="${i * 4 + j}"]`);
          sum <<= 1;
          sum |= (e as HTMLInputElement)?.checked ? 1 : 0;
        }
        types += sum.toString(16);
      }
      console.log(types);

      const select = document.getElementById('vehicle-preset') as HTMLSelectElement;
      const option = select.options.namedItem(types);
      select.options.selectedIndex = option?.index ?? select.options.length - 1;

      renderLast();
    }
    if (check instanceof HTMLSelectElement) {
      if (check.value != '') {
        for (let i = 0; i < 12; ++i) {
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
  }
})

window.initMap = initMap;
