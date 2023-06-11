#!/usr/bin/env bash

FILES=(/d/opendata/202304030911/typeD_hokkaido.zip
/d/opendata/202304030911/typeD_aomori.zip
/d/opendata/202304030911/typeD_iwate.zip
/d/opendata/202304030911/typeD_miyagi.zip
/d/opendata/202304030911/typeD_akita.zip
/d/opendata/202304030911/typeD_yamagata.zip
/d/opendata/202304030911/typeD_fukushima.zip
/d/opendata/202304030911/typeD_ibaraki.zip
/d/opendata/202304030911/typeD_tochigi.zip
/d/opendata/202304030911/typeD_gumma.zip
/d/opendata/202304030911/typeD_saitama.zip
/d/opendata/202304030911/typeD_chiba.zip
/d/opendata/202304030911/typeD_tokyo.zip
/d/opendata/202304030911/typeD_kanagawa.zip
/d/opendata/202304030911/typeD_yamanashi.zip
/d/opendata/202304030911/typeD_nagano.zip
/d/opendata/202304030911/typeD_niigata.zip
/d/opendata/202304030911/typeD_toyama.zip
/d/opendata/202304030911/typeD_ishikawa.zip
/d/opendata/202304030911/typeD_fukui.zip
/d/opendata/202304030911/typeD_gifu.zip
/d/opendata/202304030911/typeD_shizuoka.zip
/d/opendata/202304030911/typeD_aichi.zip
/d/opendata/202304030911/typeD_mie.zip
/d/opendata/202304030911/typeD_shiga.zip
/d/opendata/202304030911/typeD_kyoto.zip
/d/opendata/202304030911/typeD_osaka.zip
/d/opendata/202304030911/typeD_hyogo.zip
/d/opendata/202304030911/typeD_nara.zip
/d/opendata/202304030911/typeD_wakayama.zip
/d/opendata/202304030911/typeD_tottori.zip
/d/opendata/202304030911/typeD_shimane.zip
/d/opendata/202304030911/typeD_okayama.zip
/d/opendata/202304030911/typeD_hiroshima.zip
/d/opendata/202304030911/typeD_yamaguchi.zip
/d/opendata/202304030911/typeD_tokushima.zip
/d/opendata/202304030911/typeD_kagawa.zip
/d/opendata/202304030911/typeD_ehime.zip
/d/opendata/202304030911/typeD_kochi.zip
/d/opendata/202304030911/typeD_fukuoka.zip
/d/opendata/202304030911/typeD_saga.zip
/d/opendata/202304030911/typeD_nagasaki.zip
/d/opendata/202304030911/typeD_kumamoto.zip
/d/opendata/202304030911/typeD_oita.zip
/d/opendata/202304030911/typeD_miyazaki.zip
/d/opendata/202304030911/typeD_kagoshima.zip
/d/opendata/202304030911/typeD_okinawa.zip)

cd data
for FILE in ${FILES[@]}; do
    echo "Downloading https://www.jartic.or.jp/$FILE..."
    curl -sL -o temp.zip https://www.jartic.or.jp/$FILE && unzip -j temp.zip && rm temp.zip
done
