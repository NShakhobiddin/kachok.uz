// Mashqlarda mushaklarning EMG faolligi (% MVIC). AVTOMATIK YARATILGAN — qo'lda tahrirlamang:
// manba jadvallar docs/emg/{lower,push,pull,home,machines}.json, o'zbekcha izohlar docs/emg/uz*.json, skript scripts/build-activation.mjs.
// est: true — qiymat to'g'ridan-to'g'ri o'lchanmagan (o'xshash mashq, tadqiqotdagi nisbiy farq yoki oraliq asosida baho).
import type { M3 } from './muscles3d';

export interface ActValue {
  /** o'rtacha (yoki eng yuqori) faollik, maksimal ixtiyoriy izometrik qisqarishga nisbatan % */
  mvic: number;
  range?: [number, number];
  /** to'g'ridan-to'g'ri o'lchanmagan — o'xshash mashq yoki bir nechta tadqiqot asosida baho */
  est?: boolean;
  src?: string[];
}

export interface ExerciseActivation {
  /** 'direct' — shu mashq o'lchangan; 'similar:<mashq>' — o'xshash mashq asosida */
  basis: string;
  load?: string;
  metric?: 'mean' | 'peak';
  muscles: Partial<Record<M3, ActValue>>;
  /** harakat amplitudasi bo'ylab faollik o'zgarishi */
  rom?: string;
  notes?: string;
}

