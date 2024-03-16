#!/usr/bin/env bash

DATE=202403011848

FILES=(/d/opendata/$DATE/typeD_hokkaido.zip
/d/opendata/$DATE/typeD_aomori.zip
/d/opendata/$DATE/typeD_iwate.zip
/d/opendata/$DATE/typeD_miyagi.zip
/d/opendata/$DATE/typeD_akita.zip
/d/opendata/$DATE/typeD_yamagata.zip
/d/opendata/$DATE/typeD_fukushima.zip
/d/opendata/$DATE/typeD_ibaraki.zip
/d/opendata/$DATE/typeD_tochigi.zip
/d/opendata/$DATE/typeD_gumma.zip
/d/opendata/$DATE/typeD_saitama.zip
/d/opendata/$DATE/typeD_chiba.zip
/d/opendata/$DATE/typeD_tokyo.zip
/d/opendata/$DATE/typeD_kanagawa.zip
/d/opendata/$DATE/typeD_yamanashi.zip
/d/opendata/$DATE/typeD_nagano.zip
/d/opendata/$DATE/typeD_niigata.zip
/d/opendata/$DATE/typeD_toyama.zip
/d/opendata/$DATE/typeD_ishikawa.zip
/d/opendata/$DATE/typeD_fukui.zip
/d/opendata/$DATE/typeD_gifu.zip
/d/opendata/$DATE/typeD_shizuoka.zip
/d/opendata/$DATE/typeD_aichi.zip
/d/opendata/$DATE/typeD_mie.zip
/d/opendata/$DATE/typeD_shiga.zip
/d/opendata/$DATE/typeD_kyoto.zip
/d/opendata/$DATE/typeD_osaka.zip
/d/opendata/$DATE/typeD_hyogo.zip
/d/opendata/$DATE/typeD_nara.zip
/d/opendata/$DATE/typeD_wakayama.zip
/d/opendata/$DATE/typeD_tottori.zip
/d/opendata/$DATE/typeD_shimane.zip
/d/opendata/$DATE/typeD_okayama.zip
/d/opendata/$DATE/typeD_hiroshima.zip
/d/opendata/$DATE/typeD_yamaguchi.zip
/d/opendata/$DATE/typeD_tokushima.zip
/d/opendata/$DATE/typeD_kagawa.zip
/d/opendata/$DATE/typeD_ehime.zip
/d/opendata/$DATE/typeD_kochi.zip
/d/opendata/$DATE/typeD_fukuoka.zip
/d/opendata/$DATE/typeD_saga.zip
/d/opendata/$DATE/typeD_nagasaki.zip
/d/opendata/$DATE/typeD_kumamoto.zip
/d/opendata/$DATE/typeD_oita.zip
/d/opendata/$DATE/typeD_miyazaki.zip
/d/opendata/$DATE/typeD_kagoshima.zip
/d/opendata/$DATE/typeD_okinawa.zip)

cd data
for FILE in ${FILES[@]}; do
    echo "Downloading https://www.jartic.or.jp/$FILE..."
    curl -sL -o temp.zip https://www.jartic.or.jp/$FILE && unzip -j temp.zip && rm temp.zip
done
