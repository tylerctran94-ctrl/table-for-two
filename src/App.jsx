import { useState } from "react";

const T = { bg:"#07070f", accent:"#c9a96e", accent2:"#9b6b9b", text:"#f0ece3", sub:"#6a5f52", border:"rgba(255,255,255,0.07)", card:"rgba(255,255,255,0.025)" };
const accentAt = (i) => [T.accent, T.accent2, "#6b9b8b", "#ff8c42", "#ff6b6b"][i % 5];

const gemScore = (reviews) => {
  if (!reviews) return 5;
  if (reviews < 100) return 10;
  if (reviews < 500) return 8;
  if (reviews < 2000) return 6;
  if (reviews < 5000) return 4;
  return 2;
};

const NEIGHBORHOODS = [
  { id:"williamsburg", label:"Williamsburg", sub:"Brooklyn", emoji:"🎸" },
  { id:"west_village", label:"West Village", sub:"Manhattan", emoji:"🕯️" },
  { id:"east_village", label:"East Village", sub:"Manhattan", emoji:"🍜" },
  { id:"midtown", label:"Midtown", sub:"Manhattan", emoji:"🥢" },
  { id:"lic", label:"Long Island City", sub:"Queens", emoji:"🌆" },
];

const DRINK_OPTS = [
  { v:"cocktails", l:"🍹 Cocktails" }, { v:"beer", l:"🍺 Beer / Dive" },
  { v:"wine", l:"🍷 Wine" }, { v:"experimental", l:"🧪 Experimental" },
  { v:"speakeasy", l:"🕯️ Speakeasy" },
];
const FOOD_OPTS = [
  { v:"brunch", l:"🥐 Brunch" }, { v:"japanese", l:"🍣 Japanese" },
  { v:"pasta", l:"🍝 Italian" }, { v:"pizza", l:"🍕 Pizza" },
  { v:"mediterranean", l:"🥙 Mediterranean" }, { v:"american", l:"🍔 American" },
];
const FOOD_DRINK_OPTS = [
  { v:"dinner_cocktails", l:"🍸 Dinner + Cocktails" },
  { v:"wine_plates",      l:"🍷 Wine + Small Plates" },
  { v:"brunch_drinks",    l:"🥂 Brunch + Drinks" },
  { v:"late_bites",       l:"🌙 Late Night Food + Drinks" },
];