export const ACTIVATION: Record<string, ExerciseActivation> = {
  "back-squat": {
    "basis": "direct",
    "load": "10RM / 70–85% 1RM",
    "metric": "mean",
    "muscles": {
      "vastusLateralis": {
        "mvic": 110,
        "range": [
          60,
          130
        ],
        "src": [
          "L.contreras2015"
        ]
      },
      "vastusMedialis": {
        "mvic": 105,
        "range": [
          60,
          130
        ],
        "est": true,
        "src": [
          "L.contreras2015",
          "L.schwanbeck2009"
        ]
      },
      "gluteMax": {
        "mvic": 53,
        "range": [
          27,
          60
        ],
        "src": [
          "L.neto2020",
          "L.contreras2015"
        ]
      },
      "rectusFemoris": {
        "mvic": 45,
        "range": [
          25,
          60
        ],
        "est": true,
        "src": [
          "L.escamilla1998",
          "L.coratella2021"
        ]
      },
      "erectors": {
        "mvic": 45,
        "range": [
          30,
          70
        ],
        "est": true,
        "src": [
          "L.nuzzo2008"
        ]
      },
      "adductors": {
        "mvic": 40,
        "range": [
          20,
          60
        ],
        "est": true,
        "src": [
          "L.coratella2021"
        ]
      },
      "gastrocnemius": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true,
        "src": [
          "L.schwanbeck2009",
          "L.escamilla2001"
        ]
      },
      "medialHamstrings": {
        "mvic": 18,
        "range": [
          10,
          30
        ],
        "est": true,
        "src": [
          "L.escamilla1998"
        ]
      },
      "bicepsFemoris": {
        "mvic": 15,
        "range": [
          10,
          30
        ],
        "src": [
          "L.contreras2015",
          "L.escamilla1998"
        ]
      }
    },
    "rom": "Son oldi va katta dumba eng ko‘p pastdan ko‘tarilishning boshida (eng og‘ir nuqta) ishlaydi va tik turishga qarab kamayadi.",
    "notes": "Sonning tashqi keng mushagi 100% MVIC dan oshadi — og‘ir dinamik harakat izometrik testdan kuchliroq. Parallel chuqurlikda dumba faolligi to‘liq o‘tirishdagidan yuqoriroq o‘lchangan."
  },
  "front-squat": {
    "basis": "direct",
    "load": "10RM",
    "metric": "mean",
    "muscles": {
      "vastusLateralis": {
        "mvic": 105,
        "range": [
          60,
          130
        ],
        "est": true,
        "src": [
          "L.contreras2016sq",
          "L.contreras2015"
        ]
      },
      "vastusMedialis": {
        "mvic": 105,
        "range": [
          60,
          130
        ],
        "est": true,
        "src": [
          "L.contreras2016sq"
        ]
      },
      "rectusFemoris": {
        "mvic": 50,
        "range": [
          25,
          65
        ],
        "est": true,
        "src": [
          "L.coratella2021"
        ]
      },
      "erectors": {
        "mvic": 45,
        "range": [
          30,
          70
        ],
        "est": true,
        "src": [
          "L.coratella2021"
        ]
      },
      "gluteMax": {
        "mvic": 41,
        "range": [
          37,
          44
        ],
        "src": [
          "L.neto2020",
          "L.contreras2016sq"
        ]
      },
      "adductors": {
        "mvic": 35,
        "range": [
          20,
          55
        ],
        "est": true,
        "src": [
          "L.coratella2021"
        ]
      },
      "bicepsFemoris": {
        "mvic": 15,
        "range": [
          10,
          30
        ],
        "est": true,
        "src": [
          "L.contreras2016sq"
        ]
      },
      "medialHamstrings": {
        "mvic": 15,
        "range": [
          10,
          30
        ],
        "est": true,
        "src": [
          "L.contreras2016sq"
        ]
      }
    },
    "rom": "Tana tikroq — yuklama son oldiga ko‘proq o‘tadi; sonning to‘g‘ri mushagi orqa o‘tirishdagidan faolroq.",
    "notes": "Har biri o‘z 10RM ida orqa va old o‘tirish deyarli bir xil faollik bergan (old o‘tirishda vazn yengilroq bo‘lsa ham)."
  },
  "goblet-squat": {
    "basis": "similar:front-squat",
    "load": "gantel / girya",
    "metric": "mean",
    "muscles": {
      "vastusLateralis": {
        "mvic": 75,
        "range": [
          40,
          100
        ],
        "est": true,
        "src": [
          "L.contreras2016sq"
        ]
      },
      "vastusMedialis": {
        "mvic": 75,
        "range": [
          40,
          100
        ],
        "est": true,
        "src": [
          "L.contreras2016sq"
        ]
      },
      "rectusFemoris": {
        "mvic": 35,
        "range": [
          20,
          50
        ],
        "est": true,
        "src": [
          "L.coratella2021"
        ]
      },
      "gluteMax": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true,
        "src": [
          "L.neto2020"
        ]
      },
      "erectors": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true,
        "src": [
          "L.coratella2021"
        ]
      },
      "adductors": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true,
        "src": [
          "L.coratella2021"
        ]
      },
      "deltAnt": {
        "mvic": 15,
        "range": [
          10,
          30
        ],
        "est": true
      },
      "biceps": {
        "mvic": 15,
        "range": [
          10,
          30
        ],
        "est": true
      }
    },
    "rom": "Old o‘tirish kabi: son oldi va dumba pastki nuqtadan chiqishda eng faol.",
    "notes": "Kubok o‘tirish bo‘yicha EMG tadqiqot topilmadi — old o‘tirish natijalari yengilroq vazn uchun kamaytirilgan."
  },
  "smith-squat": {
    "basis": "similar:back-squat",
    "load": "8RM",
    "metric": "mean",
    "muscles": {
      "vastusLateralis": {
        "mvic": 105,
        "range": [
          60,
          130
        ],
        "est": true,
        "src": [
          "L.schwanbeck2009",
          "L.contreras2015"
        ]
      },
      "vastusMedialis": {
        "mvic": 70,
        "range": [
          45,
          100
        ],
        "est": true,
        "src": [
          "L.schwanbeck2009"
        ]
      },
      "gluteMax": {
        "mvic": 50,
        "range": [
          25,
          60
        ],
        "est": true,
        "src": [
          "L.neto2020"
        ]
      },
      "rectusFemoris": {
        "mvic": 40,
        "range": [
          20,
          55
        ],
        "est": true,
        "src": [
          "L.escamilla1998"
        ]
      },
      "erectors": {
        "mvic": 40,
        "range": [
          25,
          60
        ],
        "est": true,
        "src": [
          "L.schwanbeck2009"
        ]
      },
      "adductors": {
        "mvic": 35,
        "range": [
          15,
          55
        ],
        "est": true
      },
      "gastrocnemius": {
        "mvic": 15,
        "range": [
          8,
          25
        ],
        "est": true,
        "src": [
          "L.schwanbeck2009"
        ]
      },
      "bicepsFemoris": {
        "mvic": 12,
        "range": [
          8,
          25
        ],
        "est": true,
        "src": [
          "L.schwanbeck2009"
        ]
      }
    },
    "rom": "Oyoqlarni grifdan oldinroq qo‘yish yuklamani dumba va son orqasiga suradi.",
    "notes": "Erkin shtangada o‘tirish Smitdagidan o‘rtacha 43% ko‘proq faollik bergan (ichki keng mushak +49%, boldir +34%)."
  },
  "leg-press": {
    "basis": "direct",
    "load": "12RM",
    "metric": "mean",
    "muscles": {
      "vastusLateralis": {
        "mvic": 48,
        "range": [
          39,
          52
        ],
        "est": true,
        "src": [
          "L.wilk1996"
        ]
      },
      "vastusMedialis": {
        "mvic": 48,
        "range": [
          39,
          52
        ],
        "est": true,
        "src": [
          "L.wilk1996"
        ]
      },
      "rectusFemoris": {
        "mvic": 39,
        "range": [
          30,
          52
        ],
        "est": true,
        "src": [
          "L.wilk1996",
          "L.escamilla1998"
        ]
      },
      "gluteMax": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true,
        "src": [
          "L.dasilva2008"
        ]
      },
      "adductors": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      },
      "gastrocnemius": {
        "mvic": 15,
        "range": [
          8,
          25
        ],
        "est": true,
        "src": [
          "L.wilk1996"
        ]
      },
      "bicepsFemoris": {
        "mvic": 12,
        "range": [
          8,
          20
        ],
        "src": [
          "L.wilk1996"
        ]
      },
      "medialHamstrings": {
        "mvic": 12,
        "range": [
          8,
          20
        ],
        "src": [
          "L.wilk1996"
        ]
      }
    },
    "rom": "Son oldi tizza eng bukilgan (pastki) holatda eng faol; oyoqlar platformada baland va keng qo‘yilsa dumba va son orqasi ko‘proq ishlaydi.",
    "notes": "Son oldi 39–52% MVIC, son orqasi ~12%. O‘tirishdan farqli — orqa va bel deyarli yuklanmaydi."
  },
  "hack-squat": {
    "basis": "direct",
    "load": "70–90% 1RM",
    "metric": "mean",
    "muscles": {
      "vastusLateralis": {
        "mvic": 100,
        "range": [
          50,
          130
        ],
        "est": true,
        "src": [
          "L.ut2012hack",
          "L.contreras2015"
        ]
      },
      "vastusMedialis": {
        "mvic": 100,
        "range": [
          50,
          130
        ],
        "est": true,
        "src": [
          "L.ut2012hack"
        ]
      },
      "gluteMax": {
        "mvic": 40,
        "range": [
          20,
          55
        ],
        "est": true
      },
      "rectusFemoris": {
        "mvic": 40,
        "range": [
          25,
          55
        ],
        "est": true
      },
      "adductors": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true
      },
      "gastrocnemius": {
        "mvic": 15,
        "range": [
          8,
          25
        ],
        "est": true
      },
      "bicepsFemoris": {
        "mvic": 12,
        "range": [
          8,
          20
        ],
        "est": true
      },
      "medialHamstrings": {
        "mvic": 12,
        "range": [
          8,
          20
        ],
        "est": true
      }
    },
    "rom": "Son oldi tizza chuqur bukilganda eng faol.",
    "notes": "Ichki va tashqi keng mushaklar gakk-mashina va orqa o‘tirishda oyoq pressidan yuqori bo‘lgan; qiymatlar baho."
  },
  "bw-squat": {
    "basis": "similar:back-squat",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "vastusLateralis": {
        "mvic": 40,
        "range": [
          25,
          60
        ],
        "est": true,
        "src": [
          "L.contreras2015"
        ]
      },
      "vastusMedialis": {
        "mvic": 40,
        "range": [
          25,
          60
        ],
        "est": true
      },
      "rectusFemoris": {
        "mvic": 20,
        "range": [
          10,
          30
        ],
        "est": true
      },
      "gluteMax": {
        "mvic": 15,
        "range": [
          8,
          25
        ],
        "est": true,
        "src": [
          "L.neto2020"
        ]
      },
      "erectors": {
        "mvic": 15,
        "range": [
          8,
          25
        ],
        "est": true
      },
      "adductors": {
        "mvic": 15,
        "range": [
          8,
          25
        ],
        "est": true
      },
      "tibialisAnterior": {
        "mvic": 15,
        "range": [
          8,
          30
        ],
        "est": true
      },
      "gastrocnemius": {
        "mvic": 10,
        "range": [
          5,
          20
        ],
        "est": true
      }
    },
    "rom": "Son oldi pastki nuqtada eng faol; boldirning old mushagi muvozanatni ushlab turadi.",
    "notes": "Vaznsiz o‘tirishda faollik og‘ir o‘tirishdan ancha past — o‘rganish va qizdirish uchun yaxshi."
  },
  "deadlift": {
    "basis": "direct",
    "load": "12RM – 1RM",
    "metric": "mean",
    "muscles": {
      "erectors": {
        "mvic": 65,
        "range": [
          45,
          100
        ],
        "est": true,
        "src": [
          "L.martinfuentes2020",
          "L.andersen2018",
          "L.nuzzo2008"
        ]
      },
      "gluteMax": {
        "mvic": 65,
        "range": [
          35,
          94
        ],
        "src": [
          "L.neto2020"
        ]
      },
      "forearmFlexors": {
        "mvic": 60,
        "range": [
          40,
          90
        ],
        "est": true
      },
      "medialHamstrings": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true,
        "src": [
          "L.martinfuentes2020"
        ]
      },
      "bicepsFemoris": {
        "mvic": 45,
        "range": [
          30,
          60
        ],
        "est": true,
        "src": [
          "L.andersen2018",
          "L.contreras2015"
        ]
      },
      "vastusLateralis": {
        "mvic": 40,
        "range": [
          35,
          60
        ],
        "src": [
          "L.escamilla2002",
          "L.martinfuentes2020"
        ]
      },
      "vastusMedialis": {
        "mvic": 36,
        "range": [
          30,
          55
        ],
        "src": [
          "L.escamilla2002"
        ]
      },
      "trapUpper": {
        "mvic": 35,
        "range": [
          20,
          60
        ],
        "est": true
      },
      "gastrocnemius": {
        "mvic": 26,
        "range": [
          19,
          35
        ],
        "src": [
          "L.escamilla2002"
        ]
      }
    },
    "rom": "Poldan ko‘tarishda son oldi ko‘proq qatnashadi; tizzadan yuqorida dumba, son orqasi va bel ustunlik qiladi.",
    "notes": "Klassik o‘lik tortishda son oldi sumo uslubidan kam, boldir esa ko‘proq ishlaydi. Bilak va yuqori trapetsiya — grifni ushlab turish uchun."
  },
  "rdl": {
    "basis": "direct",
    "load": "70% 1RM – 6RM",
    "metric": "mean",
    "muscles": {
      "medialHamstrings": {
        "mvic": 94,
        "range": [
          73,
          115
        ],
        "est": true,
        "src": [
          "L.zebis2013",
          "L.martinfuentes2020"
        ]
      },
      "bicepsFemoris": {
        "mvic": 75,
        "range": [
          55,
          95
        ],
        "est": true,
        "src": [
          "L.zebis2013"
        ]
      },
      "erectors": {
        "mvic": 55,
        "range": [
          40,
          80
        ],
        "est": true,
        "src": [
          "L.martinfuentes2020",
          "L.andersen2021"
        ]
      },
      "gluteMax": {
        "mvic": 50,
        "range": [
          35,
          80
        ],
        "est": true,
        "src": [
          "L.lee2018",
          "L.delgado2019",
          "L.andersen2021",
          "L.coratella2022"
        ]
      },
      "forearmFlexors": {
        "mvic": 45,
        "range": [
          30,
          70
        ],
        "est": true
      },
      "adductors": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true
      },
      "trapUpper": {
        "mvic": 25,
        "range": [
          15,
          40
        ],
        "est": true
      },
      "vastusLateralis": {
        "mvic": 15,
        "range": [
          8,
          25
        ],
        "est": true,
        "src": [
          "L.delgado2019"
        ]
      }
    },
    "rom": "Son orqasi va dumba eng pastda (tana gorizontalga yaqin, son orqasi cho‘zilgan) eng ko‘p ishlaydi.",
    "notes": "Ichki son orqasi (yarim payli) ikki boshli mushakdan ~20% faolroq. Bel mushaklari son orqasidan kamroq ishlaydi."
  },
  "db-rdl": {
    "basis": "similar:rdl",
    "load": "gantel",
    "metric": "mean",
    "muscles": {
      "medialHamstrings": {
        "mvic": 80,
        "range": [
          55,
          105
        ],
        "est": true,
        "src": [
          "L.zebis2013"
        ]
      },
      "bicepsFemoris": {
        "mvic": 65,
        "range": [
          45,
          85
        ],
        "est": true,
        "src": [
          "L.zebis2013"
        ]
      },
      "forearmFlexors": {
        "mvic": 50,
        "range": [
          30,
          75
        ],
        "est": true
      },
      "erectors": {
        "mvic": 45,
        "range": [
          30,
          70
        ],
        "est": true,
        "src": [
          "L.martinfuentes2020"
        ]
      },
      "gluteMax": {
        "mvic": 45,
        "range": [
          30,
          70
        ],
        "est": true,
        "src": [
          "L.lee2018",
          "L.delgado2019"
        ]
      },
      "adductors": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      },
      "trapUpper": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      }
    },
    "rom": "Shtangali rumin o‘lik tortishi kabi: eng pastki cho‘zilgan holatda eng og‘ir.",
    "notes": "Gantel uchun EMG tadqiqot topilmadi — shtangali variantning ~85% i sifatida baho."
  },
  "kb-swing": {
    "basis": "direct",
    "load": "16 kg girya",
    "metric": "peak",
    "muscles": {
      "medialHamstrings": {
        "mvic": 94,
        "range": [
          73,
          115
        ],
        "est": true,
        "src": [
          "L.zebis2013"
        ]
      },
      "bicepsFemoris": {
        "mvic": 79,
        "range": [
          62,
          95
        ],
        "src": [
          "L.vangelder2015",
          "L.zebis2013"
        ]
      },
      "gluteMax": {
        "mvic": 75,
        "range": [
          75,
          80
        ],
        "src": [
          "L.vangelder2015",
          "L.mcgill2012"
        ]
      },
      "gluteMed": {
        "mvic": 56,
        "range": [
          30,
          80
        ],
        "src": [
          "L.vangelder2015"
        ]
      },
      "erectors": {
        "mvic": 50,
        "range": [
          40,
          60
        ],
        "src": [
          "L.mcgill2012"
        ]
      },
      "forearmFlexors": {
        "mvic": 40,
        "range": [
          25,
          60
        ],
        "est": true
      },
      "vastusLateralis": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true
      },
      "deltAnt": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      }
    },
    "rom": "Mushaklar \"yonib-o‘chib\" ishlaydi: pastdan tos to‘liq yozilguncha dumba va son orqasi kuchli qisqaradi, girya uchganda bo‘shashadi.",
    "notes": "Cho‘qqi qiymatlar, tafovut juda katta. Harakatni son orqasi birinchi bo‘lib boshlaydi."
  },
  "back-extension": {
    "basis": "direct",
    "load": "6RM, 45°",
    "metric": "mean",
    "muscles": {
      "bicepsFemoris": {
        "mvic": 90,
        "range": [
          60,
          130
        ],
        "est": true,
        "src": [
          "L.andersen2021"
        ]
      },
      "medialHamstrings": {
        "mvic": 85,
        "range": [
          55,
          120
        ],
        "est": true,
        "src": [
          "L.andersen2021"
        ]
      },
      "erectors": {
        "mvic": 55,
        "range": [
          40,
          80
        ],
        "est": true,
        "src": [
          "L.andersen2021"
        ]
      },
      "gluteMax": {
        "mvic": 50,
        "range": [
          30,
          75
        ],
        "est": true,
        "src": [
          "L.andersen2021"
        ]
      },
      "adductors": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      }
    },
    "rom": "Tana gorizontaldan o‘tayotganda yuklama eng katta; umurtqani bukish o‘rniga tosdan bukilsangiz ish son orqasi va dumbaga o‘tadi.",
    "notes": "Son orqasi rumin o‘lik tortishiga nisbatan 71–174% ko‘proq ishlagan; bel mushaklari uchala mashqda bir xil."
  },
  "split-squat": {
    "basis": "direct",
    "load": "6–8RM",
    "metric": "peak",
    "muscles": {
      "vastusLateralis": {
        "mvic": 90,
        "range": [
          70,
          110
        ],
        "est": true,
        "src": [
          "L.mausehund2018"
        ]
      },
      "vastusMedialis": {
        "mvic": 85,
        "range": [
          65,
          110
        ],
        "est": true,
        "src": [
          "L.mausehund2018"
        ]
      },
      "gluteMax": {
        "mvic": 70,
        "range": [
          55,
          85
        ],
        "src": [
          "L.neto2020",
          "L.mausehund2018",
          "L.williams2021"
        ]
      },
      "bicepsFemoris": {
        "mvic": 62,
        "range": [
          50,
          75
        ],
        "src": [
          "L.mausehund2018"
        ]
      },
      "medialHamstrings": {
        "mvic": 50,
        "range": [
          35,
          65
        ],
        "est": true
      },
      "gluteMed": {
        "mvic": 46,
        "range": [
          35,
          60
        ],
        "src": [
          "L.mausehund2018"
        ]
      },
      "rectusFemoris": {
        "mvic": 40,
        "range": [
          25,
          55
        ],
        "est": true
      },
      "adductors": {
        "mvic": 40,
        "range": [
          20,
          55
        ],
        "est": true
      },
      "forearmFlexors": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true
      }
    },
    "rom": "Oldingi oyoqda son oldi va dumba pastki nuqtada eng faol; set oxiriga qarab son orqasi ham ko‘proq qatnashadi.",
    "notes": "Cho‘qqi qiymatlar. Dumba faolligi bolgar o‘tirishi va bir oyoqda o‘tirish bilan bir xil."
  },
  "bulgarian": {
    "basis": "direct",
    "load": "6–8RM",
    "metric": "peak",
    "muscles": {
      "vastusLateralis": {
        "mvic": 92,
        "range": [
          70,
          110
        ],
        "est": true,
        "src": [
          "L.mausehund2018"
        ]
      },
      "vastusMedialis": {
        "mvic": 88,
        "range": [
          65,
          110
        ],
        "est": true,
        "src": [
          "L.mausehund2018"
        ]
      },
      "bicepsFemoris": {
        "mvic": 76,
        "range": [
          60,
          90
        ],
        "src": [
          "L.mausehund2018"
        ]
      },
      "gluteMax": {
        "mvic": 70,
        "range": [
          55,
          85
        ],
        "est": true,
        "src": [
          "L.mausehund2018",
          "L.neto2020"
        ]
      },
      "medialHamstrings": {
        "mvic": 60,
        "range": [
          40,
          75
        ],
        "est": true
      },
      "gluteMed": {
        "mvic": 55,
        "range": [
          40,
          70
        ],
        "src": [
          "L.mausehund2018"
        ]
      },
      "adductors": {
        "mvic": 40,
        "range": [
          20,
          55
        ],
        "est": true
      },
      "rectusFemoris": {
        "mvic": 35,
        "range": [
          20,
          50
        ],
        "est": true
      },
      "forearmFlexors": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true
      }
    },
    "rom": "Orqa oyoq ko‘tarilgan — oldingi oyoqda son orqasi oddiy hamla (lunge) dan ko‘proq ishlaydi.",
    "notes": "Cho‘qqi qiymatlar. Ikki boshli son mushagi 76% (oddiy hamlada 62%)."
  },
  "step-up": {
    "basis": "direct",
    "load": "6RM, 46 sm quti",
    "metric": "mean",
    "muscles": {
      "gluteMax": {
        "mvic": 120,
        "range": [
          74,
          169
        ],
        "est": true,
        "src": [
          "L.neto2020",
          "L.simenz2012"
        ]
      },
      "vastusLateralis": {
        "mvic": 90,
        "range": [
          60,
          120
        ],
        "est": true,
        "src": [
          "L.simenz2012"
        ]
      },
      "vastusMedialis": {
        "mvic": 90,
        "range": [
          60,
          120
        ],
        "est": true,
        "src": [
          "L.simenz2012"
        ]
      },
      "gluteMed": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true,
        "src": [
          "L.simenz2012"
        ]
      },
      "rectusFemoris": {
        "mvic": 40,
        "range": [
          25,
          60
        ],
        "est": true,
        "src": [
          "L.simenz2012"
        ]
      },
      "bicepsFemoris": {
        "mvic": 35,
        "range": [
          20,
          50
        ],
        "est": true,
        "src": [
          "L.simenz2012"
        ]
      },
      "medialHamstrings": {
        "mvic": 35,
        "range": [
          20,
          50
        ],
        "est": true,
        "src": [
          "L.simenz2012"
        ]
      },
      "gastrocnemius": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      }
    },
    "rom": "Ko‘tarilishning boshida (tizza va tos eng bukilgan) eng og‘ir.",
    "notes": "Katta dumba uchun eng kuchli mashqlardan biri (bir tadqiqotda 169% MVIC — referens testi tufayli oshirilgan, bu yerda 120% olingan)."
  },
  "bw-split-squat": {
    "basis": "similar:split-squat",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "vastusLateralis": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true,
        "src": [
          "L.mausehund2018",
          "L.muyor2020"
        ]
      },
      "vastusMedialis": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true,
        "src": [
          "L.muyor2020"
        ]
      },
      "gluteMed": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true,
        "src": [
          "L.muyor2020"
        ]
      },
      "gluteMax": {
        "mvic": 28,
        "range": [
          15,
          45
        ],
        "est": true,
        "src": [
          "L.muyor2020",
          "L.neto2020"
        ]
      },
      "rectusFemoris": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      },
      "bicepsFemoris": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true,
        "src": [
          "L.mausehund2018"
        ]
      },
      "adductors": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      },
      "medialHamstrings": {
        "mvic": 15,
        "range": [
          8,
          30
        ],
        "est": true
      }
    },
    "rom": "Ko‘tarilish fazasida barcha mushaklar tushishdagidan sezilarli faolroq.",
    "notes": "Vaznsiz variant — qiymatlar og‘ir hamladan kamaytirilgan."
  },
  "leg-extension": {
    "basis": "direct",
    "load": "12RM",
    "metric": "mean",
    "muscles": {
      "vastusLateralis": {
        "mvic": 70,
        "range": [
          50,
          90
        ],
        "est": true,
        "src": [
          "L.escamilla1998"
        ]
      },
      "vastusMedialis": {
        "mvic": 70,
        "range": [
          50,
          90
        ],
        "est": true,
        "src": [
          "L.escamilla1998"
        ]
      },
      "rectusFemoris": {
        "mvic": 65,
        "range": [
          45,
          90
        ],
        "est": true,
        "src": [
          "L.escamilla1998"
        ]
      }
    },
    "rom": "Ochiq zanjirda son oldi oyoq to‘liq yozilishiga yaqinlashganda eng ko‘p ishlaydi (o‘tirishning aksi).",
    "notes": "Sonning to‘g‘ri mushagi bu mashqda o‘tirishdagidan faolroq; son orqasi deyarli ishlamaydi."
  },
  "leg-curl": {
    "basis": "similar:son orqasini bukish (yotib yoki o‘tirib)",
    "load": "o‘rtacha–og‘ir",
    "metric": "mean",
    "muscles": {
      "medialHamstrings": {
        "mvic": 80,
        "range": [
          69,
          85
        ],
        "est": true,
        "src": [
          "L.hegyi2019",
          "L.schoenfeld2015"
        ]
      },
      "bicepsFemoris": {
        "mvic": 75,
        "range": [
          69,
          85
        ],
        "est": true,
        "src": [
          "L.hegyi2019"
        ]
      },
      "gastrocnemius": {
        "mvic": 30,
        "range": [
          15,
          50
        ],
        "est": true
      }
    },
    "rom": "Oyoq bukish son orqasining pastki qismini o‘lik tortishdan ko‘proq ishlatadi.",
    "notes": "Son orqasi ko‘tarishda 69–85%, tushirishda 40–54% MVIC."
  },
  "hip-thrust": {
    "basis": "direct",
    "load": "10RM – 1RM",
    "metric": "mean",
    "muscles": {
      "gluteMax": {
        "mvic": 82,
        "range": [
          70,
          105
        ],
        "src": [
          "L.neto2020",
          "L.contreras2015",
          "L.contreras2016ht",
          "L.williams2021"
        ]
      },
      "vastusLateralis": {
        "mvic": 75,
        "range": [
          50,
          100
        ],
        "est": true,
        "src": [
          "L.contreras2015",
          "L.delgado2019"
        ]
      },
      "vastusMedialis": {
        "mvic": 70,
        "range": [
          45,
          95
        ],
        "est": true
      },
      "erectors": {
        "mvic": 55,
        "range": [
          35,
          75
        ],
        "est": true,
        "src": [
          "L.andersen2018"
        ]
      },
      "bicepsFemoris": {
        "mvic": 41,
        "range": [
          30,
          55
        ],
        "src": [
          "L.contreras2015",
          "L.andersen2018"
        ]
      },
      "medialHamstrings": {
        "mvic": 35,
        "range": [
          20,
          50
        ],
        "est": true
      },
      "adductors": {
        "mvic": 35,
        "range": [
          15,
          50
        ],
        "est": true
      },
      "gluteMed": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true
      }
    },
    "rom": "Katta dumba tos to‘liq yozilgan (tepadagi) holatda eng faol — yuqori qismda trap-grif o‘lik tortishidan 26% ko‘proq.",
    "notes": "Katta dumba 82% (o‘tirishda ~30–53%). Son orqasi o‘tirishdagidan ~3 baravar ko‘proq ishlaydi."
  },
  "glute-bridge": {
    "basis": "similar:hip-thrust",
    "load": "o‘z vazni yoki shtanga",
    "metric": "mean",
    "muscles": {
      "gluteMax": {
        "mvic": 60,
        "range": [
          25,
          82
        ],
        "est": true,
        "src": [
          "L.contreras2016ht",
          "L.contreras2015"
        ]
      },
      "vastusLateralis": {
        "mvic": 35,
        "range": [
          15,
          60
        ],
        "est": true
      },
      "erectors": {
        "mvic": 35,
        "range": [
          20,
          50
        ],
        "est": true
      },
      "bicepsFemoris": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true,
        "src": [
          "L.contreras2015"
        ]
      },
      "medialHamstrings": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      },
      "gluteMed": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      },
      "adductors": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      }
    },
    "rom": "Ko‘prik deyarli faqat yuqori amplitudada ishlaydi — dumba tepada eng faol.",
    "notes": "Shtanga bilan tos ko‘tarish natijalaridan kamaytirilgan baho."
  },
  "calf-raise": {
    "basis": "similar:bir oyoqda tovonni ko‘tarish",
    "load": "~10RM",
    "metric": "mean",
    "muscles": {
      "gastrocnemius": {
        "mvic": 60,
        "range": [
          23,
          90
        ],
        "est": true,
        "src": [
          "L.heberlosier2012",
          "L.riemann2011"
        ]
      },
      "soleus": {
        "mvic": 55,
        "range": [
          23,
          85
        ],
        "est": true,
        "src": [
          "L.heberlosier2012"
        ]
      }
    },
    "rom": "Tizza to‘g‘ri bo‘lsa boldirning ikki boshli mushagi, bukilgan bo‘lsa kambalasimon mushak ko‘proq ishlaydi.",
    "notes": "O‘z vazni bilan ~23% MVIC; og‘ir yuklama uchun qiymatlar baho."
  },
  "bench-press": {
    "basis": "direct",
    "load": "60–85% 1RM",
    "metric": "mean",
    "muscles": {
      "pecMid": {
        "mvic": 75,
        "range": [
          25,
          100
        ],
        "src": [
          "P.lauver2016",
          "P.wojdala2020",
          "P.rodriguezridao2020",
          "P.stastny2017",
          "P.vandentillaar2014"
        ]
      },
      "pecUpper": {
        "mvic": 70,
        "range": [
          25,
          98
        ],
        "src": [
          "P.lauver2016",
          "P.rodriguezridao2020",
          "P.muyor2023"
        ]
      },
      "pecLower": {
        "mvic": 65,
        "range": [
          27,
          100
        ],
        "est": true,
        "src": [
          "P.rodriguezridao2020",
          "P.lauver2016",
          "P.arseneault2021"
        ]
      },
      "deltAnt": {
        "mvic": 55,
        "range": [
          21,
          70
        ],
        "src": [
          "P.botton2013",
          "P.campos2020",
          "P.rodriguezridao2020",
          "P.muyor2023",
          "P.yan2025"
        ]
      },
      "tricepsLateral": {
        "mvic": 70,
        "range": [
          12,
          90
        ],
        "est": true,
        "src": [
          "P.wojdala2020",
          "P.stastny2017",
          "P.muyor2023"
        ]
      },
      "tricepsLong": {
        "mvic": 55,
        "range": [
          30,
          80
        ],
        "est": true,
        "src": [
          "P.barnett1995",
          "P.saeterbakken2017"
        ]
      },
      "tricepsMedial": {
        "mvic": 55,
        "range": [
          15,
          80
        ],
        "est": true,
        "src": [
          "P.rodriguezridao2020"
        ]
      }
    },
    "rom": "Ko‘krak va old delta eng ko‘p ko‘tarishning boshi-o‘rtasida (eng og‘ir nuqta) ishlaydi; charchagan sari ularning faolligi yanada oshadi.",
    "notes": "Laboratoriyalar orasida mutlaq qiymat 3 baravargacha farq qiladi (60% 1RM da ~25%, 65% 1RM da ~100% MVIC) — raqamlar og‘ir set uchun o‘rtacha baho."
  },
  "db-bench": {
    "basis": "direct",
    "load": "6RM – 1RM",
    "metric": "mean",
    "muscles": {
      "pecMid": {
        "mvic": 75,
        "range": [
          25,
          100
        ],
        "est": true,
        "src": [
          "P.saeterbakken2011",
          "P.welsch2005"
        ]
      },
      "pecUpper": {
        "mvic": 70,
        "range": [
          25,
          98
        ],
        "est": true,
        "src": [
          "P.saeterbakken2011",
          "P.luczak2013"
        ]
      },
      "pecLower": {
        "mvic": 60,
        "range": [
          25,
          95
        ],
        "est": true,
        "src": [
          "P.saeterbakken2011"
        ]
      },
      "deltAnt": {
        "mvic": 55,
        "range": [
          21,
          70
        ],
        "est": true,
        "src": [
          "P.saeterbakken2011",
          "P.welsch2005",
          "P.luczak2013"
        ]
      },
      "tricepsLateral": {
        "mvic": 55,
        "range": [
          10,
          80
        ],
        "est": true,
        "src": [
          "P.saeterbakken2011"
        ]
      },
      "tricepsLong": {
        "mvic": 45,
        "range": [
          10,
          70
        ],
        "est": true,
        "src": [
          "P.saeterbakken2011"
        ]
      },
      "tricepsMedial": {
        "mvic": 45,
        "range": [
          10,
          70
        ],
        "est": true,
        "src": [
          "P.saeterbakken2011"
        ]
      },
      "biceps": {
        "mvic": 15,
        "range": [
          5,
          25
        ],
        "est": true,
        "src": [
          "P.saeterbakken2011"
        ]
      }
    },
    "rom": "Ko‘krak va old delta shtangadagi kabi ishlaydi; gantelda triseps biroz kamroq, bitseps (barqarorlashtirish uchun) ko‘proq.",
    "notes": "Gantel uchun %MVIC o‘lchanmagan — shtanga natijalaridan nisbiy farqlar bo‘yicha hisoblangan."
  },
  "machine-chest-press": {
    "basis": "direct",
    "load": "60–80% 1RM",
    "metric": "mean",
    "muscles": {
      "pecMid": {
        "mvic": 60,
        "range": [
          25,
          80
        ],
        "est": true,
        "src": [
          "P.coratella2020bp",
          "P.schanke2012",
          "P.muyor2023"
        ]
      },
      "pecUpper": {
        "mvic": 55,
        "range": [
          30,
          75
        ],
        "est": true,
        "src": [
          "P.muyor2023",
          "P.coratella2020bp"
        ]
      },
      "pecLower": {
        "mvic": 50,
        "range": [
          25,
          70
        ],
        "est": true,
        "src": [
          "P.coratella2020bp"
        ]
      },
      "deltAnt": {
        "mvic": 50,
        "range": [
          24,
          60
        ],
        "est": true,
        "src": [
          "P.muyor2023",
          "P.coratella2020bp"
        ]
      },
      "tricepsLateral": {
        "mvic": 50,
        "range": [
          12,
          65
        ],
        "est": true,
        "src": [
          "P.muyor2023",
          "P.coratella2020bp"
        ]
      },
      "tricepsLong": {
        "mvic": 40,
        "range": [
          12,
          60
        ],
        "est": true,
        "src": [
          "P.coratella2020bp"
        ]
      }
    },
    "rom": "Trenajyor harakat yo‘lini o‘zi ushlaydi — barqarorlashtiruvchi mushaklar kamroq qatnashadi.",
    "notes": "Ko‘krakning yuqori qismi bo‘yicha tadqiqotlar bir-biriga zid (biri yuqoriroq, boshqasi pastroq topgan)."
  },
  "push-up": {
    "basis": "direct",
    "load": "o‘z vazni",
    "metric": "peak",
    "muscles": {
      "pecMid": {
        "mvic": 75,
        "range": [
          64,
          105
        ],
        "src": [
          "P.snarr2013",
          "P.youdas2010",
          "P.calatayud2015"
        ]
      },
      "tricepsLateral": {
        "mvic": 74,
        "range": [
          17,
          109
        ],
        "src": [
          "P.snarr2013",
          "P.youdas2010",
          "P.borreani2015"
        ]
      },
      "deltAnt": {
        "mvic": 59,
        "range": [
          39,
          79
        ],
        "src": [
          "P.snarr2013"
        ]
      },
      "serratus": {
        "mvic": 75,
        "range": [
          67,
          87
        ],
        "src": [
          "P.youdas2010"
        ]
      },
      "deltPost": {
        "mvic": 15,
        "range": [
          11,
          21
        ],
        "src": [
          "P.youdas2010"
        ]
      },
      "tricepsLong": {
        "mvic": 60,
        "range": [
          40,
          90
        ],
        "est": true,
        "src": [
          "P.youdas2010",
          "P.marcolin2015"
        ]
      },
      "pecUpper": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true,
        "src": [
          "P.borreani2015",
          "P.marcolin2015"
        ]
      },
      "rectusAbdominis": {
        "mvic": 20,
        "range": [
          10,
          30
        ],
        "est": true,
        "src": [
          "P.calatayud2014"
        ]
      }
    },
    "rom": "Qo‘llar torroq qo‘yilsa triseps (va ko‘krak) faolligi oshadi.",
    "notes": "Cho‘qqi qiymatlar — boshqa mashqlardagi o‘rtacha qiymatlardan balandroq chiqadi. Old tishsimon mushak kuchli ishlaydi — kurakni ko‘krak qafasiga bosib turadi."
  },
  "dips": {
    "basis": "direct",
    "load": "o‘z vazni",
    "metric": "peak",
    "muscles": {
      "tricepsLateral": {
        "mvic": 85,
        "range": [
          60,
          110
        ],
        "est": true,
        "src": [
          "P.mckenzie2022",
          "P.bagchi2015",
          "P.boehler2011"
        ]
      },
      "tricepsLong": {
        "mvic": 75,
        "range": [
          50,
          100
        ],
        "est": true,
        "src": [
          "P.mckenzie2022",
          "P.boehler2011"
        ]
      },
      "tricepsMedial": {
        "mvic": 75,
        "range": [
          50,
          100
        ],
        "est": true,
        "src": [
          "P.mckenzie2022"
        ]
      },
      "pecMid": {
        "mvic": 65,
        "range": [
          40,
          90
        ],
        "est": true,
        "src": [
          "P.mckenzie2022",
          "P.bagchi2015",
          "P.mckenzie2022fatigue"
        ]
      },
      "pecLower": {
        "mvic": 70,
        "range": [
          40,
          95
        ],
        "est": true,
        "src": [
          "P.mckenzie2022"
        ]
      },
      "deltAnt": {
        "mvic": 55,
        "range": [
          35,
          80
        ],
        "est": true,
        "src": [
          "P.mckenzie2022"
        ]
      },
      "pecUpper": {
        "mvic": 30,
        "range": [
          15,
          50
        ],
        "est": true,
        "src": [
          "P.mckenzie2022"
        ]
      },
      "lats": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true,
        "src": [
          "P.mckenzie2022"
        ]
      }
    },
    "rom": "Pastki nuqtada (yelka orqaga cho‘zilganda) ko‘krak faolligi yuqori va charchaganda keskin oshadi.",
    "notes": "%MVIC tadqiqoti topilmadi (faqat mV) — baho. Brusyada qo‘l bukish skameykadagi variantdan barcha mushaklarda kuchliroq."
  },
  "incline-db-press": {
    "basis": "direct",
    "load": "o‘rtacha vazn",
    "metric": "mean",
    "muscles": {
      "pecUpper": {
        "mvic": 70,
        "range": [
          30,
          120
        ],
        "est": true,
        "src": [
          "P.luczak2013",
          "P.lauver2016",
          "P.rodriguezridao2020"
        ]
      },
      "pecMid": {
        "mvic": 55,
        "range": [
          20,
          85
        ],
        "est": true,
        "src": [
          "P.luczak2013",
          "P.lauver2016"
        ]
      },
      "pecLower": {
        "mvic": 35,
        "range": [
          15,
          60
        ],
        "est": true,
        "src": [
          "P.rodriguezridao2020"
        ]
      },
      "deltAnt": {
        "mvic": 65,
        "range": [
          33,
          85
        ],
        "est": true,
        "src": [
          "P.luczak2013",
          "P.rodriguezridao2020"
        ]
      },
      "tricepsLateral": {
        "mvic": 40,
        "range": [
          10,
          65
        ],
        "est": true,
        "src": [
          "P.saeterbakken2011",
          "P.saeterbakken2017"
        ]
      },
      "tricepsLong": {
        "mvic": 35,
        "range": [
          10,
          60
        ],
        "est": true,
        "src": [
          "P.saeterbakken2011"
        ]
      },
      "biceps": {
        "mvic": 15,
        "range": [
          5,
          30
        ],
        "est": true,
        "src": [
          "P.saeterbakken2011",
          "P.saeterbakken2017"
        ]
      },
      "trapUpper": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true,
        "src": [
          "P.luczak2013"
        ]
      }
    },
    "rom": "Ko‘krakning yuqori qismi qiya skameykada tekisdagidan asosan tushirish fazasida ko‘proq ishlaydi.",
    "notes": "Qiya shtanga natijalaridan gantel farqlari bo‘yicha hisoblangan."
  },
  "incline-bench": {
    "basis": "direct",
    "load": "65–80% 1RM, 30–45°",
    "metric": "mean",
    "muscles": {
      "pecUpper": {
        "mvic": 80,
        "range": [
          30,
          124
        ],
        "src": [
          "P.lauver2016",
          "P.rodriguezridao2020",
          "P.trebs2010",
          "P.coratella2020bp"
        ]
      },
      "pecMid": {
        "mvic": 60,
        "range": [
          25,
          87
        ],
        "src": [
          "P.lauver2016",
          "P.rodriguezridao2020",
          "P.trebs2010",
          "P.lopezvivancos2023"
        ]
      },
      "pecLower": {
        "mvic": 35,
        "range": [
          15,
          72
        ],
        "est": true,
        "src": [
          "P.arseneault2021",
          "P.rodriguezridao2020",
          "P.lauver2016"
        ]
      },
      "deltAnt": {
        "mvic": 65,
        "range": [
          33,
          85
        ],
        "est": true,
        "src": [
          "P.rodriguezridao2020",
          "P.trebs2010",
          "P.barnett1995"
        ]
      },
      "tricepsLateral": {
        "mvic": 45,
        "range": [
          15,
          70
        ],
        "est": true,
        "src": [
          "P.saeterbakken2017",
          "P.rodriguezridao2020",
          "P.lopezvivancos2023"
        ]
      },
      "tricepsLong": {
        "mvic": 40,
        "range": [
          15,
          65
        ],
        "est": true,
        "src": [
          "P.barnett1995",
          "P.saeterbakken2017"
        ]
      },
      "tricepsMedial": {
        "mvic": 45,
        "range": [
          15,
          70
        ],
        "est": true,
        "src": [
          "P.rodriguezridao2020"
        ]
      },
      "biceps": {
        "mvic": 15,
        "range": [
          5,
          30
        ],
        "est": true,
        "src": [
          "P.saeterbakken2017",
          "P.lopezvivancos2023"
        ]
      }
    },
    "rom": "30–45° qiyalikda yuqori ko‘krak ustunligi ko‘tarishning 26–50% qismida ko‘rinadi; qiyalik oshgan sari to‘sh qismi kamayadi, old delta ko‘payadi.",
    "notes": "Yuqori ko‘krak uchun eng yaxshi burchak ~30°; 45° dan tik qilinsa ish yelkaga o‘tadi."
  },
  "cable-fly": {
    "basis": "similar:pec-deck",
    "load": "80% 1RM",
    "metric": "mean",
    "muscles": {
      "pecMid": {
        "mvic": 65,
        "range": [
          40,
          85
        ],
        "est": true,
        "src": [
          "P.schanke2012",
          "P.rochajunior2007"
        ]
      },
      "pecLower": {
        "mvic": 60,
        "range": [
          35,
          80
        ],
        "est": true,
        "src": [
          "P.schanke2012"
        ]
      },
      "pecUpper": {
        "mvic": 45,
        "range": [
          25,
          70
        ],
        "est": true,
        "src": [
          "P.schanke2012"
        ]
      },
      "deltAnt": {
        "mvic": 40,
        "range": [
          19,
          55
        ],
        "est": true,
        "src": [
          "P.campos2020",
          "P.botton2013"
        ]
      }
    },
    "rom": "Kabel qo‘llar yaqinlashganda ham yuklamani ushlab turadi (gantelda tepada yuklama yo‘qoladi).",
    "notes": "Ilmiy jurnalda chop etilgan EMG tadqiqot topilmadi — batterflay trenajyori va yotib jim natijalari asosida baho. Yuqori yoki pastki ko‘krak ulushi kabel yo‘nalishiga bog‘liq."
  },
  "pec-deck": {
    "basis": "direct",
    "load": "10RM",
    "metric": "mean",
    "muscles": {
      "pecMid": {
        "mvic": 70,
        "range": [
          40,
          95
        ],
        "est": true,
        "src": [
          "P.rochajunior2007",
          "P.schanke2012"
        ]
      },
      "pecUpper": {
        "mvic": 60,
        "range": [
          30,
          85
        ],
        "est": true,
        "src": [
          "P.rochajunior2007"
        ]
      },
      "pecLower": {
        "mvic": 55,
        "range": [
          30,
          80
        ],
        "est": true,
        "src": [
          "P.rochajunior2007"
        ]
      },
      "deltAnt": {
        "mvic": 50,
        "range": [
          19,
          55
        ],
        "src": [
          "P.botton2013",
          "P.rochajunior2007",
          "P.campos2020"
        ]
      }
    },
    "rom": "Ko‘krak va old delta faolligi yotib jimdagidan farq qilmagan; triseps deyarli ishlamaydi.",
    "notes": "Ko‘krak qismlari bo‘yicha qiymatlar baho."
  },
  "db-fly": {
    "basis": "direct",
    "load": "6RM",
    "metric": "mean",
    "muscles": {
      "pecMid": {
        "mvic": 60,
        "range": [
          35,
          90
        ],
        "est": true,
        "src": [
          "P.solstad2020",
          "P.welsch2005"
        ]
      },
      "pecUpper": {
        "mvic": 50,
        "range": [
          25,
          80
        ],
        "est": true,
        "src": [
          "P.solstad2020"
        ]
      },
      "pecLower": {
        "mvic": 50,
        "range": [
          25,
          80
        ],
        "est": true,
        "src": [
          "P.solstad2020"
        ]
      },
      "deltAnt": {
        "mvic": 45,
        "range": [
          19,
          55
        ],
        "est": true,
        "src": [
          "P.campos2020",
          "P.welsch2005"
        ]
      }
    },
    "rom": "Gantelli ochishda ko‘krak pastki (cho‘zilgan) holatda yaxshi ishlaydi, qo‘llar tepada tik bo‘lganda faollik keskin tushadi.",
    "notes": "Umuman olganda ko‘krak faolligi shtanga bilan yotib jimdan ~16% past."
  },
  "ohp": {
    "basis": "direct",
    "load": "60–80% 1RM",
    "metric": "mean",
    "muscles": {
      "deltAnt": {
        "mvic": 70,
        "range": [
          33,
          90
        ],
        "est": true,
        "src": [
          "P.saeterbakken2013",
          "P.campos2020",
          "P.botton2013",
          "P.paoli2010"
        ]
      },
      "deltLat": {
        "mvic": 50,
        "range": [
          28,
          70
        ],
        "est": true,
        "src": [
          "P.campos2020",
          "P.saeterbakken2013",
          "P.coratella2022"
        ]
      },
      "deltPost": {
        "mvic": 20,
        "range": [
          11,
          30
        ],
        "est": true,
        "src": [
          "P.campos2020",
          "P.saeterbakken2013"
        ]
      },
      "tricepsLateral": {
        "mvic": 65,
        "range": [
          30,
          90
        ],
        "est": true,
        "src": [
          "P.saeterbakken2013"
        ]
      },
      "tricepsLong": {
        "mvic": 50,
        "range": [
          25,
          75
        ],
        "est": true,
        "src": [
          "P.saeterbakken2013"
        ]
      },
      "trapUpper": {
        "mvic": 50,
        "range": [
          25,
          75
        ],
        "est": true,
        "src": [
          "P.coratella2022",
          "P.luczak2013"
        ]
      },
      "serratus": {
        "mvic": 45,
        "range": [
          20,
          70
        ],
        "est": true
      },
      "pecUpper": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true,
        "src": [
          "P.coratella2022"
        ]
      }
    },
    "rom": "To‘liq amplitudada delta va trapetsiya eng ko‘p ishlaydi; qisqa amplituda ikkalasini kamaytiradi.",
    "notes": "Tik turib bajarilganda delta (ayniqsa orqa qismi) o‘tirib bajarilgandan faolroq."
  },
  "db-shoulder-press": {
    "basis": "direct",
    "load": "60–80% 1RM",
    "metric": "mean",
    "muscles": {
      "deltAnt": {
        "mvic": 65,
        "range": [
          33,
          85
        ],
        "est": true,
        "src": [
          "P.saeterbakken2013",
          "P.campos2020",
          "P.luczak2013",
          "P.paoli2010"
        ]
      },
      "deltLat": {
        "mvic": 45,
        "range": [
          28,
          65
        ],
        "est": true,
        "src": [
          "P.campos2020",
          "P.saeterbakken2013"
        ]
      },
      "deltPost": {
        "mvic": 15,
        "range": [
          11,
          25
        ],
        "est": true,
        "src": [
          "P.campos2020",
          "P.saeterbakken2013"
        ]
      },
      "tricepsLateral": {
        "mvic": 45,
        "range": [
          20,
          70
        ],
        "est": true,
        "src": [
          "P.saeterbakken2013"
        ]
      },
      "tricepsLong": {
        "mvic": 35,
        "range": [
          15,
          60
        ],
        "est": true,
        "src": [
          "P.saeterbakken2013"
        ]
      },
      "trapUpper": {
        "mvic": 40,
        "range": [
          20,
          65
        ],
        "est": true,
        "src": [
          "P.luczak2013"
        ]
      },
      "serratus": {
        "mvic": 35,
        "range": [
          15,
          60
        ],
        "est": true
      },
      "pecUpper": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      }
    },
    "rom": "To‘liq amplituda — eng yuqori faollik.",
    "notes": "O‘tirib bajarilganda orqa delta tik turishdagidan ~24% kam ishlaydi."
  },
  "machine-shoulder-press": {
    "basis": "direct",
    "load": "10RM",
    "metric": "mean",
    "muscles": {
      "deltAnt": {
        "mvic": 70,
        "range": [
          33,
          70
        ],
        "src": [
          "P.botton2013",
          "P.campos2020"
        ]
      },
      "deltLat": {
        "mvic": 40,
        "range": [
          25,
          60
        ],
        "est": true,
        "src": [
          "P.coratella2022",
          "P.campos2020"
        ]
      },
      "deltPost": {
        "mvic": 10,
        "range": [
          5,
          20
        ],
        "est": true,
        "src": [
          "P.coratella2022"
        ]
      },
      "tricepsLateral": {
        "mvic": 50,
        "range": [
          25,
          75
        ],
        "est": true,
        "src": [
          "P.saeterbakken2013"
        ]
      },
      "tricepsLong": {
        "mvic": 40,
        "range": [
          20,
          60
        ],
        "est": true
      },
      "trapUpper": {
        "mvic": 35,
        "range": [
          15,
          55
        ],
        "est": true,
        "src": [
          "P.coratella2022"
        ]
      },
      "serratus": {
        "mvic": 25,
        "range": [
          10,
          45
        ],
        "est": true
      },
      "pecUpper": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      }
    },
    "rom": "Trenajyor yo‘lni ushlaydi — orqa delta erkin shtangadagidan kamroq qatnashadi.",
    "notes": "Old delta qiymati Smit-trenajyordagi jimdan olingan."
  },
  "pike-push-up": {
    "basis": "similar:otjimaniya va tik turib jim",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "deltAnt": {
        "mvic": 65,
        "range": [
          40,
          85
        ],
        "est": true,
        "src": [
          "P.snarr2013",
          "P.campos2020"
        ]
      },
      "tricepsLateral": {
        "mvic": 60,
        "range": [
          35,
          85
        ],
        "est": true,
        "src": [
          "P.snarr2013"
        ]
      },
      "tricepsLong": {
        "mvic": 45,
        "range": [
          25,
          70
        ],
        "est": true
      },
      "deltLat": {
        "mvic": 35,
        "range": [
          20,
          55
        ],
        "est": true,
        "src": [
          "P.campos2020"
        ]
      },
      "serratus": {
        "mvic": 45,
        "range": [
          25,
          70
        ],
        "est": true,
        "src": [
          "P.youdas2010"
        ]
      },
      "trapUpper": {
        "mvic": 35,
        "range": [
          15,
          55
        ],
        "est": true
      },
      "pecUpper": {
        "mvic": 30,
        "range": [
          15,
          50
        ],
        "est": true,
        "src": [
          "P.rodriguezridao2020",
          "P.trebs2010"
        ]
      },
      "rectusAbdominis": {
        "mvic": 15,
        "range": [
          5,
          25
        ],
        "est": true,
        "src": [
          "P.calatayud2014"
        ]
      }
    },
    "rom": "Tana qanchalik tik bo‘lsa, ish ko‘krakdan deltaga shuncha ko‘p o‘tadi.",
    "notes": "EMG tadqiqot topilmadi — otjimaniya va tik turib jim oralig‘ida baho."
  },
  "lateral-raise": {
    "basis": "direct",
    "load": "60% 1RM – 10RM",
    "metric": "mean",
    "muscles": {
      "deltLat": {
        "mvic": 55,
        "range": [
          30,
          75
        ],
        "est": true,
        "src": [
          "P.campos2020",
          "P.coratella2020lr",
          "P.botton2013"
        ]
      },
      "deltAnt": {
        "mvic": 30,
        "range": [
          21,
          45
        ],
        "est": true,
        "src": [
          "P.campos2020",
          "P.coratella2020lr"
        ]
      },
      "deltPost": {
        "mvic": 30,
        "range": [
          24,
          40
        ],
        "est": true,
        "src": [
          "P.campos2020",
          "P.coratella2020lr"
        ]
      },
      "trapUpper": {
        "mvic": 40,
        "range": [
          20,
          60
        ],
        "est": true,
        "src": [
          "P.coratella2020lr"
        ]
      },
      "serratus": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      }
    },
    "rom": "O‘rta delta yelka 90° ga yaqinlashganda eng ko‘p ishlaydi (mexanik yuklama tepada eng katta).",
    "notes": "To‘rt yelka mashqi ichida o‘rta va orqa delta eng ko‘p shu mashqda ishlagan. Qo‘l neytral holatda bo‘lsa o‘rta delta eng faol."
  },
  "cable-lateral-raise": {
    "basis": "similar:lateral-raise",
    "load": "10RM",
    "metric": "mean",
    "muscles": {
      "deltLat": {
        "mvic": 55,
        "range": [
          30,
          75
        ],
        "est": true,
        "src": [
          "P.botton2013",
          "P.campos2020",
          "P.larsen2025"
        ]
      },
      "deltAnt": {
        "mvic": 30,
        "range": [
          20,
          45
        ],
        "est": true,
        "src": [
          "P.campos2020"
        ]
      },
      "deltPost": {
        "mvic": 30,
        "range": [
          20,
          40
        ],
        "est": true,
        "src": [
          "P.campos2020"
        ]
      },
      "trapUpper": {
        "mvic": 35,
        "range": [
          20,
          55
        ],
        "est": true,
        "src": [
          "P.coratella2020lr"
        ]
      },
      "serratus": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      }
    },
    "rom": "Kabel pastki holatda ham yuklama beradi, gantelda esa yuklama tepada eng katta.",
    "notes": "Kabel va gantel varianti EMG bo‘yicha farq qilmagan."
  },
  "pushdown": {
    "basis": "direct",
    "load": "30–70% 1RM",
    "metric": "mean",
    "muscles": {
      "tricepsLateral": {
        "mvic": 70,
        "range": [
          45,
          95
        ],
        "est": true,
        "src": [
          "P.boehler2011",
          "P.hussain2020"
        ]
      },
      "tricepsLong": {
        "mvic": 70,
        "range": [
          40,
          95
        ],
        "est": true,
        "src": [
          "P.kholinne2018",
          "P.boehler2011",
          "P.villalba2024"
        ]
      },
      "tricepsMedial": {
        "mvic": 60,
        "range": [
          35,
          90
        ],
        "est": true,
        "src": [
          "P.hussain2020",
          "P.kholinne2018"
        ]
      },
      "forearmFlexors": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true,
        "src": [
          "P.villalba2024"
        ]
      },
      "forearmExtensors": {
        "mvic": 15,
        "range": [
          5,
          30
        ],
        "est": true,
        "src": [
          "P.villalba2024"
        ]
      }
    },
    "rom": "Qo‘l tanaga yopishgan holatda tirsakni yozish uchala boshni ham ishlatadi.",
    "notes": "Ilmiy jurnaldagi %MVIC qiymatlari topilmadi — baho. Bir tadqiqotda uzun bosh yon tomondagi boshdan faolroq chiqqan."
  },
  "overhead-extension": {
    "basis": "direct",
    "load": "40% maks. – 70% 1RM",
    "metric": "mean",
    "muscles": {
      "tricepsLong": {
        "mvic": 70,
        "range": [
          40,
          95
        ],
        "est": true,
        "src": [
          "P.alves2018",
          "P.boehler2011"
        ]
      },
      "tricepsMedial": {
        "mvic": 70,
        "range": [
          40,
          95
        ],
        "est": true,
        "src": [
          "P.kholinne2018"
        ]
      },
      "tricepsLateral": {
        "mvic": 60,
        "range": [
          35,
          90
        ],
        "est": true,
        "src": [
          "P.alves2018",
          "P.boehler2011"
        ]
      }
    },
    "rom": "Faollik tirsak bukilgan (uzun bosh cho‘zilgan) boshlang‘ich va o‘rta qismida eng yuqori.",
    "notes": "Qo‘l bosh ustida bo‘lganda uzun bosh cho‘ziladi — uning o‘sishi uchun foydali holat."
  },
  "skull-crusher": {
    "basis": "direct",
    "load": "40% maks. – 70% 1RM",
    "metric": "mean",
    "muscles": {
      "tricepsLateral": {
        "mvic": 65,
        "range": [
          35,
          90
        ],
        "est": true,
        "src": [
          "P.alves2018",
          "P.boehler2011"
        ]
      },
      "tricepsMedial": {
        "mvic": 65,
        "range": [
          35,
          90
        ],
        "est": true,
        "src": [
          "P.kholinne2018"
        ]
      },
      "tricepsLong": {
        "mvic": 60,
        "range": [
          30,
          85
        ],
        "est": true,
        "src": [
          "P.alves2018",
          "P.boehler2011"
        ]
      }
    },
    "rom": "Tashqi bosh boshlang‘ich va o‘rta amplitudada eng faol.",
    "notes": "%MVIC qiymatlari baho."
  },
  "close-grip-bench": {
    "basis": "direct",
    "load": "60–80% 1RM",
    "metric": "mean",
    "muscles": {
      "tricepsLateral": {
        "mvic": 75,
        "range": [
          16,
          95
        ],
        "est": true,
        "src": [
          "P.muyor2023",
          "P.lehman2005",
          "P.barnett1995"
        ]
      },
      "tricepsLong": {
        "mvic": 65,
        "range": [
          30,
          90
        ],
        "est": true,
        "src": [
          "P.barnett1995"
        ]
      },
      "tricepsMedial": {
        "mvic": 60,
        "range": [
          15,
          85
        ],
        "est": true,
        "src": [
          "P.rodriguezridao2020"
        ]
      },
      "pecUpper": {
        "mvic": 65,
        "range": [
          25,
          95
        ],
        "est": true,
        "src": [
          "P.barnett1995",
          "P.arseneault2021"
        ]
      },
      "pecMid": {
        "mvic": 60,
        "range": [
          25,
          90
        ],
        "est": true,
        "src": [
          "P.lehman2005",
          "P.saeterbakken2021"
        ]
      },
      "pecLower": {
        "mvic": 50,
        "range": [
          20,
          85
        ],
        "est": true,
        "src": [
          "P.arseneault2021"
        ]
      },
      "deltAnt": {
        "mvic": 55,
        "range": [
          24,
          70
        ],
        "est": true,
        "src": [
          "P.saeterbakken2021",
          "P.muyor2023"
        ]
      }
    },
    "rom": "Ushlash torayganda triseps va ko‘krakning yuqori qismi ko‘proq, to‘sh qismi kamroq ishlaydi.",
    "notes": "Juda tor ushlash (yelka kengligidan tor) bilakka ortiqcha yuklama beradi."
  },
  "bench-dip": {
    "basis": "direct",
    "load": "o‘z vazni",
    "metric": "peak",
    "muscles": {
      "tricepsLateral": {
        "mvic": 65,
        "range": [
          45,
          90
        ],
        "est": true,
        "src": [
          "P.mckenzie2022"
        ]
      },
      "tricepsLong": {
        "mvic": 55,
        "range": [
          35,
          80
        ],
        "est": true,
        "src": [
          "P.mckenzie2022"
        ]
      },
      "tricepsMedial": {
        "mvic": 60,
        "range": [
          40,
          85
        ],
        "est": true,
        "src": [
          "P.mckenzie2022"
        ]
      },
      "deltAnt": {
        "mvic": 45,
        "range": [
          25,
          70
        ],
        "est": true,
        "src": [
          "P.mckenzie2022"
        ]
      },
      "pecMid": {
        "mvic": 30,
        "range": [
          15,
          50
        ],
        "est": true,
        "src": [
          "P.mckenzie2022"
        ]
      }
    },
    "rom": "Pastki nuqtada yelka barlardagidan ham ko‘proq orqaga cho‘ziladi.",
    "notes": "Triseps cho‘qqisi barlardagi ko‘tarilishning ~80% i — qiymatlar baho."
  },
  "face-pull": {
    "basis": "similar:reverse-fly",
    "load": "yengil–o‘rtacha",
    "metric": "mean",
    "muscles": {
      "deltPost": {
        "mvic": 70,
        "range": [
          45,
          88
        ],
        "est": true,
        "src": [
          "U.reinold2004",
          "U.fukunaga2022"
        ]
      },
      "infraspinatus": {
        "mvic": 50,
        "range": [
          23,
          62
        ],
        "est": true,
        "src": [
          "U.reinold2004",
          "U.fukunaga2022"
        ]
      },
      "trapMid": {
        "mvic": 55,
        "range": [
          35,
          75
        ],
        "est": true,
        "src": [
          "U.fukunaga2022"
        ]
      },
      "rhomboids": {
        "mvic": 45,
        "range": [
          25,
          65
        ],
        "est": true
      },
      "trapLower": {
        "mvic": 40,
        "range": [
          20,
          60
        ],
        "est": true,
        "src": [
          "U.fukunaga2022"
        ]
      },
      "deltLat": {
        "mvic": 40,
        "range": [
          25,
          87
        ],
        "est": true,
        "src": [
          "U.reinold2004"
        ]
      },
      "trapUpper": {
        "mvic": 30,
        "range": [
          15,
          50
        ],
        "est": true,
        "src": [
          "U.fukunaga2022"
        ]
      },
      "biceps": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      }
    },
    "rom": "Qo‘llar yuqoriga-orqaga tortilib, yelka tashqariga burilganda orqa delta, qirra osti mushagi va pastki trapetsiya ko‘proq ishlaydi.",
    "notes": "Arqonni yuzga tortish bo‘yicha EMG tadqiqot topilmadi — orqa ochish va rezinani cho‘zish mashqlari asosida baho."
  },
  "reverse-fly": {
    "basis": "direct",
    "load": "rezina, o‘rtacha kuch",
    "metric": "peak",
    "muscles": {
      "deltPost": {
        "mvic": 70,
        "range": [
          45,
          88
        ],
        "est": true,
        "src": [
          "U.fukunaga2022",
          "U.reinold2004",
          "U.schoenfeld2013"
        ]
      },
      "trapMid": {
        "mvic": 50,
        "range": [
          30,
          73
        ],
        "est": true,
        "src": [
          "U.fukunaga2022"
        ]
      },
      "rhomboids": {
        "mvic": 45,
        "range": [
          25,
          65
        ],
        "est": true
      },
      "deltLat": {
        "mvic": 40,
        "range": [
          20,
          87
        ],
        "est": true,
        "src": [
          "U.reinold2004",
          "U.schoenfeld2013"
        ]
      },
      "infraspinatus": {
        "mvic": 35,
        "range": [
          23,
          50
        ],
        "est": true,
        "src": [
          "U.fukunaga2022",
          "U.schoenfeld2013"
        ]
      },
      "trapLower": {
        "mvic": 35,
        "range": [
          15,
          60
        ],
        "est": true,
        "src": [
          "U.fukunaga2022"
        ]
      },
      "trapUpper": {
        "mvic": 35,
        "range": [
          15,
          60
        ],
        "est": true,
        "src": [
          "U.fukunaga2022"
        ]
      }
    },
    "rom": "Kaft yuqoriga qaraganda qirra osti va pastki trapetsiya, pastga qaraganda yuqori trapetsiya va orqa delta ko‘proq ishlaydi; diagonal yuqoriga tortish eng samarali.",
    "notes": "Orqa delta qiymatlari baho."
  },
  "barbell-row": {
    "basis": "direct",
    "load": "o‘rtacha–og‘ir",
    "metric": "peak",
    "muscles": {
      "trapMid": {
        "mvic": 60,
        "range": [
          40,
          80
        ],
        "est": true
      },
      "deltPost": {
        "mvic": 60,
        "range": [
          40,
          85
        ],
        "est": true
      },
      "erectors": {
        "mvic": 55,
        "range": [
          35,
          75
        ],
        "est": true,
        "src": [
          "U.fenwick2009"
        ]
      },
      "rhomboids": {
        "mvic": 55,
        "range": [
          35,
          75
        ],
        "est": true
      },
      "lats": {
        "mvic": 53,
        "range": [
          45,
          70
        ],
        "src": [
          "U.fenwick2009"
        ]
      },
      "biceps": {
        "mvic": 40,
        "range": [
          25,
          60
        ],
        "est": true
      },
      "trapLower": {
        "mvic": 40,
        "range": [
          25,
          60
        ],
        "est": true
      },
      "gluteMax": {
        "mvic": 19,
        "range": [
          15,
          25
        ],
        "src": [
          "U.fenwick2009"
        ]
      }
    },
    "rom": "Bel va dumba butun harakat davomida statik ushlab turadi — bel yuklamasi eng katta tortish turi.",
    "notes": "Keng orqa mushagi qiymati (53%) tadqiqot qisqacha bayonidan olingan; trapetsiya va romb qiymatlari baho."
  },
  "db-row": {
    "basis": "direct",
    "load": "o‘rtacha–og‘ir",
    "metric": "peak",
    "muscles": {
      "lats": {
        "mvic": 60,
        "range": [
          40,
          80
        ],
        "est": true
      },
      "trapMid": {
        "mvic": 60,
        "range": [
          45,
          80
        ],
        "est": true,
        "src": [
          "U.andersen2012"
        ]
      },
      "deltPost": {
        "mvic": 55,
        "range": [
          35,
          75
        ],
        "est": true
      },
      "trapLower": {
        "mvic": 55,
        "range": [
          35,
          75
        ],
        "est": true,
        "src": [
          "U.andersen2012"
        ]
      },
      "rhomboids": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true
      },
      "teresMajor": {
        "mvic": 45,
        "range": [
          30,
          65
        ],
        "est": true
      },
      "biceps": {
        "mvic": 40,
        "range": [
          25,
          55
        ],
        "est": true
      },
      "trapUpper": {
        "mvic": 35,
        "range": [
          20,
          60
        ],
        "est": true,
        "src": [
          "U.andersen2012",
          "U.andersen2008"
        ]
      }
    },
    "rom": "Bir qo‘lda tortishda o‘rta va pastki trapetsiya yuqori trapetsiyadan ancha faol.",
    "notes": "Qiymatlar baho; nisbiy farqlar tadqiqotdan."
  },
  "cable-row": {
    "basis": "direct",
    "load": "o‘rtacha",
    "metric": "mean",
    "muscles": {
      "lats": {
        "mvic": 55,
        "range": [
          35,
          75
        ],
        "est": true,
        "src": [
          "U.vasconcelos2023",
          "U.difonza2026"
        ]
      },
      "trapMid": {
        "mvic": 45,
        "range": [
          31,
          52
        ],
        "est": true,
        "src": [
          "U.vasconcelos2023"
        ]
      },
      "deltPost": {
        "mvic": 45,
        "range": [
          30,
          65
        ],
        "est": true,
        "src": [
          "U.vasconcelos2023"
        ]
      },
      "rhomboids": {
        "mvic": 45,
        "range": [
          30,
          60
        ],
        "est": true,
        "src": [
          "U.lehman2004"
        ]
      },
      "trapLower": {
        "mvic": 35,
        "range": [
          20,
          50
        ],
        "est": true
      },
      "biceps": {
        "mvic": 30,
        "range": [
          20,
          45
        ],
        "est": true
      },
      "trapUpper": {
        "mvic": 25,
        "range": [
          16,
          55
        ],
        "est": true,
        "src": [
          "U.vasconcelos2023"
        ]
      },
      "erectors": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      }
    },
    "rom": "Tirsaklar yon tomonga ochilsa trapetsiya va orqa delta, tanaga yopishtirilsa keng orqa mushagi ko‘proq ishlaydi.",
    "notes": "Kurakni ataylab qisish keng orqa mushagi faolligini oshirmagan."
  },
  "chest-supported-row": {
    "basis": "similar:barbell-row",
    "load": "o‘rtacha–og‘ir",
    "metric": "mean",
    "muscles": {
      "trapMid": {
        "mvic": 60,
        "range": [
          40,
          80
        ],
        "est": true
      },
      "deltPost": {
        "mvic": 60,
        "range": [
          40,
          85
        ],
        "est": true
      },
      "rhomboids": {
        "mvic": 55,
        "range": [
          35,
          75
        ],
        "est": true
      },
      "lats": {
        "mvic": 50,
        "range": [
          35,
          70
        ],
        "est": true,
        "src": [
          "U.fenwick2009"
        ]
      },
      "biceps": {
        "mvic": 40,
        "range": [
          25,
          55
        ],
        "est": true
      },
      "trapLower": {
        "mvic": 40,
        "range": [
          25,
          60
        ],
        "est": true
      },
      "trapUpper": {
        "mvic": 25,
        "range": [
          10,
          45
        ],
        "est": true
      }
    },
    "rom": "Ko‘krak tayanchda — bel va dumba deyarli ishlamaydi, butun ish yelka kamari va orqaga tushadi.",
    "notes": "Engashib tortish natijalaridan bel va dumbasiz baho."
  },
  "inverted-row": {
    "basis": "direct",
    "load": "o‘z vazni",
    "metric": "peak",
    "muscles": {
      "deltPost": {
        "mvic": 70,
        "range": [
          61,
          90
        ],
        "est": true,
        "src": [
          "U.youdas2016",
          "U.snarr2013"
        ]
      },
      "lats": {
        "mvic": 65,
        "range": [
          61,
          102
        ],
        "src": [
          "U.fenwick2009",
          "U.youdas2016",
          "U.snarr2013"
        ]
      },
      "trapLower": {
        "mvic": 65,
        "range": [
          61,
          80
        ],
        "est": true,
        "src": [
          "U.youdas2016"
        ]
      },
      "biceps": {
        "mvic": 65,
        "range": [
          61,
          85
        ],
        "est": true,
        "src": [
          "U.youdas2016",
          "U.snarr2013"
        ]
      },
      "trapMid": {
        "mvic": 60,
        "range": [
          41,
          77
        ],
        "est": true,
        "src": [
          "U.youdas2016",
          "U.snarr2013"
        ]
      },
      "trapUpper": {
        "mvic": 50,
        "range": [
          41,
          60
        ],
        "est": true,
        "src": [
          "U.youdas2016"
        ]
      },
      "erectors": {
        "mvic": 35,
        "range": [
          21,
          60
        ],
        "est": true,
        "src": [
          "U.youdas2016"
        ]
      },
      "rectusAbdominis": {
        "mvic": 30,
        "range": [
          21,
          40
        ],
        "est": true,
        "src": [
          "U.youdas2016"
        ]
      },
      "gluteMax": {
        "mvic": 19,
        "range": [
          15,
          25
        ],
        "src": [
          "U.fenwick2009"
        ]
      }
    },
    "rom": "Ko‘tarish fazasida keng orqa mushagi ~65% MVIC; uch xil tortish ichida keng orqa mushagi va orqa eng faol, bel yuklamasi esa eng kam.",
    "notes": "Ko‘pchilik qiymatlar tadqiqotdagi oraliqlar ichida baho."
  },
  "pull-up": {
    "basis": "direct",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "lats": {
        "mvic": 120,
        "range": [
          52,
          130
        ],
        "est": true,
        "src": [
          "U.youdas2010",
          "U.dickie2017"
        ]
      },
      "biceps": {
        "mvic": 80,
        "range": [
          78,
          96
        ],
        "est": true,
        "src": [
          "U.youdas2010",
          "U.dickie2017"
        ]
      },
      "infraspinatus": {
        "mvic": 75,
        "range": [
          71,
          79
        ],
        "est": true,
        "src": [
          "U.youdas2010"
        ]
      },
      "teresMajor": {
        "mvic": 70,
        "range": [
          50,
          100
        ],
        "est": true
      },
      "trapLower": {
        "mvic": 56,
        "range": [
          45,
          56
        ],
        "est": true,
        "src": [
          "U.youdas2010"
        ]
      },
      "forearmFlexors": {
        "mvic": 50,
        "range": [
          35,
          70
        ],
        "est": true
      },
      "pecLower": {
        "mvic": 44,
        "range": [
          44,
          57
        ],
        "est": true,
        "src": [
          "U.youdas2010"
        ]
      },
      "erectors": {
        "mvic": 40,
        "range": [
          39,
          41
        ],
        "est": true,
        "src": [
          "U.youdas2010"
        ]
      },
      "externalOblique": {
        "mvic": 33,
        "range": [
          31,
          35
        ],
        "est": true,
        "src": [
          "U.youdas2010"
        ]
      }
    },
    "rom": "Tortishni pastki trapetsiya va ko‘krak boshlaydi, tepada bitseps va keng orqa mushagi yakunlaydi.",
    "notes": "Keng orqa mushagi 100% dan oshadi — eng kuchli orqa mashqlaridan. Laboratoriyalar orasida farq katta (boshqa tadqiqotda ~55%)."
  },
  "chin-up": {
    "basis": "direct",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "lats": {
        "mvic": 117,
        "range": [
          52,
          130
        ],
        "src": [
          "U.youdas2010",
          "U.dickie2017"
        ]
      },
      "biceps": {
        "mvic": 96,
        "range": [
          78,
          96
        ],
        "est": true,
        "src": [
          "U.youdas2010",
          "U.dickie2017",
          "U.doma2013"
        ]
      },
      "infraspinatus": {
        "mvic": 75,
        "range": [
          71,
          79
        ],
        "est": true,
        "src": [
          "U.youdas2010"
        ]
      },
      "teresMajor": {
        "mvic": 65,
        "range": [
          45,
          95
        ],
        "est": true
      },
      "pecLower": {
        "mvic": 57,
        "range": [
          44,
          57
        ],
        "est": true,
        "src": [
          "U.youdas2010"
        ]
      },
      "trapLower": {
        "mvic": 45,
        "range": [
          45,
          56
        ],
        "est": true,
        "src": [
          "U.youdas2010"
        ]
      },
      "forearmFlexors": {
        "mvic": 45,
        "range": [
          30,
          65
        ],
        "est": true
      },
      "erectors": {
        "mvic": 40,
        "range": [
          39,
          41
        ],
        "est": true,
        "src": [
          "U.youdas2010",
          "U.doma2013"
        ]
      },
      "externalOblique": {
        "mvic": 33,
        "range": [
          31,
          35
        ],
        "est": true,
        "src": [
          "U.youdas2010"
        ]
      }
    },
    "rom": "Supinatsiya (kaft o‘ziga) ushlashda bitseps va ko‘krak turnikdagidan ko‘proq, pastki trapetsiya kamroq ishlaydi.",
    "notes": "Keng orqa mushagi 117 ± 46% MVIC."
  },
  "lat-pulldown": {
    "basis": "direct",
    "load": "70% 1RM",
    "metric": "mean",
    "muscles": {
      "lats": {
        "mvic": 67,
        "range": [
          55,
          80
        ],
        "src": [
          "U.lusk2010",
          "U.andersen2014",
          "U.difonza2026"
        ]
      },
      "teresMajor": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true
      },
      "biceps": {
        "mvic": 35,
        "range": [
          20,
          55
        ],
        "est": true,
        "src": [
          "U.lusk2010"
        ]
      },
      "trapMid": {
        "mvic": 35,
        "range": [
          20,
          55
        ],
        "est": true,
        "src": [
          "U.lusk2010"
        ]
      },
      "trapLower": {
        "mvic": 35,
        "range": [
          20,
          50
        ],
        "est": true
      },
      "deltPost": {
        "mvic": 35,
        "range": [
          20,
          55
        ],
        "est": true
      },
      "infraspinatus": {
        "mvic": 35,
        "range": [
          20,
          50
        ],
        "est": true,
        "src": [
          "U.andersen2014"
        ]
      },
      "pecLower": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true,
        "src": [
          "U.doma2013"
        ]
      }
    },
    "rom": "Old tomonga (ko‘krakka) tortish keng orqa mushagini eng barqaror faollashtiradi; ushlash kengligi deyarli farq qilmaydi.",
    "notes": "Keng va tor ushlash keng orqa mushagi, trapetsiya va bitseps bo‘yicha farq bermagan."
  },
  "db-shrug": {
    "basis": "direct",
    "load": "20–30 kg",
    "metric": "peak",
    "muscles": {
      "trapUpper": {
        "mvic": 102,
        "range": [
          91,
          113
        ],
        "src": [
          "U.andersen2008",
          "U.ekstrom2003"
        ]
      },
      "trapMid": {
        "mvic": 40,
        "range": [
          20,
          60
        ],
        "est": true,
        "src": [
          "U.pizzari2014"
        ]
      },
      "forearmFlexors": {
        "mvic": 40,
        "range": [
          25,
          60
        ],
        "est": true
      },
      "rhomboids": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      },
      "serratus": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true,
        "src": [
          "U.pizzari2014"
        ]
      },
      "trapLower": {
        "mvic": 15,
        "range": [
          5,
          30
        ],
        "est": true,
        "src": [
          "U.pizzari2014"
        ]
      }
    },
    "rom": "Qo‘llar biroz yon tomonga (30°) ochilgan holda yelka qisish yuqori va pastki trapetsiyani ko‘proq ishlatadi.",
    "notes": "Yuqori trapetsiya ~102% MVIC (tadqiqot bo‘yin og‘rig‘i bor ayollarda o‘tkazilgan)."
  },
  "barbell-curl": {
    "basis": "direct",
    "load": "65% 1RM",
    "metric": "mean",
    "muscles": {
      "biceps": {
        "mvic": 95,
        "range": [
          70,
          120
        ],
        "est": true,
        "src": [
          "U.marcolin2018",
          "U.parpa2025"
        ]
      },
      "brachialis": {
        "mvic": 75,
        "range": [
          50,
          95
        ],
        "est": true
      },
      "brachioradialis": {
        "mvic": 60,
        "range": [
          40,
          80
        ],
        "est": true,
        "src": [
          "U.marcolin2018"
        ]
      },
      "forearmFlexors": {
        "mvic": 35,
        "range": [
          20,
          50
        ],
        "est": true
      },
      "deltAnt": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true,
        "src": [
          "U.coratella2023"
        ]
      }
    },
    "rom": "Tik turib bukishda bitseps butun amplituda davomida yuqori ishlaydi; to‘g‘ri grifda yelka-bilak mushagi gantelga nisbatan faolroq.",
    "notes": "To‘g‘ri va EZ-grif deyarli farq qilmaydi, ikkalasi ham gantel bilan bukishdan yuqori."
  },
  "db-curl": {
    "basis": "direct",
    "load": "80% 1RM",
    "metric": "mean",
    "muscles": {
      "biceps": {
        "mvic": 112,
        "range": [
          85,
          138
        ],
        "src": [
          "U.parpa2025",
          "U.marcolin2018"
        ]
      },
      "brachialis": {
        "mvic": 75,
        "range": [
          50,
          95
        ],
        "est": true
      },
      "brachioradialis": {
        "mvic": 50,
        "range": [
          35,
          75
        ],
        "est": true,
        "src": [
          "U.marcolin2018"
        ]
      },
      "forearmFlexors": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true
      },
      "deltAnt": {
        "mvic": 15,
        "range": [
          5,
          30
        ],
        "est": true,
        "src": [
          "U.coratella2023"
        ]
      }
    },
    "rom": "Tik turib gantel bilan bukishda bitseps butun amplituda davomida kuchli ishlaydi.",
    "notes": "Bitseps 111 ± 27% MVIC."
  },
  "hammer-curl": {
    "basis": "direct",
    "load": "8RM",
    "metric": "mean",
    "muscles": {
      "biceps": {
        "mvic": 80,
        "range": [
          60,
          100
        ],
        "est": true,
        "src": [
          "U.coratella2023"
        ]
      },
      "brachialis": {
        "mvic": 75,
        "range": [
          55,
          95
        ],
        "est": true
      },
      "brachioradialis": {
        "mvic": 60,
        "range": [
          40,
          80
        ],
        "est": true,
        "src": [
          "U.coratella2023"
        ]
      },
      "forearmExtensors": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true
      },
      "deltAnt": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true,
        "src": [
          "U.coratella2023"
        ]
      },
      "forearmFlexors": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      }
    },
    "rom": "Neytral ushlashda bitseps ~12% kam ishlaydi; yelka-bilak mushagi esa (keng tarqalgan fikrdan farqli) ko‘paymagan.",
    "notes": "Mutlaq qiymatlar gantel bilan bukishdan nisbiy farq bo‘yicha baho."
  },
  "incline-curl": {
    "basis": "direct",
    "load": "o‘rtacha",
    "metric": "mean",
    "muscles": {
      "biceps": {
        "mvic": 90,
        "range": [
          65,
          115
        ],
        "est": true,
        "src": [
          "U.oliveira2009",
          "U.parpa2025"
        ]
      },
      "brachialis": {
        "mvic": 70,
        "range": [
          50,
          90
        ],
        "est": true
      },
      "brachioradialis": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true
      },
      "forearmFlexors": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true
      }
    },
    "rom": "Qiya skameykada yelka orqada — bitseps uzun boshi cho‘ziladi va butun amplituda davomida ishlaydi (Skott skameykasida faqat qisqa oraliqda).",
    "notes": "Qiymatlar baho."
  },
  "cable-curl": {
    "basis": "similar:Bayes usulidagi (orqadan) kabel bilan bukish",
    "load": "80% 1RM",
    "metric": "mean",
    "muscles": {
      "biceps": {
        "mvic": 93,
        "range": [
          78,
          109
        ],
        "est": true,
        "src": [
          "U.parpa2025"
        ]
      },
      "brachialis": {
        "mvic": 70,
        "range": [
          50,
          90
        ],
        "est": true
      },
      "brachioradialis": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true
      },
      "forearmFlexors": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true
      },
      "deltAnt": {
        "mvic": 15,
        "range": [
          5,
          30
        ],
        "est": true
      }
    },
    "rom": "Kabel butun amplituda bo‘ylab yuklamani tekisroq beradi.",
    "notes": "Kabel bilan bukishda bitseps 93% — gantel bilan bukishdagidan (111%) kam."
  },
  "plank": {
    "basis": "direct",
    "load": "o‘z vazni, ~30 s",
    "metric": "mean",
    "muscles": {
      "externalOblique": {
        "mvic": 40,
        "range": [
          20,
          60
        ],
        "est": true,
        "src": [
          "U.schoenfeld2014",
          "U.snarr2014"
        ]
      },
      "rectusAbdominis": {
        "mvic": 35,
        "range": [
          20,
          55
        ],
        "est": true,
        "src": [
          "U.schoenfeld2014",
          "U.calatayud2017",
          "U.oliva2020"
        ]
      },
      "deltAnt": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true,
        "src": [
          "U.saglam2025"
        ]
      },
      "serratus": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      },
      "rectusFemoris": {
        "mvic": 15,
        "range": [
          5,
          25
        ],
        "est": true
      }
    },
    "rom": "Izometrik. Tos orqaga qiyshaytirilib, tirsaklar uzoqroq qo‘yilsa qorin mushaklari sezilarli ko‘proq ishlaydi.",
    "notes": "Oddiy plankada qorin faolligi o‘rtacha — kuchliroq yuklama uchun uzun-richagli variantni bajaring."
  },
  "hanging-leg-raise": {
    "basis": "direct",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "rectusAbdominis": {
        "mvic": 80,
        "range": [
          50,
          130
        ],
        "est": true,
        "src": [
          "U.escamilla2006",
          "U.axler1997"
        ]
      },
      "externalOblique": {
        "mvic": 60,
        "range": [
          40,
          88
        ],
        "est": true,
        "src": [
          "U.escamilla2006",
          "U.axler1997"
        ]
      },
      "iliopsoas": {
        "mvic": 60,
        "range": [
          40,
          90
        ],
        "est": true,
        "src": [
          "U.axler1997"
        ]
      },
      "forearmFlexors": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true
      },
      "rectusFemoris": {
        "mvic": 40,
        "range": [
          20,
          60
        ],
        "est": true,
        "src": [
          "U.escamilla2006"
        ]
      },
      "lats": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true,
        "src": [
          "U.escamilla2006"
        ]
      }
    },
    "rom": "Boshida asosan son bukuvchilar ishlaydi; tepada tos o‘zingizga burilganda qorin mushaklari eng ko‘p ishlaydi.",
    "notes": "Qorin mashqlari ichida eng kuchlilaridan biri; qiymatlar baho."
  },
  "cable-crunch": {
    "basis": "similar:trenajyorda qorin bukish",
    "load": "10RM",
    "metric": "peak",
    "muscles": {
      "rectusAbdominis": {
        "mvic": 84,
        "range": [
          84,
          104
        ],
        "est": true,
        "src": [
          "U.sundstrup2012"
        ]
      },
      "externalOblique": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true,
        "src": [
          "U.sundstrup2012"
        ]
      },
      "rectusFemoris": {
        "mvic": 15,
        "range": [
          5,
          30
        ],
        "est": true,
        "src": [
          "U.sundstrup2012"
        ]
      },
      "lats": {
        "mvic": 15,
        "range": [
          5,
          25
        ],
        "est": true
      }
    },
    "rom": "Yuklama butun harakat davomida qorin to‘g‘ri mushagida.",
    "notes": "Trenajyorda qorin bukish bo‘yicha: to‘g‘ri mushak 84% MVIC."
  },
  "crunch": {
    "basis": "direct",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "rectusAbdominis": {
        "mvic": 55,
        "range": [
          30,
          80
        ],
        "est": true,
        "src": [
          "U.youdas2008",
          "U.escamilla2006"
        ]
      },
      "externalOblique": {
        "mvic": 30,
        "range": [
          15,
          50
        ],
        "est": true,
        "src": [
          "U.youdas2008",
          "U.escamilla2006"
        ]
      }
    },
    "rom": "Faqat yelka kuraklari poldan ko‘tariladi — son bukuvchilar deyarli ishlamaydi.",
    "notes": "Qiymatlar baho."
  },
  "dead-bug": {
    "basis": "direct",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "externalOblique": {
        "mvic": 30,
        "range": [
          10,
          55
        ],
        "est": true,
        "src": [
          "U.yun2017"
        ]
      },
      "rectusAbdominis": {
        "mvic": 25,
        "range": [
          10,
          50
        ],
        "est": true,
        "src": [
          "U.yun2017"
        ]
      },
      "iliopsoas": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      },
      "rectusFemoris": {
        "mvic": 15,
        "range": [
          5,
          30
        ],
        "est": true
      }
    },
    "rom": "Tezroq bajarilganda va qo‘l-oyoq birga harakatlantirilganda qorin mushaklari faolligi oshadi.",
    "notes": "Qiymatlar baho."
  },
  "sumo-squat": {
    "basis": "similar:goblet-squat",
    "load": "bitta gantel yoki girya oyoqlar orasida",
    "metric": "mean",
    "muscles": {
      "vastusLateralis": {
        "mvic": 60,
        "range": [
          35,
          90
        ],
        "est": true,
        "src": [
          "H.mccaw1999"
        ]
      },
      "vastusMedialis": {
        "mvic": 60,
        "range": [
          35,
          90
        ],
        "est": true
      },
      "gluteMax": {
        "mvic": 40,
        "range": [
          20,
          60
        ],
        "est": true,
        "src": [
          "H.mccaw1999",
          "H.paoli2009"
        ]
      },
      "adductors": {
        "mvic": 40,
        "range": [
          20,
          65
        ],
        "est": true,
        "src": [
          "H.mccaw1999"
        ]
      },
      "erectors": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      },
      "rectusFemoris": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      }
    },
    "rom": "Son oldi va dumba pastki nuqtadan ko‘tarilishda eng faol. Keng turish katta dumba va son ichki mushaklari faolligini oshiradi (McCaw 1999; Paoli 2009).",
    "notes": "Gantel bilan sumo o‘tirish bo‘yicha EMG tadqiqot topilmadi: qiymatlar kubok o‘tirishdan olingan, dumba va son ichki mushaklari keng turish tadqiqotlariga (shtanga bilan) ko‘ra oshirilgan."
  },
  "reverse-lunge": {
    "basis": "similar:bw-split-squat",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "vastusLateralis": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true
      },
      "vastusMedialis": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true
      },
      "gluteMax": {
        "mvic": 35,
        "range": [
          15,
          55
        ],
        "est": true,
        "src": [
          "H.ekstrom2007"
        ]
      },
      "gluteMed": {
        "mvic": 30,
        "range": [
          15,
          50
        ],
        "est": true,
        "src": [
          "H.distefano2009"
        ]
      },
      "bicepsFemoris": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      },
      "adductors": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      }
    },
    "rom": "Old oyoqda son oldi va katta dumba pastki nuqtada eng faol; gavdani biroz oldinga engashtirish dumbaga ko‘proq yuk beradi.",
    "notes": "Qiymatlar baho: o‘z vazni bilan split-o‘tirishdan olingan. Hamla turlarida dumba o‘rta mushagi ~48% MVIC gacha (DiStefano 2009)."
  },
  "curtsy-lunge": {
    "basis": "similar:reverse-lunge",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "vastusLateralis": {
        "mvic": 45,
        "range": [
          25,
          65
        ],
        "est": true
      },
      "vastusMedialis": {
        "mvic": 45,
        "range": [
          25,
          65
        ],
        "est": true
      },
      "gluteMed": {
        "mvic": 38,
        "range": [
          20,
          60
        ],
        "est": true,
        "src": [
          "H.distefano2009"
        ]
      },
      "gluteMax": {
        "mvic": 32,
        "range": [
          15,
          50
        ],
        "est": true
      },
      "adductors": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      },
      "bicepsFemoris": {
        "mvic": 15,
        "range": [
          8,
          30
        ],
        "est": true
      }
    },
    "rom": "Kesishgan turishda old oyoqdagi dumba o‘rta mushagi tizza va tosning ichkariga qulashini ushlab turadi.",
    "notes": "Reverans hamla bo‘yicha EMG tadqiqot topilmadi — qiymatlar orqaga hamladan baho, dumba o‘rta mushagi biroz oshirilgan."
  },
  "glute-kickback": {
    "basis": "similar:bird-dog",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "gluteMax": {
        "mvic": 55,
        "range": [
          35,
          75
        ],
        "est": true,
        "src": [
          "H.ekstrom2007",
          "H.selkowitz2013"
        ]
      },
      "gluteMed": {
        "mvic": 35,
        "range": [
          20,
          50
        ],
        "est": true,
        "src": [
          "H.ekstrom2007"
        ]
      },
      "bicepsFemoris": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true
      },
      "erectors": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true
      },
      "medialHamstrings": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      }
    },
    "rom": "Katta dumba son gavda bilan bir chiziqqa kelganda eng faol; undan baland ko‘tarish ishni belga o‘tkazadi.",
    "notes": "To‘rt oyoqlab qo‘l va oyoq ko‘tarishda katta dumba ~56%, o‘rta dumba ~42% MVIC (Ekstrom 2007). Tizza bukik bo‘lgani uchun son orqasi kamroq ishlaydi. Qiymatlar baho."
  },
  "fire-hydrant": {
    "basis": "similar:clamshell",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "gluteMed": {
        "mvic": 45,
        "range": [
          25,
          70
        ],
        "est": true,
        "src": [
          "H.distefano2009",
          "H.boren2011"
        ]
      },
      "gluteMax": {
        "mvic": 35,
        "range": [
          20,
          55
        ],
        "est": true,
        "src": [
          "H.distefano2009"
        ]
      },
      "externalOblique": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      },
      "erectors": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      }
    },
    "rom": "Faollik ko‘tarishning yuqori qismida eng katta; tana mushaklari tosning qiyshayishiga qarshi ishlaydi.",
    "notes": "«Gidrant» bo‘yicha EMG tadqiqot topilmadi. Qiymatlar «chig‘anoq» (o‘rta dumba 38–40%) va yonboshlab oyoq ko‘tarish (81%) oralig‘ida baho (DiStefano 2009)."
  },
  "clamshell": {
    "basis": "direct",
    "load": "o‘z vazni, sonlar 30° yoki 60° bukik",
    "metric": "mean",
    "muscles": {
      "gluteMed": {
        "mvic": 40,
        "range": [
          38,
          40
        ],
        "src": [
          "H.distefano2009",
          "H.boren2011"
        ]
      },
      "gluteMax": {
        "mvic": 34,
        "range": [
          34,
          39
        ],
        "src": [
          "H.distefano2009"
        ]
      }
    },
    "rom": "Sonlar 30° yoki 60° bukik bo‘lishi deyarli farq qilmagan: o‘rta dumba 40 va 38%, katta dumba 34 va 39% MVIC.",
    "notes": "Dumba mushaklarini son fassiyasini taranglovchi mushakka (TFL) nisbatan eng ko‘p ishlatgan mashq (Selkowitz 2013). Qiyinroq variantlarda o‘rta dumba ~77% MVIC gacha (Boren 2011)."
  },
  "side-leg-raise": {
    "basis": "direct",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "gluteMed": {
        "mvic": 81,
        "range": [
          40,
          100
        ],
        "src": [
          "H.distefano2009",
          "H.ekstrom2007"
        ]
      },
      "gluteMax": {
        "mvic": 39,
        "range": [
          20,
          45
        ],
        "src": [
          "H.distefano2009"
        ]
      }
    },
    "rom": "Ko‘tarishning yuqori qismida eng faol. Oyoq oldinga ketsa, ishni son bukuvchilari va TFL oladi.",
    "notes": "DiStefano 2009 da o‘rta dumba uchun 12 mashq ichida eng yuqori natija (81 ± 42% MVIC), katta dumba 39%. Boshqa tadqiqotda (Ekstrom 2007) ancha past qiymat olingan — oraliq keng."
  },
  "banded-lateral-walk": {
    "basis": "direct",
    "load": "rezina lenta, o‘z vazni",
    "metric": "mean",
    "muscles": {
      "gluteMed": {
        "mvic": 61,
        "range": [
          40,
          95
        ],
        "src": [
          "H.distefano2009",
          "H.berry2015",
          "H.cambridge2012"
        ]
      },
      "gluteMax": {
        "mvic": 27,
        "range": [
          15,
          45
        ],
        "src": [
          "H.distefano2009",
          "H.berry2015"
        ]
      },
      "vastusLateralis": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      }
    },
    "rom": "Yarim o‘tirish holatida yurish dumba mushaklarini tik turishdan ko‘ra ko‘proq ishlatgan (Berry 2015). Lenta tizzadan to‘piqqa, so‘ng oyoq kaftiga tushirilgani sari faollik oshgan (Cambridge 2012).",
    "notes": "O‘rta dumba 61 ± 34% MVIC — eng yuqorilardan, katta dumba esa past (27%) (DiStefano 2009). Son oldi qiymati baho."
  },
  "single-leg-bridge": {
    "basis": "direct",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "gluteMed": {
        "mvic": 47,
        "range": [
          47,
          57
        ],
        "src": [
          "H.ekstrom2007"
        ]
      },
      "gluteMax": {
        "mvic": 40,
        "range": [
          40,
          51
        ],
        "src": [
          "H.ekstrom2007",
          "H.selkowitz2013"
        ]
      },
      "erectors": {
        "mvic": 35,
        "range": [
          20,
          50
        ],
        "est": true,
        "src": [
          "H.ekstrom2007"
        ]
      },
      "bicepsFemoris": {
        "mvic": 30,
        "range": [
          15,
          50
        ],
        "est": true
      },
      "medialHamstrings": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      }
    },
    "rom": "Dumba tepada eng faol; tosni bir oyoqda tekis ushlash o‘rta dumbani ham ishlatadi.",
    "notes": "O‘rta dumba ~47%, katta dumba ~40% MVIC (Ekstrom 2007); boshqa tadqiqotlarda 47–57% va 40–51%. Bel va son orqasi qiymatlari baho."
  },
  "wall-sit": {
    "basis": "similar:bw-squat",
    "load": "o‘z vazni, 30–60 soniya",
    "metric": "mean",
    "muscles": {
      "vastusLateralis": {
        "mvic": 45,
        "range": [
          25,
          65
        ],
        "est": true
      },
      "vastusMedialis": {
        "mvic": 45,
        "range": [
          25,
          65
        ],
        "est": true
      },
      "rectusFemoris": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      },
      "gluteMax": {
        "mvic": 12,
        "range": [
          5,
          25
        ],
        "est": true
      },
      "bicepsFemoris": {
        "mvic": 8,
        "range": [
          3,
          15
        ],
        "est": true
      }
    },
    "rom": "Izometrik. Tizza qanchalik ko‘p bukilsa, son oldiga yuk shunchalik katta: 90° da ushlash 45–60° dan qiyinroq.",
    "notes": "Devorga suyanib o‘tirish bo‘yicha EMG ma’lumot topilmadi — o‘z vazni bilan o‘tirishning pastki nuqtasidan baho. Orqa devorga tiralgani uchun dumba va bel kam ishlaydi."
  },
  "knee-push-up": {
    "basis": "similar:push-up",
    "load": "o‘z vazni, tizzada",
    "metric": "peak",
    "muscles": {
      "pecMid": {
        "mvic": 58,
        "range": [
          40,
          80
        ],
        "est": true,
        "src": [
          "H.youdas2010",
          "H.suprak2011"
        ]
      },
      "serratus": {
        "mvic": 55,
        "range": [
          40,
          70
        ],
        "est": true,
        "src": [
          "H.youdas2010"
        ]
      },
      "tricepsLateral": {
        "mvic": 55,
        "range": [
          30,
          80
        ],
        "est": true,
        "src": [
          "H.youdas2010"
        ]
      },
      "deltAnt": {
        "mvic": 45,
        "range": [
          30,
          60
        ],
        "est": true
      },
      "rectusAbdominis": {
        "mvic": 12,
        "range": [
          5,
          25
        ],
        "est": true
      }
    },
    "rom": "Ko‘krak va triseps pastki nuqtada va itarish boshida eng faol.",
    "notes": "Cho‘qqi qiymatlar. Tizzada otjimaniyada qo‘llarga tana vaznining ~54–62% i tushadi, oddiy otjimaniyada ~69–75% (Suprak 2011) — qiymatlar shunga ko‘ra kamaytirilgan."
  },
  "superman": {
    "basis": "similar:back-extension",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "erectors": {
        "mvic": 45,
        "range": [
          25,
          70
        ],
        "est": true,
        "src": [
          "H.callaghan1998"
        ]
      },
      "gluteMax": {
        "mvic": 30,
        "range": [
          15,
          50
        ],
        "est": true
      },
      "trapMid": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      },
      "bicepsFemoris": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      }
    },
    "rom": "Tepada ushlab turishda eng faol. Qorinda yotib gavda va oyoqlarni ko‘tarish bel mushaklarini eng ko‘p ishlatgan, lekin umurtqaga yuklama ham eng katta bo‘lgan (Callaghan 1998).",
    "notes": "Qiymatlar baho: 45° giperekstenziyadan kamaytirilgan."
  },
  "bird-dog": {
    "basis": "direct",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "gluteMax": {
        "mvic": 56,
        "range": [
          40,
          70
        ],
        "src": [
          "H.ekstrom2007"
        ]
      },
      "gluteMed": {
        "mvic": 42,
        "range": [
          25,
          55
        ],
        "src": [
          "H.ekstrom2007"
        ]
      },
      "erectors": {
        "mvic": 40,
        "range": [
          25,
          55
        ],
        "est": true,
        "src": [
          "H.ekstrom2007",
          "H.callaghan1998"
        ]
      },
      "deltAnt": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      },
      "externalOblique": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      }
    },
    "rom": "Qo‘l va qarama-qarshi oyoq to‘liq cho‘zilganda eng faol. Umurtqaga yuklama qorinda yotib ko‘tarilishdan ancha kam (Callaghan 1998).",
    "notes": "Katta dumba ~56%, o‘rta dumba ~42% MVIC (Ekstrom 2007). Bel, yelka va qiyshiq mushak qiymatlari baho."
  },
  "side-plank": {
    "basis": "direct",
    "load": "o‘z vazni, tirsakda",
    "metric": "mean",
    "muscles": {
      "gluteMed": {
        "mvic": 74,
        "range": [
          69,
          89
        ],
        "src": [
          "H.ekstrom2007",
          "H.youdas2014"
        ]
      },
      "externalOblique": {
        "mvic": 69,
        "range": [
          45,
          90
        ],
        "est": true,
        "src": [
          "H.ekstrom2007",
          "H.youdas2014"
        ]
      },
      "rectusAbdominis": {
        "mvic": 35,
        "range": [
          20,
          50
        ],
        "est": true,
        "src": [
          "H.youdas2014"
        ]
      },
      "erectors": {
        "mvic": 35,
        "range": [
          20,
          50
        ],
        "est": true,
        "src": [
          "H.youdas2014"
        ]
      },
      "gluteMax": {
        "mvic": 20,
        "range": [
          10,
          30
        ],
        "est": true,
        "src": [
          "H.ekstrom2007"
        ]
      }
    },
    "rom": "Izometrik. Ustki oyoqni ko‘tarish yoki gavdani burish qiyinlashtiradi.",
    "notes": "9 mashq ichida o‘rta dumba uchun eng yuqori (~74% MVIC), qiyshiq mushaklar ham yuqori, katta dumba past (Ekstrom 2007). Ustki oyoq yonga ko‘tarilsa o‘rta dumba ~89–103% gacha (Boren 2011). Qiyshiq va to‘g‘ri qorin, bel qiymatlari baho."
  },
  "reverse-crunch": {
    "basis": "similar:crunch",
    "load": "o‘z vazni, polda",
    "metric": "mean",
    "muscles": {
      "rectusAbdominis": {
        "mvic": 50,
        "range": [
          30,
          80
        ],
        "est": true,
        "src": [
          "H.escamilla2006"
        ]
      },
      "externalOblique": {
        "mvic": 35,
        "range": [
          20,
          60
        ],
        "est": true,
        "src": [
          "H.escamilla2006"
        ]
      },
      "rectusFemoris": {
        "mvic": 20,
        "range": [
          10,
          40
        ],
        "est": true,
        "src": [
          "H.escamilla2006"
        ]
      },
      "iliopsoas": {
        "mvic": 20,
        "range": [
          10,
          40
        ],
        "est": true
      }
    },
    "rom": "Tos poldan uzilayotganda qorin eng faol; oyoqlarni silkitish ishni son bukuvchilariga o‘tkazadi.",
    "notes": "Qiya (30°) taxtada teskari qisqarish qorin mushaklarini eng samarali ishlatgan mashqlardan (Escamilla 2006). Polda bajarish yengilroq — qiymatlar baho."
  },
  "bicycle-crunch": {
    "basis": "similar:crunch",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "rectusAbdominis": {
        "mvic": 55,
        "range": [
          30,
          80
        ],
        "est": true
      },
      "externalOblique": {
        "mvic": 50,
        "range": [
          30,
          80
        ],
        "est": true
      },
      "iliopsoas": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      },
      "rectusFemoris": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      }
    },
    "rom": "Qiyshiq mushaklar har burilish oxirida eng faol; cho‘zilgan oyoq pastroq bo‘lsa — qiyinroq.",
    "notes": "Ilmiy EMG tadqiqot topilmadi — qisqarish natijalaridan baho, burilish uchun qiyshiq mushaklar oshirilgan."
  },
  "mountain-climber": {
    "basis": "similar:plank",
    "load": "o‘z vazni, 20–40 soniya",
    "metric": "mean",
    "muscles": {
      "rectusAbdominis": {
        "mvic": 40,
        "range": [
          20,
          65
        ],
        "est": true
      },
      "externalOblique": {
        "mvic": 40,
        "range": [
          20,
          65
        ],
        "est": true
      },
      "iliopsoas": {
        "mvic": 30,
        "range": [
          15,
          50
        ],
        "est": true
      },
      "rectusFemoris": {
        "mvic": 30,
        "range": [
          15,
          50
        ],
        "est": true
      },
      "deltAnt": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true
      }
    },
    "rom": "Tana butun set davomida planka holatini ushlaydi; har tizza tortilishi son bukuvchilarini qo‘shadi.",
    "notes": "EMG ma’lumot topilmadi — planka natijalaridan baho; tezlik qiymatlarni sezilarli o‘zgartiradi."
  },
  "band-row": {
    "basis": "similar:cable-row",
    "load": "rezina lenta, o‘rtacha kuch",
    "metric": "mean",
    "muscles": {
      "lats": {
        "mvic": 45,
        "range": [
          25,
          65
        ],
        "est": true,
        "src": [
          "H.andersen2010"
        ]
      },
      "trapMid": {
        "mvic": 40,
        "range": [
          25,
          55
        ],
        "est": true,
        "src": [
          "H.andersen2010"
        ]
      },
      "rhomboids": {
        "mvic": 40,
        "range": [
          25,
          55
        ],
        "est": true
      },
      "deltPost": {
        "mvic": 40,
        "range": [
          25,
          60
        ],
        "est": true
      },
      "biceps": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true
      },
      "erectors": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      }
    },
    "rom": "Lenta cho‘zilgan sari qarshilik oshadi — tortish oxirida (tirsaklar orqada) eng og‘ir.",
    "notes": "Blokda tortishdan kamaytirilgan baho. Bir xil nisbiy yuklamada rezina va gantel mushaklarni bir xil darajada ishlatgan (Andersen 2010)."
  },
  "ball-leg-curl": {
    "basis": "similar:leg-curl",
    "load": "o‘z vazni, fitbol",
    "metric": "mean",
    "muscles": {
      "medialHamstrings": {
        "mvic": 60,
        "range": [
          35,
          85
        ],
        "est": true
      },
      "bicepsFemoris": {
        "mvic": 55,
        "range": [
          35,
          80
        ],
        "est": true
      },
      "gluteMax": {
        "mvic": 30,
        "range": [
          15,
          50
        ],
        "est": true
      },
      "gastrocnemius": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      },
      "erectors": {
        "mvic": 20,
        "range": [
          10,
          35
        ],
        "est": true
      }
    },
    "rom": "Son orqasi tos yuqorida turgan holda tizza bukilganda eng faol; dumba va bel tosni ushlab turadi.",
    "notes": "Fitbolda oyoq bukish bo‘yicha EMG ma’lumot topilmadi — trenajyorda oyoq bukishdan kamaytirilgan baho."
  },
  "hip-abduction": {
    "basis": "similar:yonboshlab yotib sonni ochish",
    "load": "10–15RM (baho)",
    "metric": "mean",
    "muscles": {
      "gluteMed": {
        "mvic": 60,
        "range": [
          40,
          85
        ],
        "est": true,
        "src": [
          "M.distefano2009",
          "M.fujisawa2014"
        ]
      },
      "gluteMax": {
        "mvic": 50,
        "range": [
          30,
          85
        ],
        "est": true,
        "src": [
          "M.fujisawa2014",
          "M.distefano2009"
        ]
      }
    },
    "rom": "Dumbaning o‘rta mushagi eng keng ochilgan holatda eng faol. O‘tirganda (son bo‘g‘imi ~80° bukik) dumba katta mushagi tik holatdagidan ko‘proq, son fassiyasini taranglovchi mushak esa kamroq ishlaydi; dumbaning o‘rta mushagi faolligi o‘zgarmaydi.",
    "notes": "Trenajyorning o‘zi bo‘yicha chop etilgan EMG tadqiqot topilmadi. Yonboshlab yotib sonni ochishda dumbaning o‘rta mushagi ~81%, katta mushagi ~39% MVIC; qiymatlar o‘rtacha og‘ir set uchun baho."
  },
  "hip-adduction": {
    "basis": "similar:son yaqinlashtiruvchi og‘ir mashqlar (Kopengagen planka, rezina bilan)",
    "load": "10–15RM (baho)",
    "metric": "peak",
    "muscles": {
      "adductors": {
        "mvic": 70,
        "range": [
          45,
          100
        ],
        "est": true,
        "src": [
          "M.serner2014"
        ]
      },
      "medialHamstrings": {
        "mvic": 15,
        "range": [
          5,
          30
        ],
        "est": true
      }
    },
    "rom": "Yostiqlar yaqinlashganda son ichki mushaklari eng faol; keng boshlang‘ich holatda ular eng ko‘p cho‘ziladi.",
    "notes": "Futbolchilarda sakkizta son yaqinlashtirish mashqida uzun yaqinlashtiruvchi mushak faolligi 14% dan 108% gacha bo‘lgan. Trenajyor uchun qiymat — baho."
  },
  "cable-kickback": {
    "basis": "similar:to‘rt oyoqda turib sonni orqaga uzatish",
    "load": "yengil–o‘rtacha (baho)",
    "metric": "mean",
    "muscles": {
      "gluteMax": {
        "mvic": 55,
        "range": [
          30,
          85
        ],
        "est": true,
        "src": [
          "M.selkowitz2013"
        ]
      },
      "bicepsFemoris": {
        "mvic": 40,
        "range": [
          20,
          60
        ],
        "est": true
      },
      "medialHamstrings": {
        "mvic": 35,
        "range": [
          20,
          55
        ],
        "est": true
      },
      "gluteMed": {
        "mvic": 30,
        "range": [
          15,
          50
        ],
        "est": true,
        "src": [
          "M.selkowitz2013"
        ]
      },
      "erectors": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      }
    },
    "rom": "Dumba katta mushagi oyoq gavda chizig‘iga yetganda eng faol; tayanch oyoqda dumbaning o‘rta mushagi tosni ushlab turadi.",
    "notes": "Tik turib blokda bajarish bo‘yicha EMG tadqiqot topilmadi — to‘rt oyoqda sonni orqaga uzatish natijalari asosida baho. U mashqda dumba mushaklari son fassiyasini taranglovchi mushakdan ancha ko‘p ishlagan."
  },
  "cable-pull-through": {
    "basis": "similar:rdl",
    "load": "o‘rtacha (baho)",
    "metric": "mean",
    "muscles": {
      "gluteMax": {
        "mvic": 60,
        "range": [
          35,
          85
        ],
        "est": true
      },
      "medialHamstrings": {
        "mvic": 55,
        "range": [
          35,
          80
        ],
        "est": true,
        "src": [
          "M.zebis2013"
        ]
      },
      "bicepsFemoris": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true,
        "src": [
          "M.zebis2013"
        ]
      },
      "erectors": {
        "mvic": 35,
        "range": [
          20,
          55
        ],
        "est": true
      },
      "forearmFlexors": {
        "mvic": 25,
        "range": [
          10,
          40
        ],
        "est": true
      }
    },
    "rom": "Rumincha o‘lik tortishdan farqi: kabel orqaga tortgani uchun yuklama tik turgan holatda ham saqlanadi — dumba tepada ham ishlashda davom etadi (biomexanik xulosa).",
    "notes": "Bu mashq bo‘yicha EMG tadqiqot topilmadi — rumincha o‘lik tortish natijalari yengilroq vazn uchun kamaytirilgan; bel mushaklari yuklamasi kamroq deb baholangan."
  },
  "seated-calf-raise": {
    "basis": "similar:calf-raise",
    "load": "10–15RM (baho)",
    "metric": "mean",
    "muscles": {
      "soleus": {
        "mvic": 60,
        "range": [
          30,
          85
        ],
        "est": true,
        "src": [
          "M.signorile2002",
          "M.heberlosier2012",
          "M.kinoshita2023"
        ]
      },
      "gastrocnemius": {
        "mvic": 35,
        "range": [
          15,
          60
        ],
        "est": true,
        "src": [
          "M.signorile2002",
          "M.heberlosier2012",
          "M.kinoshita2023"
        ]
      }
    },
    "rom": "Tizza 90° bukilganda boldirning ikki boshli mushagi bo‘shashadi — ishni asosan kambalasimon mushak bajaradi.",
    "notes": "12 haftalik tadqiqotda tik turib boldir ko‘tarish ikki boshli mushakni o‘tirib ko‘tarishdan ancha ko‘p o‘stirgan, kambalasimon mushak esa ikkalasida bir xil o‘sgan. Shuning uchun bu mashq tik turib ko‘tarishning o‘rnini bosmaydi, uni to‘ldiradi. Qiymatlar baho."
  },
  "assisted-pull-up": {
    "basis": "similar:lat-pulldown",
    "load": "tana vazni − yordam (baho)",
    "metric": "mean",
    "muscles": {
      "lats": {
        "mvic": 65,
        "range": [
          45,
          90
        ],
        "est": true,
        "src": [
          "M.lusk2010",
          "M.youdas2010"
        ]
      },
      "teresMajor": {
        "mvic": 45,
        "range": [
          25,
          65
        ],
        "est": true
      },
      "biceps": {
        "mvic": 45,
        "range": [
          25,
          70
        ],
        "est": true,
        "src": [
          "M.youdas2010"
        ]
      },
      "trapLower": {
        "mvic": 40,
        "range": [
          20,
          55
        ],
        "est": true,
        "src": [
          "M.youdas2010"
        ]
      },
      "infraspinatus": {
        "mvic": 40,
        "range": [
          20,
          60
        ],
        "est": true,
        "src": [
          "M.youdas2010"
        ]
      },
      "forearmFlexors": {
        "mvic": 35,
        "range": [
          20,
          50
        ],
        "est": true
      },
      "deltPost": {
        "mvic": 30,
        "range": [
          15,
          50
        ],
        "est": true
      }
    },
    "rom": "Turnikdagi tortilish kabi: harakatni pastki trapetsiya boshlaydi, tepada keng orqa mushagi va bitseps yakunlaydi.",
    "notes": "Gravitron bo‘yicha EMG tadqiqot topilmadi — yuqori blokni tortish va turnikda tortilish oralig‘ida baho. Yordam kamaygan sari faollik turnikdagi tortilishga yaqinlashadi."
  },
  "preacher-curl": {
    "basis": "direct",
    "load": "o‘rtacha (baho)",
    "metric": "mean",
    "muscles": {
      "biceps": {
        "mvic": 85,
        "range": [
          60,
          110
        ],
        "est": true,
        "src": [
          "M.oliveira2009"
        ]
      },
      "brachialis": {
        "mvic": 70,
        "range": [
          45,
          90
        ],
        "est": true
      },
      "brachioradialis": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true
      },
      "forearmFlexors": {
        "mvic": 30,
        "range": [
          15,
          45
        ],
        "est": true
      }
    },
    "rom": "Skott skameykasida bitseps faqat qisqa oraliqda — pastki qismida — eng yuqori ishlaydi; bilak tik holatga yaqinlashganda yuklama deyarli yo‘qoladi.",
    "notes": "Qiymatlar baho. Yosh ayollarda 8 haftalik tadqiqotda Skott skameykasi tirsak bukuvchilarning pastki (tirsak yaqinidagi) qismini, qiya skameyka esa yuqori qismini ko‘proq o‘stirgan."
  },
  "t-bar-row": {
    "basis": "similar:barbell-row",
    "load": "o‘rtacha–og‘ir (baho)",
    "metric": "peak",
    "muscles": {
      "lats": {
        "mvic": 60,
        "range": [
          40,
          80
        ],
        "est": true,
        "src": [
          "M.fenwick2009"
        ]
      },
      "trapMid": {
        "mvic": 55,
        "range": [
          35,
          75
        ],
        "est": true
      },
      "rhomboids": {
        "mvic": 50,
        "range": [
          30,
          70
        ],
        "est": true
      },
      "deltPost": {
        "mvic": 50,
        "range": [
          30,
          75
        ],
        "est": true
      },
      "erectors": {
        "mvic": 45,
        "range": [
          30,
          65
        ],
        "est": true,
        "src": [
          "M.fenwick2009"
        ]
      },
      "biceps": {
        "mvic": 40,
        "range": [
          25,
          60
        ],
        "est": true
      },
      "forearmFlexors": {
        "mvic": 35,
        "range": [
          20,
          55
        ],
        "est": true
      },
      "trapLower": {
        "mvic": 35,
        "range": [
          20,
          55
        ],
        "est": true
      }
    },
    "rom": "Engashib tortishdagi kabi: bel va dumba butun set davomida statik ushlab turadi; tor neytral ushlashda tirsaklar tanaga yaqin yuradi.",
    "notes": "T-shtanga bo‘yicha EMG tadqiqot topilmadi — engashib shtanga tortish natijalari asosida baho; gavda odatda tikroq bo‘lgani uchun bel qiymati biroz pastroq olingan."
  },
  "ab-wheel": {
    "basis": "similar:fitbolda va g‘ildirakda yoyilish",
    "load": "o‘z vazni",
    "metric": "mean",
    "muscles": {
      "rectusAbdominis": {
        "mvic": 70,
        "range": [
          50,
          100
        ],
        "est": true,
        "src": [
          "M.escamilla2010",
          "M.escamilla2006",
          "M.youdas2008"
        ]
      },
      "externalOblique": {
        "mvic": 55,
        "range": [
          40,
          85
        ],
        "est": true,
        "src": [
          "M.escamilla2010",
          "M.escamilla2006"
        ]
      },
      "lats": {
        "mvic": 30,
        "range": [
          15,
          50
        ],
        "est": true,
        "src": [
          "M.escamilla2010"
        ]
      },
      "rectusFemoris": {
        "mvic": 15,
        "range": [
          5,
          30
        ],
        "est": true
      },
      "erectors": {
        "mvic": 8,
        "range": [
          3,
          15
        ],
        "est": true,
        "src": [
          "M.escamilla2010"
        ]
      }
    },
    "rom": "Eng uzoq nuqtada press tananing orqaga egilishiga qarshi eng ko‘p ishlaydi; bel mushaklari deyarli ishlamaydi (10% dan kam).",
    "notes": "Fitbolda yoyilishda qorin to‘g‘ri mushagi ~63%, tashqi qiyshiq mushak ~46% MVIC. Press roligida richag uzunroq — qiymatlar biroz yuqoriroq baholangan."
  }
};