const DB = {
  williamsburg: {
    bars: {
      cocktails: [
          { place:"Hole In The Wall", type:"brunch", desc:"brunch", booking:"https://holeinthewallnyc.com/williamsburg-1", maps:"Hole+In+The+Wall+Williamsburg+Brooklyn", reviews:3969, price:"$$", reservable:true, stars:4.8 },
          { place:"Hide & Seek", type:"bar", desc:"bar", booking:"http://www.hideandseek.nyc/", maps:"Hide+&+Seek+Williamsburg+Brooklyn", reviews:217, price:"$", reservable:true, stars:4.6 },
          { place:"Wandering Barman", type:"happy hour", desc:"happy hour", booking:"https://www.wanderingbarman.com/", maps:"Wandering+Barman+Williamsburg+Brooklyn", reviews:148, price:"$", reservable:false, stars:4.8 },
          { place:"Bee's Knees & Honey Lounge", type:"happy hour", desc:"happy hour", booking:"http://www.beeskneesbk.com/", maps:"Bees+Knees+&+Honey+Lounge+Williamsburg+Brooklyn", reviews:397, price:"$$", reservable:true, stars:4.7 },
          { place:"Koi Bā", type:"cocktail bar, japanese", desc:"cocktail bar, japanese", booking:"http://www.instagram.com/koibabrooklyn", maps:"Koi+Bā+Williamsburg+Brooklyn", reviews:50, price:"$$", reservable:true, stars:4.9 },
          { place:"Sleepwalk", type:"cocktail bar", desc:"cocktail bar", booking:"http://www.sleepwalk.nyc/", maps:"Sleepwalk+Williamsburg+Brooklyn", reviews:205, price:"$$", reservable:true, stars:4.7 },
          { place:"Recette", type:"french", desc:"french", booking:"https://www.recettebrooklyn.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=main_button", maps:"Recette+Williamsburg+Brooklyn", reviews:1076, price:"$$$", reservable:true, stars:4.8 },
          { place:"Fandi Mata", type:"evening restaurant", desc:"evening restaurant", booking:"https://www.fandimata.com/", maps:"Fandi+Mata+Williamsburg+Brooklyn", reviews:4385, price:"$$", reservable:true, stars:4.7 },
          { place:"Isla & Co. - Williamsburg", type:"brunch", desc:"brunch", booking:"https://www.isla-co.com/williamsburg", maps:"Isla+&+Co.+-+Williamsburg+Williamsburg+Brooklyn", reviews:1633, price:"$$", reservable:true, stars:4.9 },
          { place:"Aurora Brooklyn", type:"italian restaurant", desc:"italian restaurant", booking:"https://aurorabk.com/", maps:"Aurora+Brooklyn+Williamsburg+Brooklyn", reviews:1580, price:"$$", reservable:true, stars:4.5 },
          { place:"Blend Williamsburg", type:"brunch, happy hour, evening dinner", desc:"brunch, happy hour, evening dinner", booking:"https://www.blendwilliamsburg.com/", maps:"Blend+Williamsburg+Williamsburg+Brooklyn", reviews:1381, price:"$$", reservable:true, stars:4.3 }
        ],
      beer: [
          { place:"Hide & Seek", type:"bar", desc:"bar", booking:"http://www.hideandseek.nyc/", maps:"Hide+&+Seek+Williamsburg+Brooklyn", reviews:217, price:"$", reservable:true, stars:4.6 },
          { place:"Wandering Barman", type:"happy hour", desc:"happy hour", booking:"https://www.wanderingbarman.com/", maps:"Wandering+Barman+Williamsburg+Brooklyn", reviews:148, price:"$", reservable:false, stars:4.8 },
          { place:"Bee's Knees & Honey Lounge", type:"happy hour", desc:"happy hour", booking:"http://www.beeskneesbk.com/", maps:"Bees+Knees+&+Honey+Lounge+Williamsburg+Brooklyn", reviews:397, price:"$$", reservable:true, stars:4.7 },
          { place:"Blend Williamsburg", type:"brunch, happy hour, evening dinner", desc:"brunch, happy hour, evening dinner", booking:"https://www.blendwilliamsburg.com/", maps:"Blend+Williamsburg+Williamsburg+Brooklyn", reviews:1381, price:"$$", reservable:true, stars:4.3 }
        ],
      wine: [
          { place:"The Four Horsemen", type:"wine bar", desc:"wine bar", booking:"http://fourhorsemenbk.com/", maps:"The+Four+Horsemen+Williamsburg+Brooklyn", reviews:1106, price:"$$", reservable:true, stars:4.6 },
          { place:"Bouquet", type:"wine bar", desc:"wine bar", booking:"http://www.bouquetbk.com/", maps:"Bouquet+Williamsburg+Brooklyn", reviews:123, price:"$$", reservable:false, stars:4.9 },
          { place:"DOC Wine Bar", type:"wine bar, italian food", desc:"wine bar, italian food", booking:"http://www.docwinebar.com/", maps:"DOC+Wine+Bar+Williamsburg+Brooklyn", reviews:471, price:"$$", reservable:true, stars:4.4 },
          { place:"Maison Premiere", type:"wine bar", desc:"wine bar", booking:"http://maisonpremiere.com/", maps:"Maison+Premiere+Williamsburg+Brooklyn", reviews:2037, price:"$$$", reservable:true, stars:4.6 }
        ],
      experimental: [],
      speakeasy: [
          { place:"The Hidden Pearl", type:"speakeasy", desc:"speakeasy", booking:"https://www.hiddenpearlbk.com/", maps:"The+Hidden+Pearl+Williamsburg+Brooklyn", reviews:166, price:"$$", reservable:true, stars:4.8 }
        ],
    },
    food: {
      japanese: [
        { id:"midoomakaser", emoji:"🥢", place:"Mido - Omakase Room", type:"japanese", desc:"5.0★ · japanese", booking:"http://www.midojapanesegroup.com/", maps:"Mido++Omakase+Room", reviews:860, price:"$$", reservable:true, stars:5.0 },
        { id:"sushihayashi", emoji:"🥢", place:"Sushi Hayashi Williamsburg", type:"japanese", desc:"5.0★ · japanese", booking:"http://hayashinyc.com/", maps:"Sushi+Hayashi+Williamsburg", reviews:33, price:"$$", reservable:true, stars:5.0 },
        { id:"katabaru", emoji:"🥢", place:"Katabaru", type:"japanese", desc:"4.8★ · japanese", booking:"https://www.katabaru.nyc/", maps:"Katabaru", reviews:158, price:"$$", reservable:true, stars:4.8 },
        { id:"iwaksushikit", emoji:"🥢", place:"IWAK Sushi + Kitchen", type:"japanese", desc:"4.8★ · japanese", booking:"http://www.iwaksushi.com/", maps:"IWAK+Sushi++Kitchen", reviews:573, price:"$$", reservable:false, stars:4.8 },
        { id:"sushishiroba", emoji:"🥢", place:"Sushi Shiro Bar and Grill", type:"japanese", desc:"4.7★ · japanese", booking:"http://sushishironyc.com/", maps:"Sushi+Shiro+Bar+and+Grill", reviews:214, price:"$$", reservable:true, stars:4.7 },
        { id:"naminoriwill", emoji:"🥢", place:"Nami Nori Williamsburg", type:"japanese", desc:"Sushi rolls & sake in a sophisticated outfit with wood furnishings and a modern, minimalist vibe.", booking:"http://naminori.nyc/", maps:"Nami+Nori+Williamsburg", reviews:729, price:"$$", reservable:true, stars:4.6 },
        { id:"samuraimama", emoji:"🥢", place:"Samurai Mama", type:"japanese", desc:"This rustic Japanese restaurant with a communal table serves udon, sushi, miso & beer.", booking:"http://samuraimama.com/", maps:"Samurai+Mama", reviews:1020, price:"$$", reservable:true, stars:4.5 },
        { id:"fushimi", emoji:"🥢", place:"Fushimi", type:"japanese", desc:"Buzzing eatery & lounge offering Japanese dishes with a French twist, plus cocktails & beer.", booking:"https://fushimiwilliamsburg.com/", maps:"Fushimi", reviews:1798, price:"$$", reservable:true, stars:4.4 },
      ],
      pasta: [
        { id:"macoletta", emoji:"🍝", place:"Macoletta", type:"italian dinner", desc:"4.9★ · italian dinner", booking:"http://www.macoletta.com/", maps:"Macoletta", reviews:628, price:"$$", reservable:true, stars:4.9 },
        { id:"pecorarolatt", emoji:"🍝", place:"Pecoraro Latteria", type:"italian dinner", desc:"4.7★ · italian dinner", booking:"https://pecoraronyc.com/?utm_source=google", maps:"Pecoraro+Latteria", reviews:401, price:"$$", reservable:true, stars:4.7 },
        { id:"aurorabrookl", emoji:"🍝", place:"Aurora Brooklyn", type:"italian dinner", desc:"A Tuscan-styled dining room & a large, leafy garden set the stage for rustic Italian cooking.", booking:"https://aurorabk.com/", maps:"Aurora+Brooklyn", reviews:1580, price:"$$", reservable:true, stars:4.5 },
        { id:"bamontes", emoji:"🍝", place:"Bamonte's", type:"italian dinner", desc:"Circa-1900 neighborhood Italian restaurant plating red-sauce standards in a retro setting.", booking:"https://bamontes.shop/", maps:"Bamontes", reviews:1309, price:"$$", reservable:true, stars:4.5 },
        { id:"lanonnaristo", emoji:"🍝", place:"La Nonna Ristorante & Bar - Williamsburg, Brooklyn", type:"italian dinner", desc:"Upscale-casual Italian restaurant & wine bar offering traditional fare & outdoor seating.", booking:"http://www.lanonnabk.com/", maps:"La+Nonna+Ristorante++Bar++Williamsburg+Brooklyn", reviews:1034, price:"$$", reservable:true, stars:4.5 },
      ],
      pizza: [
        { id:"acespizza", emoji:"🍕", place:"Ace's Pizza", type:"pizza", desc:"Down-to-earth restaurant offering deep dish & thin crust pizza, plus garlic bread.", booking:"https://www.acespizzaspot.com/", maps:"Aces+Pizza", reviews:1231, price:"$", reservable:true, stars:4.8 },
      ],
      mediterranean: [
        { id:"fandimata", emoji:"🥙", place:"Fandi Mata", type:"mediterranean", desc:"Lively restaurant serving global cuisine & cocktails amid plant-filled, industrial-chic decor.", booking:"https://www.fandimata.com/", maps:"Fandi+Mata", reviews:4384, price:"$$", reservable:true, stars:4.7 },
        { id:"merakigreekb", emoji:"🥙", place:"Meraki Greek Bistro Williamsburg", type:"mediterranean", desc:"4.7★ · mediterranean", booking:"https://merakibrooklyn.com/", maps:"Meraki+Greek+Bistro+Williamsburg", reviews:806, price:"$$", reservable:true, stars:4.7 },
        { id:"bisbaslebane", emoji:"🥙", place:"Bis Bas Lebanese-Mediterranean Grill", type:"mediterranean", desc:"4.7★ · mediterranean", booking:"http://bisbas.com/", maps:"Bis+Bas+LebaneseMediterranean+Grill", reviews:541, price:"$", reservable:false, stars:4.7 },
        { id:"cafemogador", emoji:"🥙", place:"Cafe Mogador", type:"mediterranean", desc:"Bustling eatery for traditional Moroccan tagines, couscous, and more in cozy yet charming quarters.", booking:"http://www.cafemogador.com/", maps:"Cafe+Mogador", reviews:3342, price:"$$", reservable:true, stars:4.6 },
        { id:"levantine", emoji:"🥙", place:"Levantine", type:"mediterranean", desc:"Contemporary Mediterranean eatery with a market-driven vegetarian menu & tranquil garden patio.", booking:"http://www.levantinenyc.com/", maps:"Levantine", reviews:891, price:"$$", reservable:true, stars:4.5 },
      ],
      american: [
        { id:"destefanosst", emoji:"🥩", place:"DeStefano's Steakhouse", type:"american dinner", desc:"Steakhouse standards & wines served in a space with an old-school Italian vibe.", booking:"http://www.deesteakhouse.com/", maps:"DeStefanos+Steakhouse", reviews:1000, price:"$$$", reservable:true, stars:4.7 },
        { id:"stanselm", emoji:"🥩", place:"St. Anselm", type:"american dinner", desc:"Steaks and grilled seafood are the specialty of this brick-walled spot.", booking:"http://www.stanselm.net/", maps:"St+Anselm", reviews:1608, price:"$$$", reservable:true, stars:4.6 },
        { id:"ambersteakho", emoji:"🥩", place:"Amber Steak House", type:"american dinner", desc:"High-end steakhouse boasting gourmet seafood & fine wines in an old-fashioned, elegant venue.", booking:"http://ambersteak.house/", maps:"Amber+Steak+House", reviews:1130, price:"$$$", reservable:true, stars:4.6 },
        { id:"peterlugerst", emoji:"🥩", place:"Peter Luger Steak House", type:"american dinner", desc:"Cash-only steak icon where old-school waiters serve aged beef in a German beer hall setting.", booking:"https://peterluger.com/", maps:"Peter+Luger+Steak+House", reviews:15739, price:"$$$$", reservable:true, stars:4.4 },
      ],
      brunch: [
        { id:"islacowillia", emoji:"🥐", place:"Isla & Co. - Williamsburg", type:"brunch", desc:"4.9★ · brunch", booking:"https://www.isla-co.com/williamsburg", maps:"Isla++Co++Williamsburg", reviews:1633, price:"$$", reservable:true, stars:4.9 },
        { id:"holeinthewal", emoji:"🥐", place:"Hole In The Wall", type:"brunch", desc:"4.8★ · brunch", booking:"https://holeinthewallnyc.com/williamsburg-1", maps:"Hole+In+The+Wall", reviews:3975, price:"$$", reservable:true, stars:4.8 },
        { id:"sungold", emoji:"🥐", place:"Sungold", type:"brunch", desc:"4.8★ · brunch", booking:"https://www.sungoldbk.com/", maps:"Sungold", reviews:1251, price:"$$", reservable:true, stars:4.8 },
        { id:"sundayinbroo", emoji:"🥐", place:"Sunday In Brooklyn", type:"brunch", desc:"Atera alum's American restaurant with a marketplace, barroom & upstairs dining room & garden.", booking:"http://sundayinbrooklyn.com/", maps:"Sunday+In+Brooklyn", reviews:3907, price:"$$", reservable:true, stars:4.4 },
        { id:"cafecolette", emoji:"🥐", place:"Cafe Colette", type:"brunch", desc:"American eatery popular for brunch, with tin ceiling & zinc bar adding a vintage vibe.", booking:"https://www.cafe-colette.com/", maps:"Cafe+Colette", reviews:1164, price:"$$", reservable:true, stars:4.4 },
      ],
      latenight: [
        { id:"santafebk", emoji:"🌙", place:"Santa Fe BK", type:"late night", desc:"Relaxed spot dishing up Southwestern eats, including breakfast burritos & green chile cheeseburgers.", booking:"http://santafebk.com/", maps:"Santa+Fe+BK", reviews:631, price:"$$", reservable:true, stars:4.8 },
        { id:"nanxiangexpr", emoji:"🌙", place:"Nan Xiang Express - Williamsburg, NY", type:"late night", desc:"4.8★ · late night", booking:"https://nanxiangexpress.com/", maps:"Nan+Xiang+Express++Williamsburg+NY", reviews:873, price:"$$", reservable:false, stars:4.8 },
      ],
    },
    activities: { free: [], paid: [
          { place:"Bathhouse Williamsburg", type:"activity", desc:"activity", booking:"https://www.abathhouse.com/williamsburg?utm_source=google&utm_medium=organic&utm_campaign=gbp-website-williamsburg", maps:"Bathhouse+Williamsburg+Williamsburg+Brooklyn", reviews:3752, price:"$$", reservable:false, stars:4.3 },
        
          { id:"deadletterno9", emoji:"🎯", place:"Dead Letter No. 9", type:"cocktail + games", desc:"Cocktail bar with darts and games. Great casual date spot.", booking:null, maps:"Dead+Letter+No9+Williamsburg", reviews:382, price:"$$", reservable:false, stars:4.6 },
          { id:"recessgrove", emoji:"🌿", place:"recess grove", type:"outdoor bar", desc:"Chill outdoor bar. Low-key and fun.", booking:null, maps:"recess+grove+Williamsburg", reviews:76, price:"$$", reservable:true, stars:5.0 },
          { id:"sleepwalkact", emoji:"🕯️", place:"Sleepwalk", type:"cocktail bar", desc:"Moody cocktail bar on Bushwick Ave. Great late night energy.", booking:"http://www.sleepwalk.nyc/", maps:"Sleepwalk+Williamsburg", reviews:205, price:"$$", reservable:true, stars:4.7 },
        ] },
    happyHour: [
          { place:"Wandering Barman", type:"happy hour", desc:"happy hour", booking:"https://www.wanderingbarman.com/", maps:"Wandering+Barman+Williamsburg+Brooklyn", reviews:148, price:"$", reservable:false, stars:4.8 },
          { place:"Bee's Knees & Honey Lounge", type:"happy hour", desc:"happy hour", booking:"http://www.beeskneesbk.com/", maps:"Bees+Knees+&+Honey+Lounge+Williamsburg+Brooklyn", reviews:397, price:"$$", reservable:true, stars:4.7 },
          { place:"Blend Williamsburg", type:"brunch, happy hour, evening dinner", desc:"brunch, happy hour, evening dinner", booking:"https://www.blendwilliamsburg.com/", maps:"Blend+Williamsburg+Williamsburg+Brooklyn", reviews:1381, price:"$$", reservable:true, stars:4.3 }
        ],
  },
  east_village: {
    bars: {
      cocktails: [
          { place:"Two Perrys", type:"cocktail bar", desc:"cocktail bar", booking:null, maps:"Two+Perrys+East+Village+Manhattan", reviews:106, price:"$$", reservable:true, stars:4.9 },
          { place:"Sweet Linda", type:"Bar", desc:"Sweet Linda", booking:"https://sweetlindanyc.com/?utm_source=gbp&utm_medium=organic", maps:"Sweet+Linda+East+Village+Manhattan", reviews:230, price:"$$", reservable:true, stars:4.7 },
          { place:"Death & Co East Village", type:"Bar", desc:"Death & Co East Village", booking:"http://www.deathandcompany.com/", maps:"Death+&+Co+East+Village+East+Village+Manhattan", reviews:2077, price:"$$$", reservable:true, stars:4.5 },
          { place:"AURA Tapas & Cocktail Bar", type:"Bar", desc:"AURA Tapas & Cocktail Bar", booking:"http://www.aurabarandkitchen.com/", maps:"AURA+Tapas+&+Cocktail+Bar+East+Village+Manhattan", reviews:356, price:"$$", reservable:true, stars:4.9 },
          { place:"Ruffian", type:"Bar", desc:"Ruffian", booking:"http://www.ruffiannyc.com/", maps:"Ruffian+East+Village+Manhattan", reviews:423, price:"$$", reservable:true, stars:4.7 },
          { place:"Sorso'", type:"Bar", desc:"Sorso'", booking:"http://www.sorsonyc.com/", maps:"Sorso+East+Village+Manhattan", reviews:736, price:"$$", reservable:true, stars:4.9 },
          { place:"Stickett Inn", type:"Bar", desc:"Stickett Inn", booking:null, maps:"Stickett+Inn+East+Village+Manhattan", reviews:121, price:"$$", reservable:false, stars:4.6 },
          { place:"The Headless Widow", type:"Bar", desc:"The Headless Widow", booking:"https://www.theheadlesswidow.com/", maps:"The+Headless+Widow+East+Village+Manhattan", reviews:455, price:"$$", reservable:true, stars:4.6 },
          { place:"Maretta", type:"Bar", desc:"Maretta", booking:"https://www.marettanewyork.com/", maps:"Maretta+East+Village+Manhattan", reviews:217, price:"$$", reservable:true, stars:4.8 },
          { place:"Poppy", type:"Bar", desc:"Poppy", booking:"https://www.poppyeastvillage.com/", maps:"Poppy+East+Village+Manhattan", reviews:130, price:"$$", reservable:true, stars:4.9 },
          { place:"Café Maud", type:"Bar", desc:"Café Maud", booking:"https://www.cafemaud.com/eastvillage", maps:"Café+Maud+East+Village+Manhattan", reviews:529, price:"$$", reservable:true, stars:4.5 },
          { place:"Pardon My French", type:"Bar", desc:"Pardon My French", booking:"https://www.pmfnyc.com/", maps:"Pardon+My+French+East+Village+Manhattan", reviews:999, price:"$$$", reservable:true, stars:4.4 },
          { place:"Cafe Mogador", type:"Bar", desc:"Cafe Mogador", booking:"http://cafemogador.com/", maps:"Cafe+Mogador+East+Village+Manhattan", reviews:3032, price:"$$", reservable:true, stars:4.5 },
          { place:"A10 Kitchen", type:"Bar", desc:"A10 Kitchen", booking:"https://a10kitchen.com/", maps:"A10+Kitchen+East+Village+Manhattan", reviews:293, price:"$$", reservable:true, stars:4.5 },
          { place:"Via Della Pace", type:"Bar", desc:"Via Della Pace", booking:"http://viadellapacenyc.com/", maps:"Via+Della+Pace+East+Village+Manhattan", reviews:990, price:"$$", reservable:true, stars:4.6 },
          { place:"The Wayland", type:"Bar", desc:"The Wayland", booking:"http://thewaylandnyc.com/", maps:"The+Wayland+East+Village+Manhattan", reviews:885, price:"$$", reservable:true, stars:4.6 },
          { place:"Pineapple Club", type:"Bar", desc:"Pineapple Club", booking:"https://pineappleclub.com/", maps:"Pineapple+Club+East+Village+Manhattan", reviews:1155, price:"$$", reservable:true, stars:4.7 },
          { place:"The Last Resort", type:"Bar", desc:"The Last Resort", booking:null, maps:"The+Last+Resort+East+Village+Manhattan", reviews:37, price:"$$", reservable:false, stars:4.7 }
        ],
      beer: [],
      wine: [],
      experimental: [],
      speakeasy: [
          { place:"Please Don't Tell", type:"speakeasy", desc:"speakeasy", booking:"http://www.pdtnyc.com/", maps:"Please+Dont+Tell+East+Village+Manhattan", reviews:2417, price:"$$$", reservable:true, stars:4.3 },
          { place:"Hidden Tiger", type:"korean, food & drink", desc:"korean, food & drink", booking:"http://hiddentigernyc.com/", maps:"Hidden+Tiger+East+Village+Manhattan", reviews:84, price:"$$", reservable:true, stars:4.3 }
        ],
    },
    food: {
      japanese: [
        { id:"secchuyokota", emoji:"🥢", place:"Secchu Yokota 折衷よこ田", type:"japanese", desc:"An omakase menu focused on seasonal tempura in a modern, intimate dining room with an open kitchen.", booking:"http://www.secchuyokota.com/", maps:"Secchu+Yokota+", reviews:313, price:"$$", reservable:true, stars:4.9 },
        { id:"odoeastvilla", emoji:"🥢", place:"Odo East Village", type:"japanese", desc:"4.9★ · japanese", booking:"https://www.odoeastvillage.nyc/", maps:"Odo+East+Village", reviews:22, price:"$$", reservable:true, stars:4.9 },
        { id:"yakinikugene", emoji:"🥢", place:"Yakiniku Gen East Village", type:"japanese", desc:"4.9★ · japanese", booking:"https://yakinikugen.com/", maps:"Yakiniku+Gen+East+Village", reviews:1330, price:"$$", reservable:true, stars:4.9 },
        { id:"rosella", emoji:"🥢", place:"Rosella", type:"japanese", desc:"Trendy restaurant offering Japanese cuisine including sushi, rice bowls & soup, plus sake & wine.", booking:"http://www.rosellanyc.com/", maps:"Rosella", reviews:398, price:"$$", reservable:true, stars:4.7 },
        { id:"taishokennyc", emoji:"🥢", place:"Taishoken NYC", type:"japanese", desc:"4.6★ · japanese", booking:"http://www.nyc-taishoken.com/", maps:"Taishoken+NYC", reviews:186, price:"$$", reservable:true, stars:4.6 },
      ],
      pasta: [
        { id:"pastarullo", emoji:"🍝", place:"Pasta Rullo", type:"italian dinner", desc:"4.9★ · italian dinner", booking:"https://pastarullo.com/", maps:"Pasta+Rullo", reviews:805, price:"$$", reservable:false, stars:4.9 },
        { id:"maretta", emoji:"🍝", place:"Maretta", type:"italian dinner", desc:"4.8★ · italian dinner", booking:"https://www.marettanewyork.com/", maps:"Maretta", reviews:217, price:"$$", reservable:true, stars:4.8 },
        { id:"ilpostoaccan", emoji:"🍝", place:"Il Posto Accanto", type:"italian dinner", desc:"Italian wines are paired with small plates at this rustic, brick-walled wine bar.", booking:"http://ilpostoaccantonyc.com/", maps:"Il+Posto+Accanto", reviews:596, price:"$$", reservable:true, stars:4.6 },
        { id:"viadellapace", emoji:"🍝", place:"Via Della Pace", type:"italian dinner", desc:"Cozy, cash-only Italian restaurant in the East Village lined with exposed brick.", booking:"http://viadellapacenyc.com/", maps:"Via+Della+Pace", reviews:990, price:"$$", reservable:true, stars:4.6 },
      ],
      pizza: [
        { id:"popspizzaofe", emoji:"🍕", place:"Pop's Pizza of East Village", type:"pizza", desc:"5.0★ · pizza", booking:"http://popspizzanyc.com/", maps:"Pops+Pizza+of+East+Village", reviews:975, price:"$$", reservable:true, stars:5.0 },
        { id:"cellospizzer", emoji:"🍕", place:"Cello's Pizzeria", type:"pizza", desc:"4.8★ · pizza", booking:"http://www.cellosnyc.com/", maps:"Cellos+Pizzeria", reviews:888, price:"$", reservable:false, stars:4.8 },
        { id:"motorinopizz", emoji:"🍕", place:"Motorino Pizza", type:"pizza", desc:"Casual restaurant featuring artisanal, Neapolitan-style thin-crust pizzas, plus wine & beer.", booking:"https://www.motorinopizza.com/", maps:"Motorino+Pizza", reviews:764, price:"$$", reservable:true, stars:4.4 },
      ],
      mediterranean: [
        { id:"fattoush", emoji:"🥙", place:"Fattoush", type:"mediterranean", desc:"4.9★ · mediterranean", booking:"https://www.fattousheastvillage.com/", maps:"Fattoush", reviews:268, price:"$$", reservable:true, stars:4.9 },
        { id:"zestytabboul", emoji:"🥙", place:"Zesty Tabbouleh", type:"mediterranean", desc:"4.9★ · mediterranean", booking:"https://www.zestytabbouleh.com/", maps:"Zesty+Tabbouleh", reviews:161, price:"$$", reservable:true, stars:4.9 },
        { id:"joseluismedi", emoji:"🥙", place:"Jose Luis Mediterranean Cuisine", type:"mediterranean", desc:"Tapas, paellas & pasta are served in this relaxed restaurant that has snug surroundings & a patio.", booking:"http://joseluisnewyork.com/", maps:"Jose+Luis+Mediterranean+Cuisine", reviews:703, price:"$$", reservable:true, stars:4.8 },
        { id:"barbounia", emoji:"🥙", place:"Barbounia", type:"mediterranean", desc:"4.7★ · mediterranean", booking:"https://barbounia.com/", maps:"Barbounia", reviews:4864, price:"$$$", reservable:true, stars:4.7 },
        { id:"baladeauthen", emoji:"🥙", place:"Balade | Authentic Lebanese Restaurant | East Village, NYC", type:"mediterranean", desc:"Lebanese bistro offering classic & creative dishes, such as kebabs & pita pizzas, plus beer & wine.", booking:"https://baladerestaurants.com/?utm_source=google", maps:"Balade++Authentic+Lebanese+Restaurant++East+Village+NYC", reviews:1562, price:"$$", reservable:true, stars:4.5 },
      ],
      american: [
          { place:"Plado Tasting Bar", type:"Bar", desc:"Plado Tasting Bar", booking:"https://pladohospitality.com/", maps:"Plado+Tasting+Bar+East+Village+Manhattan", reviews:431, price:"$$", reservable:true, stars:4.7 },
          { place:"Bungalow", type:"Bar", desc:"Bungalow", booking:"https://www.bungalowny.com/", maps:"Bungalow+East+Village+Manhattan", reviews:2344, price:"$$", reservable:true, stars:4.4 },
          { place:"Smør", type:"Bar", desc:"Smør", booking:"http://www.smornyc.com/", maps:"Smør+East+Village+Manhattan", reviews:468, price:"$$", reservable:true, stars:4.6 },
          { place:"Thursday Kitchen", type:"Bar", desc:"Thursday Kitchen", booking:"http://www.thursdaykitchen.com/", maps:"Thursday+Kitchen+East+Village+Manhattan", reviews:1417, price:"$$", reservable:false, stars:4.6 }
        ],
      brunch: [
        { id:"poppy", emoji:"🥐", place:"Poppy", type:"brunch", desc:"4.9★ · brunch", booking:"https://www.poppyeastvillage.com/", maps:"Poppy", reviews:130, price:"$$", reservable:true, stars:4.9 },
        { id:"cafmaud", emoji:"🥐", place:"Café Maud", type:"brunch", desc:"4.5★ · brunch", booking:"https://www.cafemaud.com/eastvillage", maps:"Caf+Maud", reviews:529, price:"$$", reservable:true, stars:4.5 },
        { id:"cafemogador", emoji:"🥐", place:"Cafe Mogador", type:"brunch", desc:"Classic Moroccan flavors & outdoor seating draw a bohemian crowd to this neighborhood standby.", booking:"http://cafemogador.com/", maps:"Cafe+Mogador", reviews:3033, price:"$$", reservable:true, stars:4.5 },
        { id:"post", emoji:"🥐", place:"POST", type:"brunch", desc:"Gourmet American eats & cocktails in a narrow, stylish space with a whitewashed bar & painted brick.", booking:"http://www.post-nyc.com/", maps:"POST", reviews:467, price:"$$", reservable:true, stars:4.5 },
      ],
      latenight: [
          { place:"Plado Tasting Bar", type:"Bar", desc:"Plado Tasting Bar", booking:"https://pladohospitality.com/", maps:"Plado+Tasting+Bar+East+Village+Manhattan", reviews:431, price:"$$", reservable:true, stars:4.7 },
          { place:"Bungalow", type:"Bar", desc:"Bungalow", booking:"https://www.bungalowny.com/", maps:"Bungalow+East+Village+Manhattan", reviews:2344, price:"$$", reservable:true, stars:4.4 },
          { place:"Smør", type:"Bar", desc:"Smør", booking:"http://www.smornyc.com/", maps:"Smør+East+Village+Manhattan", reviews:468, price:"$$", reservable:true, stars:4.6 },
          { place:"Thursday Kitchen", type:"Bar", desc:"Thursday Kitchen", booking:"http://www.thursdaykitchen.com/", maps:"Thursday+Kitchen+East+Village+Manhattan", reviews:1417, price:"$$", reservable:false, stars:4.6 },
        
        { id:"nofork", emoji:"🌙", place:"No Fork", type:"late night", desc:"4.9★ · late night", booking:null, maps:"No+Fork", reviews:401, price:"$$", reservable:false, stars:4.9 },
        { id:"soothr", emoji:"🌙", place:"Soothr", type:"late night", desc:"Intimate space with al fresco dining, offering Thai noodles and soups, plus cocktails.", booking:"http://soothrnyc.com/", maps:"Soothr", reviews:5853, price:"$$", reservable:true, stars:4.7 },
        { id:"thesmith", emoji:"🌙", place:"The Smith", type:"late night", desc:"Trendy types gather for American eats & specialty drinks at this upbeat hangout & brunch favorite.", booking:"https://thesmithrestaurant.com/location/east-village/", maps:"The+Smith", reviews:2879, price:"$$", reservable:true, stars:4.4 },
        { id:"bungalow", emoji:"🌙", place:"Bungalow", type:"late night", desc:"4.4★ · late night", booking:"https://www.bungalowny.com/", maps:"Bungalow", reviews:2344, price:"$$", reservable:true, stars:4.4 },
      ],
    },
    activities: { free: [], paid: [
          { id:"nycomedyclubev", emoji:"😂", place:"New York Comedy Club", type:"comedy", desc:"One of NYC's most respected comedy clubs. Intimate room, strong lineups.", booking:"https://newyorkcomedyclub.com/", maps:"New+York+Comedy+Club+East+Village", reviews:956, price:"$$", reservable:true, stars:4.3 },
          { id:"stmarkscc", emoji:"😂", place:"St. Marks Comedy Club", type:"comedy", desc:"Comedy club on St. Marks Place. Great for a first date.", booking:null, maps:"St+Marks+Comedy+Club+East+Village", reviews:829, price:"$$", reservable:false, stars:4.3 },
          { id:"topsecretcc", emoji:"😂", place:"Top Secret Comedy Club", type:"comedy", desc:"Intimate comedy show in the East Village.", booking:"https://www.topsecretcomedy.com/", maps:"Top+Secret+Comedy+Club+East+Village", reviews:252, price:"$$", reservable:true, stars:4.9 },
        ] },
    happyHour: [
          { place:"Lovers of Today", type:"Speakeasy Bar", desc:"50% off cocktails early evening. Most romantic happy hour in the neighborhood.", deal:"50% off cocktails", hours:"Daily 5–8pm", booking:null, maps:"Lovers+of+Today+East+Village+NYC", reviews:640, price:"$$", reservable:false, stars:4.6 },
          { place:"Alison St. Marks", type:"Oyster Bar", desc:"The best value happy hour in the East Village. Don't miss the oysters.", deal:"$1.50 oysters + $9 wine", hours:"Tue–Fri noon–7pm", booking:null, maps:"Alison+St+Marks+East+Village+NYC", reviews:520, price:"$$", reservable:false, stars:4.5 },
          { place:"Death & Co", type:"Cocktail Bar", desc:"Early hour discounts at one of NYC's most acclaimed bars.", deal:"$12 cocktails", hours:"Mon–Fri 5–7pm", booking:"deathandcompany.com", maps:"Death+and+Co+East+Village+NYC", reviews:2077, price:"$$$", reservable:true, stars:4.5 },
          { place:"The Wayland", type:"Neighborhood Bar", desc:"Laid-back happy hour with great cocktails and a relaxed crowd.", deal:"$8 wines + $6 beers", hours:"Daily 4–7pm", booking:null, maps:"The+Wayland+East+Village+NYC", reviews:885, price:"$$", reservable:true, stars:4.6 },
        ],
  },
  west_village: {
    bars: {
      cocktails: [
          { place:"Dante West Village", type:"Bar", desc:"Dante West Village", booking:"https://www.dante-nyc.com/wv/", maps:"Dante+West+Village+West+Village+Manhattan", reviews:1198, price:"$$$", reservable:true, stars:4.5 },
          { place:"Serpentine", type:"Bar", desc:"Serpentine", booking:"https://www.serpentinenyc.com/", maps:"Serpentine+West+Village+Manhattan", reviews:138, price:"$$", reservable:true, stars:4.6 },
          { place:"Do Not Disturb", type:"Bar", desc:"Do Not Disturb", booking:"http://www.dnd-nyc.com/", maps:"Do+Not+Disturb+West+Village+Manhattan", reviews:561, price:"$$", reservable:true, stars:4.6 },
          { place:"WEST10WEST", type:"Bar", desc:"WEST10WEST", booking:"http://www.west10west.com/", maps:"WEST10WEST+West+Village+Manhattan", reviews:320, price:"$$", reservable:true, stars:4.8 },
          { place:"LELABAR", type:"Bar", desc:"LELABAR", booking:"http://www.lelabar.com/", maps:"LELABAR+West+Village+Manhattan", reviews:357, price:"$$", reservable:true, stars:4.6 },
          { place:"Cork Soho", type:"Bar", desc:"Cork Soho", booking:"http://corkny.com/", maps:"Cork+Soho+West+Village+Manhattan", reviews:230, price:"$$", reservable:true, stars:4.8 },
          { place:"St Tropez West Village", type:"Bar", desc:"St Tropez West Village", booking:"https://www.sttropezwinebar.com/", maps:"St+Tropez+West+Village+West+Village+Manhattan", reviews:944, price:"$$", reservable:true, stars:4.6 },
          { place:"The Garret", type:"Bar", desc:"The Garret", booking:"http://www.thegarretbars.com/", maps:"The+Garret+West+Village+Manhattan", reviews:833, price:"$$", reservable:false, stars:4.2 },
          { place:"Employees Only", type:"Bar", desc:"Employees Only", booking:"http://www.employeesonlynyc.com/", maps:"Employees+Only+West+Village+Manhattan", reviews:3129, price:"$$$", reservable:true, stars:4.2 },
          { place:"Angel's Share", type:"Bar", desc:"Angel's Share", booking:"http://www.angelssharenyc.com/", maps:"Angel's+Share+West+Village+Manhattan", reviews:1804, price:"$$", reservable:false, stars:4.4 },
          { place:"The Mary Lane", type:"Bar", desc:"The Mary Lane", booking:"https://www.themarylanenyc.com/", maps:"The+Mary+Lane+West+Village+Manhattan", reviews:443, price:"$$", reservable:true, stars:4.6 },
          { place:"The Happiest Hour", type:"Bar", desc:"The Happiest Hour", booking:"http://happiesthournyc.com/", maps:"The+Happiest+Hour+West+Village+Manhattan", reviews:1070, price:"$$", reservable:true, stars:4.1 },
          { place:"Turks & Frogs", type:"Bar", desc:"Turks & Frogs", booking:"http://www.turksandfrogs.com/", maps:"Turks+&+Frogs+West+Village+Manhattan", reviews:165, price:"$$", reservable:true, stars:4.4 }
        ],
      beer: [],
      wine: [
          { place:"Entwine Cocktail Bar", type:"Bar", desc:"Entwine Cocktail Bar", booking:"http://www.entwinenyc.com/", maps:"Entwine+Cocktail+Bar+West+Village+Manhattan", reviews:428, price:"$$", reservable:true, stars:4.5 },
          { place:"Amélie West Village Restaurant, Bistro & Wine Bar", type:"Bar", desc:"Amélie West Village Restaurant, Bistro & Wine Bar", booking:"http://www.ameliewinebar.com/", maps:"Amélie+West+Village+Restaurant,+Bistro+&+Wine+Bar+West+Village+Manhattan", reviews:1444, price:"$$", reservable:true, stars:4.6 },
          { place:"CARTA Wine Bar New York", type:"Bar", desc:"CARTA Wine Bar New York", booking:"http://cartawinebar.com/", maps:"CARTA+Wine+Bar+New+York+West+Village+Manhattan", reviews:91, price:"$$", reservable:true, stars:4.7 },
          { place:"Society Cafe", type:"Bar", desc:"Society Cafe", booking:"https://www.societycafenyc.com/", maps:"Society+Cafe+West+Village+Manhattan", reviews:687, price:"$$", reservable:true, stars:4.5 },
          { place:"St Jardim", type:"Bar", desc:"St Jardim", booking:"http://www.stjardimnyc.com/", maps:"St+Jardim+West+Village+Manhattan", reviews:351, price:"$$", reservable:true, stars:4.5 }
        ],
      experimental: [],
      speakeasy: [
          { place:"Little Branch", type:"Bar", desc:"Little Branch", booking:null, maps:"Little+Branch+West+Village+Manhattan", reviews:904, price:"$$$", reservable:false, stars:4.4 }
        ],
    },
    food: {
      japanese: [
        { id:"midoomakasew", emoji:"🥢", place:"Mido Omakase - West Village", type:"japanese", desc:"4.9★ · japanese", booking:"https://midojapanesegroup.com/", maps:"Mido+Omakase++West+Village", reviews:424, price:"$$", reservable:true, stars:4.9 },
        { id:"blueribbonsu", emoji:"🥢", place:"Blue Ribbon Sushi & Sake", type:"japanese", desc:"4.9★ · japanese", booking:"https://www.blueribbonsushiandsake.com/", maps:"Blue+Ribbon+Sushi++Sake", reviews:68, price:"$$", reservable:true, stars:4.9 },
        { id:"fukuomakase", emoji:"🥢", place:"Fuku Omakase", type:"japanese", desc:"4.8★ · japanese", booking:"http://fukuomakase.com/", maps:"Fuku+Omakase", reviews:331, price:"$$", reservable:true, stars:4.8 },
        { id:"sushimakotoo", emoji:"🥢", place:"Sushi Makoto - Omakase", type:"japanese", desc:"4.8★ · japanese", booking:"http://sushimakoto.com/", maps:"Sushi+Makoto++Omakase", reviews:359, price:"$$", reservable:true, stars:4.8 },
        { id:"naminoriwest", emoji:"🥢", place:"Nami Nori West Village", type:"japanese", desc:"Temaki hand rolls and other Japanese bites served in a minimalist setting with neutral tones.", booking:"http://naminori.nyc/", maps:"Nami+Nori+West+Village", reviews:1796, price:"$$", reservable:true, stars:4.4 },
      ],
      pasta: [
          { place:"Canto West Village", type:"Bar", desc:"Canto West Village", booking:"https://www.cantonyc.com/", maps:"Canto+West+Village+West+Village+Manhattan", reviews:1549, price:"$$", reservable:true, stars:4.6 },
          { place:"Boucherie West Village", type:"Bar", desc:"Boucherie West Village", booking:"https://www.boucherieus.com/west-village-menus/", maps:"Boucherie+West+Village+West+Village+Manhattan", reviews:9271, price:"$$$", reservable:true, stars:4.8 },
          { place:"Joseph Leonard", type:"Bar", desc:"Joseph Leonard", booking:"http://www.josephleonard.com/", maps:"Joseph+Leonard+West+Village+Manhattan", reviews:1362, price:"$$$", reservable:true, stars:4.6 },
          { place:"Le Petit Village", type:"Bar", desc:"Le Petit Village", booking:"https://www.lepetitvillagenyc.com/", maps:"Le+Petit+Village+West+Village+Manhattan", reviews:581, price:"$$", reservable:true, stars:4.7 },
        
        { id:"osterianonni", emoji:"🍝", place:"Osteria Nonnino", type:"italian dinner", desc:"4.8★ · italian dinner", booking:"http://www.osterianonnino.com/", maps:"Osteria+Nonnino", reviews:3761, price:"$$", reservable:true, stars:4.8 },
        { id:"osteriacarli", emoji:"🍝", place:"Osteria Carlina West Village", type:"italian dinner", desc:"Quaint Italian restaurant serving pasta, meat dishes & desserts, plus weekend brunch & wine.", booking:"http://www.osteriacarlina.com/", maps:"Osteria+Carlina+West+Village", reviews:914, price:"$$", reservable:true, stars:4.7 },
        { id:"cantowestvil", emoji:"🍝", place:"Canto West Village", type:"italian dinner", desc:"Vibrant outfit with exposed bricks & a wood ceiling serving Italian classics & cocktails.", booking:"https://www.cantonyc.com/", maps:"Canto+West+Village", reviews:1549, price:"$$", reservable:true, stars:4.6 },
        { id:"palma", emoji:"🍝", place:"Palma", type:"italian dinner", desc:"Italian classics are crafted from organic ingredients in a sunwashed stucco space with a garden.", booking:"https://www.palmanyc.com/", maps:"Palma", reviews:1162, price:"$$$", reservable:true, stars:4.6 },
        { id:"lalanternadi", emoji:"🍝", place:"La Lanterna di Vittorio", type:"italian dinner", desc:"A lantern-lit indoor garden & live jazz in the adjoining bar complement light Italian fare.", booking:"http://lalanterna.nyc/", maps:"La+Lanterna+di+Vittorio", reviews:2387, price:"$$", reservable:true, stars:4.5 },
      ],
      pizza: [
        { id:"fermentopizz", emoji:"🍕", place:"Fermento Pizza NYC", type:"pizza", desc:"5.0★ · pizza", booking:"https://www.fermentonyc.com/", maps:"Fermento+Pizza+NYC", reviews:77, price:"$$", reservable:false, stars:5.0 },
      ],
      mediterranean: [],
      american: [
          { place:"Canto West Village", type:"Bar", desc:"Canto West Village", booking:"https://www.cantonyc.com/", maps:"Canto+West+Village+West+Village+Manhattan", reviews:1549, price:"$$", reservable:true, stars:4.6 },
          { place:"Boucherie West Village", type:"Bar", desc:"Boucherie West Village", booking:"https://www.boucherieus.com/west-village-menus/", maps:"Boucherie+West+Village+West+Village+Manhattan", reviews:9271, price:"$$$", reservable:true, stars:4.8 },
          { place:"Little Ruby's West Village", type:"Bar", desc:"Little Ruby's West Village", booking:"https://www.rubyscafe.com/", maps:"Little+Rubys+West+Village+West+Village+Manhattan", reviews:755, price:"$$", reservable:true, stars:4.4 },
          { place:"Joseph Leonard", type:"Bar", desc:"Joseph Leonard", booking:"http://www.josephleonard.com/", maps:"Joseph+Leonard+West+Village+Manhattan", reviews:1362, price:"$$$", reservable:true, stars:4.6 },
          { place:"Le Petit Village", type:"Bar", desc:"Le Petit Village", booking:"https://www.lepetitvillagenyc.com/", maps:"Le+Petit+Village+West+Village+Manhattan", reviews:581, price:"$$", reservable:true, stars:4.7 }
        ],
      brunch: [
        { id:"sunrisetcaf", emoji:"🥐", place:"Sunriset Café", type:"brunch", desc:"4.9★ · brunch", booking:"https://sunrisetcafe.com/", maps:"Sunriset+Caf", reviews:35, price:"$$", reservable:false, stars:4.9 },
        { id:"boucheriewes", emoji:"🥐", place:"Boucherie West Village", type:"brunch", desc:"Two-floor bistro serving dry-aged steaks and other French fare, with a bar that's strong on absinthe.", booking:"https://www.boucherieus.com/west-village-menus/", maps:"Boucherie+West+Village", reviews:9270, price:"$$$", reservable:true, stars:4.8 },
        { id:"hungryllama", emoji:"🥐", place:"Hungry Llama", type:"brunch", desc:"4.8★ · brunch", booking:"https://www.hungryllamacafe.com/", maps:"Hungry+Llama", reviews:342, price:"$$", reservable:false, stars:4.8 },
        { id:"themarylane", emoji:"🥐", place:"The Mary Lane", type:"brunch", desc:"4.6★ · brunch", booking:"https://www.themarylanenyc.com/", maps:"The+Mary+Lane", reviews:443, price:"$$", reservable:true, stars:4.6 },
        { id:"littlerubysw", emoji:"🥐", place:"Little Ruby's West Village", type:"brunch", desc:"4.4★ · brunch", booking:"https://www.rubyscafe.com/", maps:"Little+Rubys+West+Village", reviews:755, price:"$$", reservable:true, stars:4.4 },
      ],
      latenight: [
          { place:"Canto West Village", type:"Bar", desc:"Canto West Village", booking:"https://www.cantonyc.com/", maps:"Canto+West+Village+West+Village+Manhattan", reviews:1549, price:"$$", reservable:true, stars:4.6 },
          { place:"Boucherie West Village", type:"Bar", desc:"Boucherie West Village", booking:"https://www.boucherieus.com/west-village-menus/", maps:"Boucherie+West+Village+West+Village+Manhattan", reviews:9271, price:"$$$", reservable:true, stars:4.8 },
          { place:"Little Ruby's West Village", type:"Bar", desc:"Little Ruby's West Village", booking:"https://www.rubyscafe.com/", maps:"Little+Rubys+West+Village+West+Village+Manhattan", reviews:755, price:"$$", reservable:true, stars:4.4 },
          { place:"Joseph Leonard", type:"Bar", desc:"Joseph Leonard", booking:"http://www.josephleonard.com/", maps:"Joseph+Leonard+West+Village+Manhattan", reviews:1362, price:"$$$", reservable:true, stars:4.6 },
          { place:"Le Petit Village", type:"Bar", desc:"Le Petit Village", booking:"https://www.lepetitvillagenyc.com/", maps:"Le+Petit+Village+West+Village+Manhattan", reviews:581, price:"$$", reservable:true, stars:4.7 },
        
        { id:"west10west", emoji:"🌙", place:"WEST10WEST", type:"late night", desc:"4.8★ · late night", booking:"http://www.west10west.com/", maps:"WEST10WEST", reviews:320, price:"$$", reservable:true, stars:4.8 },
      ],
    },
    activities: { free: [], paid: [
          { place:"Pier 57", type:"Bar", desc:"Pier 57", booking:"https://www.pier57nyc.com/", maps:"Pier+57+West+Village+Manhattan", reviews:1870, price:"$$", reservable:false, stars:4.7 },
        
          { id:"moonflowerwv", emoji:"🌸", place:"Moonflower", type:"floral cocktail bar", desc:"Tiny floral cocktail bar. Intimate and absolutely unique.", booking:null, maps:"Moonflower+West+Village+NYC", reviews:114, price:"$$", reservable:false, stars:4.5 },
        ] },
    happyHour: [
          { place:"Amelie Wine Bar", type:"French Wine Bar", desc:"Half-price bottles on select wines. Best wine happy hour in the Village.", deal:"50% off select bottles", hours:"Tue–Fri 5–7pm", booking:"amelienyc.com", maps:"Amelie+Wine+Bar+West+Village+NYC", reviews:1444, price:"$$", reservable:true, stars:4.6 },
          { place:"Jeffrey's Grocery", type:"Oyster Bar", desc:"$1 oysters and $8 wines on Waverly Place. Get there early.", deal:"$1 oysters + $8 wine", hours:"Mon–Fri 5–6:30pm", booking:"jeffreysgrocery.com", maps:"Jeffreys+Grocery+West+Village+NYC", reviews:2200, price:"$$", reservable:true, stars:4.5 },
          { place:"Dante West Village", type:"Cocktail Bar", desc:"World's 50 Best Bars. Negroni hour you won't forget.", deal:"$12 negronis", hours:"Daily 3–6pm", booking:"dante-nyc.com", maps:"Dante+West+Village+NYC", reviews:1199, price:"$$$", reservable:true, stars:4.5 },
          { place:"Corner Bistro", type:"Dive Bar", desc:"$5 beers all day every day. The West Village's best value.", deal:"$5 beers all day", hours:"Daily 11:30am–4am", booking:null, maps:"Corner+Bistro+West+Village+NYC", reviews:4200, price:"$", reservable:false, stars:4.2 },
        ],
  },
  midtown: {
    bars: {
      cocktails: [
          { place:"Madame George", type:"Bar", desc:"Madame George", booking:"https://www.madamegeorgenyc.com/", maps:"Madame+George+Midtown+Manhattan", reviews:530, price:"$$", reservable:true, stars:4.7 },
          { place:"The Dickens", type:"Bar", desc:"The Dickens", booking:"https://www.thedickensnyc.com/", maps:"The+Dickens+Midtown+Manhattan", reviews:2143, price:"$$", reservable:true, stars:4.8 },
          { place:"Sir Henry's", type:"Bar", desc:"Sir Henry's", booking:"https://sirhenrysnyc.com/", maps:"Sir+Henry's+Midtown+Manhattan", reviews:1198, price:"$$", reservable:true, stars:4.8 },
          { place:"Shaken Not Stirred", type:"Bar", desc:"Shaken Not Stirred", booking:"http://shakennotstirrednyc.com/", maps:"Shaken+Not+Stirred+Midtown+Manhattan", reviews:579, price:"$$", reservable:true, stars:4.8 },
          { place:"AperiBar", type:"Bar", desc:"AperiBar", booking:"https://www.aperibar.com/", maps:"AperiBar+Midtown+Manhattan", reviews:1082, price:"$$", reservable:true, stars:4.8 },
          { place:"The Parlour Room", type:"Bar", desc:"The Parlour Room", booking:"https://www.parlourroomnyc.com/", maps:"The+Parlour+Room+Midtown+Manhattan", reviews:971, price:"$$", reservable:true, stars:4.7 },
          { place:"The Woo Woo", type:"Bar", desc:"The Woo Woo", booking:"https://thewoowoonyc.com/", maps:"The+Woo+Woo+Midtown+Manhattan", reviews:1937, price:"$$", reservable:true, stars:4.8 },
          { place:"Patent Pending", type:"Bar", desc:"Patent Pending", booking:"https://www.patentpendingnyc.com/", maps:"Patent+Pending+Midtown+Manhattan", reviews:1084, price:"$$$", reservable:true, stars:4.4 },
          { place:"George Bang Bang", type:"Bar", desc:"George Bang Bang", booking:"http://www.gbbnyc.com/", maps:"George+Bang+Bang+Midtown+Manhattan", reviews:334, price:"$$", reservable:true, stars:4.6 },
          { place:"LOLITA", type:"Bar", desc:"LOLITA", booking:"https://www.lolitanewyorkcity.com/", maps:"LOLITA+Midtown+Manhattan", reviews:571, price:"$$", reservable:true, stars:4.6 },
          { place:"Isla & Co. - Midtown", type:"Bar", desc:"Isla & Co. - Midtown", booking:"http://www.isla-co.com/", maps:"Isla+&+Co.+-+Midtown+Midtown+Manhattan", reviews:4797, price:"$$", reservable:true, stars:4.8 },
          { place:"STK Steakhouse Midtown NYC", type:"Bar", desc:"STK Steakhouse Midtown NYC", booking:"https://stksteakhouse.com/venues/nyc-midtown/", maps:"STK+Steakhouse+Midtown+NYC+Midtown+Manhattan", reviews:36675, price:"$$$", reservable:true, stars:4.8 },
          { place:"VALERIE", type:"Bar", desc:"VALERIE", booking:"https://www.valerienewyorkcity.com/", maps:"VALERIE+Midtown+Manhattan", reviews:2213, price:"$$", reservable:true, stars:4.4 },
          { place:"Albert's Bar", type:"Bar", desc:"Albert's Bar", booking:"https://www.albertsbar.com/", maps:"Albert's+Bar+Midtown+Manhattan", reviews:493, price:"$$", reservable:true, stars:4.5 },
          { place:"Vida Verde - Tequila Bar", type:"Bar", desc:"Vida Verde - Tequila Bar", booking:"https://www.vidaverdeny.com/", maps:"Vida+Verde+-+Tequila+Bar+Midtown+Manhattan", reviews:4200, price:"$$", reservable:true, stars:4.6 }
        ],
      beer: [],
      wine: [
          { place:"Sofia Wine Bar", type:"Bar", desc:"Sofia Wine Bar", booking:"http://sofiawinebar.com/", maps:"Sofia+Wine+Bar+Midtown+Manhattan", reviews:634, price:"$$", reservable:false, stars:4.6 },
          { place:"Ayza Wine & Chocolate Bar", type:"Bar", desc:"Ayza Wine & Chocolate Bar", booking:"https://ayzanyc.com/", maps:"Ayza+Wine+&+Chocolate+Bar+Midtown+Manhattan", reviews:2184, price:"$$", reservable:true, stars:4.5 }
        ],
      experimental: [
          { place:"Vintage Green Rooftop", type:"Bar", desc:"Vintage Green Rooftop", booking:"https://vintagegreen.nyc/", maps:"Vintage+Green+Rooftop+Midtown+Manhattan", reviews:2673, price:"$$", reservable:true, stars:4.9 },
        
        { id:"vintagegreen", emoji:"🌆", place:"Vintage Green Rooftop", type:"rooftop", desc:"4.9★ · rooftop", booking:"https://vintagegreen.nyc/", maps:"Vintage+Green+Rooftop", reviews:2674, price:"$$", reservable:true, stars:4.9 },
        { id:"artmidtownro", emoji:"🌆", place:"ART Midtown - Rooftop Bars Midtown, NYC (Arlo Midtown)", type:"rooftop", desc:"4.6★ · rooftop", booking:"https://artrooftops.com/location/midtown/", maps:"ART+Midtown++Rooftop+Bars+Midtown+NYC+Arlo+Midtown", reviews:154, price:"$$", reservable:true, stars:4.6 },
        { id:"refineryroof", emoji:"🌆", place:"Refinery Rooftop", type:"rooftop", desc:"Industrial-chic rooftop spot in the Refinery Hotel featuring cocktails, light fare, and dramatic views.", booking:"https://refineryrooftop.com/", maps:"Refinery+Rooftop", reviews:4262, price:"$$$", reservable:true, stars:4.5 },
        { id:"rt60rooftopb", emoji:"🌆", place:"RT60 Rooftop Bar & Lounge", type:"rooftop", desc:"Sleek, music-themed bar offering craft cocktails, beer & small plates, plus terraces & live DJs.", booking:"https://hotel.hardrock.com/new-york/rt60-rooftop-bar.aspx?utm_campaign=hri%20%7C%20hotel%20%7C%20new-york%20%7C%20websitelisting&utm_medium=referral&utm_source=gmb", maps:"RT60+Rooftop+Bar++Lounge", reviews:808, price:"$$", reservable:true, stars:4.4 },
        { id:"230fifthroof", emoji:"🌆", place:"230 Fifth Rooftop Bar", type:"rooftop", desc:"Chic penthouse bar & lounge featuring a rooftop garden & live music, plus global bites & brunch.", booking:"http://www.230-fifth.com/", maps:"230+Fifth+Rooftop+Bar", reviews:24883, price:"$$", reservable:true, stars:4.3 },
      ],
      speakeasy: [
        { id:"thewoowoo", emoji:"🕯️", place:"The Woo Woo", type:"speakeasy", desc:"4.8★ · speakeasy", booking:"https://thewoowoonyc.com/", maps:"The+Woo+Woo", reviews:1938, price:"$$", reservable:true, stars:4.8 },
        { id:"georgebangba", emoji:"🕯️", place:"George Bang Bang", type:"speakeasy", desc:"4.6★ · speakeasy", booking:"http://www.gbbnyc.com/", maps:"George+Bang+Bang", reviews:335, price:"$$", reservable:true, stars:4.6 },
        { id:"patentpendin", emoji:"🕯️", place:"Patent Pending", type:"speakeasy", desc:"Low-lit bar behind a hidden door in Patent Coffee, serving cocktails with an electric theme.", booking:"https://www.patentpendingnyc.com/", maps:"Patent+Pending", reviews:1087, price:"$$$", reservable:true, stars:4.4 },
      ],
    },
    food: {
      japanese: [
        { id:"tatsudaomaka", emoji:"🥢", place:"Tatsuda Omakase", type:"japanese", desc:"4.8★ · japanese", booking:"http://tatsudanyc.com/", maps:"Tatsuda+Omakase", reviews:310, price:"$$", reservable:true, stars:4.8 },
        { id:"fushimitimes", emoji:"🥢", place:"Fushimi Times Square", type:"japanese", desc:"Buzzing eatery & lounge offering Japanese dishes with a French twist, plus cocktails & beer.", booking:"https://fushimi.nyc/", maps:"Fushimi+Times+Square", reviews:704, price:"$$", reservable:true, stars:4.6 },
        { id:"sakagura", emoji:"🥢", place:"Sakagura", type:"japanese", desc:"Japanese small plates & a deep sake list in a blond-wood izakaya hidden beneath an office building.", booking:"http://www.sakagura.com/", maps:"Sakagura", reviews:1443, price:"$$$", reservable:true, stars:4.5 },
        { id:"nobufiftysev", emoji:"🥢", place:"Nobu Fifty Seven", type:"japanese", desc:"Sleek Japanese-Peruvian spot from Nobu Matsuhisa frequented by business types & celebs.", booking:"https://www.noburestaurants.com/fifty-seven/home/?utm_source=google&utm_medium=Yext", maps:"Nobu+Fifty+Seven", reviews:2692, price:"$$$$", reservable:true, stars:4.4 },
        { id:"zumanewyork", emoji:"🥢", place:"Zuma New York", type:"japanese", desc:"Trendy, high-end Japanese place with an izakaya-inspired menu including sushi & robata grilled fare.", booking:"https://www.zumarestaurant.com/en/new-york?utm_source=InfoButtonClick&utm_medium=Home&utm_campaign=GoogleBusinessProfile", maps:"Zuma+New+York", reviews:2033, price:"$$$$", reservable:true, stars:4.3 },
      ],
      pasta: [
          { place:"La Grande Boucherie", type:"Bar", desc:"La Grande Boucherie", booking:"https://www.boucherieus.com/", maps:"La+Grande+Boucherie+Midtown+Manhattan", reviews:9985, price:"$$", reservable:true, stars:4.6 },
        
        { id:"osterialabai", emoji:"🍝", place:"Osteria La Baia", type:"italian dinner", desc:"Traditional and creative Italian cuisine plus cocktails in a spacious venue with chic, polished decor.", booking:"https://www.labaianyc.com/?y_source=1_MTAwNTA2Mjg0My03MTUtbG9jYXRpb24ud2Vic2l0ZQ%3D%3D", maps:"Osteria+La+Baia", reviews:5384, price:"$$$$", reservable:true, stars:4.9 },
        { id:"lapecorabian", emoji:"🍝", place:"La Pecora Bianca Bryant Park", type:"italian dinner", desc:"Stylish, bright eatery featuring market-driven Italian cuisine, regional wines & apéritifs.", booking:"https://www.lapecorabianca.com/", maps:"La+Pecora+Bianca+Bryant+Park", reviews:7020, price:"$$$", reservable:true, stars:4.8 },
        { id:"tonysdinapol", emoji:"🍝", place:"Tony's Di Napoli", type:"italian dinner", desc:"Bustling eatery serving large, shareable portions of Italian comfort food in a lively setting.", booking:"https://www.tonysnyc.com/", maps:"Tonys+Di+Napoli", reviews:8174, price:"$$", reservable:true, stars:4.6 },
        { id:"cisiamo", emoji:"🍝", place:"Ci Siamo", type:"italian dinner", desc:"Stylish restaurant offering high-end Mediterranean standards, plus wine and cocktails.", booking:"https://www.cisiamo.com/?utm_source=google&utm_medium=gmb", maps:"Ci+Siamo", reviews:2092, price:"$$$", reservable:true, stars:4.6 },
      ],
      pizza: [],
      mediterranean: [],
      american: [
          { place:"La Pecora Bianca Bryant Park", type:"Bar", desc:"La Pecora Bianca Bryant Park", booking:"https://www.lapecorabianca.com/", maps:"La+Pecora+Bianca+Bryant+Park+Midtown+Manhattan", reviews:7011, price:"$$$", reservable:true, stars:4.8 },
          { place:"Monkey Bar", type:"Bar", desc:"Monkey Bar", booking:"https://nycmonkeybar.com/", maps:"Monkey+Bar+Midtown+Manhattan", reviews:1745, price:"$$$", reservable:true, stars:4.5 },
          { place:"The Reading Room", type:"Bar", desc:"The Reading Room", booking:"https://readingroomnyc.com/", maps:"The+Reading+Room+Midtown+Manhattan", reviews:339, price:"$$", reservable:true, stars:4.4 },
          { place:"Parker & Quinn", type:"Bar", desc:"Parker & Quinn", booking:"https://parkerandquinn.com/", maps:"Parker+&+Quinn+Midtown+Manhattan", reviews:3015, price:"$$", reservable:true, stars:4.6 },
          { place:"Little Collins", type:"Bar", desc:"Little Collins", booking:"http://www.littlecollinsnyc.com/", maps:"Little+Collins+Midtown+Manhattan", reviews:2624, price:"$$", reservable:false, stars:4.5 },
          { place:"In Common NYC - A Breakfast & Brunch Restaurant", type:"Bar", desc:"In Common NYC - A Breakfast & Brunch Restaurant", booking:"https://www.incommonnyc.com/", maps:"In+Common+NYC+-+A+Breakfast+&+Brunch+Restaurant+Midtown+Manhattan", reviews:2100, price:"$$", reservable:true, stars:4.6 },
          { place:"La Grande Boucherie", type:"Bar", desc:"La Grande Boucherie", booking:"https://www.boucherieus.com/", maps:"La+Grande+Boucherie+Midtown+Manhattan", reviews:9985, price:"$$", reservable:true, stars:4.6 },
          { place:"Tony's Di Napoli", type:"Bar", desc:"Tony's Di Napoli", booking:"https://www.tonysnyc.com/", maps:"Tonys+Di+Napoli+Midtown+Manhattan", reviews:8173, price:"$$", reservable:true, stars:4.6 },
          { place:"Grand Brasserie", type:"Bar", desc:"Grand Brasserie", booking:"https://www.grandbrasserie.com/", maps:"Grand+Brasserie+Midtown+Manhattan", reviews:582, price:"$$", reservable:true, stars:4.1 }
        ],
      brunch: [
        { id:"holeinthewal", emoji:"🥐", place:"Hole In The Wall - Murray Hill", type:"brunch", desc:"4.8★ · brunch", booking:"https://holeinthewallnyc.com/murray-hill", maps:"Hole+In+The+Wall++Murray+Hill", reviews:2170, price:"$$", reservable:true, stars:4.8 },
        { id:"incommonnyca", emoji:"🥐", place:"In Common NYC - A Breakfast & Brunch Restaurant", type:"brunch", desc:"4.6★ · brunch", booking:"https://www.incommonnyc.com/", maps:"In+Common+NYC++A+Breakfast++Brunch+Restaurant", reviews:2100, price:"$$", reservable:true, stars:4.6 },
        { id:"parkerquinn", emoji:"🥐", place:"Parker & Quinn", type:"brunch", desc:"American dining & creative cocktails set against a vintage backdrop in the Refinery Hotel.", booking:"https://parkerandquinn.com/", maps:"Parker++Quinn", reviews:3015, price:"$$", reservable:true, stars:4.6 },
        { id:"thereadingro", emoji:"🥐", place:"The Reading Room", type:"brunch", desc:"4.4★ · brunch", booking:"https://readingroomnyc.com/", maps:"The+Reading+Room", reviews:339, price:"$$", reservable:true, stars:4.4 },
      ],
      latenight: [
          { place:"La Pecora Bianca Bryant Park", type:"Bar", desc:"La Pecora Bianca Bryant Park", booking:"https://www.lapecorabianca.com/", maps:"La+Pecora+Bianca+Bryant+Park+Midtown+Manhattan", reviews:7011, price:"$$$", reservable:true, stars:4.8 },
          { place:"Monkey Bar", type:"Bar", desc:"Monkey Bar", booking:"https://nycmonkeybar.com/", maps:"Monkey+Bar+Midtown+Manhattan", reviews:1745, price:"$$$", reservable:true, stars:4.5 },
          { place:"The Reading Room", type:"Bar", desc:"The Reading Room", booking:"https://readingroomnyc.com/", maps:"The+Reading+Room+Midtown+Manhattan", reviews:339, price:"$$", reservable:true, stars:4.4 },
          { place:"Parker & Quinn", type:"Bar", desc:"Parker & Quinn", booking:"https://parkerandquinn.com/", maps:"Parker+&+Quinn+Midtown+Manhattan", reviews:3015, price:"$$", reservable:true, stars:4.6 },
          { place:"Little Collins", type:"Bar", desc:"Little Collins", booking:"http://www.littlecollinsnyc.com/", maps:"Little+Collins+Midtown+Manhattan", reviews:2624, price:"$$", reservable:false, stars:4.5 },
          { place:"In Common NYC - A Breakfast & Brunch Restaurant", type:"Bar", desc:"In Common NYC - A Breakfast & Brunch Restaurant", booking:"https://www.incommonnyc.com/", maps:"In+Common+NYC+-+A+Breakfast+&+Brunch+Restaurant+Midtown+Manhattan", reviews:2100, price:"$$", reservable:true, stars:4.6 },
          { place:"La Grande Boucherie", type:"Bar", desc:"La Grande Boucherie", booking:"https://www.boucherieus.com/", maps:"La+Grande+Boucherie+Midtown+Manhattan", reviews:9985, price:"$$", reservable:true, stars:4.6 },
          { place:"Tony's Di Napoli", type:"Bar", desc:"Tony's Di Napoli", booking:"https://www.tonysnyc.com/", maps:"Tonys+Di+Napoli+Midtown+Manhattan", reviews:8173, price:"$$", reservable:true, stars:4.6 },
          { place:"Grand Brasserie", type:"Bar", desc:"Grand Brasserie", booking:"https://www.grandbrasserie.com/", maps:"Grand+Brasserie+Midtown+Manhattan", reviews:582, price:"$$", reservable:true, stars:4.1 }
        ],
    },
    activities: { free: [], paid: [
          { place:"SUMMIT One Vanderbilt", type:"Bar", desc:"SUMMIT One Vanderbilt", booking:"https://summitov.com/", maps:"SUMMIT+One+Vanderbilt+Midtown+Manhattan", reviews:33385, price:"$$", reservable:false, stars:4.7 },
        
          { id:"swingersnomd", emoji:"⛳", place:"Swingers NoMad", type:"crazy golf + bar", desc:"Immersive crazy golf with cocktails. One of the best date activities in Midtown.", booking:"https://www.swingersusa.com/", maps:"Swingers+NoMad+Midtown+NYC", reviews:1257, price:"$$", reservable:true, stars:4.4 },
        ] },
    happyHour: [
          { place:"Jimmy's Corner", type:"Dive Bar", desc:"Under $4 drinks all day in the heart of Times Square. NYC's best kept secret.", deal:"$3.50 wells all day", hours:"Daily 11:30am–close", booking:null, maps:"Jimmys+Corner+Bar+Times+Square+NYC", reviews:2200, price:"$", reservable:false, stars:4.3 },
          { place:"Lodi at Rockefeller", type:"Italian Cafe", desc:"Aperitivo hour at Rock Center. Spritzes and Italian snacks.", deal:"$12 spritzes + $10 wine", hours:"Mon–Fri 4–6pm", booking:"lodirestaurant.com", maps:"Lodi+Restaurant+Rockefeller+Center+NYC", reviews:2400, price:"$$", reservable:true, stars:4.5 },
          { place:"Valerie", type:"Gin Library Bar", desc:"70+ gins and happy hour deals in a stunning Manhattan Golden Age room.", deal:"$12 cocktails + $8 beer", hours:"Mon–Fri 4–7pm", booking:"valerienewyork.com", maps:"Valerie+Bar+Midtown+NYC", reviews:2213, price:"$$", reservable:true, stars:4.4 },
          { place:"Tanner Smith's", type:"Prohibition Lounge", desc:"Pre-theater cocktail hour in the Theater District.", deal:"$12 cocktails + $6 beer", hours:"Mon–Fri 4–7pm", booking:"tannersmiths.com", maps:"Tanner+Smiths+Theater+District+NYC", reviews:1800, price:"$$", reservable:true, stars:4.4 },
          { place:"Albert's Bar", type:"Hidden Hotel Bar", desc:"Tucked inside the Marriott on 45th. Almost nobody knows it exists.", deal:"$9 beers + $11 cocktails", hours:"Mon–Fri 4–7pm", booking:null, maps:"Alberts+Bar+Midtown+NYC", reviews:493, price:"$$", reservable:false, stars:4.5 },
          { place:"The Rum House", type:"Jazz Saloon", desc:"Nightly live jazz in a dark Edison Hotel saloon. Pre-theater gem.", deal:"$10 cocktails + $6 beer", hours:"Daily 4–7pm", booking:null, maps:"The+Rum+House+Edison+Hotel+NYC", reviews:620, price:"$$", reservable:false, stars:4.3 },
        ],
  },
  lic: {
    bars: {
      cocktails: [
          { place:"Bar Enzo", type:"Bar", desc:"Bar Enzo", booking:"http://barenzonyc.com/", maps:"Bar+Enzo+Long+Island+City+Queens", reviews:266, price:"$$", reservable:true, stars:5.0 },
          { place:"Drinkology NYC", type:"Bar", desc:"Drinkology NYC", booking:"https://www.drinkologynyc.com/", maps:"Drinkology+NYC+Long+Island+City+Queens", reviews:429, price:"$$", reservable:true, stars:4.8 },
          { place:"The Beast Next Door", type:"Bar", desc:"The Beast Next Door", booking:"http://thebeastnextdoor.com/", maps:"The+Beast+Next+Door+Long+Island+City+Queens", reviews:787, price:"$$", reservable:true, stars:4.6 },
          { place:"The Infamous", type:"Bar", desc:"The Infamous", booking:"https://infamousbar.com/", maps:"The+Infamous+Long+Island+City+Queens", reviews:279, price:"$$", reservable:true, stars:4.7 },
          { place:"The Newsroom", type:"Bar", desc:"The Newsroom", booking:"https://newsroomny.com/", maps:"The+Newsroom+Long+Island+City+Queens", reviews:1312, price:"$$", reservable:true, stars:4.9 },
          { place:"The Last Word", type:"Bar", desc:"The Last Word", booking:"http://tlwcocktailbar.com/", maps:"The+Last+Word+Long+Island+City+Queens", reviews:684, price:"$$$", reservable:true, stars:4.7 },
          { place:"Dutch Kills", type:"Bar", desc:"Dutch Kills", booking:"https://www.dutchkillsbar.com/", maps:"Dutch+Kills+Long+Island+City+Queens", reviews:1299, price:"$$", reservable:false, stars:4.4 },
          { place:"Blend on the Water", type:"Bar", desc:"Blend on the Water", booking:"http://www.blendonthewater.com/", maps:"Blend+on+the+Water+Long+Island+City+Queens", reviews:5904, price:"$$", reservable:true, stars:4.2 },
          { place:"Café Henri", type:"Bar", desc:"Café Henri", booking:"https://cafehenrilic.com/", maps:"Café+Henri+Long+Island+City+Queens", reviews:1114, price:"$$", reservable:true, stars:4.4 },
          { place:"Casa Enrique", type:"Bar", desc:"Casa Enrique", booking:"https://casaenriquelic.com/", maps:"Casa+Enrique+Long+Island+City+Queens", reviews:3017, price:"$$", reservable:true, stars:4.5 },
          { place:"Beija Flor", type:"Bar", desc:"Beija Flor", booking:"https://www.beijaflor.nyc/", maps:"Beija+Flor+Long+Island+City+Queens", reviews:1100, price:"$$", reservable:true, stars:4.5 }
        ],
      beer: [],
      wine: [
          { place:"DiWine Natural Wine Bar & Restaurant", type:"Bar", desc:"DiWine Natural Wine Bar & Restaurant", booking:"http://www.diwineonline.com/", maps:"DiWine+Natural+Wine+Bar+&+Restaurant+Long+Island+City+Queens", reviews:572, price:"$$", reservable:true, stars:4.6 }
        ],
      experimental: [
          { place:"Lost in Paradise Rooftop", type:"Bar", desc:"Lost in Paradise Rooftop", booking:"https://www.lostinparadiserooftop.com/", maps:"Lost+in+Paradise+Rooftop+Long+Island+City+Queens", reviews:6591, price:"$$", reservable:true, stars:4.7 },
          { place:"Skybar Rooftop & Lounge", type:"Bar", desc:"Skybar Rooftop & Lounge", booking:"https://skybarlic.com/", maps:"Skybar+Rooftop+&+Lounge+Long+Island+City+Queens", reviews:381, price:"$$", reservable:true, stars:4.0 },
        
        { id:"evenihgskylo", emoji:"🌆", place:"EVEN IHG Sky Lounge and Bar", type:"rooftop", desc:"4.4★ · rooftop", booking:"https://www.skyloungelic.com/", maps:"EVEN+IHG+Sky+Lounge+and+Bar", reviews:10, price:"$$", reservable:true, stars:4.4 },
      ],
      speakeasy: [
        { id:"barenzo", emoji:"🕯️", place:"Bar Enzo", type:"speakeasy", desc:"5.0★ · speakeasy", booking:"http://barenzonyc.com/", maps:"Bar+Enzo", reviews:268, price:"$$", reservable:true, stars:5.0 },
        { id:"25hours", emoji:"🕯️", place:"25 HOURS", type:"speakeasy", desc:"4.8★ · speakeasy", booking:"http://25hours.bar/", maps:"25+HOURS", reviews:25, price:"$$", reservable:true, stars:4.8 },
        { id:"theinfamous", emoji:"🕯️", place:"The Infamous", type:"speakeasy", desc:"4.7★ · speakeasy", booking:"https://infamousbar.com/", maps:"The+Infamous", reviews:279, price:"$$", reservable:true, stars:4.7 },
        { id:"thebeastnext", emoji:"🕯️", place:"The Beast Next Door", type:"speakeasy", desc:"Brick- & wood-lined space offering cafe bites, charcuterie & cocktails along with live bands & DJs.", booking:"http://thebeastnextdoor.com/", maps:"The+Beast+Next+Door", reviews:787, price:"$$", reservable:true, stars:4.6 },
      ],
    },
    food: {
      japanese: [
        { id:"warabiomakas", emoji:"🥢", place:"Warabi Omakase", type:"japanese", desc:"4.9★ · japanese", booking:"https://www.warabiomakase.com/", maps:"Warabi+Omakase", reviews:64, price:"$$", reservable:true, stars:4.9 },
        { id:"matsuzukisak", emoji:"🥢", place:"Matsuzuki Sakura", type:"japanese", desc:"4.9★ · japanese", booking:"http://www.matsuzukisakura.com/", maps:"Matsuzuki+Sakura", reviews:47, price:"$$", reservable:false, stars:4.9 },
        { id:"izakayanonam", emoji:"🥢", place:"Izakaya Noname", type:"japanese", desc:"4.6★ · japanese", booking:"http://www.nonameus.com/", maps:"Izakaya+Noname", reviews:363, price:"$$", reservable:true, stars:4.6 },
        { id:"daihachisush", emoji:"🥢", place:"Dai Hachi Sushi in Long Island City", type:"japanese", desc:"Laid-back Japanese restaurant with exposed-brick walls offering sushi, ramen, noodles & sake.", booking:"https://daihachinyc.com/", maps:"Dai+Hachi+Sushi+in+Long+Island+City", reviews:536, price:"$$", reservable:true, stars:4.6 },
        { id:"hibinolic", emoji:"🥢", place:"Hibino LIC", type:"japanese", desc:"Unusual restaurant offering sushi, small plates & other Japanese fare in a minimalist setting.", booking:"https://hibino-lic.com/", maps:"Hibino+LIC", reviews:588, price:"$$", reservable:true, stars:4.5 },
      ],
      pasta: [
        { id:"manettasrist", emoji:"🍝", place:"Manetta's Ristorante", type:"italian dinner", desc:"A fireplace adds a homey touch to this longtime Italian joint with a basic menu & brick-oven pizzas.", booking:"http://www.manettaslic.com/", maps:"Manettas+Ristorante", reviews:931, price:"$$", reservable:true, stars:4.6 },
        { id:"osteriabrook", emoji:"🍝", place:"Osteria Brooklyn @LIC On the Water", type:"italian dinner", desc:"4.6★ · italian dinner", booking:"https://www.osteriabrooklyn.com/", maps:"Osteria+Brooklyn+LIC+On+the+Water", reviews:769, price:"$$$", reservable:true, stars:4.6 },
        { id:"manducatisru", emoji:"🍝", place:"Manducatis Rustica VIG", type:"italian dinner", desc:"Old-world Italian cafe with a warm vibe offering homemade pasta dishes, pizzas & house-made gelato.", booking:"http://www.manducatisrustica.com/", maps:"Manducatis+Rustica+VIG", reviews:569, price:"$$", reservable:true, stars:4.6 },
        { id:"sottolaluna", emoji:"🍝", place:"Sotto la Luna", type:"italian dinner", desc:"4.5★ · italian dinner", booking:"https://www.sottolalunanyc.com/", maps:"Sotto+la+Luna", reviews:869, price:"$$", reservable:true, stars:4.5 },
        { id:"maiella", emoji:"🍝", place:"Maiella", type:"italian dinner", desc:"Sophisticated waterfront bar & restaurant crafting contemporary Italian dishes & cocktails.", booking:"https://www.maiellalic.com/", maps:"Maiella", reviews:1978, price:"$$$", reservable:true, stars:4.4 },
      ],
      pizza: [
        { id:"sauceypizzab", emoji:"🍕", place:"Saucey Pizza Bar", type:"pizza", desc:"5.0★ · pizza", booking:"https://www.sauceypizzabar.com/", maps:"Saucey+Pizza+Bar", reviews:307, price:"$$", reservable:true, stars:5.0 },
        { id:"sohopizza", emoji:"🍕", place:"Soho Pizza", type:"pizza", desc:"4.8★ · pizza", booking:"http://sohopizzany.com/", maps:"Soho+Pizza", reviews:52, price:"$$", reservable:false, stars:4.8 },
        { id:"sottolestell", emoji:"🍕", place:"Sotto Le Stelle", type:"pizza", desc:"Neighborhood Italian spot for wood-fired pies by a pizzaiolo from Naples, plus panini & antipasti.", booking:"https://www.sottolestelleny.com/", maps:"Sotto+Le+Stelle", reviews:1027, price:"$$", reservable:true, stars:4.7 },
      ],
      mediterranean: [],
      american: [
          { place:"Lighthouse Rooftop", type:"Bar", desc:"Lighthouse Rooftop", booking:"http://lighthouserooftop.com/", maps:"Lighthouse+Rooftop+Long+Island+City+Queens", reviews:912, price:"$$", reservable:true, stars:4.1 },
          { place:"Maiella", type:"Bar", desc:"Maiella", booking:"https://www.maiellalic.com/", maps:"Maiella+Long+Island+City+Queens", reviews:1978, price:"$$$", reservable:true, stars:4.4 },
          { place:"Osteria Brooklyn @LIC On the Water", type:"Bar", desc:"Osteria Brooklyn @LIC On the Water", booking:"https://www.osteriabrooklyn.com/", maps:"Osteria+Brooklyn+@LIC+On+the+Water+Long+Island+City+Queens", reviews:769, price:"$$$", reservable:true, stars:4.6 },
          { place:"4747LIC", type:"Bar", desc:"4747LIC", booking:"http://4747lic.com/", maps:"4747LIC+Long+Island+City+Queens", reviews:621, price:"$$", reservable:true, stars:4.8 },
          { place:"Café Coco", type:"Bar", desc:"Café Coco", booking:"https://www.cafe-coco.com/", maps:"Café+Coco+Long+Island+City+Queens", reviews:104, price:"$$", reservable:false, stars:4.6 },
          { place:"Kakes NYC", type:"Bar", desc:"Kakes NYC", booking:"http://www.kakes.nyc/", maps:"Kakes+NYC+Long+Island+City+Queens", reviews:752, price:"$$", reservable:true, stars:4.7 },
          { place:"Tournesol", type:"Bar", desc:"Tournesol", booking:"https://www.tournesolnyc.com/", maps:"Tournesol+Long+Island+City+Queens", reviews:723, price:"$$", reservable:true, stars:4.5 }
        ],
      brunch: [
        { id:"4747lic", emoji:"🥐", place:"4747LIC", type:"brunch", desc:"4.8★ · brunch", booking:"http://4747lic.com/", maps:"4747LIC", reviews:621, price:"$$", reservable:true, stars:4.8 },
        { id:"kakesnyc", emoji:"🥐", place:"Kakes NYC", type:"brunch", desc:"4.7★ · brunch", booking:"http://www.kakes.nyc/", maps:"Kakes+NYC", reviews:752, price:"$$", reservable:true, stars:4.7 },
        { id:"carla", emoji:"🥐", place:"Carla", type:"brunch", desc:"Bright spot for burgers, salads & wings, plus Tex-Mex classics, vegan options & creative cocktails.", booking:"http://www.carlalic.com/", maps:"Carla", reviews:437, price:"$$", reservable:true, stars:4.6 },
        { id:"cafhenri", emoji:"🥐", place:"Café Henri", type:"brunch", desc:"Quaint & classic haunt specializing in crêpes & other classic French plates.", booking:"https://cafehenrilic.com/", maps:"Caf+Henri", reviews:1114, price:"$$", reservable:true, stars:4.4 },
      ],
      latenight: [
          { place:"Lighthouse Rooftop", type:"Bar", desc:"Lighthouse Rooftop", booking:"http://lighthouserooftop.com/", maps:"Lighthouse+Rooftop+Long+Island+City+Queens", reviews:912, price:"$$", reservable:true, stars:4.1 },
          { place:"Maiella", type:"Bar", desc:"Maiella", booking:"https://www.maiellalic.com/", maps:"Maiella+Long+Island+City+Queens", reviews:1978, price:"$$$", reservable:true, stars:4.4 },
          { place:"Osteria Brooklyn @LIC On the Water", type:"Bar", desc:"Osteria Brooklyn @LIC On the Water", booking:"https://www.osteriabrooklyn.com/", maps:"Osteria+Brooklyn+@LIC+On+the+Water+Long+Island+City+Queens", reviews:769, price:"$$$", reservable:true, stars:4.6 },
          { place:"4747LIC", type:"Bar", desc:"4747LIC", booking:"http://4747lic.com/", maps:"4747LIC+Long+Island+City+Queens", reviews:621, price:"$$", reservable:true, stars:4.8 },
          { place:"Café Coco", type:"Bar", desc:"Café Coco", booking:"https://www.cafe-coco.com/", maps:"Café+Coco+Long+Island+City+Queens", reviews:104, price:"$$", reservable:false, stars:4.6 },
          { place:"Kakes NYC", type:"Bar", desc:"Kakes NYC", booking:"http://www.kakes.nyc/", maps:"Kakes+NYC+Long+Island+City+Queens", reviews:752, price:"$$", reservable:true, stars:4.7 },
          { place:"Tournesol", type:"Bar", desc:"Tournesol", booking:"https://www.tournesolnyc.com/", maps:"Tournesol+Long+Island+City+Queens", reviews:723, price:"$$", reservable:true, stars:4.5 },
        
        { id:"dkpublic", emoji:"🌙", place:"DK PubLIC", type:"late night", desc:"4.5★ · late night", booking:"http://dkpublic.com/", maps:"DK+PubLIC", reviews:395, price:"$$", reservable:true, stars:4.5 },
        { id:"redsorghum", emoji:"🌙", place:"Red Sorghum 夜宴", type:"late night", desc:"4.5★ · late night", booking:"https://redsorghumlic.com/", maps:"Red+Sorghum+", reviews:1131, price:"$$", reservable:true, stars:4.5 },
      ],
    },
    activities: { free: [], paid: [
          { id:"gamingcity", emoji:"🎮", place:"Gaming City", type:"arcade + bar", desc:"Huge arcade bar -- games, drinks, great date energy.", booking:null, maps:"Gaming+City+Long+Island+City", reviews:2766, price:"$$", reservable:false, stars:4.9 },
          { id:"drinkologyact", emoji:"🍸", place:"Drinkology NYC", type:"cocktail experience", desc:"Interactive cocktail experience and bar.", booking:"https://www.drinkologynyc.com/", maps:"Drinkology+NYC+Long+Island+City", reviews:429, price:"$$", reservable:true, stars:4.8 },
        ] },
    happyHour: [
          { place:"Dutch Kills", type:"Cocktail Bar", desc:"Best value craft cocktails in all of Queens. Early hour specials.", deal:"$12 cocktails", hours:"Tue–Fri 5–7pm", booking:null, maps:"Dutch+Kills+Bar+Long+Island+City+Queens", reviews:1299, price:"$$", reservable:false, stars:4.4 },
          { place:"American Brass", type:"Waterfront Bar", desc:"Oysters and discounted drinks with the Manhattan skyline as your backdrop.", deal:"$1.50 oysters + $8 wine", hours:"Mon–Fri 5–6:30pm", booking:"americanbrass.com", maps:"American+Brass+Long+Island+City+Queens", reviews:2200, price:"$$", reservable:true, stars:4.3 },
          { place:"LIC Bar", type:"Neighborhood Bar", desc:"Cheap beers in the backyard garden. Most relaxed happy hour in LIC.", deal:"$5 beers + $6 wells", hours:"Daily 4–7pm", booking:null, maps:"LIC+Bar+Long+Island+City+Queens", reviews:1400, price:"$", reservable:false, stars:4.2 },
          { place:"The Beast Next Door", type:"Wine + Cocktail Bar", desc:"Charcuterie and discounted drinks on Vernon Blvd.", deal:"$8 wines + $10 cocktails", hours:"Mon–Fri 4–7pm", booking:null, maps:"The+Beast+Next+Door+Long+Island+City+Queens", reviews:787, price:"$$", reservable:true, stars:4.6 },
        ],
  },
};


const getQuestion = (a) => {
  if (!a.neighborhood) return { id:"neighborhood", special:"neighborhood" };
  if (a.focus === "ourpick") return null; // skip all questions after neighborhood
  if (!a.budget) return { id:"budget", emoji:"💰", q:"What's the budget?", opts:[
    {l:"Free ($0)",v:"free",i:"🌿"},{l:"Under $50",v:"under50",i:"🪙"},
    {l:"$50-$150",v:"mid",i:"💵"},{l:"$150+",v:"splurge",i:"💎"}
  ]};
  if (!a.dateType) return { id:"dateType", emoji:"💬", q:"First date or you two?", opts:[
    {l:"First date",v:"first",i:"🦋"},{l:"We're together",v:"couple",i:"🔥"}
  ]};
  if (!a.focus) return { id:"focus", emoji:"✨", q:"What's the plan?", opts:[
    {l:"Food",v:"food",i:"🍽️"},{l:"Drinks",v:"drinks",i:"🍸"},
    {l:"Food & Drinks",v:"fooddrinks",i:"🥂"},
    {l:"Activity",v:"activity",i:"🎯"},{l:"Happy Hour",v:"happyhour",i:"🎉"},
    {l:"Our Pick",v:"ourpick",i:"⭐"}
  ]};
  if (a.focus === "ourpick") return null; // go straight to results
  if (a.focus === "drinks"     && !a.drinkType)     return { id:"drinkType",     emoji:"🍹", q:"What are you drinking?",  opts:DRINK_OPTS };
  if (a.focus === "food"       && !a.foodType)       return { id:"foodType",      emoji:"🍽️", q:"What are you feeling?",   opts:FOOD_OPTS };
  if (a.focus === "fooddrinks" && !a.foodDrinkType)  return { id:"foodDrinkType", emoji:"🥂", q:"What kind of combo?",      opts:FOOD_DRINK_OPTS };
  if (a.focus === "activity"   && !a.activityType)   return { id:"activityType",  emoji:"🌟", q:"Activity type?", opts:[
    {l:"Free ($0)",v:"free",i:"🌿"},{l:"Paid",v:"paid",i:"🎟️"}
  ]};
  if ((a.focus === "drinks" || a.focus === "fooddrinks" || (a.focus === "food" && a.foodType !== "brunch")) && !a.vibe) return {
    id:"vibe", emoji:"🌡️", q:"What's the energy?", opts:[
      {l:"Lively & buzzing",v:"lively",i:"⚡"},{l:"Quiet & intimate",v:"quiet",i:"🕯️"}
    ]
  };
  if (a.focus !== "happyhour" && !a.timeOfDay) return { id:"timeOfDay", emoji:"🕐", q:"When are you going?", opts:[
    {l:"Daytime",v:"day",i:"☀️"},{l:"Evening",v:"evening",i:"🌆"},{l:"Late Night",v:"late",i:"🌙"}
  ]};
  return null;
};