export const EMG_SOURCES: Record<string, { cite: string; doi?: string }> = {
  "L.contreras2015": {
    "cite": "Contreras B, Vigotsky AD, Schoenfeld BJ, Beardsley C, Cronin J. A Comparison of Gluteus Maximus, Biceps Femoris, and Vastus Lateralis Electromyographic Activity in the Back Squat and Barbell Hip Thrust Exercises. J Appl Biomech 31(6):452-458, 2015."
  },
  "L.contreras2016sq": {
    "cite": "Contreras B, Vigotsky AD, Schoenfeld BJ, Beardsley C, Cronin J. A Comparison of Gluteus Maximus, Biceps Femoris, and Vastus Lateralis Electromyography Amplitude in the Parallel, Full, and Front Squat Variations in Resistance-Trained Females. J Appl Biomech 32(1):16-22, 2016.",
    "doi": "10.1123/jab.2015-0113"
  },
  "L.contreras2016ht": {
    "cite": "Contreras B, Vigotsky AD, Schoenfeld BJ, Beardsley C, Cronin J. A Comparison of Gluteus Maximus, Biceps Femoris, and Vastus Lateralis Electromyography Amplitude for the Barbell, Band, and American Hip Thrust Variations. J Appl Biomech 32(3):254-260, 2016."
  },
  "L.neto2020": {
    "cite": "Krause Neto W, Soares EG, Vieira TL, et al. Gluteus Maximus Activation during Common Strength and Hypertrophy Exercises: A Systematic Review. J Sports Sci Med 19(1):195-203, 2020."
  },
  "L.mausehund2018": {
    "cite": "Mausehund L, Skard AE, Krosshaug T. Muscle Activation in Unilateral Barbell Exercises: Implications for Strength Training and Rehabilitation. J Strength Cond Res, 2018 (published online).",
    "doi": "10.1519/JSC.0000000000002617"
  },
  "L.vangelder2015": {
    "cite": "Van Gelder LH, et al. EMG analysis and sagittal plane kinematics of the two-handed and single-handed kettlebell swing: a descriptive study. Int J Sports Phys Ther, 2015."
  },
  "L.mcgill2012": {
    "cite": "McGill SM, Marshall LW. Kettlebell swing, snatch, and bottoms-up carry: back and hip muscle loads, motion, and training implications. J Strength Cond Res 26(1):16-27, 2012."
  },
  "L.zebis2013": {
    "cite": "Zebis MK, et al. Kettlebell swing targets semitendinosus and supine leg curl targets biceps femoris: an EMG study with rehabilitation implications. Br J Sports Med 47(18):1192, 2013."
  },
  "L.wilk1996": {
    "cite": "Wilk KE, Escamilla RF, Fleisig GS, Barrentine SW, Andrews JR, Boyd ML. A comparison of tibiofemoral joint forces and electromyographic activity during open and closed kinetic chain exercises. Am J Sports Med 24:518-527, 1996.",
    "doi": "10.1177/036354659602400418"
  },
  "L.escamilla1998": {
    "cite": "Escamilla RF, Fleisig GS, Zheng N, Barrentine SW, Wilk KE, Andrews JR. Biomechanics of the knee during closed kinetic chain and open kinetic chain exercises. Med Sci Sports Exerc 30(4):556-569, 1998.",
    "doi": "10.1097/00005768-199804000-00014"
  },
  "L.escamilla2001": {
    "cite": "Escamilla RF, Fleisig GS, et al. Effects of technique variations on knee biomechanics during the squat and leg press. Med Sci Sports Exerc, 2001."
  },
  "L.escamilla2002": {
    "cite": "Escamilla RF, Francisco AC, Kayes AV, Speer KP, Moorman CT. An electromyographic analysis of sumo and conventional style deadlifts. Med Sci Sports Exerc 34(4):682-688, 2002.",
    "doi": "10.1097/00005768-200204000-00019"
  },
  "L.martinfuentes2020": {
    "cite": "Martín-Fuentes I, Oliva-Lozano JM, Muyor JM. Electromyographic activity in deadlift exercise and its variants. A systematic review. PLoS One 15(2):e0229507, 2020.",
    "doi": "10.1371/journal.pone.0229507"
  },
  "L.andersen2018": {
    "cite": "Andersen V, et al. Electromyographic Comparison of Barbell Deadlift, Hex Bar Deadlift, and Hip Thrust Exercises: A Cross-Over Study. J Strength Cond Res 32(3):587-593, 2018.",
    "doi": "10.1519/JSC.0000000000001826"
  },
  "L.andersen2021": {
    "cite": "Andersen V, Pedersen H, Fimland MS, Shaw MP, et al. Comparison of Muscle Activity in Three Single-Joint, Hip Extension Exercises in Resistance-Trained Women. J Sports Sci Med 20:181-187, 2021."
  },
  "L.lee2018": {
    "cite": "Lee S, Schultz J, Timgren J, Staelgraeve K, Miller M, Liu Y. An electromyographic and kinetic comparison of conventional and Romanian deadlifts. J Exerc Sci Fit 16(3):87-93, 2018.",
    "doi": "10.1016/j.jesf.2018.08.001"
  },
  "L.delgado2019": {
    "cite": "Delgado J, et al. Comparison between back squat, Romanian deadlift, and barbell hip thrust for leg and hip muscle activities during hip extension. J Strength Cond Res 33(10):2595-2601, 2019."
  },
  "L.schwanbeck2009": {
    "cite": "Schwanbeck S, Chilibeck PD, Binsted G. A comparison of free weight squat to Smith machine squat using electromyography. J Strength Cond Res, 2009."
  },
  "L.williams2021": {
    "cite": "Williams MJ, et al. Activation of the Gluteus Maximus During Performance of the Back Squat, Split Squat, and Barbell Hip Thrust and the Relationship With Maximal Sprinting. J Strength Cond Res 35(1):16-24, 2021.",
    "doi": "10.1519/JSC.0000000000002651"
  },
  "L.simenz2012": {
    "cite": "Simenz CJ, et al. Electromyographical analysis of lower extremity muscle activation during variations of the loaded step-up exercise. J Strength Cond Res 26(12):3398-3405, 2012."
  },
  "L.heberlosier2012": {
    "cite": "Hébert-Losier K, et al. Influence of knee flexion angle and age on triceps surae muscle activity during heel raises. J Strength Cond Res 26(11), 2012."
  },
  "L.riemann2011": {
    "cite": "Riemann BL, Limbaugh GK, Eitner JD, LeFavi RG. Medial and lateral gastrocnemius activation differences during heel-raise exercise with three different foot positions. J Strength Cond Res 25(3):634-639, 2011.",
    "doi": "10.1519/JSC.0b013e3181cc22b8"
  },
  "L.hegyi2019": {
    "cite": "Hegyi A, Csala D, Péter A, Finni T, Cronin NJ. High-density electromyography activity in various hamstring exercises. Scand J Med Sci Sports 29:34-43, 2019."
  },
  "L.ebben2009": {
    "cite": "Ebben WP. Hamstring activation during lower body resistance training exercises. Int J Sports Physiol Perform 4(1):84-96, 2009.",
    "doi": "10.1123/ijspp.4.1.84"
  },
  "L.schoenfeld2015": {
    "cite": "Schoenfeld BJ, et al. Regional differences in muscle activation during hamstrings exercise. J Strength Cond Res 29(1):159-164, 2015."
  },
  "L.muyor2020": {
    "cite": "Muyor JM, et al. Electromyographic activity in the gluteus medius, gluteus maximus, biceps femoris, vastus lateralis, vastus medialis and rectus femoris during the Monopodal Squat, Forward Lunge and Lateral Step-Up exercises. PLoS One 15:e0230841, 2020.",
    "doi": "10.1371/journal.pone.0230841"
  },
  "L.coratella2021": {
    "cite": "Coratella G, Tornatore G, et al. The Activation of Gluteal, Thigh, and Lower Back Muscles in Different Squat Variations Performed by Competitive Bodybuilders: Implications for Resistance Training. Int J Environ Res Public Health 18(2):772, 2021.",
    "doi": "10.3390/ijerph18020772"
  },
  "L.coratella2022": {
    "cite": "Coratella G, et al. An Electromyographic Analysis of Romanian, Step-Romanian, and Stiff-Leg Deadlift: Implication for Resistance Training. Int J Environ Res Public Health 19(3):1903, 2022.",
    "doi": "10.3390/ijerph19031903"
  },
  "L.clark2012": {
    "cite": "Clark DR, Lambert MI, Hunter AM. Muscle activation in the loaded free barbell squat: a brief review. J Strength Cond Res 26(4):1169-1178, 2012.",
    "doi": "10.1519/JSC.0b013e31822d533d"
  },
  "L.isear1997": {
    "cite": "Isear JA, Erickson JC, Worrell TW. EMG analysis of lower extremity muscle recruitment patterns during an unloaded squat. Med Sci Sports Exerc 29(4):532-539, 1997.",
    "doi": "10.1097/00005768-199704000-00016"
  },
  "L.ut2012hack": {
    "cite": "Mualliflar aniqlanmagan. The Comparison of Myoelectric Activity of Selected Lower Limb Muscles during Three Common Quadriceps Strength Exercises Performed with Different Loads. Sport Sciences and Health Research (University of Tehran), c. 2011-2012."
  },
  "L.dasilva2008": {
    "cite": "Da Silva EM, Brentano MA, Cadore EL, De Almeida AP, Kruel LF. Analysis of muscle activation during different leg press exercises at submaximum effort levels. J Strength Cond Res 22:1059-1065, 2008."
  },
  "L.nuzzo2008": {
    "cite": "Nuzzo JL, McCaulley GO, Cormie P, Cavill MJ, McBride JM. Trunk muscle activity during stability ball and free weight exercises. J Strength Cond Res 22(1):95-102, 2008."
  },
  "L.slater2017": {
    "cite": "Slater LV, Hart JM. Muscle activation patterns during different squat techniques. J Strength Cond Res 31:667-676, 2017.",
    "doi": "10.1519/JSC.0000000000001323"
  },
  "L.ekstrom2007": {
    "cite": "Ekstrom RA, Donatelli RA, Carp KC. Electromyographic analysis of core trunk, hip, and thigh muscles during 9 rehabilitation exercises. J Orthop Sports Phys Ther 37(12):754-762, 2007.",
    "doi": "10.2519/jospt.2007.2471"
  },
  "P.stastny2017": {
    "cite": "Stastny P, et al. A systematic review of surface electromyography analyses of the bench press movement task. PLoS One 12(2):e0171632, 2017.",
    "doi": "10.1371/journal.pone.0171632"
  },
  "P.saeterbakken2011": {
    "cite": "Saeterbakken AH, van den Tillaar R, Fimland MS. A comparison of muscle activity and 1-RM strength of three chest-press exercises with different stability requirements. J Sports Sci 29(5):533-538, 2011.",
    "doi": "10.1080/02640414.2010.543916"
  },
  "P.saeterbakken2017": {
    "cite": "Saeterbakken AH, Mo DA, Scott S, Andersen V. The Effects of Bench Press Variations in Competitive Athletes on Muscle Activity and Performance. J Hum Kinet 57:61-71, 2017.",
    "doi": "10.1515/hukin-2017-0047"
  },
  "P.saeterbakken2021": {
    "cite": "Saeterbakken AH, et al. The Effect of Grip Width on Muscle Strength and Electromyographic Activity in Bench Press among Novice- and Resistance-Trained Men. Int J Environ Res Public Health 18(12):6444, 2021.",
    "doi": "10.3390/ijerph18126444"
  },
  "P.saeterbakken2013": {
    "cite": "Saeterbakken AH, Fimland MS. Effects of body position and loading modality on muscle activity and strength in shoulder presses. J Strength Cond Res 27(7):1824-1831, 2013."
  },
  "P.lauver2016": {
    "cite": "Lauver JD, Cayot TE, Scheuermann BW. Influence of bench angle on upper extremity muscular activation during bench press exercise. Eur J Sport Sci 16(3):309-316, 2016.",
    "doi": "10.1080/17461391.2015.1022605"
  },
  "P.trebs2010": {
    "cite": "Trebs AA, Brandenburg JP, Pitney WA. An electromyography analysis of 3 muscles surrounding the shoulder joint during the performance of a chest press exercise at several angles. J Strength Cond Res 24(7):1925-1930, 2010."
  },
  "P.rodriguezridao2020": {
    "cite": "Rodriguez-Ridao D, et al. Effect of Five Bench Inclinations on the Electromyographic Activity of the Pectoralis Major, Anterior Deltoid, and Triceps Brachii during the Bench Press Exercise. Int J Environ Res Public Health 17(19):7339, 2020.",
    "doi": "10.3390/ijerph17197339"
  },
  "P.muyor2023": {
    "cite": "Muyor JM, Rodriguez-Ridao D, Oliva-Lozano JM. Comparison of Muscle Activity between the Horizontal Bench Press and the Seated Chest Press Exercises Using Several Grips. J Hum Kinet 87:23-34, 2023."
  },
  "P.lopezvivancos2023": {
    "cite": "Lopez-Vivancos A, et al. Electromyographic Activity of the Pectoralis Major Muscle during Traditional Bench Press and Other Variants of Pectoral Exercises: A Systematic Review and Meta-Analysis. Appl Sci 13(8):5203, 2023.",
    "doi": "10.3390/app13085203"
  },
  "P.arseneault2021": {
    "cite": "Arseneault, Roy, Sercia. The Effect of 12 variations of the bench press exercise on the EMG activity of three heads of the pectoralis major. International Journal of Strength and Conditioning, 2021."
  },
  "P.barnett1995": {
    "cite": "Barnett C, Kippers V, Turner P. Effects of variations of the bench press exercise on the EMG activity of five shoulder muscles. J Strength Cond Res 9(4):222-227, 1995."
  },
  "P.lehman2005": {
    "cite": "Lehman GJ. The influence of grip width and forearm pronation/supination on upper-body myoelectric activity during the flat bench press. J Strength Cond Res 19(3):587-591, 2005."
  },
  "P.wojdala2020": {
    "cite": "Wojdala G, et al. Impact of the \"Sling Shot\" Supportive Device on Upper-Body Neuromuscular Activity during the Bench Press Exercise. Int J Environ Res Public Health 17(20):7695, 2020.",
    "doi": "10.3390/ijerph17207695"
  },
  "P.yan2025": {
    "cite": "Yan et al. Study on the differences in peripheral fatigue responses elicitation effects of bench press training with different loads and tempos based on electromyography and motion sensors. Front Physiol, 2025.",
    "doi": "10.3389/fphys.2025.1661217"
  },
  "P.vandentillaar2014": {
    "cite": "van den Tillaar R, Saeterbakken A. Effect of Fatigue Upon Performance and Electromyographic Activity in 6-RM Bench Press. J Hum Kinet 40:57-65, 2014.",
    "doi": "10.2478/hukin-2014-0007"
  },
  "P.coratella2020bp": {
    "cite": "Coratella G, Tornatore G, Longo S, Esposito F, Ce E. Specific prime movers' excitation during free-weight bench press variations and chest press machine in competitive bodybuilders. Eur J Sport Sci 20(5), 2020.",
    "doi": "10.1080/17461391.2019.1655101"
  },
  "P.schanke2012": {
    "cite": "Schanke W (Porcari J, supervisor). Electromyographical analysis of the pectoralis major muscle during various chest exercises. MS thesis, University of Wisconsin-La Crosse, 2012 (ACE-sponsored; NOT peer-reviewed)."
  },
  "P.welsch2005": {
    "cite": "Welsch EA, Bird M, Mayhew JL. Electromyographic activity of the pectoralis major and anterior deltoid muscles during three upper-body lifts. J Strength Cond Res 19(2):449-452, 2005.",
    "doi": "10.1519/14513.1"
  },
  "P.solstad2020": {
    "cite": "Solstad TEJ, et al. A Comparison of Muscle Activation between Barbell Bench Press and Dumbbell Flyes in Resistance-Trained Males. J Sports Sci Med 19(4):645-651, 2020."
  },
  "P.rochajunior2007": {
    "cite": "Rocha Junior VA, et al. Comparison among the EMG activity of the pectoralis major, anterior deltoidis and triceps brachii during the bench press and peck deck exercises. Rev Bras Med Esporte 13(1):51-54, 2007.",
    "doi": "10.1590/S1517-86922007000100012"
  },
  "P.botton2013": {
    "cite": "Botton CE, Wilhelm EN, Ughini CC, Pinto RS, Lima CS. Electromyographical analysis of the deltoid between different strength training exercises. Medicina Sportiva 17(2):67-71, 2013.",
    "doi": "10.5604/17342260.1055261"
  },
  "P.campos2020": {
    "cite": "Campos YAC, et al. Different Shoulder Exercises Affect the Activation of Deltoid Portions in Resistance-Trained Individuals. J Hum Kinet 75:5-14, 2020.",
    "doi": "10.2478/hukin-2020-0033"
  },
  "P.coratella2020lr": {
    "cite": "Coratella G, et al. An Electromyographic Analysis of Lateral Raise Variations and Frontal Raise in Competitive Bodybuilders. Int J Environ Res Public Health 17(17):6015, 2020.",
    "doi": "10.3390/ijerph17176015"
  },
  "P.coratella2022": {
    "cite": "Coratella G, et al. Front vs Back and Barbell vs Machine Overhead Press: An Electromyographic Analysis and Implications For Resistance Training. Front Physiol 13:825880, 2022.",
    "doi": "10.3389/fphys.2022.825880"
  },
  "P.paoli2010": {
    "cite": "Paoli A, Marcolin G, Petrone N. Influence of different ranges of motion on selective recruitment of shoulder muscles in the sitting military press: an electromyographic study. J Strength Cond Res, 2010.",
    "doi": "10.1519/JSC.0b013e3181d756ea"
  },
  "P.luczak2013": {
    "cite": "Luczak J, Bosak A, Riemann BL. Shoulder Muscle Activation of Novice and Resistance Trained Women during Variations of Dumbbell Press Exercises. J Sports Med 2013:612650, 2013.",
    "doi": "10.1155/2013/612650"
  },
  "P.larsen2025": {
    "cite": "Larsen S, et al. Dumbbell versus cable lateral raises for lateral deltoid hypertrophy: an experimental study. Front Physiol, 2025 (hypertrophy study; EMG statements are from its literature review).",
    "doi": "10.3389/fphys.2025.1611468"
  },
  "P.youdas2010": {
    "cite": "Youdas JW, et al. Comparison of muscle-activation patterns during the conventional push-up and Perfect Pushup exercises. J Strength Cond Res 24(12):3352-3362, 2010."
  },
  "P.snarr2013": {
    "cite": "Snarr RL, Esco MR. Electromyographic Comparison of Traditional and Suspension Push-Ups. J Hum Kinet, 2013."
  },
  "P.borreani2015": {
    "cite": "Borreani S, et al. Shoulder muscle activation during stable and suspended push-ups at different heights in healthy subjects. Phys Ther Sport, 2015."
  },
  "P.calatayud2014": {
    "cite": "Calatayud J, et al. Muscle Activation during Push-Ups with Different Suspension Training Systems. J Sports Sci Med 13(3):502-510, 2014."
  },
  "P.calatayud2015": {
    "cite": "Calatayud J, et al. Bench press and push-up at comparable levels of muscle activity results in similar strength gains. J Strength Cond Res 29(1):246-253, 2015.",
    "doi": "10.1519/JSC.0000000000000589"
  },
  "P.marcolin2015": {
    "cite": "Marcolin G, Petrone N, Moro T, Battaglia G, Bianco A, Paoli A. Selective Activation of Shoulder, Trunk, and Arm Muscles: A Comparative Analysis of Different Push-Up Variants. J Athl Train 50(11):1126-1132, 2015.",
    "doi": "10.4085/1062-6050-50.9.09"
  },
  "P.mckenzie2022": {
    "cite": "McKenzie A, Crowley-McHattan Z, Meir R, Whitting J, Volschenk W. Bench, Bar, and Ring Dips: Do Kinematics and Muscle Activity Differ? Int J Environ Res Public Health 19(20):13211, 2022.",
    "doi": "10.3390/ijerph192013211"
  },
  "P.mckenzie2022fatigue": {
    "cite": "McKenzie A, et al. Fatigue Increases Muscle Activations but Does Not Change Maximal Joint Angles during the Bar Dip. Int J Environ Res Public Health 19(21):14390, 2022.",
    "doi": "10.3390/ijerph192114390"
  },
  "P.bagchi2015": {
    "cite": "Bagchi A. A comparative electromyographical investigation of triceps brachii and pectoralis major during four different freehand exercises. J Phys Educ Res, 2015."
  },
  "P.boehler2011": {
    "cite": "Boehler B (Porcari J, supervisor). Electromyographic analysis of the triceps brachii muscle during a variety of triceps exercises. MS thesis, University of Wisconsin-La Crosse, 2011 (ACE-sponsored; NOT peer-reviewed; values relative to triangle push-up)."
  },
  "P.kholinne2018": {
    "cite": "Kholinne E, et al. The different role of each head of the triceps brachii muscle in elbow extension. Acta Orthop Traumatol Turc 52(3):201-205, 2018.",
    "doi": "10.1016/j.aott.2018.02.005"
  },
  "P.alves2018": {
    "cite": "Alves D, Matta T, Oliveira L. Effect of shoulder position on triceps brachii heads activity in dumbbell elbow extension exercises. J Sports Med Phys Fitness 58(9):1247-1252, 2018.",
    "doi": "10.23736/S0022-4707.17.06849-9"
  },
  "P.hussain2020": {
    "cite": "Hussain J, et al. Muscle Fatigue in the Three Heads of Triceps Brachii During Intensity and Speed Variations of Triceps Push-Down Exercise. Front Physiol 11:112, 2020.",
    "doi": "10.3389/fphys.2020.00112"
  },
  "P.villalba2024": {
    "cite": "Villalba et al. Forearm Position Influences Triceps Brachii Activation During Triceps Push-Down Exercise. International Journal of Strength and Conditioning, 2024."
  },
  "U.youdas2010": {
    "cite": "Youdas et al. Surface electromyographic activation patterns and elbow joint motion during a pull-up, chin-up, or Perfect-Pullup rotational exercise. J Strength Cond Res 24(12):3404-3414, 2010.",
    "doi": "10.1519/JSC.0b013e3181f1598c"
  },
  "U.dickie2017": {
    "cite": "Dickie, Faulkner, Barnes, Lark. Electromyographic analysis of muscle activation during pull-up variations. J Electromyogr Kinesiol 32:30-36, 2017.",
    "doi": "10.1016/j.jelekin.2016.11.004"
  },
  "U.doma2013": {
    "cite": "Doma, Deakin, Ness. Kinematic and electromyographic comparisons between chin-ups and lat-pull down exercises. Sports Biomech 12(3):302-313, 2013.",
    "doi": "10.1080/14763141.2012.760204"
  },
  "U.lusk2010": {
    "cite": "Lusk et al. Grip width and forearm orientation effects on muscle activity during the lat pull-down. J Strength Cond Res 24(7):1895-1900, 2010."
  },
  "U.andersen2014": {
    "cite": "Andersen, Fimland, Wiik, Skoglund, Saeterbakken. Effects of grip width on muscle strength and activation in the lat pull-down. J Strength Cond Res 28(4):1135-1142, 2014."
  },
  "U.difonza2026": {
    "cite": "Di Fonza et al. Electromyographic analysis of latissimus dorsi activation during common resistance training exercises: a narrative review. J Funct Morphol Kinesiol 11(3):315, 2026.",
    "doi": "10.3390/jfmk11030315"
  },
  "U.fenwick2009": {
    "cite": "Fenwick, Brown, McGill. Comparison of different rowing exercises: trunk muscle activation and lumbar spine motion, load, and stiffness. J Strength Cond Res 23(2):350-358, 2009 (also indexed as 23(5):1408-1417, DOI 10.1519/JSC.0b013e3181b07334).",
    "doi": "10.1519/JSC.0b013e3181942019"
  },
  "U.youdas2016": {
    "cite": "Youdas et al. Activation of spinal stabilizers and shoulder complex muscles during an inverted row using a portable pull-up device and body weight resistance. J Strength Cond Res 30(7):1933-1941, 2016.",
    "doi": "10.1519/JSC.0000000000001210"
  },
  "U.snarr2013": {
    "cite": "Snarr RL, Esco MR. Comparison of electromyographic activity when performing an inverted row with and without a suspension device. J Exerc Physiol Online 16(6):51-58, 2013."
  },
  "U.vasconcelos2023": {
    "cite": "Vasconcelos, Lopes, Almeida, Krause Neto, Soares. Effect of different grip position and shoulder-abduction angle on muscle strength and activation during the seated cable row. Int J Strength Cond, 2023."
  },
  "U.lehman2004": {
    "cite": "Lehman GJ, Buchan DD, Lundy A, Myers N, Nalborczyk A. Variations in muscle activation levels during traditional latissimus dorsi weight training exercises: an experimental study. Dyn Med 3(1):4, 2004."
  },
  "U.andersen2008": {
    "cite": "Andersen et al. Muscle activation during selected strength exercises in women with chronic neck muscle pain. Phys Ther 88(6):703-711, 2008."
  },
  "U.andersen2012": {
    "cite": "Andersen et al. Scapular muscle activity from selected strengthening exercises performed at low and high intensities. J Strength Cond Res 26(9):2408-2416, 2012.",
    "doi": "10.1519/JSC.0b013e31823f8d24"
  },
  "U.ekstrom2003": {
    "cite": "Ekstrom RA, Donatelli RA, et al. Surface electromyographic analysis of exercises for the trapezius and serratus anterior muscles. J Orthop Sports Phys Ther 33(5):247-258, 2003.",
    "doi": "10.2519/jospt.2003.33.5.247"
  },
  "U.pizzari2014": {
    "cite": "Pizzari, Wickham, Balster, Ganderton, Watson. Modifying a shrug exercise can facilitate the upward rotator muscles of the scapula. Clin Biomech 29(2):201-205, 2014.",
    "doi": "10.1016/j.clinbiomech.2013.11.011"
  },
  "U.reinold2004": {
    "cite": "Reinold et al. Electromyographic analysis of the rotator cuff and deltoid musculature during common shoulder external rotation exercises. J Orthop Sports Phys Ther 34(7):385-394, 2004.",
    "doi": "10.2519/jospt.2004.34.7.385"
  },
  "U.schoenfeld2013": {
    "cite": "Schoenfeld B, Sonmez RGT, Kolber MJ, Contreras B, Harris R, Ozen S. Effect of hand position on EMG activity of the posterior shoulder musculature during a horizontal abduction exercise. J Strength Cond Res 27(10):2644-2649, 2013.",
    "doi": "10.1519/JSC.0b013e318281e1e9"
  },
  "U.fukunaga2022": {
    "cite": "Fukunaga et al. Band pull-apart exercise: effects of movement direction and hand position on shoulder muscle activity. Int J Sports Phys Ther 17(3):400-408, 2022."
  },
  "U.marcolin2018": {
    "cite": "Marcolin G, Panizzolo FA, Petrone N, Moro T, Grigoletto D, Piccolo D, Paoli A. Differences in electromyographic activity of biceps brachii and brachioradialis while performing three variants of curl. PeerJ 6:e5165, 2018.",
    "doi": "10.7717/peerj.5165"
  },
  "U.coratella2023": {
    "cite": "Coratella et al. Biceps brachii and brachioradialis excitation in biceps curl exercise: different handgrips, different synergy. Sports 11(3):64, 2023.",
    "doi": "10.3390/sports11030064"
  },
  "U.oliveira2009": {
    "cite": "Oliveira LF, Matta TT, Alves DS, Garcia MAC, Vieira TMM. Effect of the shoulder position on the biceps brachii EMG in different dumbbell curls. J Sports Sci Med 8(1):24-29, 2009."
  },
  "U.parpa2025": {
    "cite": "Parpa et al. An exploratory study of biceps brachii electromyographic activity during traditional dumbbell versus Bayesian cable curls. Muscles 4(4):45, 2025.",
    "doi": "10.3390/muscles4040045"
  },
  "U.escamilla2006": {
    "cite": "Escamilla et al. Electromyographic analysis of traditional and nontraditional abdominal exercises: implications for rehabilitation and training. Phys Ther 86(5):656-671, 2006.",
    "doi": "10.1093/ptj/86.5.656"
  },
  "U.youdas2008": {
    "cite": "Youdas, Guck, et al. An electromyographic analysis of the Ab-Slide exercise, abdominal crunch, supine double leg thrust, and side bridge in healthy young adults: implications for rehabilitation professionals. J Strength Cond Res 22(6):1939-1946, 2008."
  },
  "U.axler1997": {
    "cite": "Axler, McGill. Low back loads over a variety of abdominal exercises: searching for the safest abdominal challenge. Med Sci Sports Exerc 29(6):804-811, 1997."
  },
  "U.sundstrup2012": {
    "cite": "Sundstrup et al. Swiss ball abdominal crunch with added elastic resistance is an effective alternative to training machines. Int J Sports Phys Ther 7(4):372-380, 2012."
  },
  "U.calatayud2017": {
    "cite": "Calatayud, Casaña, et al. Progression of core stability exercises based on the extent of muscle activity. Am J Phys Med Rehabil 96(10):694-699, 2017.",
    "doi": "10.1097/PHM.0000000000000713"
  },
  "U.schoenfeld2014": {
    "cite": "Schoenfeld et al. An electromyographic comparison of a modified version of the plank with a long lever and posterior tilt versus the traditional plank exercise. Sports Biomech 13(3):296-306, 2014.",
    "doi": "10.1080/14763141.2014.942355"
  },
  "U.snarr2014": {
    "cite": "Snarr RL, Esco MR. Electromyographical comparison of plank variations performed with and without instability devices. J Strength Cond Res 28(11):3298-3305, 2014.",
    "doi": "10.1519/JSC.0000000000000521"
  },
  "U.saglam2025": {
    "cite": "Sağlam AF, Aydın EM, Demirkan E, Gündoğan B, Favre M. Effects of surface stability on muscle activation during plank exercise. J Hum Kinet, 2025.",
    "doi": "10.5114/jhk/203417"
  },
  "U.oliva2020": {
    "cite": "Oliva-Lozano, Muyor. Core muscle activity during physical fitness exercises: a systematic review. Int J Environ Res Public Health, 2020 (PMID 32560185)."
  },
  "U.yun2017": {
    "cite": "Yun et al. Changes in muscle activity of the abdominal muscles according to exercise method and speed during dead bug exercise. Phys Ther Rehabil Sci 6(1), 2017.",
    "doi": "10.14474/ptrs.2017.6.1.1"
  },
  "H.distefano2009": {
    "cite": "DiStefano LJ, Blackburn JT, Marshall SW, Padua DA. Gluteal muscle activation during common therapeutic exercises. J Orthop Sports Phys Ther 39(7):532-540, 2009.",
    "doi": "10.2519/jospt.2009.2796"
  },
  "H.boren2011": {
    "cite": "Boren K, Conrey C, Le Coguic J, Paprocki L, Voight M, Robinson TK. Electromyographic analysis of gluteus medius and gluteus maximus during rehabilitation exercises. Int J Sports Phys Ther 6(3):206-223, 2011."
  },
  "H.ekstrom2007": {
    "cite": "Ekstrom RA, Donatelli RA, Carp KC. Electromyographic analysis of core trunk, hip, and thigh muscles during 9 rehabilitation exercises. J Orthop Sports Phys Ther 37(12):754-762, 2007.",
    "doi": "10.2519/jospt.2007.2471"
  },
  "H.selkowitz2013": {
    "cite": "Selkowitz DM, Beneck GJ, Powers CM. Which exercises target the gluteal muscles while minimizing activation of the tensor fascia lata? Electromyographic assessment using fine-wire electrodes. J Orthop Sports Phys Ther 43(2):54-64, 2013."
  },
  "H.cambridge2012": {
    "cite": "Cambridge EDJ, Sidorkewicz N, Ikeda DM, McGill SM. Progressive hip rehabilitation: the effects of resistance band placement on gluteal activation during two common exercises. Clin Biomech 27(7):719-724, 2012."
  },
  "H.berry2015": {
    "cite": "Berry JW, Lee TS, Foley HD, Lewis CL. Resisted side stepping: the effect of posture on hip abductor muscle activation. J Orthop Sports Phys Ther 45(9):675-682, 2015."
  },
  "H.mccaw1999": {
    "cite": "McCaw ST, Melrose DR. Stance width and bar load effects on leg muscle activity during the parallel squat. Med Sci Sports Exerc 31(3):428-436, 1999."
  },
  "H.paoli2009": {
    "cite": "Paoli A, Marcolin G, Petrone N. The effect of stance width on the electromyographical activity of eight superficial thigh muscles during back squat with different bar loads. J Strength Cond Res 23(1):246-250, 2009."
  },
  "H.suprak2011": {
    "cite": "Suprak DN, Dawes J, Stephenson MD. The effect of position on the percentage of body mass supported during traditional and modified push-up variants. J Strength Cond Res 25(2):497-503, 2011."
  },
  "H.youdas2010": {
    "cite": "Youdas JW, et al. Comparison of muscle-activation patterns during the conventional push-up and Perfect Pushup exercises. J Strength Cond Res 24(12):3352-3362, 2010."
  },
  "H.callaghan1998": {
    "cite": "Callaghan JP, Gunning JL, McGill SM. The relationship between lumbar spine load and muscle activity during extensor exercises. Phys Ther 78(1):8-18, 1998.",
    "doi": "10.1093/ptj/78.1.8"
  },
  "H.youdas2014": {
    "cite": "Youdas JW, Boor MMP, Darfler AL, Koenig MK, Mills KM, Hollman JH. Surface electromyographic analysis of core trunk and hip muscles during selected rehabilitation exercises in the side-bridge to neutral spine position. Sports Health, 2014."
  },
  "H.escamilla2006": {
    "cite": "Escamilla RF, et al. Electromyographic analysis of traditional and nontraditional abdominal exercises: implications for rehabilitation and training. Phys Ther 86(5):656-671, 2006.",
    "doi": "10.1093/ptj/86.5.656"
  },
  "H.andersen2010": {
    "cite": "Andersen LL, et al. Muscle activation and perceived loading during rehabilitation exercises: comparison of dumbbells and elastic resistance. Phys Ther 90(4):538-549, 2010."
  },
  "M.distefano2009": {
    "cite": "DiStefano LJ, Blackburn JT, Marshall SW, Padua DA. Gluteal muscle activation during common therapeutic exercises. J Orthop Sports Phys Ther 39(7):532-540, 2009.",
    "doi": "10.2519/jospt.2009.2796"
  },
  "M.fujisawa2014": {
    "cite": "Fujisawa H, Suzuki H, Yamaguchi E, Yoshiki H, Wada Y, Watanabe A. Hip muscle activity during isometric contraction of hip abduction. J Phys Ther Sci 26(2):187-190, 2014.",
    "doi": "10.1589/jpts.26.187"
  },
  "M.serner2014": {
    "cite": "Serner A, et al. EMG evaluation of hip adduction exercises for soccer players: implications for exercise selection in prevention and treatment of groin injuries. Br J Sports Med 48(14):1108-1114, 2014.",
    "doi": "10.1136/bjsports-2012-091746"
  },
  "M.selkowitz2013": {
    "cite": "Selkowitz DM, Beneck GJ, Powers CM. Which exercises target the gluteal muscles while minimizing activation of the tensor fascia lata? Electromyographic assessment using fine-wire electrodes. J Orthop Sports Phys Ther 43(2):54-64, 2013.",
    "doi": "10.2519/jospt.2013.4116"
  },
  "M.zebis2013": {
    "cite": "Zebis MK, et al. Kettlebell swing targets semitendinosus and supine leg curl targets biceps femoris: an EMG study with rehabilitation implications. Br J Sports Med 47(18):1192, 2013."
  },
  "M.signorile2002": {
    "cite": "Signorile JF, Applegate B, Duque M, Cole N, Zink A. Selective recruitment of the triceps surae muscles with changes in knee angle. J Strength Cond Res 16(3):433-439, 2002."
  },
  "M.heberlosier2012": {
    "cite": "Hébert-Losier K, et al. Influence of knee flexion angle and age on triceps surae muscle activity during heel raises. J Strength Cond Res 26(11), 2012."
  },
  "M.kinoshita2023": {
    "cite": "Kinoshita M, Maeo S, Kobayashi Y, Eihara Y, Ono M, Sato M, Sugiyama T, Kanehisa H, Isaka T. Triceps surae muscle hypertrophy is greater after standing versus seated calf-raise training. Front Physiol 14:1272106, 2023.",
    "doi": "10.3389/fphys.2023.1272106"
  },
  "M.lusk2010": {
    "cite": "Lusk et al. Grip width and forearm orientation effects on muscle activity during the lat pull-down. J Strength Cond Res 24(7):1895-1900, 2010."
  },
  "M.youdas2010": {
    "cite": "Youdas et al. Surface electromyographic activation patterns and elbow joint motion during a pull-up, chin-up, or Perfect-Pullup rotational exercise. J Strength Cond Res 24(12):3404-3414, 2010.",
    "doi": "10.1519/JSC.0b013e3181f1598c"
  },
  "M.oliveira2009": {
    "cite": "Oliveira LF, Matta TT, Alves DS, Garcia MAC, Vieira TMM. Effect of the shoulder position on the biceps brachii EMG in different dumbbell curls. J Sports Sci Med 8(1):24-29, 2009."
  },
  "M.kassiano2025": {
    "cite": "Kassiano W, Costa B, Kunevaliki G, et al. Distinct muscle growth and strength adaptations after preacher and incline biceps curls. Int J Sports Med 46(5):334-343, 2025.",
    "doi": "10.1055/a-2517-0509"
  },
  "M.fenwick2009": {
    "cite": "Fenwick, Brown, McGill. Comparison of different rowing exercises: trunk muscle activation and lumbar spine motion, load, and stiffness. J Strength Cond Res 23(2):350-358, 2009 (also indexed as 23(5):1408-1417, DOI 10.1519/JSC.0b013e3181b07334).",
    "doi": "10.1519/JSC.0b013e3181942019"
  },
  "M.escamilla2010": {
    "cite": "Escamilla RF, Lewis C, Bell D, et al. Core muscle activation during Swiss ball and traditional abdominal exercises. J Orthop Sports Phys Ther 40(5):265-276, 2010."
  },
  "M.escamilla2006": {
    "cite": "Escamilla et al. Electromyographic analysis of traditional and nontraditional abdominal exercises: implications for rehabilitation and training. Phys Ther 86(5):656-671, 2006.",
    "doi": "10.1093/ptj/86.5.656"
  },
  "M.youdas2008": {
    "cite": "Youdas, Guck, et al. An electromyographic analysis of the Ab-Slide exercise, abdominal crunch, supine double leg thrust, and side bridge in healthy young adults: implications for rehabilitation professionals. J Strength Cond Res 22(6):1939-1946, 2008."
  }
};