const getSpots = (a) => {
  if (a.budget === "free") return (DB[a.neighborhood]?.activities?.free || []).slice(0, 6);
  const nb = DB[a.neighborhood] || DB.williamsburg;

  // Date type review filter — applied everywhere
  const dateOk = (spot) => {
    if (!spot.reviews) return true;
    if (a.dateType === "first")  return spot.reviews >= 500;
    if (a.dateType === "couple") return spot.reviews <= 1000;
    return true;
  };

  // Happy hour — filter by date type
  if (a.focus === "happyhour") {
    let pool = [...(nb.happyHour || [])];
    if (a.dateType === "first") {
      const filtered = pool.filter(s => !s.reviews || s.reviews >= 300);
      if (filtered.length >= 2) pool = filtered;
    } else if (a.dateType === "couple") {
      const filtered = pool.filter(s => !s.reviews || s.reviews <= 1000);
      if (filtered.length >= 2) pool = filtered;
      else {
        // not enough hidden gems, take lowest review count spots
        pool = pool.sort((a,b) => (a.reviews||9999)-(b.reviews||9999));
      }
    }
    return pool.slice(0, 6);
  }

  // ── OUR PICK: curated + featured first ──────────────────────────────────
  if (a.focus === "ourpick") {
    const all = [
      ...(nb.bars.cocktails||[]), ...(nb.bars.wine||[]), ...(nb.bars.speakeasy||[]),
      ...(nb.food.pasta||[]), ...(nb.food.japanese||[]), ...(nb.food.mediterranean||[]),
      ...(nb.food.american||[]),
    ];
    // Featured (paid) always first, then filter by gem score (hidden gems = low reviews, high quality)
    const featured = all.filter(s => s.featured);
    // Our Pick defaults to experienced dater logic (hidden gems, ≤1000 reviews) unless first date
    const gemFilter = a.dateType === "first"
      ? all.filter(s => !s.featured && (s.reviews||0) >= 500)
      : all.filter(s => !s.featured && (s.reviews||0) <= 1000 && (s.reviews||0) >= 50);
    const rest = gemFilter.sort((a,b) => (b.stars||0)-(a.stars||0));
    const pool = [...featured, ...rest];
    return pool.length >= 2 ? pool.slice(0, 6) : all.sort((a,b)=>(b.stars||0)-(a.stars||0)).slice(0,6);
  }

  // Budget price filter -- unknown price excluded on budget selections
  const priceOk = (spot) => {
    if (!a.budget || a.budget === "splurge") return true;
    const p = (spot.price || "").replace(/\?/g, "").trim();
    if (!p) return false;
    if (a.budget === "under50") return p === "$" || p === "$$";
    if (a.budget === "mid")     return p === "$" || p === "$$" || p === "$$$";
    return true;
  };

  let pool = [];

  if (a.focus === "drinks") {
    pool = [...(nb.bars[a.drinkType] || nb.bars.cocktails)];
    if (a.vibe === "quiet") pool.sort((x,y) => gemScore(y.reviews) - gemScore(x.reviews));
    else pool.sort(() => Math.random() - 0.5);
  }

  if (a.focus === "food") {
    let key;
    if (a.foodType === "brunch" || a.timeOfDay === "day") key = "brunch";
    else if (a.timeOfDay === "late") key = "latenight";
    else key = a.foodType || "american";
    pool = [...(nb.food[key] || nb.food.american || [])];
    // If evening, exclude spots that are brunch-only
    if (a.timeOfDay === "evening" && key !== "brunch") {
      const filtered = pool.filter(s => !String(s.type||"").toLowerCase().includes("brunch"));
      if (filtered.length >= 2) pool = filtered;
    }
  }

  if (a.focus === "fooddrinks") {
    if (a.foodDrinkType === "dinner_cocktails") {
      pool = [...(nb.bars.cocktails||[]).slice(0,2), ...(nb.food.american||[]).slice(0,2), ...(nb.bars.wine||[]).slice(0,2)];
    } else if (a.foodDrinkType === "wine_plates") {
      pool = [...(nb.bars.wine||[]), ...(nb.food.mediterranean||[]).slice(0,2)];
    } else if (a.foodDrinkType === "brunch_drinks") {
      pool = [...(nb.food.brunch||[])];
    } else {
      pool = [...(nb.food.latenight||[])];
    }
    if (a.vibe === "quiet") pool.sort((x,y) => gemScore(y.reviews) - gemScore(x.reviews));
    else pool.sort(() => Math.random() - 0.5);
  }

  if (a.focus === "activity") {
    pool = [...(a.activityType === "free" ? nb.activities.free : nb.activities.paid) || []];
  }

  // Apply budget + date type filters -- fall back to unfiltered if too few results
  const filtered = pool.filter(s => priceOk(s) && dateOk(s));
  if (filtered.length >= 2) pool = filtered;
  else {
    // Partial fallback: at least apply budget
    const budgetOnly = pool.filter(s => priceOk(s));
    if (budgetOnly.length >= 2) pool = budgetOnly;
  }

  // First date: also bubble spots with reservations to top
  if (a.dateType === "first") {
    const withBooking = pool.filter(s => s.booking);
    const without = pool.filter(s => !s.booking);
    if (withBooking.length >= 1) pool = [...withBooking, ...without];
  }

  return pool.slice(0, 6);
};

const NB_SILHOUETTES = {
  williamsburg: () => (
    <svg viewBox="0 0 240 60" style={{width:"100%",height:"52px",display:"block"}}>
      <defs>
        <linearGradient id="wbg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c9a96e" stopOpacity="1"/>
          <stop offset="100%" stopColor="#9b6b9b" stopOpacity="0.6"/>
        </linearGradient>
        <filter id="wbf"><feGaussianBlur stdDeviation="0.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <g fill="url(#wbg)" filter="url(#wbf)">
        <rect x="4" y="32" width="14" height="28"/><rect x="6" y="24" width="10" height="10"/><rect x="8" y="18" width="6" height="8"/>
        <line x1="11" y1="18" x2="11" y2="8" stroke="#c9a96e" strokeWidth="1.5" opacity="0.8"/>
        <circle cx="11" cy="7" r="3" fill="none" stroke="#c9a96e" strokeWidth="1.2" opacity="0.8"/>
        <rect x="22" y="22" width="20" height="38"/><rect x="26" y="14" width="12" height="10"/>
        <rect x="46" y="36" width="12" height="24"/><rect x="48" y="29" width="8" height="9"/>
        <rect x="62" y="26" width="18" height="34"/><rect x="65" y="18" width="12" height="10"/>
        <rect x="84" y="40" width="10" height="20"/><rect x="98" y="28" width="16" height="32"/>
        <rect x="101" y="20" width="10" height="10"/><rect x="118" y="42" width="10" height="18"/>
        <rect x="132" y="32" width="14" height="28"/><rect x="150" y="36" width="12" height="24"/>
        <rect x="166" y="24" width="18" height="36"/><rect x="169" y="16" width="12" height="10"/>
        <rect x="188" y="40" width="12" height="20"/><rect x="204" y="30" width="16" height="30"/>
        <rect x="224" y="38" width="12" height="22"/>
      </g>
      <g fill="#fff8e0" opacity="0.25">
        {[32,40,50].map(y=>[24,30,66,72,100,106,136,142].map(x=><rect key={`${x}-${y}`} x={x} y={y} width="2" height="2"/>))}
      </g>
    </svg>
  ),
  east_village: () => (
    <svg viewBox="0 0 240 60" style={{width:"100%",height:"52px",display:"block"}}>
      <defs>
        <linearGradient id="evbg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9b6b9b" stopOpacity="1"/>
          <stop offset="100%" stopColor="#c9a96e" stopOpacity="0.5"/>
        </linearGradient>
        <filter id="evbf"><feGaussianBlur stdDeviation="0.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <g fill="url(#evbg)" filter="url(#evbf)">
        {[0,1,2,3,4,5,6,7,8,9,10].map(i => {
          const x = 4+i*22, h=[22,26,20,24,28,22,26,20,24,22,26][i], w=16;
          return <g key={i}>
            <rect x={x} y={60-h} width={w} height={h}/>
            <rect x={x+2} y={60-h-5} width={w-4} height={5}/>
            <rect x={x+2} y={60-h+4} width={4} height={5} opacity="0.4"/>
            <rect x={x+10} y={60-h+4} width={4} height={5} opacity="0.4"/>
          </g>;
        })}
      </g>
      <g fill="#fff8e0" opacity="0.2">
        {[0,1,2,3,4].map(i=>{const x=4+i*44,h=[22,26,24,28,22][i];return [38,46,54].map(y=>y<(60-h+8)?null:<rect key={`${x}-${y}`} x={x+2} y={y} width="2" height="2"/>);})}
      </g>
    </svg>
  ),
  west_village: () => (
    <svg viewBox="0 0 240 60" style={{width:"100%",height:"52px",display:"block"}}>
      <defs>
        <linearGradient id="wvbg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6b9b8b" stopOpacity="1"/>
          <stop offset="100%" stopColor="#c9a96e" stopOpacity="0.5"/>
        </linearGradient>
        <filter id="wvbf"><feGaussianBlur stdDeviation="0.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <g fill="url(#wvbg)" filter="url(#wvbf)">
        {[0,1,2,3,4,5,6,7,8,9,10].map(i => {
          const x=4+i*22, h=[20,24,18,22,26,20,24,18,22,20,24][i], w=16;
          return <g key={i}>
            <path d={`M${x},60 L${x},${60-h} Q${x+w/2},${60-h-6} ${x+w},${60-h} L${x+w},60 Z`}/>
            <rect x={x+3} y={60-h+4} width={3} height={4} opacity="0.3"/>
            <rect x={x+10} y={60-h+4} width={3} height={4} opacity="0.3"/>
          </g>;
        })}
      </g>
    </svg>
  ),
  midtown: () => (
    <svg viewBox="0 0 240 60" style={{width:"100%",height:"52px",display:"block"}}>
      <defs>
        <linearGradient id="mtbg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff8c42" stopOpacity="1"/>
          <stop offset="100%" stopColor="#c9a96e" stopOpacity="0.5"/>
        </linearGradient>
        <filter id="mtbf"><feGaussianBlur stdDeviation="0.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <g fill="url(#mtbg)" filter="url(#mtbf)">
        <rect x="4" y="36" width="14" height="24"/><rect x="22" y="22" width="18" height="38"/>
        <rect x="44" y="8" width="22" height="52"/><rect x="47" y="2" width="16" height="8"/><rect x="52" y="-2" width="6" height="6"/>
        <rect x="70" y="20" width="18" height="40"/><rect x="92" y="12" width="20" height="48"/>
        <rect x="95" y="5" width="14" height="9"/><rect x="116" y="26" width="16" height="34"/>
        <rect x="136" y="14" width="20" height="46"/><rect x="139" y="7" width="14" height="9"/>
        <rect x="160" y="24" width="18" height="36"/><rect x="182" y="10" width="22" height="50"/>
        <rect x="185" y="3" width="16" height="9"/><rect x="208" y="28" width="14" height="32"/>
        <rect x="226" y="18" width="10" height="42"/>
      </g>
      <g fill="#fff8e0" opacity="0.2">
        {[20,32,44].map(y=>[46,52,94,100,138,144,184,190].map(x=><rect key={`${x}-${y}`} x={x} y={y} width="2" height="2"/>))}
      </g>
    </svg>
  ),
  lic: () => (
    <svg viewBox="0 0 240 60" style={{width:"100%",height:"52px",display:"block"}}>
      <defs>
        <linearGradient id="licbg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c9a96e" stopOpacity="1"/>
          <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0.5"/>
        </linearGradient>
        <filter id="licbf"><feGaussianBlur stdDeviation="0.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <g fill="url(#licbg)" filter="url(#licbf)">
        <rect x="4" y="38" width="14" height="22"/><rect x="22" y="26" width="18" height="34"/>
        <rect x="44" y="16" width="22" height="44"/><rect x="47" y="9" width="16" height="9"/>
        <rect x="70" y="32" width="14" height="28"/>
        <line x1="96" y1="0" x2="90" y2="60" stroke="#c9a96e" strokeWidth="2.5" opacity="0.45"/>
        <line x1="106" y1="0" x2="100" y2="60" stroke="#c9a96e" strokeWidth="2.5" opacity="0.45"/>
        <line x1="88" y1="22" x2="108" y2="22" stroke="#c9a96e" strokeWidth="1.5" opacity="0.45"/>
        <line x1="86" y1="40" x2="110" y2="40" stroke="#c9a96e" strokeWidth="1.5" opacity="0.45"/>
        <rect x="118" y="30" width="16" height="30"/><rect x="138" y="20" width="20" height="40"/>
        <rect x="141" y="12" width="14" height="10"/><rect x="162" y="34" width="14" height="26"/>
        <rect x="180" y="22" width="18" height="38"/><rect x="202" y="30" width="14" height="30"/>
        <rect x="220" y="16" width="18" height="44"/><rect x="223" y="9" width="12" height="9"/>
      </g>
    </svg>
  ),
};

const Skyline = () => (
  <svg viewBox="0 0 500 140" style={{width:"100%",maxWidth:"440px",margin:"0 auto",display:"block"}}>
    <defs>
      <linearGradient id="sg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#c9a96e" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#9b6b9b" stopOpacity="0.6"/>
      </linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <g fill="url(#sg)" filter="url(#glow)">
      <rect x="0" y="115" width="16" height="25" opacity="0.5"/>
      <rect x="18" y="100" width="18" height="40" opacity="0.6"/>
      <rect x="38" y="85" width="14" height="55" opacity="0.7"/>
      <rect x="66" y="70" width="18" height="70" opacity="0.8"/>
      <rect x="86" y="45" width="22" height="95" opacity="0.95"/>
      <rect x="88" y="28" width="8" height="20" opacity="0.95"/>
      <rect x="90" y="14" width="4" height="16" opacity="0.95"/>
      <rect x="92" y="5" width="2" height="10" opacity="0.95"/>
      <rect x="110" y="80" width="12" height="60" opacity="0.75"/>
      <rect x="124" y="60" width="20" height="80" opacity="0.85"/>
      <rect x="146" y="42" width="24" height="98" opacity="0.95"/>
      <rect x="148" y="28" width="12" height="17" opacity="0.95"/>
      <rect x="151" y="16" width="6" height="14" opacity="0.95"/>
      <rect x="172" y="72" width="16" height="68" opacity="0.8"/>
      <rect x="190" y="62" width="20" height="78" opacity="0.85"/>
      <rect x="212" y="78" width="14" height="62" opacity="0.7"/>
      <rect x="228" y="52" width="22" height="88" opacity="0.9"/>
      <rect x="230" y="38" width="10" height="17" opacity="0.9"/>
      <rect x="252" y="85" width="16" height="55" opacity="0.72"/>
      <rect x="270" y="68" width="18" height="72" opacity="0.8"/>
      <rect x="290" y="55" width="22" height="85" opacity="0.88"/>
      <rect x="292" y="42" width="10" height="16" opacity="0.88"/>
      <rect x="314" y="80" width="14" height="60" opacity="0.72"/>
      <rect x="330" y="65" width="20" height="75" opacity="0.8"/>
      <rect x="352" y="90" width="16" height="50" opacity="0.65"/>
      <rect x="370" y="78" width="18" height="62" opacity="0.72"/>
      <rect x="390" y="100" width="14" height="40" opacity="0.58"/>
      <rect x="406" y="88" width="20" height="52" opacity="0.65"/>
      <rect x="428" y="105" width="16" height="35" opacity="0.5"/>
      <rect x="446" y="95" width="20" height="45" opacity="0.55"/>
      <rect x="468" y="110" width="18" height="30" opacity="0.45"/>
      <rect x="488" y="115" width="12" height="25" opacity="0.4"/>
    </g>
    <g fill="#fff8e0" opacity="0.3">
      {[88,96,108,120].map(y=>[90,95,128,133,149,156,193,200,232,239,293,300].map(x=>(
        <rect key={`${x}-${y}`} x={x} y={y} width="2" height="2"/>
      )))}
    </g>
    <rect x="0" y="130" width="500" height="10" fill="#0a0a18" opacity="0.6"/>
  </svg>
);

const MODE_EMOJI = {
  food: { brunch:"🥐", japanese:"🍣", pasta:"🍝", pizza:"🍕", mediterranean:"🥙", american:"🥩", latenight:"🌙", default:"🍽️" },
  drinks: { cocktails:"🍸", beer:"🍺", wine:"🍷", experimental:"🧪", speakeasy:"🕯️", default:"🥂" },
  fooddrinks: { dinner_cocktails:"🍸", wine_plates:"🍷", brunch_drinks:"🥂", late_bites:"🌙", default:"🥂" },
  activity: { free:"🌿", paid:"🎯", default:"✨" },
  happyhour: { default:"🎉" },
};

const getModeEmoji = (focus, subtype) => {
  const map = MODE_EMOJI[focus];
  if (!map) return "✨";
  return map[subtype] || map.default;
};

const ResultCards = ({ spots, mode, dateType, onReset, neighborhood, answers }) => {
  const [idx, setIdx] = useState(0);
  const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${q}`;
  const resyUrl = (name) => `https://resy.com/cities/ny?query=${encodeURIComponent(name)}`;

  if (!spots || !spots.length) return (
    <div style={{textAlign:"center",color:T.sub,padding:"32px",fontFamily:"sans-serif"}}>No spots found for this selection.</div>
  );

  const spot = spots[idx];
  const gem = gemScore(spot.reviews);
  const isGem = gem >= 8;
  const cycleNext = () => setIdx(i => (i + 1) % spots.length);

  const starRating = spot.stars || 0;
  const fullStars = Math.floor(starRating);
  const halfStar = starRating - fullStars >= 0.5;

  const SilSvg = NB_SILHOUETTES[neighborhood];
  const nbAccent = {williamsburg:"#c9a96e",east_village:"#9b6b9b",west_village:"#6b9b8b",midtown:"#ff8c42",lic:"#c9a96e"}[neighborhood] || T.accent;

  // Don't show desc if it's just the place name or a raw notes tag
  const SKIP_DESCS = ["brunch","bar","late night","latenight","dinner","activity","pizza","japanese","italian dinner","american dinner","mediterranean","cocktail bar","wine bar","speakeasy","rooftop","happy hour"];
  const desc = spot.desc && spot.desc !== spot.place && !SKIP_DESCS.includes(spot.desc.toLowerCase().trim()) ? spot.desc : null;

  // Category emoji
  const subtype = answers?.drinkType || answers?.foodType || answers?.foodDrinkType || answers?.activityType || "";
  const catEmoji = getModeEmoji(mode, subtype);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>

      {/* ── GRAND REVEAL CARD ── */}
      <div style={{background:`linear-gradient(160deg,rgba(14,10,22,0.99),rgba(8,6,14,0.99))`,border:`1px solid ${nbAccent}44`,borderRadius:"14px",overflow:"hidden",boxShadow:`0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)`}}>

        {/* Top accent line */}
        <div style={{height:"2px",background:`linear-gradient(90deg,transparent,${nbAccent},transparent)`}}/>

        {/* ── HERO: emoji + pick label + name ── */}
        <div style={{padding:"22px 22px 0",background:`linear-gradient(180deg,${nbAccent}14 0%,transparent 100%)`}}>

          {/* Pick label + category emoji + featured badge */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
              <div style={{fontSize:"8px",letterSpacing:"4px",textTransform:"uppercase",color:nbAccent,fontFamily:"sans-serif"}}>
                {idx === 0 ? "Tonight's Pick" : `Pick ${idx + 1} of ${spots.length}`}
              </div>
              {spot.featured && (
                <div style={{fontSize:"8px",letterSpacing:"1.5px",textTransform:"uppercase",color:"#fff",fontFamily:"sans-serif",background:`linear-gradient(135deg,${nbAccent},${T.accent2})`,padding:"2px 7px",borderRadius:"10px"}}>
                  ⭐ Featured
                </div>
              )}
            </div>
            <div style={{fontSize:"28px",lineHeight:1}}>{catEmoji}</div>
          </div>

          {/* BIG place name — above the silhouette */}
          <div style={{fontSize:"clamp(28px,8vw,44px)",lineHeight:1.05,letterSpacing:"-1px",fontWeight:"normal",textShadow:`0 2px 30px ${nbAccent}33`,marginBottom:"0"}}>
            {spot.place}
          </div>
        </div>

        {/* ── SILHOUETTE below the name ── */}
        {SilSvg && (
          <div style={{opacity:0.25,marginTop:"-4px",pointerEvents:"none"}}>
            <SilSvg/>
          </div>
        )}

        {/* ── DETAILS SECTION ── */}
        <div style={{padding:"8px 22px 20px"}}>

          {/* Stars + rating */}
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
            <div style={{display:"flex",gap:"2px"}}>
              {[1,2,3,4,5].map(i => (
                <span key={i} style={{fontSize:"13px",color:i<=fullStars||(i===fullStars+1&&halfStar)?nbAccent:"#2a2420"}}>★</span>
              ))}
            </div>
            {starRating > 0 && <span style={{fontSize:"13px",color:nbAccent,fontFamily:"sans-serif",fontWeight:"700"}}>{starRating.toFixed(1)}</span>}
            {spot.reviews > 0 && <span style={{fontSize:"11px",color:T.sub,fontFamily:"sans-serif"}}>· {Number(spot.reviews).toLocaleString()} reviews</span>}
            {isGem && <span style={{fontSize:"9px",color:nbAccent,fontFamily:"sans-serif",background:`${nbAccent}18`,border:`1px solid ${nbAccent}44`,padding:"2px 7px",borderRadius:"20px",marginLeft:"4px"}}>💎 Gem</span>}
          </div>

          {spot.reservable && (
            <div style={{fontSize:"10px",color:"#6b9b8b",fontFamily:"sans-serif",marginBottom:"12px"}}>✓ Takes Reservations</div>
          )}

          {/* Divider */}
          <div style={{height:"1px",background:`linear-gradient(90deg,${nbAccent}44,transparent)`,marginBottom:"14px"}}/>

          {desc && (
            <p style={{fontSize:"14px",color:"#b8a898",fontFamily:"sans-serif",lineHeight:1.8,margin:"0 0 16px",fontStyle:"italic"}}>{desc}</p>
          )}

          {mode === "happyhour" && spot.deal && (
            <div style={{background:`${nbAccent}14`,border:`1px solid ${nbAccent}33`,borderRadius:"6px",padding:"10px 14px",marginBottom:"16px"}}>
              <div style={{fontSize:"12px",color:nbAccent,fontFamily:"sans-serif",fontWeight:"700"}}>🎉 {spot.deal}</div>
              <div style={{fontSize:"10px",color:T.sub,fontFamily:"sans-serif",marginTop:"3px"}}>{spot.hours}</div>
            </div>
          )}

          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            {spot.booking && (
              <a href={spot.booking.startsWith("http") ? spot.booking : `https://${spot.booking}`} target="_blank" rel="noopener noreferrer"
                style={{display:"inline-block",padding:"10px 18px",background:`linear-gradient(135deg,${nbAccent},${T.accent2})`,borderRadius:"4px",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"800",letterSpacing:"2px",textTransform:"uppercase",color:T.bg,textDecoration:"none"}}>
                📅 Reserve
              </a>
            )}
            {dateType === "first" && spot.booking && (
              <a href={resyUrl(spot.place)} target="_blank" rel="noopener noreferrer"
                style={{display:"inline-block",padding:"10px 18px",background:"transparent",border:`1px solid ${T.accent2}`,borderRadius:"4px",fontSize:"10px",fontFamily:"sans-serif",letterSpacing:"2px",textTransform:"uppercase",color:T.accent2,textDecoration:"none"}}>
                🍽️ Resy
              </a>
            )}
            <a href={mapsUrl(spot.maps)} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-block",padding:"10px 18px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:"4px",fontSize:"10px",fontFamily:"sans-serif",letterSpacing:"2px",textTransform:"uppercase",color:T.sub,textDecoration:"none"}}>
              🗺️ Maps
            </a>
          </div>
        </div>

        <div style={{height:"2px",background:`linear-gradient(90deg,transparent,${nbAccent}66,transparent)`}}/>
      </div>

      {spots.length > 1 && (
        <button onClick={cycleNext}
          style={{width:"100%",padding:"14px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:"8px",color:T.sub,fontFamily:"sans-serif",fontSize:"10px",letterSpacing:"2.5px",textTransform:"uppercase",cursor:"pointer",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=nbAccent;e.currentTarget.style.color=nbAccent;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.sub;}}>
          {idx < spots.length - 1 ? `Show Another Pick (${spots.length - idx - 1} more)` : "Start from the top"}
        </button>
      )}

      <div style={{padding:"8px 12px",fontSize:"10px",color:T.sub,fontFamily:"sans-serif",lineHeight:1.6,textAlign:"center"}}>
        🔍 Always verify on Google Maps — NYC spots close unexpectedly.
      </div>
    </div>
  );


  return (
    <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>

      {/* ── GRAND REVEAL CARD ── */}
      <div style={{background:`linear-gradient(160deg,rgba(12,8,18,0.99),rgba(8,6,14,0.99))`,border:`1px solid ${nbAccent}33`,borderRadius:"14px",overflow:"hidden",boxShadow:`0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)`}}>

        {/* ── HERO HEADER with silhouette ── */}
        <div style={{position:"relative",background:`linear-gradient(180deg, ${nbAccent}22 0%, ${nbAccent}08 60%, rgba(8,6,14,0) 100%)`,padding:"28px 22px 0",overflow:"hidden"}}>

          {/* Background silhouette - large and faded */}
          {SilSvg && (
            <div style={{position:"absolute",bottom:"-2px",left:0,right:0,opacity:0.35,transform:"scale(1.1)"}}>
              <SilSvg/>
            </div>
          )}

          {/* Top accent line */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,transparent,${nbAccent},transparent)`}}/>

          {/* Pick label */}
          <div style={{fontSize:"8px",letterSpacing:"4px",textTransform:"uppercase",color:nbAccent,fontFamily:"sans-serif",marginBottom:"16px",position:"relative"}}>
            {idx === 0 ? "Tonight's Pick" : `Pick ${idx + 1} of ${spots.length}`}
          </div>

          {/* BIG place name */}
          <div style={{fontSize:"clamp(30px,9vw,46px)",lineHeight:1.0,letterSpacing:"-1.5px",fontWeight:"normal",position:"relative",paddingBottom:"24px",textShadow:`0 0 60px ${nbAccent}44`}}>
            {spot.place}
          </div>
        </div>

        {/* ── DETAILS SECTION ── */}
        <div style={{padding:"16px 22px"}}>

          {/* Stars + rating */}
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
            <div style={{display:"flex",gap:"2px"}}>
              {[1,2,3,4,5].map(i => (
                <span key={i} style={{fontSize:"14px",color:i<=fullStars||( i===fullStars+1&&halfStar)?nbAccent:"#2a2420"}}>★</span>
              ))}
            </div>
            {starRating > 0 && <span style={{fontSize:"13px",color:nbAccent,fontFamily:"sans-serif",fontWeight:"700"}}>{starRating.toFixed(1)}</span>}
            {spot.reviews > 0 && <span style={{fontSize:"11px",color:T.sub,fontFamily:"sans-serif"}}>· {Number(spot.reviews).toLocaleString()} reviews</span>}
            {isGem && <span style={{fontSize:"9px",color:nbAccent,fontFamily:"sans-serif",background:`${nbAccent}18`,border:`1px solid ${nbAccent}44`,padding:"2px 7px",borderRadius:"20px",marginLeft:"4px"}}>💎 Gem</span>}
          </div>

          {/* Reservation badge */}
          {spot.reservable && (
            <div style={{fontSize:"10px",color:"#6b9b8b",fontFamily:"sans-serif",letterSpacing:"0.5px",marginBottom:"12px"}}>✓ Takes Reservations</div>
          )}

          {/* Divider */}
          <div style={{height:"1px",background:`linear-gradient(90deg,${nbAccent}44,transparent)`,marginBottom:"14px"}}/>

          {/* Description */}
          {desc && (
            <p style={{fontSize:"14px",color:"#b8a898",fontFamily:"sans-serif",lineHeight:1.8,margin:"0 0 16px",fontStyle:"italic"}}>{desc}</p>
          )}

          {/* Happy hour deal */}
          {mode === "happyhour" && spot.deal && (
            <div style={{background:`${nbAccent}14`,border:`1px solid ${nbAccent}33`,borderRadius:"6px",padding:"10px 14px",marginBottom:"16px"}}>
              <div style={{fontSize:"12px",color:nbAccent,fontFamily:"sans-serif",fontWeight:"700"}}>🎉 {spot.deal}</div>
              <div style={{fontSize:"10px",color:T.sub,fontFamily:"sans-serif",marginTop:"3px"}}>{spot.hours}</div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            {spot.booking && (
              <a href={spot.booking.startsWith("http") ? spot.booking : `https://${spot.booking}`} target="_blank" rel="noopener noreferrer"
                style={{display:"inline-block",padding:"10px 18px",background:`linear-gradient(135deg,${nbAccent},${T.accent2})`,borderRadius:"4px",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"800",letterSpacing:"2px",textTransform:"uppercase",color:T.bg,textDecoration:"none"}}>
                📅 Reserve
              </a>
            )}
            {dateType === "first" && spot.booking && (
              <a href={resyUrl(spot.place)} target="_blank" rel="noopener noreferrer"
                style={{display:"inline-block",padding:"10px 18px",background:"transparent",border:`1px solid ${T.accent2}`,borderRadius:"4px",fontSize:"10px",fontFamily:"sans-serif",letterSpacing:"2px",textTransform:"uppercase",color:T.accent2,textDecoration:"none"}}>
                🍽️ Resy
              </a>
            )}
            <a href={mapsUrl(spot.maps)} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-block",padding:"10px 18px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:"4px",fontSize:"10px",fontFamily:"sans-serif",letterSpacing:"2px",textTransform:"uppercase",color:T.sub,textDecoration:"none"}}>
              🗺️ Maps
            </a>
          </div>
        </div>

        {/* Bottom gradient bar */}
        <div style={{height:"2px",background:`linear-gradient(90deg,transparent,${nbAccent}66,transparent)`}}/>
      </div>

      {/* Cycle button */}
      {spots.length > 1 && (
        <button onClick={cycleNext}
          style={{width:"100%",padding:"14px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:"8px",color:T.sub,fontFamily:"sans-serif",fontSize:"10px",letterSpacing:"2.5px",textTransform:"uppercase",cursor:"pointer",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=nbAccent;e.currentTarget.style.color=nbAccent;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.sub;}}>
          {idx < spots.length - 1 ? `Show Another Pick (${spots.length - idx - 1} more)` : "Start from the top"}
        </button>
      )}

      <div style={{padding:"8px 12px",fontSize:"10px",color:T.sub,fontFamily:"sans-serif",lineHeight:1.6,textAlign:"center"}}>
        🔍 Always verify on Google Maps — NYC spots close unexpectedly.
      </div>
    </div>
  );


  return (
    <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>

      {/* ── GRAND REVEAL CARD ── */}
      <div style={{background:`linear-gradient(160deg, rgba(15,10,20,0.99) 0%, rgba(10,8,16,0.99) 100%)`,border:`1px solid ${T.accent}44`,borderRadius:"12px",overflow:"hidden",boxShadow:`0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)`}}>

        {/* Top gradient bar */}
        <div style={{height:"3px",background:`linear-gradient(90deg,${T.accent2},${T.accent},${T.accent2})`}}/>

        {/* Eyebrow + pick counter */}
        <div style={{padding:"20px 22px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:"8px",letterSpacing:"3.5px",textTransform:"uppercase",color:T.accent,fontFamily:"sans-serif"}}>
            {idx === 0 ? "Tonight's Pick" : `Pick ${idx + 1} of ${spots.length}`}
          </div>
          {isGem && (
            <div style={{fontSize:"8px",letterSpacing:"1.5px",textTransform:"uppercase",color:T.accent,fontFamily:"sans-serif",background:`${T.accent}18`,border:`1px solid ${T.accent}44`,padding:"3px 8px",borderRadius:"20px"}}>
              💎 Hidden Gem
            </div>
          )}
        </div>

        {/* Place name */}
        <div style={{padding:"14px 22px 0"}}>
          <div style={{fontSize:"clamp(28px,8vw,40px)",lineHeight:1.0,letterSpacing:"-1px",fontWeight:"normal"}}>
            {spot.place}
          </div>
        </div>

        {/* Real star rating + review count */}
        <div style={{padding:"10px 22px 0",display:"flex",alignItems:"center",gap:"8px"}}>
          <div style={{display:"flex",gap:"2px"}}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{fontSize:"13px",color: i <= fullStars ? T.accent : i === fullStars+1 && halfStar ? T.accent : "#2a2420",opacity: i <= fullStars || (i === fullStars+1 && halfStar) ? 1 : 0.3}}>
                {i <= fullStars ? "★" : i === fullStars+1 && halfStar ? "⭑" : "★"}
              </span>
            ))}
          </div>
          {starRating > 0 && <span style={{fontSize:"12px",color:T.accent,fontFamily:"sans-serif",fontWeight:"600"}}>{starRating.toFixed(1)}</span>}
          {spot.reviews > 0 && <span style={{fontSize:"11px",color:T.sub,fontFamily:"sans-serif"}}>· {Number(spot.reviews).toLocaleString()} reviews</span>}
        </div>

        {/* Reservation badge */}
        {spot.reservable && (
          <div style={{padding:"8px 22px 0"}}>
            <span style={{fontSize:"9px",color:"#6b9b8b",fontFamily:"sans-serif",letterSpacing:"0.5px"}}>✓ Takes Reservations</span>
          </div>
        )}

        {/* Divider */}
        <div style={{margin:"14px 22px 0",height:"1px",background:`linear-gradient(90deg,${T.accent}44,transparent)`}}/>

        {/* Description */}
        <div style={{padding:"14px 22px"}}>
          <p style={{fontSize:"14px",color:"#b0a090",fontFamily:"sans-serif",lineHeight:1.8,margin:"0 0 18px",fontStyle:"italic"}}>{spot.desc}</p>

          {mode === "happyhour" && spot.deal && (
            <div style={{background:`${T.accent}14`,border:`1px solid ${T.accent}33`,borderRadius:"5px",padding:"10px 14px",marginBottom:"16px"}}>
              <div style={{fontSize:"12px",color:T.accent,fontFamily:"sans-serif",fontWeight:"700"}}>🎉 {spot.deal}</div>
              <div style={{fontSize:"10px",color:T.sub,fontFamily:"sans-serif",marginTop:"3px"}}>{spot.hours}</div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            {spot.booking && (
              <a href={spot.booking.startsWith("http") ? spot.booking : `https://${spot.booking}`} target="_blank" rel="noopener noreferrer"
                style={{display:"inline-block",padding:"10px 18px",background:`linear-gradient(135deg,${T.accent},${T.accent2})`,borderRadius:"4px",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"800",letterSpacing:"2px",textTransform:"uppercase",color:T.bg,textDecoration:"none"}}>
                📅 Reserve
              </a>
            )}
            {dateType === "first" && spot.booking && (
              <a href={resyUrl(spot.place)} target="_blank" rel="noopener noreferrer"
                style={{display:"inline-block",padding:"10px 18px",background:"transparent",border:`1px solid ${T.accent2}`,borderRadius:"4px",fontSize:"10px",fontFamily:"sans-serif",letterSpacing:"2px",textTransform:"uppercase",color:T.accent2,textDecoration:"none"}}>
                🍽️ Resy
              </a>
            )}
            <a href={mapsUrl(spot.maps)} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-block",padding:"10px 18px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:"4px",fontSize:"10px",fontFamily:"sans-serif",letterSpacing:"2px",textTransform:"uppercase",color:T.sub,textDecoration:"none"}}>
              🗺️ Maps
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{height:"2px",background:`linear-gradient(90deg,transparent,${T.accent}44,transparent)`}}/>
      </div>

      {/* Cycle + Start Over */}
      {spots.length > 1 && (
        <button onClick={cycleNext}
          style={{width:"100%",padding:"14px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:"6px",color:T.sub,fontFamily:"sans-serif",fontSize:"10px",letterSpacing:"2.5px",textTransform:"uppercase",cursor:"pointer",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.color=T.accent;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.sub;}}>
          {idx < spots.length - 1 ? `Show Another Pick (${spots.length - idx - 1} more)` : "Start from the top"}
        </button>
      )}

      <div style={{padding:"8px 12px",background:"rgba(255,255,255,0.02)",border:`1px solid ${T.border}`,borderRadius:"4px",fontSize:"10px",color:T.sub+"66",fontFamily:"sans-serif",lineHeight:1.6,textAlign:"center"}}>
        🔍 Always verify on Google Maps — NYC spots close unexpectedly.
      </div>
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [answers, setAnswers] = useState({});
  const [questionHistory, setQuestionHistory] = useState([]);
  const [currentQ, setCurrentQ] = useState(null);
  const [results, setResults] = useState(null);
  const [hoverNb, setHoverNb] = useState(null);

  const totalSteps = 7;
  const progress = Math.min((Object.keys(answers).length / totalSteps) * 100, 95);

  const advance = (key, val) => {
    const next = { ...answers, [key]: val };
    setQuestionHistory(h => [...h, key]);
    setAnswers(next);
    const q = getQuestion(next);
    if (q) { setCurrentQ(q); setScreen("quiz"); }
    else { setScreen("loading"); setTimeout(() => { setResults(getSpots(next)); setScreen("result"); }, 1000); }
  };

  const goBack = () => {
    if (questionHistory.length === 0) { reset(); return; }
    const lastKey = questionHistory[questionHistory.length - 1];
    const newAnswers = { ...answers };
    delete newAnswers[lastKey];
    const newHistory = questionHistory.slice(0, -1);
    setQuestionHistory(newHistory);
    setAnswers(newAnswers);
    const q = getQuestion(newAnswers);
    if (q) { setCurrentQ(q); setScreen("quiz"); } else { setScreen("intro"); }
  };

  const reset = () => {
    setScreen("intro");
    setAnswers({});
    setQuestionHistory([]);
    setCurrentQ(null);
    setResults(null);
    setHoverNb(null);
  };

  const resultTitle = () => {
    if (answers.budget === "free") return "Free Tonight";
    const timeLabel = answers.timeOfDay === "day" ? "Daytime" : answers.timeOfDay === "late" ? "Late Night" : "Tonight's";
    const focusMap = {
      drinks:     `${timeLabel} Bar`,
      food:       answers.timeOfDay === "day" ? "Brunch Picks" : `${timeLabel} Table`,
      fooddrinks: `${timeLabel} Food & Drinks`,
      activity:   answers.activityType === "free" ? "Free Activities" : `${timeLabel} Activity`,
      happyhour:  "Best Happy Hours",
      ourpick:    "Our Pick Tonight",
    };
    return focusMap[answers.focus] || "Your Picks";
  };

  const nbLabel = NEIGHBORHOODS.find(n => n.id === answers.neighborhood)?.label || "";

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"'Palatino Linotype',Palatino,serif",position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",inset:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",top:"8%",left:"20%",width:"600px",height:"600px",borderRadius:"50%",background:`radial-gradient(circle,${T.accent}07 0%,transparent 65%)`}}/>
        <div style={{position:"absolute",bottom:"10%",right:"10%",width:"400px",height:"400px",borderRadius:"50%",background:`radial-gradient(circle,${T.accent2}06 0%,transparent 65%)`}}/>
      </div>

      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:"520px"}}>

        {screen === "intro" && (
          <div style={{textAlign:"center",animation:"fadeUp 0.7s ease"}}>
            <Skyline/>
            <div style={{marginTop:"20px",fontSize:"10px",letterSpacing:"6px",textTransform:"uppercase",color:T.accent,fontFamily:"sans-serif",marginBottom:"8px"}}>New York City</div>
            <h1 style={{fontSize:"clamp(40px,9vw,62px)",fontWeight:"normal",lineHeight:1.0,margin:"0 0 6px",letterSpacing:"-2px"}}>
              Table for<br/>
              <span style={{background:`linear-gradient(135deg,${T.accent},${T.accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Two</span>
            </h1>
            <div style={{width:"36px",height:"1px",background:`linear-gradient(90deg,${T.accent},${T.accent2})`,margin:"14px auto"}}/>
            <p style={{color:T.sub,fontSize:"13px",lineHeight:1.7,fontFamily:"sans-serif",marginBottom:"32px",opacity:0.85}}>Curated dates across NYC.<br/>No tourists. No obvious picks.</p>
            <button onClick={()=>{setScreen("quiz");setCurrentQ(getQuestion({}));}}
              style={{background:`linear-gradient(135deg,${T.accent},${T.accent2})`,border:"none",color:T.bg,padding:"14px 42px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"800",letterSpacing:"3px",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px",transition:"all 0.2s",display:"block",margin:"0 auto"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow=`0 10px 36px ${T.accent}44`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="none";}}>
              Plan Our Date
            </button>
            <button onClick={()=>{setAnswers({focus:"ourpick"});setCurrentQ(getQuestion({}));setScreen("quiz");}}
              style={{background:"transparent",border:`1px solid ${T.accent}44`,color:T.accent,padding:"11px 28px",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"600",letterSpacing:"2.5px",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px",transition:"all 0.2s",display:"block",margin:"12px auto 0"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.background=`${T.accent}11`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=`${T.accent}44`;e.currentTarget.style.background="transparent";}}>
              ⭐ Show Me Tonight's Pick
            </button>
          </div>
        )}

        {screen === "quiz" && currentQ && (
          <div style={{animation:"fadeUp 0.35s ease"}}>
            {currentQ.special !== "neighborhood" && (
              <div style={{marginBottom:"28px"}}>
                <div style={{height:"2px",background:"#111118",borderRadius:"1px",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${T.accent},${T.accent2})`,transition:"width 0.5s ease"}}/>
                </div>
              </div>
            )}

            {currentQ.special === "neighborhood" ? (
              <div>
                <div style={{textAlign:"center",marginBottom:"24px"}}>
                  <div style={{fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",color:T.accent,fontFamily:"sans-serif",marginBottom:"6px"}}>Where are you going?</div>
                  <h2 style={{fontSize:"clamp(20px,5vw,26px)",fontWeight:"normal"}}>Pick your neighborhood</h2>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
                  {NEIGHBORHOODS.slice(0,4).map(nb=>{
                    const SilSvg = NB_SILHOUETTES[nb.id];
                    const acc = {williamsburg:"#c9a96e",east_village:"#9b6b9b",west_village:"#6b9b8b",midtown:"#ff8c42",lic:"#c9a96e"}[nb.id]||T.accent;
                    return (
                    <button key={nb.id} onClick={()=>advance("neighborhood",nb.id)}
                      style={{background:hoverNb===nb.id?`linear-gradient(135deg,${acc}22,${acc}08)`:T.card,border:hoverNb===nb.id?`1px solid ${acc}`:`1px solid ${T.border}`,color:T.text,padding:"0",cursor:"pointer",borderRadius:"6px",transition:"all 0.2s",display:"flex",flexDirection:"column",alignItems:"stretch",overflow:"hidden"}}
                      onMouseEnter={()=>setHoverNb(nb.id)}
                      onMouseLeave={()=>setHoverNb(null)}>
                      <div style={{padding:"10px 10px 0",background:`${acc}10`}}>
                        {SilSvg && <SilSvg/>}
                      </div>
                      <div style={{padding:"8px 12px 12px",textAlign:"center"}}>
                        <div style={{fontSize:"12px",fontFamily:"sans-serif",fontWeight:"700",marginBottom:"2px"}}>{nb.label}</div>
                        <div style={{fontSize:"10px",color:T.sub,fontFamily:"sans-serif"}}>{nb.sub}</div>
                      </div>
                    </button>
                  )})}
                </div>
                <div style={{display:"flex",justifyContent:"center"}}>
                  {(() => {
                    const nb = NEIGHBORHOODS[4];
                    const SilSvg = NB_SILHOUETTES[nb.id];
                    const acc = "#c9a96e";
                    return (
                    <button onClick={()=>advance("neighborhood",nb.id)}
                      style={{background:hoverNb===nb.id?`linear-gradient(135deg,${acc}22,${acc}08)`:T.card,border:hoverNb===nb.id?`1px solid ${acc}`:`1px solid ${T.border}`,color:T.text,padding:"0",cursor:"pointer",borderRadius:"6px",transition:"all 0.2s",display:"flex",flexDirection:"column",alignItems:"stretch",overflow:"hidden",width:"48%"}}
                      onMouseEnter={()=>setHoverNb(nb.id)}
                      onMouseLeave={()=>setHoverNb(null)}>
                      <div style={{padding:"8px 10px 0",background:`${acc}10`}}>
                        {SilSvg && <SilSvg/>}
                      </div>
                      <div style={{padding:"6px 12px 10px",textAlign:"center"}}>
                        <div style={{fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",marginBottom:"2px"}}>{nb.label}</div>
                        <div style={{fontSize:"10px",color:T.sub,fontFamily:"sans-serif"}}>{nb.sub}</div>
                      </div>
                    </button>
                  );})()}
                </div>
              </div>
            ) : (
              <>
                <div style={{fontSize:"34px",textAlign:"center",marginBottom:"8px"}}>{currentQ.emoji}</div>
                <h2 style={{fontSize:"clamp(19px,5vw,24px)",fontWeight:"normal",textAlign:"center",marginBottom:"24px",lineHeight:1.25}}>{currentQ.q}</h2>
                <div style={{display:"grid",gridTemplateColumns:currentQ.opts.length<=3?`repeat(${currentQ.opts.length},1fr)`:"1fr 1fr",gap:"10px"}}>
                  {currentQ.opts.map(opt=>(
                    <button key={opt.v} onClick={()=>advance(currentQ.id,opt.v)}
                      style={{background:T.card,border:`1px solid ${T.border}`,color:T.text,padding:"18px 12px",cursor:"pointer",borderRadius:"3px",transition:"all 0.18s",display:"flex",flexDirection:"column",alignItems:"center",gap:"7px"}}
                      onMouseEnter={e=>{e.currentTarget.style.background=`${T.accent2}12`;e.currentTarget.style.borderColor=`${T.accent2}55`;e.currentTarget.style.transform="translateY(-2px)";}}
                      onMouseLeave={e=>{e.currentTarget.style.background=T.card;e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="translateY(0)";}}>
                      <span style={{fontSize:"22px"}}>{opt.i}</span>
                      <span style={{fontSize:"12px",fontFamily:"sans-serif",fontWeight:"600",lineHeight:1.3,textAlign:"center"}}>{opt.l}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"24px"}}>
              <button onClick={goBack}
                style={{background:"transparent",border:"none",color:T.sub,fontSize:"11px",fontFamily:"sans-serif",cursor:"pointer",letterSpacing:"1px",transition:"color 0.15s",padding:"0"}}
                onMouseEnter={e=>e.currentTarget.style.color=T.accent}
                onMouseLeave={e=>e.currentTarget.style.color=T.sub}>
                ← back
              </button>
              <button onClick={reset}
                style={{background:"transparent",border:"none",color:T.sub+"88",fontSize:"10px",fontFamily:"sans-serif",cursor:"pointer",letterSpacing:"1px",transition:"color 0.15s",padding:"0"}}
                onMouseEnter={e=>e.currentTarget.style.color=T.sub}
                onMouseLeave={e=>e.currentTarget.style.color=T.sub+"88"}>
                start over
              </button>
            </div>
          </div>
        )}

        {screen === "loading" && (
          <div style={{textAlign:"center",animation:"fadeUp 0.4s ease"}}>
            <div style={{fontSize:"40px",marginBottom:"16px",animation:"pulse 1s ease infinite"}}>🗽</div>
            <div style={{fontSize:"11px",letterSpacing:"4px",textTransform:"uppercase",color:T.accent,fontFamily:"sans-serif"}}>Finding your spots...</div>
            <div style={{marginTop:"16px",display:"flex",gap:"7px",justifyContent:"center"}}>
              {[0,1,2].map(i=><div key={i} style={{width:"5px",height:"5px",borderRadius:"50%",background:T.accent,animation:`bounce 0.9s ease ${i*0.2}s infinite`}}/>)}
            </div>
          </div>
        )}

        {screen === "result" && results && (
          <div style={{animation:"fadeUp 0.5s ease"}}>
            <div style={{textAlign:"center",marginBottom:"20px"}}>
              <div style={{fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",color:T.accent,fontFamily:"sans-serif",marginBottom:"5px"}}>{nbLabel}</div>
              <h2 style={{fontSize:"clamp(20px,5vw,26px)",fontWeight:"normal",marginBottom:"4px"}}>{resultTitle()}</h2>
              <div style={{width:"32px",height:"1px",background:T.accent,margin:"8px auto",opacity:0.4}}/>
            </div>

            <ResultCards spots={results} mode={answers.focus} dateType={answers.dateType} onReset={reset} neighborhood={answers.neighborhood} answers={answers}/>

            <div style={{display:"flex",gap:"10px",marginTop:"16px"}}>
              <button onClick={reset}
                style={{flex:1,background:"transparent",border:`1px solid ${T.border}`,color:T.sub,padding:"12px",cursor:"pointer",fontFamily:"sans-serif",fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",borderRadius:"4px",transition:"all 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.color=T.accent;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.sub;}}>
                ↺ Start Over
              </button>
              <button
                style={{flex:2,background:`linear-gradient(135deg,${T.accent},${T.accent2})`,border:"none",color:T.bg,padding:"12px",cursor:"pointer",fontFamily:"sans-serif",fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",fontWeight:"800",borderRadius:"4px"}}
                onClick={()=>navigator.share&&navigator.share({title:"Table for Two",text:`Check out tonight's picks in ${nbLabel}`})}>
                📲 Share These Spots
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.1);opacity:1}}
        @keyframes bounce{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-8px);opacity:1}}
      `}</style>
    </div>
  );
}
