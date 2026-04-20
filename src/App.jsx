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
  // Manhattan — north to south
  { id:"upper_west", label:"Upper West Side", sub:"Manhattan", emoji:"🌳" },
  { id:"upper_east", label:"Upper East Side", sub:"Manhattan", emoji:"🥂" },
  { id:"midtown", label:"Midtown", sub:"Manhattan", emoji:"🥢" },
  { id:"west_village", label:"West Village", sub:"Manhattan", emoji:"🕯️" },
  { id:"east_village", label:"East Village", sub:"Manhattan", emoji:"🍜" },
  { id:"fidi", label:"Financial District", sub:"Manhattan", emoji:"🏛️" },
  // Brooklyn — north to south
  { id:"williamsburg", label:"Williamsburg", sub:"Brooklyn", emoji:"🎸" },
  { id:"bushwick", label:"Bushwick", sub:"Brooklyn", emoji:"🎨" },
  // Queens
  { id:"lic", label:"Long Island City", sub:"Queens", emoji:"🌆" },
];

const DRINK_OPTS = [
  { v:"cocktails", l:"🍹 Cocktails" }, { v:"beer", l:"🍺 Beer / Dive" },
  { v:"wine", l:"🍷 Wine" }, { v:"experimental", l:"🧪 Experimental" },
  { v:"speakeasy", l:"🕯️ Speakeasy" },
];
const FOOD_OPTS = [
  { v:"brunch", l:"🥐 Brunch" }, { v:"coffee", l:"☕ Coffee & Matcha" },
  { v:"japanese", l:"🍣 Japanese" }, { v:"korean", l:"🥩 Korean" },
  { v:"chinese", l:"🥢 Chinese" }, { v:"pasta", l:"🍝 Italian" },
  { v:"pizza", l:"🍕 Pizza" }, { v:"mediterranean", l:"🥙 Mediterranean" },
  { v:"mexican", l:"🌮 Mexican" }, { v:"vegan", l:"🌿 Vegan" },
  { v:"american", l:"🍔 American" },
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
          { place:"Blend Williamsburg", type:"brunch, happy hour, evening dinner", desc:"brunch, happy hour, evening dinner", booking:"https://www.blendwilliamsburg.com/", maps:"Blend+Williamsburg+Williamsburg+Brooklyn", reviews:1381, price:"$$", reservable:true, stars:4.3 },
        
        { id:"mommyscockta", emoji:"🍸", place:"Mommy's Cocktail Bar", type:"late night bar", desc:"Open until 3:00am.", booking:"https://www.mommysbar.com/", maps:"Mommys+Cocktail+Bar+NYC", reviews:447, price:"$$", reservable:false, stars:4.9, latenight:true },
        { id:"sleepwalk", emoji:"🍸", place:"Sleepwalk", type:"late night bar", desc:"Open until 4:00am.", booking:"http://www.sleepwalk.nyc/", maps:"Sleepwalk+NYC", reviews:205, price:"$$", reservable:false, stars:4.7, latenight:true },
        { id:"luckydog", emoji:"🍸", place:"Lucky Dog", type:"late night bar", desc:"Jumping, brick-walled watering hole featuring booze, a dog-friendly policy, games & a backyard. Open until 4:00am.", booking:null, maps:"Lucky+Dog+NYC", reviews:878, price:"$", reservable:false, stars:4.6, latenight:true },
        { id:"skinnydennis", emoji:"🍸", place:"Skinny Dennis", type:"late night bar", desc:"Down-home, honky-tonk saloon pairing a woody space with beer, games & live country music. Open until 4:00am.", booking:"https://skinnydennisbrooklyn.com/", maps:"Skinny+Dennis+NYC", reviews:1040, price:"$", reservable:false, stars:4.4, latenight:true },
        { id:"rockarolla", emoji:"🍸", place:"Rocka Rolla", type:"late night bar", desc:"Hard-rocking joint with jukebox tunes, old-school signs, big beers, pinball & outdoor grill grub. Open until 4:00am.", booking:"https://m.facebook.com/pages/category/Bar/Rocka-Rolla-838004392899971/", maps:"Rocka+Rolla+NYC", reviews:1111, price:"$", reservable:false, stars:4.3, latenight:true },
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
          { place:"Maison Premiere", type:"wine bar", desc:"wine bar", booking:"http://maisonpremiere.com/", maps:"Maison+Premiere+Williamsburg+Brooklyn", reviews:2037, price:"$$$", reservable:true, stars:4.6 , latenight:true}
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
      
        { id:"narachickenk", emoji:"🥩", place:"NaRa Chicken & Korean Cuisine", type:"korean", desc:"4.9★ · korean", booking:"https://eatnarachicken.com/", maps:"NaRa+Chicken++Korean+Cuisine+NYC", reviews:153, price:"$$", reservable:false, stars:4.9 },
        { id:"gomikoreanwi", emoji:"🥩", place:"Gomi Korean wine Bar", type:"korean", desc:"Korean & Brazilian dishes with no added sugar are paired with wines in a relaxed, simple space.", booking:"http://gomikoreanwinebar.com/", maps:"Gomi+Korean+wine+Bar+NYC", reviews:299, price:"$$", reservable:false, stars:4.8 },
        { id:"antidote", emoji:"🥢", place:"Antidote", type:"chinese", desc:"4.8★ · chinese", booking:"http://antidoteny.com/", maps:"Antidote+NYC", reviews:2087, price:"$$", reservable:true, stars:4.8 },
        { id:"ren", emoji:"🥢", place:"Ren 稔", type:"chinese", desc:"4.8★ · chinese", booking:"https://www.renbrooklyn.com/", maps:"Ren++NYC", reviews:169, price:"$$", reservable:true, stars:4.8 },
        { id:"breeze", emoji:"🥢", place:"Breeze", type:"chinese", desc:"4.8★ · chinese", booking:"https://breezebk.com/", maps:"Breeze+NYC", reviews:474, price:"$$", reservable:true, stars:4.8 },
        { id:"meili", emoji:"🥢", place:"MEILI 沉香", type:"chinese", desc:"4.8★ · chinese", booking:"http://meiliwilliamsburg.com/", maps:"MEILI++NYC", reviews:540, price:"$$", reservable:true, stars:4.8 },
        { id:"mokyo", emoji:"🥩", place:"Mokyo", type:"korean", desc:"Korean-inspired comfort food & small plates in a casual, rustic setting with exposed brick walls.", booking:"http://www.mokyony.com/", maps:"Mokyo+NYC", reviews:719, price:"$$", reservable:true, stars:4.7 },
        { id:"chingoo", emoji:"🥩", place:"ChinGoo", type:"korean", desc:"4.7★ · korean", booking:null, maps:"ChinGoo+NYC", reviews:356, price:"$$", reservable:true, stars:4.7 },
        { id:"haenyeo", emoji:"🥩", place:"Haenyeo", type:"korean", desc:"Playful takes on Korean classics & seafood in cozy, white-walled space.", booking:"https://haenyeobk.com/", maps:"Haenyeo+NYC", reviews:659, price:"$$", reservable:true, stars:4.5 },
        { id:"kingscoimper", emoji:"🥢", place:"Kings Co Imperial", type:"chinese", desc:"Modern Chinese haunt serving dishes made with local ingredients, including some from its own garden.", booking:"https://www.kingscoimperial.com/location/kings-co-imperial-williamsburg/?utm_source=google_business_profile&utm_medium=gbp_view_website&utm_campaign=google_business_profile", maps:"Kings+Co+Imperial+NYC", reviews:941, price:"$$", reservable:true, stars:4.5 },
        { id:"dokebibarand", emoji:"🥩", place:"Dokebi Bar and Grill", type:"korean", desc:"Busy Korean-style BBQ eatery with tableside grills & veggie options in a cozy ambiance.", booking:"http://www.dokebibrooklyn.com/", maps:"Dokebi+Bar+and+Grill+NYC", reviews:546, price:"$$", reservable:true, stars:4.3 },
        { id:"atti", emoji:"🥩", place:"ATTI", type:"korean", desc:"4.3★ · korean", booking:"http://www.attinyc.com/", maps:"ATTI+NYC", reviews:293, price:"$$", reservable:true, stars:4.3 },
      
        { id:"narachickenk", emoji:"🥩", place:"NaRa Chicken & Korean Cuisine", type:"korean", desc:"4.9★ · korean", booking:"https://eatnarachicken.com/", maps:"NaRa+Chicken++Korean+Cuisine+NYC", reviews:153, price:"$$", reservable:false, stars:4.9 },
        { id:"gomikoreanwi", emoji:"🥩", place:"Gomi Korean wine Bar", type:"korean", desc:"Korean & Brazilian dishes with no added sugar are paired with wines in a relaxed, simple space.", booking:"http://gomikoreanwinebar.com/", maps:"Gomi+Korean+wine+Bar+NYC", reviews:299, price:"$$", reservable:false, stars:4.8 },
        { id:"namdobrookly", emoji:"🥩", place:"Namdo Brooklyn", type:"korean", desc:"4.7★ · korean", booking:"https://www.instagram.com/namdo.bk", maps:"Namdo+Brooklyn+NYC", reviews:332, price:"$$", reservable:true, stars:4.7 },
        { id:"chingoo", emoji:"🥩", place:"ChinGoo", type:"korean", desc:"4.7★ · korean", booking:null, maps:"ChinGoo+NYC", reviews:356, price:"$$", reservable:true, stars:4.7 },
        { id:"haenyeo", emoji:"🥩", place:"Haenyeo", type:"korean", desc:"Playful takes on Korean classics & seafood in cozy, white-walled space.", booking:"https://haenyeobk.com/", maps:"Haenyeo+NYC", reviews:659, price:"$$", reservable:true, stars:4.5 },
        { id:"littledokebi", emoji:"🥩", place:"Little Dokebi", type:"korean", desc:"Korean bibimbop restaurant, plus a full bar built from salvaged materials.", booking:"https://littledokebi.com/", maps:"Little+Dokebi+NYC", reviews:438, price:"$$", reservable:true, stars:4.4 },
        { id:"dokebibarand", emoji:"🥩", place:"Dokebi Bar and Grill", type:"korean", desc:"Busy Korean-style BBQ eatery with tableside grills & veggie options in a cozy ambiance.", booking:"http://www.dokebibrooklyn.com/", maps:"Dokebi+Bar+and+Grill+NYC", reviews:546, price:"$$", reservable:true, stars:4.3 },
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
      
        { id:"theamthaiwil", emoji:"🌿", place:"the AM-THAI Williamsburg", type:"vegan", desc:"4.9★ · vegan", booking:"https://am-thainyc.com/?utm_source=google", maps:"the+AMTHAI+Williamsburg+NYC", reviews:798, price:"$$", reservable:true, stars:4.9 },
        { id:"reverievegan", emoji:"🌿", place:"Reverie Vegan Restaurant and Cocktail Bar", type:"vegan", desc:"4.9★ · vegan", booking:"https://reveriebrooklyn.com/?utm_source=google&utm_medium=gmb&utm_campaign=reverie_profile", maps:"Reverie+Vegan+Restaurant+and+Cocktail+Bar+NYC", reviews:260, price:"$$", reservable:true, stars:4.9 },
        { id:"gardencarver", emoji:"🌿", place:"Garden Carver", type:"vegan", desc:"4.7★ · vegan", booking:"http://gardencarver.com/", maps:"Garden+Carver+NYC", reviews:239, price:"$$", reservable:true, stars:4.7 },
        { id:"nycveganbist", emoji:"🌿", place:"NYC VEGAN BISTRO", type:"vegan", desc:"4.7★ · vegan", booking:"https://nycveganbistro.com/", maps:"NYC+VEGAN+BISTRO+NYC", reviews:328, price:"$$", reservable:false, stars:4.7 },
        { id:"haamcaribbea", emoji:"🌿", place:"HAAM Caribbean Plant Cuisine", type:"vegan", desc:"4.7★ · vegan", booking:"https://haamnyc.com/", maps:"HAAM+Caribbean+Plant+Cuisine+NYC", reviews:876, price:"$$", reservable:true, stars:4.7 },
        { id:"xixa", emoji:"🌮", place:"Xixa", type:"mexican", desc:"Swanky space serving innovative, upscale takes on Mexican fare paired with a selection of mezcals.", booking:"http://xixany.com/", maps:"Xixa+NYC", reviews:774, price:"$$$", reservable:true, stars:4.6 },
        { id:"newtown", emoji:"🌿", place:"Newtown", type:"vegan", desc:"Cozy neighborhood cafe specializing in vegetarian Mediterranean dishes with some vegan options.", booking:"http://www.newtownbk.com/", maps:"Newtown+NYC", reviews:335, price:"$", reservable:false, stars:4.6 },
        { id:"jajajamexica", emoji:"🌿", place:"Jajaja Mexicana", type:"vegan", desc:"4.6★ · vegan", booking:"https://www.jajajamexicana.com/", maps:"Jajaja+Mexicana+NYC", reviews:726, price:"$$$", reservable:true, stars:4.6 },
        { id:"oxomoco", emoji:"🌮", place:"Oxomoco", type:"mexican", desc:"Airy Mexican eatery offering wood-fired dishes plus ample tequila, mezcal cocktails, and a patio.", booking:"https://www.oxomoconyc.com/", maps:"Oxomoco+NYC", reviews:2403, price:"$$", reservable:true, stars:4.5 },
        { id:"mesacoyoacan", emoji:"🌮", place:"Mesa Coyoacan", type:"mexican", desc:"Traditional Mexican dishes served on rustic communal tables, plus a huge selection of tequila.", booking:"http://mesacoyoacan.com/", maps:"Mesa+Coyoacan+NYC", reviews:946, price:"$$", reservable:true, stars:4.5 },
        { id:"casapblica", emoji:"🌮", place:"Casa Pública", type:"mexican", desc:"Cool locale for tacos, ceviche & upscale Mexican dishes with micheladas & other cocktails.", booking:"http://www.casapublicabk.com/", maps:"Casa+Pblica+NYC", reviews:591, price:"$$", reservable:true, stars:4.4 },
        { id:"republiclati", emoji:"🌮", place:"Republic Latin Asian Fusion", type:"mexican", desc:"4.4★ · mexican", booking:"http://www.republiclatinfusion.com/", maps:"Republic+Latin+Asian+Fusion+NYC", reviews:1550, price:"$$", reservable:true, stars:4.4 },
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
      coffee: [
        { id:"kijitorawb", emoji:"🍵", place:"Kijitora", type:"matcha cafe", desc:"Japanese matcha bar from Tokyo. Ceremonial grade matcha, lush lattes, minimal and calm.", booking:"https://www.instagram.com/kijitoranyc", maps:"Kijitora+Bedford+Ave+Williamsburg+Brooklyn", reviews:850, price:"$$", reservable:false, stars:4.8 },
        { id:"yellowsuncof", emoji:"☕", place:"YellowSun Coffee", type:"coffee", subtype:"coffee", desc:"5.0★ · coffee", booking:"https://yellowsun.coffee/", maps:"YellowSun+Coffee+NYC", reviews:142, price:"$$", reservable:false, stars:5.0 },
        { id:"cafemia", emoji:"☕", place:"Cafe Mia", type:"coffee", subtype:"coffee", desc:"4.9★ · coffee", booking:"http://www.cafemiabk.com/", maps:"Cafe+Mia+NYC", reviews:96, price:"$$", reservable:false, stars:4.9 },
        { id:"secretcoffee", emoji:"☕", place:"Secret Coffee", type:"coffee", subtype:"coffee", desc:"4.9★ · coffee", booking:"http://www.secretcoffee.nyc/", maps:"Secret+Coffee+NYC", reviews:97, price:"$$", reservable:false, stars:4.9 },
        { id:"headrestcoff", emoji:"☕", place:"HEADREST COFFEE", type:"coffee", subtype:"coffee", desc:"4.9★ · coffee", booking:"http://headrestcoffee.com/", maps:"HEADREST+COFFEE+NYC", reviews:749, price:"$$", reservable:false, stars:4.9 },
        { id:"passionfruit", emoji:"☕", place:"Passionfruit Coffee", type:"coffee", subtype:"coffee", desc:"4.9★ · coffee", booking:"http://passionfruitcoffee.com/", maps:"Passionfruit+Coffee+NYC", reviews:584, price:"$$", reservable:false, stars:4.9 },
        { id:"tildeath", emoji:"☕", place:"Til Death", type:"coffee", subtype:"coffee", desc:"4.9★ · coffee", booking:"http://www.tildeathnyc.com/", maps:"Til+Death+NYC", reviews:163, price:"$$", reservable:false, stars:4.9 },
        { id:"lazysuzycafe", emoji:"☕", place:"Lazy Suzy Cafe & Shop", type:"coffee", subtype:"coffee", desc:"Spacious, modern cafe serving an assortment of espresso & tea drinks.", booking:"http://lazysuzycafe.com/", maps:"Lazy+Suzy+Cafe++Shop+NYC", reviews:268, price:"$", reservable:false, stars:4.7 },
        { id:"lacabraroast", emoji:"☕", place:"La Cabra Roastery", type:"coffee", subtype:"coffee", desc:"4.4★ · coffee", booking:"https://us.lacabra.com/pages/bushwick", maps:"La+Cabra+Roastery+NYC", reviews:264, price:"$$", reservable:false, stars:4.4 },
      ],
      latenight: [
        { id:"santafebk", emoji:"🌙", place:"Santa Fe BK", type:"late night", latenight:true, desc:"Relaxed spot dishing up Southwestern eats, including breakfast burritos & green chile cheeseburgers.", booking:"http://santafebk.com/", maps:"Santa+Fe+BK", reviews:631, price:"$$", reservable:true, stars:4.8 },
        { id:"nanxiangexpr", emoji:"🌙", place:"Nan Xiang Express - Williamsburg, NY", type:"late night", latenight:true, desc:"4.8★ · late night", booking:"https://nanxiangexpress.com/", maps:"Nan+Xiang+Express++Williamsburg+NY", reviews:873, price:"$$", reservable:false, stars:4.8 },
      ],
    },
    activities: {
      free: [
        { id:"dominopark", emoji:"🌊", place:"Domino Park", type:"Waterfront Park", desc:"Walk the waterfront with stunning Manhattan skyline views. Best people-watching in Brooklyn.", booking:null, maps:"Domino+Park+Williamsburg+Brooklyn", reviews:6496, price:"Free", reservable:false, stars:4.8 },

        { id:"marshajohnson", emoji:"🌿", place:"Marsha P. Johnson State Park", type:"Waterfront Park", desc:"Quiet waterfront park on the North Brooklyn shoreline. Beautiful sunset views.", booking:null, maps:"Marsha+P+Johnson+State+Park+Williamsburg+Brooklyn", reviews:3648, price:"Free", reservable:false, stars:4.6 },

        { id:"mccarrenpark", emoji:"🌳", place:"McCarren Park", type:"Park", desc:"The beating heart of Williamsburg. Great for a walk, picnic, or just hanging out.", booking:null, maps:"McCarren+Park+Williamsburg+Brooklyn", reviews:6179, price:"Free", reservable:false, stars:4.6 },

        { id:"wbridgewalk", emoji:"🌉", place:"Williamsburg Bridge Walk", type:"Bridge Walk", desc:"Walk the bridge at night for epic Manhattan views. One of NYC's best free experiences.", booking:null, maps:"Williamsburg+Bridge+Pedestrian+Path+Brooklyn", reviews:0, price:"Free", reservable:false, stars:4.8 },

        { id:"kentavewaterfront", emoji:"🌅", place:"Kent Ave Waterfront", type:"Waterfront Walk", desc:"Walk Kent Ave along the river at golden hour. Quiet, beautiful, completely free.", booking:null, maps:"Kent+Avenue+Waterfront+Williamsburg+Brooklyn", reviews:32, price:"Free", reservable:false, stars:4.8 },

        { place:"Bathhouse Williamsburg", type:"activity", desc:"activity", booking:"https://www.abathhouse.com/williamsburg?utm_source=google&utm_medium=organic&utm_campaign=gbp-website-williamsburg", maps:"Bathhouse+Williamsburg+Williamsburg+Brooklyn", reviews:3752, price:"$$", reservable:false, stars:4.3 },

        { id:"deadletterno9", emoji:"🎯", place:"Dead Letter No. 9", type:"cocktail + games", desc:"Cocktail bar with darts and games. Great casual date spot.", booking:null, maps:"Dead+Letter+No9+Williamsburg", reviews:382, price:"$$", reservable:false, stars:4.6 },

        { id:"recessgrove", emoji:"🌿", place:"recess grove", type:"outdoor bar", desc:"Chill outdoor bar. Low-key and fun.", booking:null, maps:"recess+grove+Williamsburg", reviews:76, price:"$$", reservable:true, stars:5.0 },

        { id:"sleepwalkact", emoji:"🕯️", place:"Sleepwalk", type:"cocktail bar", desc:"Moody cocktail bar on Bushwick Ave. Great late night energy.", booking:"http://www.sleepwalk.nyc/", maps:"Sleepwalk+Williamsburg", reviews:205, price:"$$", reservable:true, stars:4.7 },

        ],
      outside: [],
      creative: [
        { id:"maisonclay", emoji:"🎨", place:"Maison Clay", type:"creative", subtype:"pottery class", desc:"5.0★ · pottery class", booking:"https://www.maisonclay.com/", maps:"Maison+Clay+NYC", reviews:161, price:"$$", reservable:false, stars:5.0 },
        { id:"brooklynarth", emoji:"🎨", place:"Brooklyn Art Haus", type:"creative", subtype:"museum", desc:"4.9★ · museum", booking:"http://www.bkarthaus.com/", maps:"Brooklyn+Art+Haus+NYC", reviews:117, price:"$$", reservable:false, stars:4.9 },
        { id:"offcentercer", emoji:"🎨", place:"Off Center Ceramics", type:"creative", subtype:"pottery class", desc:"4.9★ · pottery class", booking:"https://www.offcenterceramics.nyc/", maps:"Off+Center+Ceramics+NYC", reviews:63, price:"$$", reservable:false, stars:4.9 },
        { id:"brooklynmuse", emoji:"🎨", place:"Brooklyn Museum", type:"creative", subtype:"museum", desc:"Beaux Arts landmark famed for ancient & modern art collections & world-class temporary exhibitions.", booking:"https://www.brooklynmuseum.org/", maps:"Brooklyn+Museum+NYC", reviews:10138, price:"$$", reservable:false, stars:4.7 },
        { id:"williamsburg", emoji:"🎨", place:"Williamsburg Art & Historical Center", type:"creative", subtype:"museum", desc:"An ornate 1867-vintage former bank building houses an art gallery with diverse shows & events.", booking:"http://www.wahcenter.net/", maps:"Williamsburg+Art++Historical+Center+NYC", reviews:39, price:"$$", reservable:false, stars:4.5 },
        { id:"thecityreliq", emoji:"🎨", place:"The City Reliquary Museum", type:"creative", subtype:"museum", desc:"Quirky storefront museum that's filled with New York City artifacts & hosts annual cultural events.", booking:"https://cityreliquary.org/", maps:"The+City+Reliquary+Museum+NYC", reviews:185, price:"$$", reservable:false, stars:4.3 },
        { id:"zerospace", emoji:"🎨", place:"ZeroSpace", type:"creative", subtype:"museum", desc:"4.3★ · museum", booking:"http://zerospace.co/", maps:"ZeroSpace+NYC", reviews:722, price:"$$", reservable:false, stars:4.3 },
        ],
      competitive: [
        { id:"burythehatch", emoji:"🎯", place:"Bury the Hatchet Axe Throwing Brooklyn", type:"competitive", subtype:"axe throwing", desc:"5.0★ · axe throwing", booking:"https://burythehatchet.com/axe-throwing-brooklyn-ny/", maps:"Bury+the+Hatchet+Axe+Throwing+Brooklyn+NYC", reviews:8015, price:"$$", reservable:false, stars:5.0 },
        { id:"beatthebombb", emoji:"🎯", place:"Beat The Bomb Brooklyn", type:"competitive", subtype:"escape room", desc:"5.0★ · escape room", booking:"https://www.beatthebomb.com/locations/brooklyn", maps:"Beat+The+Bomb+Brooklyn+NYC", reviews:15823, price:"$$", reservable:false, stars:5.0 },
        { id:"myssticrooms", emoji:"🎯", place:"MyssTic Rooms", type:"competitive", subtype:"escape room", desc:"5.0★ · escape room", booking:"https://www.myssticrooms.com/", maps:"MyssTic+Rooms+NYC", reviews:1092, price:"$$", reservable:false, stars:5.0 },
        { id:"nyaxethrowin", emoji:"🎯", place:"NY Axe Throwing Range - Brooklyn", type:"competitive", subtype:"axe throwing", desc:"4.9★ · axe throwing", booking:"https://www.nyaxe.com/williamsburg-ny-reservations/?utm_source=google&utm_medium=gmb&utm_campaign=seo", maps:"NY+Axe+Throwing+Range++Brooklyn+NYC", reviews:700, price:"$$", reservable:false, stars:4.9 },
        { id:"233starrkara", emoji:"🎯", place:"233 Starr Karaoke & Eats", type:"competitive", subtype:"karaoke", desc:"4.9★ · karaoke", booking:"http://www.233starrkaraoke.com/", maps:"233+Starr+Karaoke++Eats+NYC", reviews:262, price:"$$", reservable:false, stars:4.9 },
        { id:"komnataquest", emoji:"🎯", place:"Komnata Quest Brooklyn", type:"competitive", subtype:"escape room", desc:"4.8★ · escape room", booking:"https://komnataescaperoom.com/", maps:"Komnata+Quest+Brooklyn+NYC", reviews:822, price:"$$", reservable:false, stars:4.8 },
        { id:"xgolfbrookly", emoji:"🎯", place:"X-Golf Brooklyn", type:"competitive", subtype:"golf simulator", desc:"4.8★ · golf simulator", booking:"http://www.xgolfbrooklyn.com/", maps:"XGolf+Brooklyn+NYC", reviews:62, price:"$$", reservable:false, stars:4.8 },
        { id:"golfzonsocia", emoji:"🎯", place:"Golfzon Social - Brooklyn", type:"competitive", subtype:"golf simulator", desc:"4.8★ · golf simulator", booking:"https://golfzonsocial.com/locations/brooklyn/?utm_source=extnet&utm_medium=yext", maps:"Golfzon+Social++Brooklyn+NYC", reviews:224, price:"$$", reservable:false, stars:4.8 },
        { id:"lionsroarkar", emoji:"🎯", place:"Lions Roar Karaoke House", type:"competitive", subtype:"karaoke", desc:"4.7★ · karaoke", booking:"http://lionsroarentertainment.com/", maps:"Lions+Roar+Karaoke+House+NYC", reviews:88, price:"$$", reservable:false, stars:4.7 },
        { id:"shipwrecked", emoji:"🎯", place:"Shipwrecked", type:"competitive", subtype:"mini golf", desc:"4.5★ · mini golf", booking:"http://www.shipwreckednyc.com/", maps:"Shipwrecked+NYC", reviews:813, price:"$$", reservable:false, stars:4.5 },
        { id:"bushwickcoun", emoji:"🎯", place:"Bushwick Country Club", type:"competitive", subtype:"mini golf", desc:"Ironically named bar featuring cheap drinks, a photo booth & a six-hole mini-golf course.", booking:"http://www.bushwickcountryclub.com/", maps:"Bushwick+Country+Club+NYC", reviews:236, price:"$", reservable:false, stars:4.5 },
        { id:"brooklynbowl", emoji:"🎯", place:"Brooklyn Bowl", type:"competitive", subtype:"bowling", desc:"Genre-defying bowling alley in Williamsburg with high-tech lanes, live tunes & food by Blue Ribbon.", booking:"http://www.brooklynbowl.com/brooklyn", maps:"Brooklyn+Bowl+NYC", reviews:3914, price:"$$", reservable:false, stars:4.5 },
        { id:"beatskaraoke", emoji:"🎯", place:"Beats Karaoke Cafe", type:"competitive", subtype:"karaoke", desc:"This rustic-modern karaoke spot with private rooms serves beer, sake & soju, plus Asian bar bites.", booking:"http://www.beatskaraoke.com/", maps:"Beats+Karaoke+Cafe+NYC", reviews:700, price:"$$", reservable:false, stars:4.5 },
        { id:"alligatorlou", emoji:"🎯", place:"Alligator Lounge", type:"competitive", subtype:"karaoke", desc:"Budget drinks come with free pizza as well as karaoke, pool & Skee-Ball at this no-frills bar.", booking:"http://www.alligatorloungebrooklyn.com/", maps:"Alligator+Lounge+NYC", reviews:1563, price:"$", reservable:false, stars:4.4 },
        { id:"chinogrande", emoji:"🎯", place:"Chino Grande", type:"competitive", subtype:"karaoke", desc:"4.3★ · karaoke", booking:"http://www.chinograndenyc.com/", maps:"Chino+Grande+NYC", reviews:285, price:"$$", reservable:false, stars:4.3 },
        ],
      shows: [],
      active: [
        { id:"form50fitnes", emoji:"💪", place:"Form50 Fitness Williamsburg", type:"active", subtype:"fitness class", desc:"4.9★ · fitness class", booking:"https://form50fitness.com/?utm_campaign=gmbWilliamsburg", maps:"Form50+Fitness+Williamsburg+NYC", reviews:286, price:"$$", reservable:false, stars:4.9 },
        { id:"sessiontrain", emoji:"💪", place:"SESSION TRAINING | SOUTH WILLIAMSBURG", type:"active", subtype:"fitness class", desc:"4.9★ · fitness class", booking:"http://www.thesessionnyc.com/", maps:"SESSION+TRAINING++SOUTH+WILLIAMSBURG+NYC", reviews:258, price:"$$", reservable:false, stars:4.9 },
        { id:"thebarmethod", emoji:"💪", place:"The Bar Method Brooklyn - Williamsburg", type:"active", subtype:"fitness class", desc:"4.7★ · fitness class", booking:"https://barmethod.com/locations/new-york-city-williamsburg/?utm_source=google&utm_medium=organic-businesslisting&utm_campaign=gbp-listing", maps:"The+Bar+Method+Brooklyn++Williamsburg+NYC", reviews:118, price:"$$", reservable:false, stars:4.7 },
        ],
      paid: [],
    },
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
          { place:"The Last Resort", type:"Bar", desc:"The Last Resort", booking:null, maps:"The+Last+Resort+East+Village+Manhattan", reviews:37, price:"$$", reservable:false, stars:4.7 },
        
        { id:"lucky", emoji:"🍸", place:"Lucky", type:"late night bar", desc:"Small, easygoing bar & community event space featuring seasonal cocktails & a backyard beer garden. Open until 4:00am.", booking:"http://www.luckyonb.com/", maps:"Lucky+NYC", reviews:298, price:"$", reservable:false, stars:4.5, latenight:true },
        { id:"deathcoeastv", emoji:"🍸", place:"Death & Co East Village", type:"late night bar", desc:"Bartenders in bow ties & suspenders recall the speakeasy era at this dark, moody cocktail lounge. Open until 2:00am.", booking:"http://www.deathandcompany.com/", maps:"Death++Co+East+Village+NYC", reviews:2078, price:"$$$", reservable:false, stars:4.5, latenight:true },
        { id:"tendegrees", emoji:"🍸", place:"Ten Degrees", type:"late night bar", desc:"Petite St. Marks Place wine bar offering a variety of vinos paired with small plates. Open until 4:00am.", booking:"https://www.tendegreesbar.com/", maps:"Ten+Degrees+NYC", reviews:627, price:"$$", reservable:false, stars:4.4, latenight:true },
        { id:"thelibrary", emoji:"🍸", place:"The Library", type:"late night bar", desc:"Longtime barroom with cheap drinks, crowd-pleasing jukebox & B movies projected on the walls. Open until 4:00am.", booking:"https://thelibrary-ny.shop/", maps:"The+Library+NYC", reviews:701, price:"$", reservable:false, stars:4.3, latenight:true },
        { id:"pleasedontte", emoji:"🍸", place:"Please Don't Tell", type:"late night bar", desc:"Patrons who enter through a phone booth in Crif Dogs next door sip novel cocktails in a dark space. Open until 2:00am.", booking:"http://www.pdtnyc.com/", maps:"Please+Dont+Tell+NYC", reviews:2417, price:"$$$", reservable:false, stars:4.3, latenight:true },
        { id:"hiddentiger", emoji:"🍸", place:"Hidden Tiger", type:"late night bar", desc:"Open until 2:00am.", booking:"http://hiddentigernyc.com/", maps:"Hidden+Tiger+NYC", reviews:84, price:"$$", reservable:false, stars:4.3, latenight:true },
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
      
        { id:"yakinikugene", emoji:"🥩", place:"Yakiniku Gen East Village", type:"korean", desc:"4.9★ · korean", booking:"https://yakinikugen.com/", maps:"Yakiniku+Gen+East+Village+NYC", reviews:1356, price:"$$", reservable:true, stars:4.9 },
        { id:"casincharlie", emoji:"🥩", place:"C as in Charlie", type:"korean", desc:"4.8★ · korean", booking:"http://c-asincharlie.com/", maps:"C+as+in+Charlie+NYC", reviews:878, price:"$$", reservable:true, stars:4.8 },
        { id:"tipsyshangha", emoji:"🥢", place:"TIPSY SHANGHAI 蘇杭餐厅", type:"chinese", desc:"4.8★ · chinese", booking:"https://www.tipsy-shanghai.com/", maps:"TIPSY+SHANGHAI++NYC", reviews:1044, price:"$$", reservable:true, stars:4.8 },
        { id:"twilightloun", emoji:"🥢", place:"Twilight Lounge 朝暮", type:"chinese", desc:"4.8★ · chinese", booking:"https://twilightloungenyc.com/", maps:"Twilight+Lounge++NYC", reviews:140, price:"$$", reservable:true, stars:4.8 },
        { id:"jiangnannyc", emoji:"🥢", place:"Jiang Nan NYC", type:"chinese", desc:"Contemporary takes on Chinese classics artfully presented in a chic, streamlined space.", booking:"https://jiangnanny.com/", maps:"Jiang+Nan+NYC+NYC", reviews:1897, price:"$$$$", reservable:true, stars:4.8 },
        { id:"nanxiangsoup", emoji:"🥢", place:"Nan Xiang Soup Dumplings - East Village", type:"chinese", desc:"4.8★ · chinese", booking:"https://nanxiangxiaolongbao.com/?utm_source=gbp&utm_medium=organic&utm_campaign=eastvillage", maps:"Nan+Xiang+Soup+Dumplings++East+Village+NYC", reviews:1196, price:"$$", reservable:true, stars:4.8 },
        { id:"atomix", emoji:"🥩", place:"ATOMIX", type:"korean", desc:"Upscale Korean restaurant offering a chef's tasting menu with beverage pairings in chic environs.", booking:"http://www.atomixnyc.com/", maps:"ATOMIX+NYC", reviews:507, price:"$$$$", reservable:true, stars:4.7 },
        { id:"oijimi", emoji:"🥩", place:"Oiji Mi", type:"korean", desc:"Stylish restaurant with retro decor, offering upscale Korean cuisine with a modern twist.", booking:"http://www.oijimi.com/", maps:"Oiji+Mi+NYC", reviews:1236, price:"$$", reservable:true, stars:4.6 },
        { id:"soogil", emoji:"🥩", place:"Soogil", type:"korean", desc:"Contemporary Korean dishes prepared with French techniques in an earthy setting with cocktails.", booking:"http://soogil.com/", maps:"Soogil+NYC", reviews:309, price:"$$", reservable:true, stars:4.6 },
        { id:"genesishouse", emoji:"🥩", place:"Genesis House", type:"korean", desc:"Elevated Korean delicacies are served in this contemporary restaurant with a spacious terrace.", booking:"https://www.genesishouse.com/us/en/nyc/index.html", maps:"Genesis+House+NYC", reviews:635, price:"$$", reservable:true, stars:4.5 },
        { id:"mlproject", emoji:"🥢", place:"MáLà Project", type:"chinese", desc:"Cozy, hip spot featuring Chinese dry pot with a choice of spice level, plus appetizers and dim sum.", booking:"http://malaproject.com/", maps:"ML+Project+NYC", reviews:1419, price:"$$", reservable:true, stars:4.4 },
      
        { id:"yakinikugene", emoji:"🥩", place:"Yakiniku Gen East Village", type:"korean", desc:"4.9★ · korean", booking:"https://yakinikugen.com/", maps:"Yakiniku+Gen+East+Village+NYC", reviews:1355, price:"$$", reservable:true, stars:4.9 },
        { id:"mokyo", emoji:"🥩", place:"Mokyo", type:"korean", desc:"Korean-inspired comfort food & small plates in a casual, rustic setting with exposed brick walls.", booking:"http://www.mokyony.com/", maps:"Mokyo+NYC", reviews:719, price:"$$", reservable:true, stars:4.7 },
        { id:"soogil", emoji:"🥩", place:"Soogil", type:"korean", desc:"Contemporary Korean dishes prepared with French techniques in an earthy setting with cocktails.", booking:"http://soogil.com/", maps:"Soogil+NYC", reviews:309, price:"$$", reservable:true, stars:4.6 },
        { id:"oijimi", emoji:"🥩", place:"Oiji Mi", type:"korean", desc:"Stylish restaurant with retro decor, offering upscale Korean cuisine with a modern twist.", booking:"http://www.oijimi.com/", maps:"Oiji+Mi+NYC", reviews:1236, price:"$$", reservable:true, stars:4.6 },
        { id:"ariari", emoji:"🥩", place:"ARIARI", type:"korean", desc:"4.6★ · korean", booking:"https://ariarinyc.com/", maps:"ARIARI+NYC", reviews:543, price:"$$", reservable:true, stars:4.6 },
        { id:"nowoneastvil", emoji:"🥩", place:"Nowon East Village", type:"korean", desc:"Korean-American plates are served in an intimate setting with hip hop influences.", booking:"https://www.nowonusa.com/", maps:"Nowon+East+Village+NYC", reviews:782, price:"$$", reservable:true, stars:4.5 },
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
      
        { id:"cuerno", emoji:"🌮", place:"Cuerno", type:"mexican", desc:"4.8★ · mexican", booking:"https://cuernony.com/", maps:"Cuerno+NYC", reviews:1088, price:"$$", reservable:true, stars:4.8 },
        { id:"hags", emoji:"🌿", place:"HAGS", type:"vegan", desc:"4.7★ · vegan", booking:"https://hagsnyc.com/", maps:"HAGS+NYC", reviews:136, price:"$$", reservable:true, stars:4.7 },
        { id:"lacontenta", emoji:"🌮", place:"La Contenta", type:"mexican", desc:"Neighborhood joint for Mexican food by a native chef-owner, plus mezcals & other agave spirits.", booking:"http://lacontentales.com/", maps:"La+Contenta+NYC", reviews:1051, price:"$$", reservable:true, stars:4.6 },
        { id:"ladybird", emoji:"🌿", place:"Ladybird", type:"vegan", desc:"Creative vegetarian small plates & cocktails in an embellished setting with plush banquettes.", booking:"https://ladybirdny.com/?utm_source=google", maps:"Ladybird+NYC", reviews:945, price:"$$", reservable:true, stars:4.6 },
        { id:"avantgarden", emoji:"🌿", place:"Avant Garden", type:"vegan", desc:"Refined vegan dishes & global wines served in a snug, brick-walled eatery with a branch chandelier.", booking:"https://www.avantgardennyc.com/", maps:"Avant+Garden+NYC", reviews:897, price:"$$$", reservable:true, stars:4.6 },
        { id:"sodaclub", emoji:"🌿", place:"Soda Club", type:"vegan", desc:"4.6★ · vegan", booking:"https://www.overthrowhospitality.com/", maps:"Soda+Club+NYC", reviews:498, price:"$$", reservable:true, stars:4.6 },
        { id:"barverde", emoji:"🌮", place:"Bar Verde", type:"mexican", desc:"Casual, modern vegan spot for tacos and other Mexican plates, plus cocktails and brunch.", booking:"https://barverdenyc.com/?utm_source=gmb&utm_medium=profile&utm_campaign=gmb_profile_visit", maps:"Bar+Verde+NYC", reviews:769, price:"$$", reservable:true, stars:4.5 },
        { id:"caravanofdre", emoji:"🌿", place:"Caravan Of Dreams", type:"vegan", desc:"Bohemian outfit offering inventive vegan dishes that are kosher & organic, plus live music.", booking:"https://www.caravanofdreams.net/", maps:"Caravan+Of+Dreams+NYC", reviews:717, price:"$$", reservable:true, stars:4.5 },
        { id:"mayamezcal", emoji:"🌮", place:"Mayamezcal", type:"mexican", desc:"Mexican small plates & top-shelf tequila cocktails are served in intimate, vintage surroundings.", booking:"http://mayamezcal.com/", maps:"Mayamezcal+NYC", reviews:458, price:"$$$", reservable:true, stars:4.4 },
        { id:"cosme", emoji:"🌮", place:"Cosme", type:"mexican", desc:"Sleek Mexican spot with a big bar for locally sourced share plates, plus tequila and mezcal cocktails.", booking:"http://www.cosmenyc.com/", maps:"Cosme+NYC", reviews:3102, price:"$$$$", reservable:true, stars:4.3 },
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
      coffee: [
        { id:"kijitoraev", emoji:"🍵", place:"Kijitora", type:"matcha cafe", desc:"Japanese matcha bar from Tokyo. Ceremonial grade matcha, lush lattes, minimal and calm.", booking:"https://www.instagram.com/kijitoranyc", maps:"Kijitora+1st+Ave+East+Village+NYC", reviews:700, price:"$$", reservable:false, stars:4.8 },
        { id:"matchahouse", emoji:"☕", place:"MATCHA HOUSE", type:"coffee", subtype:"coffee", desc:"4.7★ · coffee", booking:"https://matchahousenyc.com/", maps:"MATCHA+HOUSE+NYC", reviews:107, price:"$$", reservable:false, stars:4.7 },
        { id:"lphin", emoji:"☕", place:"Lê Phin", type:"coffee", subtype:"coffee", desc:"4.7★ · coffee", booking:null, maps:"L+Phin+NYC", reviews:440, price:"$$", reservable:false, stars:4.7 },
        { id:"lacabrabaker", emoji:"☕", place:"La Cabra Bakery", type:"coffee", subtype:"coffee", desc:"4.6★ · coffee", booking:"https://us.lacabra.com/pages/east-village", maps:"La+Cabra+Bakery+NYC", reviews:1521, price:"$$", reservable:false, stars:4.6 },
        { id:"thelazyllama", emoji:"☕", place:"The Lazy Llama Coffee Bar", type:"coffee", subtype:"coffee", desc:"4.6★ · coffee", booking:null, maps:"The+Lazy+Llama+Coffee+Bar+NYC", reviews:391, price:"$", reservable:false, stars:4.6 },
        { id:"redbeardcoff", emoji:"☕", place:"Red Beard Coffee & Bakery", type:"coffee", subtype:"coffee", desc:"4.6★ · coffee", booking:"https://www.instagram.com/redbeardcoffeebakery/", maps:"Red+Beard+Coffee++Bakery+NYC", reviews:133, price:"$$", reservable:false, stars:4.6 },
        { id:"coffeeprojec", emoji:"☕", place:"Coffee Project New York | East Village", type:"coffee", subtype:"coffee", desc:"Cozy, brick-lined joint for inventive drinks such as deconstructed lattes and nitro cold-brew coffee.", booking:"https://coffeeprojectny.com/?utm_source=google&utm_medium=organic&utm_campaign=gmb_ev", maps:"Coffee+Project+New+York++East+Village+NYC", reviews:814, price:"$$", reservable:false, stars:4.6 },
        { id:"12matcha", emoji:"☕", place:"12 Matcha", type:"coffee", subtype:"coffee", desc:"4.4★ · coffee", booking:"https://12matcha.com/", maps:"12+Matcha+NYC", reviews:608, price:"$$", reservable:false, stars:4.4 },
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
      
        { id:"theyork", emoji:"🌙", place:"The York", type:"late night food", desc:"Open until 2:00am.", booking:"http://theyork.nyc/", maps:"The+York+NYC", reviews:174, price:"$$", reservable:false, stars:4.9, latenight:true },
      ],
    },
    activities: {
      free: [
        { id:"tompkinssqpark", emoji:"🌳", place:"Tompkins Square Park", type:"Park", desc:"The beating heart of the East Village. Sit on a bench and watch the neighborhood unfold.", booking:null, maps:"Tompkins+Square+Park+East+Village+NYC", reviews:5929, price:"Free", reservable:false, stars:4.4 },

        { id:"johnlindsaypark", emoji:"🌊", place:"East River Park", type:"Waterfront Park", desc:"Walk the FDR esplanade along the East River with sweeping bridge views.", booking:null, maps:"John+V+Lindsay+East+River+Park+East+Village+NYC", reviews:4303, price:"Free", reservable:false, stars:4.5 },

        { id:"6bcgarden", emoji:"🌺", place:"6BC Botanical Garden", type:"Community Garden", desc:"Hidden botanical garden on 6th St. One of the East Village's best kept secrets.", booking:null, maps:"6BC+Botanical+Garden+East+Village+NYC", reviews:274, price:"Free", reservable:false, stars:4.6 },

        { id:"evcommgardens", emoji:"🌿", place:"East Village Community Gardens", type:"Garden Walk", desc:"Wander between 6th Street gardens on Aves B and C. Flowers, quiet, no tourists.", booking:null, maps:"East+Village+Community+Gardens+NYC", reviews:96, price:"Free", reservable:false, stars:4.7 },

        { id:"nycomedyclubev", emoji:"😂", place:"New York Comedy Club", type:"comedy", desc:"One of NYC's most respected comedy clubs. Intimate room, strong lineups.", booking:"https://newyorkcomedyclub.com/", maps:"New+York+Comedy+Club+East+Village", reviews:956, price:"$$", reservable:true, stars:4.3 },

        { id:"stmarkscc", emoji:"😂", place:"St. Marks Comedy Club", type:"comedy", desc:"Comedy club on St. Marks Place. Great for a first date.", booking:null, maps:"St+Marks+Comedy+Club+East+Village", reviews:829, price:"$$", reservable:false, stars:4.3 },

        { id:"topsecretcc", emoji:"😂", place:"Top Secret Comedy Club", type:"comedy", desc:"Intimate comedy show in the East Village.", booking:"https://www.topsecretcomedy.com/", maps:"Top+Secret+Comedy+Club+East+Village", reviews:252, price:"$$", reservable:true, stars:4.9 },

        ],
      outside: [],
      creative: [
        { id:"artsclub", emoji:"🎨", place:"ArtsClub", type:"creative", subtype:"museum", desc:"5.0★ · museum", booking:"http://artsclubstudios.com/", maps:"ArtsClub+NYC", reviews:43, price:"$$", reservable:false, stars:5.0 },
        { id:"museumofrecl", emoji:"🎨", place:"Museum of Reclaimed Urban Space (MoRUS)", type:"creative", subtype:"museum", desc:"4.8★ · museum", booking:"https://www.morusnyc.org/about-morus/about-us/", maps:"Museum+of+Reclaimed+Urban+Space+MoRUS+NYC", reviews:118, price:"$$", reservable:false, stars:4.8 },
        { id:"yarostudios", emoji:"🎨", place:"YARO STUDIOS", type:"creative", subtype:"art class", desc:"4.8★ · art class", booking:"http://www.yarostudios.com/", maps:"YARO+STUDIOS+NYC", reviews:65, price:"$$", reservable:false, stars:4.8 },
        { id:"themuseumofi", emoji:"🎨", place:"The Museum of Interesting Things", type:"creative", subtype:"museum", desc:"Appointment-only viewings of old phonographs, cameras & toys in a private collector's home.", booking:"http://www.museumofinterestingthings.org/", maps:"The+Museum+of+Interesting+Things+NYC", reviews:60, price:"$$", reservable:false, stars:4.7 },
        { id:"tenementmuse", emoji:"🎨", place:"Tenement Museum", type:"creative", subtype:"museum", desc:"1863 preserved tenement building brings Lower East Side immigrant stories to life with guided tours.", booking:"https://www.tenement.org/", maps:"Tenement+Museum+NYC", reviews:5872, price:"$$", reservable:false, stars:4.6 },
        ],
      competitive: [
        { id:"97happyktvin", emoji:"🎯", place:"97 Happy KTV Inc", type:"competitive", subtype:"karaoke", desc:"4.8★ · karaoke", booking:"http://www.97happyktv.com/", maps:"97+Happy+KTV+Inc+NYC", reviews:39, price:"$$", reservable:false, stars:4.8 },
        { id:"bohokaraokeo", emoji:"🎯", place:"Boho Karaoke Orchard", type:"competitive", subtype:"karaoke", desc:"Karaoke lounge with 17 private rooms & a list of around 80,000 songs in multiple languages.", booking:"http://www.karaokeboho.com/", maps:"Boho+Karaoke+Orchard+NYC", reviews:1235, price:"$", reservable:false, stars:4.4 },
        { id:"barcade", emoji:"🎯", place:"Barcade", type:"competitive", subtype:"bowling", desc:"A spin-off of a Williamsburg bar, this hang has vintage video games (Pac-Man, Donkey Kong) & beer.", booking:"https://barcade.com/stmarks/", maps:"Barcade+NYC", reviews:1888, price:"$$", reservable:false, stars:4.3 },
        ],
      shows: [],
      active: [
        { id:"liftoniceast", emoji:"💪", place:"LIFTONIC East Village", type:"active", subtype:"fitness class", desc:"4.9★ · fitness class", booking:"https://eastvillage.liftonic.com/", maps:"LIFTONIC+East+Village+NYC", reviews:178, price:"$$", reservable:false, stars:4.9 },
        { id:"saltdrop", emoji:"💪", place:"SaltDrop", type:"active", subtype:"fitness class", desc:"4.9★ · fitness class", booking:"https://www.thesaltdrop.com/", maps:"SaltDrop+NYC", reviews:64, price:"$$", reservable:false, stars:4.9 },
        { id:"bodyevolutio", emoji:"💪", place:"Body Evolution", type:"active", subtype:"fitness class", desc:"Calm, spacious facility offering classes in the Gyrotonic fitness system, as well as Pilates.", booking:"http://www.bodyevolutions.com/", maps:"Body+Evolution+NYC", reviews:30, price:"$$", reservable:false, stars:4.4 },
        { id:"the14thstree", emoji:"💪", place:"The 14th Street Y", type:"active", subtype:"fitness class", desc:"4.3★ · fitness class", booking:"http://www.14streety.org/", maps:"The+14th+Street+Y+NYC", reviews:316, price:"$$", reservable:false, stars:4.3 },
        ],
      paid: [],
    },
    happyHour: [
          { place:"Lovers of Today", type:"Speakeasy Bar", desc:"50% off cocktails early evening. Snug, dark, craft cocktails.", deal:"50% off cocktails", hours:"Daily 5-8pm", booking:null, maps:"Lovers+of+Today+East+Village+NYC", reviews:235, price:"$$", reservable:false, stars:3.7 },
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
          { place:"Turks & Frogs", type:"Bar", desc:"Turks & Frogs", booking:"http://www.turksandfrogs.com/", maps:"Turks+&+Frogs+West+Village+Manhattan", reviews:165, price:"$$", reservable:true, stars:4.4 },
        
        { id:"artbar", emoji:"🍸", place:"Art Bar", type:"late night bar", desc:"Village mainstay with comfortable, dimly lit back room offers cocktails & bar food. Open until 4:00am.", booking:"https://www.artbar.com/", maps:"Art+Bar+NYC", reviews:1595, price:"$", reservable:false, stars:4.4, latenight:true },
        { id:"downthehatch", emoji:"🍸", place:"Down the Hatch", type:"late night bar", desc:"Underground bar serving up wings, burgers & more, along with drink specials & sports on the TVs. Open until 4:00am.", booking:"https://www.downthehatchnyc.com/", maps:"Down+the+Hatch+NYC", reviews:1486, price:"$", reservable:false, stars:4.3, latenight:true },
        { id:"wilfienell", emoji:"🍸", place:"Wilfie & Nell", type:"late night bar", desc:"Locally sourced pub grub, a wide cocktail menu & weekend brunch served in a compact, homey setting. Open until 4:00am.", booking:"http://www.wilfieandnell.com/", maps:"Wilfie++Nell+NYC", reviews:690, price:"$$", reservable:false, stars:4.3, latenight:true },
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
      
        { id:"lindaughters", emoji:"🥢", place:"Lin & Daughters - West Village", type:"chinese", desc:"4.7★ · chinese", booking:"https://www.linanddaughters.com/", maps:"Lin++Daughters++West+Village+NYC", reviews:360, price:"$$", reservable:false, stars:4.7 },
        { id:"yumchachines", emoji:"🥢", place:"Yum Cha Chinese Kitchen & Bar 姑苏里", type:"chinese", desc:"4.7★ · chinese", booking:"http://yumchanyc.com/", maps:"Yum+Cha+Chinese+Kitchen++Bar++NYC", reviews:991, price:"$$", reservable:true, stars:4.7 },
        { id:"steam", emoji:"🥢", place:"Steam", type:"chinese", desc:"4.6★ · chinese", booking:"https://steam-nyc.com/", maps:"Steam+NYC", reviews:507, price:"$$", reservable:true, stars:4.6 },
        { id:"naro", emoji:"🥩", place:"NARO", type:"korean", desc:"4.5★ · korean", booking:"https://www.naronyc.com/", maps:"NARO+NYC", reviews:613, price:"$$", reservable:true, stars:4.5 },
        { id:"kyunyc", emoji:"🥩", place:"KYU NYC", type:"korean", desc:"4.5★ · korean", booking:"https://www.kyurestaurants.com/location/kyu-nyc/?utm_source=gmb", maps:"KYU+NYC+NYC", reviews:828, price:"$$", reservable:true, stars:4.5 },
        { id:"decoy", emoji:"🥢", place:"Decoy", type:"chinese", desc:"Tiny restaurant under RedFarm for peking duck prix fixe meals plus a bar with drinks & Asian bites.", booking:"http://decoynyc.com/", maps:"Decoy+NYC", reviews:462, price:"$$$", reservable:true, stars:4.5 },
        { id:"redfarm", emoji:"🥢", place:"RedFarm", type:"chinese", desc:"Creative dim sum & other modern, seasonal Chinese food in a cozy & rustic farmhouse-style setting.", booking:"https://www.redfarmnyc.com/location/west-village/", maps:"RedFarm+NYC", reviews:697, price:"$$$", reservable:true, stars:4.5 },
      
        { id:"tbdgimbap", emoji:"🥩", place:"TBD Gimbap", type:"korean", desc:"5.0★ · korean", booking:null, maps:"TBD+Gimbap+NYC", reviews:82, price:"$$", reservable:false, stars:5.0 },
        { id:"jejunoodleba", emoji:"🥩", place:"Jeju Noodle Bar", type:"korean", desc:"Korean restaurant focused on ramyun and starters in a warmly lit, contemporary space.", booking:"http://jejunoodlebar.com/", maps:"Jeju+Noodle+Bar+NYC", reviews:3265, price:"$$", reservable:true, stars:4.6 },
        { id:"kimbaplab", emoji:"🥩", place:"Kimbap Lab", type:"korean", desc:"4.6★ · korean", booking:"http://www.kimbaplab.com/", maps:"Kimbap+Lab+NYC", reviews:118, price:"$", reservable:false, stars:4.6 },
        { id:"genesishouse", emoji:"🥩", place:"Genesis House", type:"korean", desc:"Elevated Korean delicacies are served in this contemporary restaurant with a spacious terrace.", booking:"https://www.genesishouse.com/us/en/nyc/index.html", maps:"Genesis+House+NYC", reviews:635, price:"$$", reservable:true, stars:4.5 },
        { id:"kyunyc", emoji:"🥩", place:"KYU NYC", type:"korean", desc:"4.5★ · korean", booking:"https://www.kyurestaurants.com/location/kyu-nyc/?utm_source=gmb", maps:"KYU+NYC+NYC", reviews:828, price:"$$", reservable:true, stars:4.5 },
        { id:"samwoojung", emoji:"🥩", place:"Samwoojung", type:"korean", desc:"4.5★ · korean", booking:"https://www.samwoojung1963.com/", maps:"Samwoojung+NYC", reviews:457, price:"$$$", reservable:true, stars:4.5 },
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
      mediterranean: [
        { id:"sentirveganm", emoji:"🌮", place:"Sentir Vegan Mexican Restaurant", type:"mexican", desc:"4.8★ · mexican", booking:"https://sentirnyc.com/", maps:"Sentir+Vegan+Mexican+Restaurant+NYC", reviews:455, price:"$$", reservable:true, stars:4.8 },
        { id:"shsh", emoji:"🌿", place:"SHŌSH", type:"vegan", desc:"4.8★ · vegan", booking:"https://www.shosh.nyc/", maps:"SHSH+NYC", reviews:267, price:"$$", reservable:true, stars:4.8 },
        { id:"aniximediter", emoji:"🌿", place:"Anixi Mediterranean Vegan Restaurant", type:"vegan", desc:"4.8★ · vegan", booking:"https://www.anixinyc.com/", maps:"Anixi+Mediterranean+Vegan+Restaurant+NYC", reviews:2119, price:"$$", reservable:true, stars:4.8 },
        { id:"chloes", emoji:"🌿", place:"CHLOE'S", type:"vegan", desc:"4.7★ · vegan", booking:"https://www.chloeonbleecker.com/", maps:"CHLOES+NYC", reviews:583, price:"$$", reservable:false, stars:4.7 },
        { id:"jajajamexica", emoji:"🌿", place:"Jajaja Mexicana", type:"vegan", desc:"Contemporary Mexican spot with a colorful, all-vegan menu, plus tequila and mezcal cocktails.", booking:"https://www.jajajamexicana.com/", maps:"Jajaja+Mexicana+NYC", reviews:1758, price:"$$", reservable:true, stars:4.6 },
        { id:"cantowestvil", emoji:"🌿", place:"Canto West Village", type:"vegan", desc:"Vibrant outfit with exposed bricks & a wood ceiling serving Italian classics & cocktails.", booking:"https://www.cantonyc.com/", maps:"Canto+West+Village+NYC", reviews:1558, price:"$$", reservable:true, stars:4.6 },
        { id:"palma", emoji:"🌿", place:"Palma", type:"vegan", desc:"Italian classics are crafted from organic ingredients in a sunwashed stucco space with a garden.", booking:"https://www.palmanyc.com/", maps:"Palma+NYC", reviews:1164, price:"$$$", reservable:true, stars:4.6 },
        { id:"delicesarras", emoji:"🌿", place:"Delice & Sarrasin", type:"vegan", desc:"Cozy, quaint cafe offering traditional French dishes made vegan, along with sweet & savory crêpes.", booking:"http://delicesarrasin.com/", maps:"Delice++Sarrasin+NYC", reviews:1326, price:"$$", reservable:true, stars:4.5 },
        { id:"littlerubysw", emoji:"🌮", place:"Little Ruby's West Village", type:"mexican", desc:"4.4★ · mexican", booking:"https://www.rubyscafe.com/", maps:"Little+Rubys+West+Village+NYC", reviews:757, price:"$$", reservable:true, stars:4.4 },
      ],
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
      coffee: [
        { id:"caferumi", emoji:"☕", place:"Cafe Rumi", type:"coffee", subtype:"coffee", desc:"4.9★ · coffee", booking:"https://caferuminyc.com/", maps:"Cafe+Rumi+NYC", reviews:447, price:"$", reservable:false, stars:4.9 },
        { id:"simplcoffee", emoji:"☕", place:"Simpl Coffee", type:"coffee", subtype:"coffee", desc:"4.9★ · coffee", booking:"http://simplcoffee.us/", maps:"Simpl+Coffee+NYC", reviews:751, price:"$$", reservable:false, stars:4.9 },
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
    activities: {
      free: [
        { id:"pier45", emoji:"🌅", place:"Pier 45 at Hudson River Park", type:"Waterfront Pier", desc:"Sit on the grass with the river and sunset views. The best free view in the Village.", booking:null, maps:"Pier+45+Hudson+River+Park+West+Village+NYC", reviews:686, price:"Free", reservable:false, stars:4.7 },

        { id:"littleisland", emoji:"🌺", place:"Little Island", type:"Public Park", desc:"An elevated park built on the Hudson River. Flowers, gardens, and stunning city views.", booking:null, maps:"Little+Island+Pier+55+Hudson+River+Park+NYC", reviews:17225, price:"Free", reservable:false, stars:4.7 },

        { id:"christopherpierwv", emoji:"🌊", place:"Christopher Street Pier", type:"Waterfront Pier", desc:"The historic pier at the end of Christopher St. Beautiful Hudson River sunsets.", booking:null, maps:"Christopher+Street+Pier+West+Village+NYC", reviews:211, price:"Free", reservable:false, stars:4.8 },

        { id:"hudsonriverpark", emoji:"🌿", place:"Hudson River Park", type:"Waterfront Walk", desc:"Miles of waterfront greenway along the Hudson. Walk south toward Tribeca or north toward Chelsea.", booking:null, maps:"Hudson+River+Park+West+Village+NYC", reviews:6647, price:"Free", reservable:false, stars:4.7 },

        { place:"Pier 57", type:"Bar", desc:"Pier 57", booking:"https://www.pier57nyc.com/", maps:"Pier+57+West+Village+Manhattan", reviews:1870, price:"$$", reservable:false, stars:4.7 },

        { id:"moonflowerwv", emoji:"🌸", place:"Moonflower", type:"floral cocktail bar", desc:"Tiny floral cocktail bar. Intimate and absolutely unique.", booking:null, maps:"Moonflower+West+Village+NYC", reviews:114, price:"$$", reservable:false, stars:4.5 },

        ],
      outside: [],
      creative: [
        { id:"artretreatny", emoji:"🎨", place:"Art Retreat NYC", type:"creative", subtype:"art class", desc:"5.0★ · art class", booking:"https://www.artretreatnyc.com/", maps:"Art+Retreat+NYC+NYC", reviews:29, price:"$$", reservable:false, stars:5.0 },
        { id:"paintingloun", emoji:"🎨", place:"Painting Lounge - Chelsea Studio", type:"creative", subtype:"art class", desc:"4.9★ · art class", booking:"http://www.paintinglounge.com/", maps:"Painting+Lounge++Chelsea+Studio+NYC", reviews:30, price:"$$", reservable:false, stars:4.9 },
        { id:"paintmebear", emoji:"🎨", place:"PAINT ME BEAR", type:"creative", subtype:"art class", desc:"4.8★ · art class", booking:"https://paintmebear.com/", maps:"PAINT+ME+BEAR+NYC", reviews:113, price:"$$", reservable:false, stars:4.8 },
        { id:"unarthodox", emoji:"🎨", place:"Unarthodox", type:"creative", subtype:"art class", desc:"4.8★ · art class", booking:"http://www.unarthodox.com/", maps:"Unarthodox+NYC", reviews:232, price:"$$", reservable:false, stars:4.8 },
        { id:"newyorkartst", emoji:"🎨", place:"New York Art Studio [ International School of Art and Design ]", type:"creative", subtype:"art class", desc:"4.8★ · art class", booking:"https://www.nyartstudio.com/", maps:"New+York+Art+Studio++International+School+of+Art+and+Design++NYC", reviews:126, price:"$$", reservable:false, stars:4.8 },
        { id:"artemuseumne", emoji:"🎨", place:"Arte Museum New York", type:"creative", subtype:"museum", desc:"4.7★ · museum", booking:"https://newyork.artemuseum.com/", maps:"Arte+Museum+New+York+NYC", reviews:2830, price:"$$", reservable:false, stars:4.7 },
        { id:"whitneymuseu", emoji:"🎨", place:"Whitney Museum of American Art", type:"creative", subtype:"museum", desc:"Museum exclusively featuring 20th-century & contemporary art by American artists, most still living.", booking:"https://whitney.org/", maps:"Whitney+Museum+of+American+Art+NYC", reviews:14740, price:"$$", reservable:false, stars:4.5 },
        { id:"museumofillu", emoji:"🎨", place:"Museum of Illusions - New York", type:"creative", subtype:"museum", desc:"Exhibits to deceive the eye including kaleidoscopes & holograms, plus tilted & reverse rooms.", booking:"http://newyork.museumofillusions.us/?utm_source=Google+GMB&utm_medium=website", maps:"Museum+of+Illusions++New+York+NYC", reviews:13498, price:"$$", reservable:false, stars:4.4 },
        { id:"colorfactory", emoji:"🎨", place:"Color Factory NYC", type:"creative", subtype:"museum", desc:"Art exhibit centered on colors, featuring playful participatory installations in separate rooms.", booking:"https://www.colorfactory.co/locations/new-york-city", maps:"Color+Factory+NYC+NYC", reviews:4681, price:"$$", reservable:false, stars:4.4 },
        ],
      competitive: [],
      shows: [],
      active: [
        { id:"westvillagea", emoji:"💪", place:"West Village Athletic (WVA)", type:"active", subtype:"fitness class", desc:"5.0★ · fitness class", booking:"http://the-athleticclubs.com/westvillageathletic", maps:"West+Village+Athletic+WVA+NYC", reviews:54, price:"$$", reservable:false, stars:5.0 },
        { id:"liftonicwest", emoji:"💪", place:"LIFTONIC West Village", type:"active", subtype:"fitness class", desc:"Custom-built gym for innovative group weight-training sessions featuring dumbbell & core exercises.", booking:"https://liftonic.com/", maps:"LIFTONIC+West+Village+NYC", reviews:252, price:"$$", reservable:false, stars:4.9 },
        { id:"willspace", emoji:"💪", place:"Willspace", type:"active", subtype:"fitness class", desc:"Upscale personal training studio providing fitness coaching on a private & small-group basis.", booking:"https://willspace.com/", maps:"Willspace+NYC", reviews:67, price:"$$", reservable:false, stars:4.9 },
        { id:"f45trainingw", emoji:"💪", place:"F45 Training West Village", type:"active", subtype:"fitness class", desc:"4.8★ · fitness class", booking:"https://f45training.com/westvillage", maps:"F45+Training+West+Village+NYC", reviews:75, price:"$$", reservable:false, stars:4.8 },
        { id:"tmplwestvill", emoji:"💪", place:"TMPL - West Village", type:"active", subtype:"fitness class", desc:"4.6★ · fitness class", booking:"https://www.tmplclubs.com/locations/tmpl-west-village?utm_source=google&utm_medium=organic&utm_campaign=google_my_business&utm_id=west_village", maps:"TMPL++West+Village+NYC", reviews:465, price:"$$", reservable:false, stars:4.6 },
        ],
      paid: [],
    },
    happyHour: [
          { place:"Amelie Wine Bar", type:"French Wine Bar", desc:"Half-price bottles on select wines. Best wine happy hour in the Village.", deal:"50% off select bottles", hours:"Tue–Fri 5–7pm", booking:"amelienyc.com", maps:"Amelie+Wine+Bar+West+Village+NYC", reviews:1444, price:"$$", reservable:true, stars:4.6 },
          { place:"Jeffrey's Grocery", type:"Oyster Bar", desc:"$1 oysters and $8 wines on Waverly Place. Get there early.", deal:"$1 oysters + $8 wine", hours:"Mon–Fri 5–6:30pm", booking:"jeffreysgrocery.com", maps:"Jeffreys+Grocery+West+Village+NYC", reviews:2200, price:"$$", reservable:true, stars:4.5 },
          { place:"Dante West Village", type:"Cocktail Bar", desc:"World's 50 Best Bars. Negroni hour you won't forget.", deal:"$12 negronis", hours:"Daily 3–6pm", booking:"dante-nyc.com", maps:"Dante+West+Village+NYC", reviews:1199, price:"$$$", reservable:true, stars:4.5 },
          { place:"Corner Bistro", latenight:true, type:"Dive Bar", desc:"$5 beers all day every day. The West Village's best value.", deal:"$5 beers all day", hours:"Daily 11:30am–4am", booking:null, maps:"Corner+Bistro+West+Village+NYC", reviews:4200, price:"$", reservable:false, stars:4.2 },
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
          { place:"Vida Verde - Tequila Bar", type:"Bar", desc:"Vida Verde - Tequila Bar", booking:"https://www.vidaverdeny.com/", maps:"Vida+Verde+-+Tequila+Bar+Midtown+Manhattan", reviews:4200, price:"$$", reservable:true, stars:4.6 },
        
        { id:"sirhenrys", emoji:"🍸", place:"Sir Henry’s", type:"late night bar", desc:"Open until 3:00am.", booking:"https://sirhenrysnyc.com/", maps:"Sir+Henrys+NYC", reviews:1210, price:"$$", reservable:false, stars:4.8, latenight:true },
        { id:"thedickens", emoji:"🍸", place:"The Dickens", type:"late night bar", desc:"Open until 2:00am.", booking:"https://www.thedickensnyc.com/", maps:"The+Dickens+NYC", reviews:2144, price:"$$", reservable:false, stars:4.8, latenight:true },
        { id:"haswellgreen", emoji:"🍸", place:"Haswell Green's", type:"late night bar", desc:"Hip, brick-lined locale with vintage accents for creative cocktails, modern pub plates & live music. Open until 4:00am.", booking:"https://haswellgreens.com/", maps:"Haswell+Greens+NYC", reviews:2218, price:"$$", reservable:false, stars:4.7, latenight:true },
        { id:"bartleydunne", emoji:"🍸", place:"Bartley Dunnes", type:"late night bar", desc:"Open until 3:00am.", booking:"https://bartleydunnesnyc.com/", maps:"Bartley+Dunnes+NYC", reviews:827, price:"$$", reservable:false, stars:4.7, latenight:true },
        { id:"jimmyscorner", emoji:"🍸", place:"Jimmy's Corner", type:"late night bar", desc:"Narrow, old-school Times Square bar with boxing memorabilia covering the walls. Open until 4:00am.", booking:"https://m.facebook.com/jimmyscornernyc", maps:"Jimmys+Corner+NYC", reviews:2211, price:"$", reservable:false, stars:4.6, latenight:true },
        { id:"tannersmiths", emoji:"🍸", place:"Tanner Smith's", type:"late night bar", desc:"Watering hole with a Prohibition theme serving craft cocktails, beer, wine & bar bites. Open until 3:00am.", booking:"http://www.tannersmiths.com/", maps:"Tanner+Smiths+NYC", reviews:3324, price:"$$", reservable:false, stars:4.4, latenight:true },
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
      
        { id:"kpotkoreanbb", emoji:"🥩", place:"KPOT Korean BBQ & Hot Pot", type:"korean", desc:"4.9★ · korean", booking:"https://thekpot.com/location/midtown-w-38th-st/", maps:"KPOT+Korean+BBQ++Hot+Pot+NYC", reviews:4092, price:"$$", reservable:true, stars:4.9 },
        { id:"thebestsichu", emoji:"🥢", place:"The Best Sichuan 一品成都21", type:"chinese", desc:"4.9★ · chinese", booking:"http://www.malahouse21.com/", maps:"The+Best+Sichuan+21+NYC", reviews:2434, price:"$$", reservable:true, stars:4.9 },
        { id:"ahgassikorea", emoji:"🥩", place:"Ahgassi Korean Barbecue", type:"korean", desc:"4.8★ · korean", booking:"https://ahgassigopchangnyc.com/", maps:"Ahgassi+Korean+Barbecue+NYC", reviews:2807, price:"$$", reservable:true, stars:4.8 },
        { id:"thebestsichu", emoji:"🥢", place:"The Best Sichuan", type:"chinese", desc:"4.8★ · chinese", booking:"https://www.mala747.com/", maps:"The+Best+Sichuan+NYC", reviews:2923, price:"$$", reservable:true, stars:4.8 },
        { id:"misskoreabbq", emoji:"🥩", place:"miss KOREA BBQ", type:"korean", desc:"Chic, zen-like Koreatown restaurant for barbecue, bulgogi and hot pots.", booking:"https://www.misskoreabbq.com/", maps:"miss+KOREA+BBQ+NYC", reviews:18929, price:"$$$", reservable:true, stars:4.7 },
        { id:"thebestsichu", emoji:"🥢", place:"The Best Sichuan 一品成都39", type:"chinese", desc:"Bi-level bar & eatery with classic decor for a vast menu of Chinese dishes from various regions.", booking:"http://www.bestsichuan.com/", maps:"The+Best+Sichuan+39+NYC", reviews:3357, price:"$$", reservable:true, stars:4.7 },
        { id:"chirestauran", emoji:"🥢", place:"Chi Restaurant & Bar", type:"chinese", desc:"4.7★ · chinese", booking:"https://chirestaurantnyc.com/", maps:"Chi+Restaurant++Bar+NYC", reviews:2568, price:"$$", reservable:true, stars:4.7 },
        { id:"skypavilion", emoji:"🥢", place:"Sky Pavilion 川雲涧", type:"chinese", desc:"4.7★ · chinese", booking:"https://www.skypavilionnyc.com/", maps:"Sky+Pavilion++NYC", reviews:541, price:"$$", reservable:true, stars:4.7 },
        { id:"loulou", emoji:"🥢", place:"LOULOU", type:"chinese", desc:"Two-level restaurant serving casual French fare paired with craft cocktails, beer, and champagne.", booking:"https://www.loulounyc.com/", maps:"LOULOU+NYC", reviews:4282, price:"$$", reservable:true, stars:4.7 },
        { id:"hojokbannyc", emoji:"🥩", place:"HOJOKBAN NYC", type:"korean", desc:"4.6★ · korean", booking:"https://hojokban.com/", maps:"HOJOKBAN+NYC+NYC", reviews:622, price:"$$", reservable:true, stars:4.6 },
        { id:"jongrobbq", emoji:"🥩", place:"Jongro BBQ", type:"korean", desc:"Serves Korean BBQ and other traditional dishes in a casual, open-timbered space with in-table grills.", booking:"https://www.jongrobbqny.com/", maps:"Jongro+BBQ+NYC", reviews:5485, price:"$$", reservable:true, stars:4.5 },
        { id:"tuome", emoji:"🥢", place:"Tuome", type:"chinese", desc:"Contemporary American cooking with Asian influences in a casual space featuring reclaimed materials.", booking:"http://www.tuomenyc.com/", maps:"Tuome+NYC", reviews:774, price:"$$", reservable:true, stars:4.5 },
        { id:"moono", emoji:"🥩", place:"Moono", type:"korean", desc:"4.4★ · korean", booking:"http://www.moononyc.com/", maps:"Moono+NYC", reviews:480, price:"$$", reservable:true, stars:4.4 },
        { id:"buddakan", emoji:"🥢", place:"Buddakan", type:"chinese", desc:"Huge, lavishly decorated restaurant offering a menu of Asian dishes & cocktails.", booking:"https://www.buddakannyc.com/?utm_source=GoogleBusinessProfile&utm_medium=Website&utm_campaign=MapLabs", maps:"Buddakan+NYC", reviews:5770, price:"$$$", reservable:true, stars:4.4 },
        { id:"53", emoji:"🥢", place:"53", type:"chinese", desc:"4.3★ · chinese", booking:"https://53-nyc.com/?utm_source=GoogleBusinessProfile&utm_medium=organic_search&utm_campaign=MapLabs", maps:"53+NYC", reviews:684, price:"$$$", reservable:true, stars:4.3 },
      
        { id:"hojokbannyc", emoji:"🥩", place:"HOJOKBAN NYC", type:"korean", desc:"4.6★ · korean", booking:"https://hojokban.com/", maps:"HOJOKBAN+NYC+NYC", reviews:622, price:"$$", reservable:true, stars:4.6 },
        { id:"jeongyukjeom", emoji:"🥩", place:"Jeong Yuk Jeom Korean BBQ NYC", type:"korean", desc:"4.6★ · korean", booking:"https://www.jeongyukjeomnyc.com/home", maps:"Jeong+Yuk+Jeom+Korean+BBQ+NYC+NYC", reviews:309, price:"$$", reservable:true, stars:4.6 },
        { id:"marikoreanha", emoji:"🥩", place:"Mari - Korean Handroll", type:"korean", desc:"Urbane restaurant with an open kitchen specializing in gourmet Korean hand rolls.", booking:"https://marinyc.com/", maps:"Mari++Korean+Handroll+NYC", reviews:475, price:"$$$$", reservable:true, stars:4.5 },
        { id:"jongrobbqmar", emoji:"🥩", place:"Jongro BBQ Market | Best All You Can Eat Korean BBQ, Koreatown", type:"korean", desc:"4.5★ · korean", booking:"https://jongrobbqmarket.com/", maps:"Jongro+BBQ+Market++Best+All+You+Can+Eat+Korean+BBQ+Koreatown+NYC", reviews:428, price:"$$", reservable:true, stars:4.5 },
        { id:"gaonnuri", emoji:"🥩", place:"Gaonnuri", type:"korean", desc:"Upscale, stylish Korean eatery on skyscraper's 39th floor offers panoramic views & tabletop BBQ.", booking:"http://www.gaonnurinyc.com/", maps:"Gaonnuri+NYC", reviews:1779, price:"$$$", reservable:true, stars:4.4 },
        { id:"lovekoreanbb", emoji:"🥩", place:"LOVE Korean BBQ", type:"korean", desc:"Bustling, informal eatery serving generous plates of homestyle Korean barbecue.", booking:"https://www.lovekoreanbbq.com/", maps:"LOVE+Korean+BBQ+NYC", reviews:1392, price:"$$", reservable:true, stars:4.4 },
      ],
      pasta: [
          { place:"La Grande Boucherie", type:"Bar", desc:"La Grande Boucherie", booking:"https://www.boucherieus.com/", maps:"La+Grande+Boucherie+Midtown+Manhattan", reviews:9985, price:"$$", reservable:true, stars:4.6 },
        
        { id:"osterialabai", emoji:"🍝", place:"Osteria La Baia", type:"italian dinner", desc:"Traditional and creative Italian cuisine plus cocktails in a spacious venue with chic, polished decor.", booking:"https://www.labaianyc.com/?y_source=1_MTAwNTA2Mjg0My03MTUtbG9jYXRpb24ud2Vic2l0ZQ%3D%3D", maps:"Osteria+La+Baia", reviews:5384, price:"$$$$", reservable:true, stars:4.9 },
        { id:"lapecorabian", emoji:"🍝", place:"La Pecora Bianca Bryant Park", type:"italian dinner", desc:"Stylish, bright eatery featuring market-driven Italian cuisine, regional wines & apéritifs.", booking:"https://www.lapecorabianca.com/", maps:"La+Pecora+Bianca+Bryant+Park", reviews:7020, price:"$$$", reservable:true, stars:4.8 },
        { id:"tonysdinapol", emoji:"🍝", place:"Tony's Di Napoli", type:"italian dinner", desc:"Bustling eatery serving large, shareable portions of Italian comfort food in a lively setting.", booking:"https://www.tonysnyc.com/", maps:"Tonys+Di+Napoli", reviews:8174, price:"$$", reservable:true, stars:4.6 },
        { id:"cisiamo", emoji:"🍝", place:"Ci Siamo", type:"italian dinner", desc:"Stylish restaurant offering high-end Mediterranean standards, plus wine and cocktails.", booking:"https://www.cisiamo.com/?utm_source=google&utm_medium=gmb", maps:"Ci+Siamo", reviews:2092, price:"$$$", reservable:true, stars:4.6 },
      ],
      pizza: [],
      mediterranean: [
        { id:"lebotaniste", emoji:"🌿", place:"Le Botaniste", type:"vegan", desc:"4.6★ · vegan", booking:"http://www.lebotaniste.us/", maps:"Le+Botaniste+NYC", reviews:468, price:"$", reservable:false, stars:4.6 },
        { id:"franchiavega", emoji:"🌿", place:"Franchia Vegan Café", type:"vegan", desc:"Creative, vegan Asian fusion dishes presented in a serene, tea-house-inspired setting.", booking:"http://www.franchia.com/", maps:"Franchia+Vegan+Caf+NYC", reviews:1918, price:"$$", reservable:true, stars:4.6 },
        { id:"plantanewyor", emoji:"🌿", place:"PLANTA New York", type:"vegan", desc:"4.5★ · vegan", booking:"https://www.plantarestaurants.com/location/planta-queen-new-york-city/", maps:"PLANTA+New+York+NYC", reviews:3062, price:"$$$", reservable:true, stars:4.5 },
        { id:"sinigual", emoji:"🌮", place:"Sinigual", type:"mexican", desc:"Large, bustling contemporary Mexican restaurant & bar with cocktails & popular happy-hour specials.", booking:"https://www.sinigualrestaurants.com/", maps:"Sinigual+NYC", reviews:3012, price:"$$", reservable:true, stars:4.4 },
        { id:"tnbychefrich", emoji:"🌮", place:"tán by Chef Richard Sandoval", type:"mexican", desc:"4.3★ · mexican", booking:"https://www.tannewyork.com/", maps:"tn+by+Chef+Richard+Sandoval+NYC", reviews:644, price:"$$", reservable:true, stars:4.3 },
      ],
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
      coffee: [
        { id:"lafabbricaca", emoji:"☕", place:"LA FABBRICA CAFE", type:"coffee", subtype:"coffee", desc:"5.0★ · coffee", booking:null, maps:"LA+FABBRICA+CAFE+NYC", reviews:80, price:"$$", reservable:false, stars:5.0 },
        { id:"meltingcups", emoji:"☕", place:"Melting Cups", type:"coffee", subtype:"coffee", desc:"4.8★ · coffee", booking:"https://meltingcups.com/", maps:"Melting+Cups+NYC", reviews:145, price:"$$", reservable:false, stars:4.8 },
        { id:"ginveematcha", emoji:"☕", place:"Ginvee Matcha", type:"coffee", subtype:"coffee", desc:"4.7★ · coffee", booking:null, maps:"Ginvee+Matcha+NYC", reviews:31, price:"$$", reservable:false, stars:4.7 },
        { id:"nostresscoff", emoji:"☕", place:"No Stress Coffee", type:"coffee", subtype:"coffee", desc:"4.7★ · coffee", booking:null, maps:"No+Stress+Coffee+NYC", reviews:477, price:"$$", reservable:false, stars:4.7 },
        { id:"mokaco", emoji:"☕", place:"Moka & Co", type:"coffee", subtype:"coffee", desc:"4.7★ · coffee", booking:"https://mokanco.com/astoria-queens-2/", maps:"Moka++Co+NYC", reviews:1542, price:"$$", reservable:false, stars:4.7 },
        { id:"littleflower", emoji:"☕", place:"Little Flower Cafe", type:"coffee", subtype:"coffee", desc:"4.6★ · coffee", booking:"https://www.instagram.com/littleflowercafe/", maps:"Little+Flower+Cafe+NYC", reviews:654, price:"$$", reservable:false, stars:4.6 },
        { id:"cafcoco", emoji:"☕", place:"Café Coco", type:"coffee", subtype:"coffee", desc:"4.6★ · coffee", booking:"https://www.cafe-coco.com/", maps:"Caf+Coco+NYC", reviews:107, price:"$$", reservable:false, stars:4.6 },
        { id:"steppingston", emoji:"☕", place:"Stepping Stone Café", type:"coffee", subtype:"coffee", desc:"4.6★ · coffee", booking:"https://www.steppingstone.cafe/", maps:"Stepping+Stone+Caf+NYC", reviews:62, price:"$$", reservable:false, stars:4.6 },
        { id:"conceptcoffe", emoji:"☕", place:"Concept Coffee", type:"coffee", subtype:"coffee", desc:"4.5★ · coffee", booking:"https://www.facebook.com/conceptcoffeenyc/", maps:"Concept+Coffee+NYC", reviews:304, price:"$$", reservable:false, stars:4.5 },
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
    activities: {
      free: [
        { id:"bryantpark", emoji:"🌳", place:"Bryant Park", type:"Park", desc:"Free movies in summer, ice skating in winter, chess tables year-round. NYC's best free park.", booking:null, maps:"Bryant+Park+Midtown+NYC", reviews:106285, price:"Free", reservable:false, stars:4.7 },

        { id:"thehighline", emoji:"🌿", place:"The High Line", type:"Elevated Park Walk", desc:"Walk the elevated railway garden from the Meatpacking District to Hudson Yards. Always stunning.", booking:null, maps:"The+High+Line+NYC", reviews:66937, price:"Free", reservable:false, stars:4.7 },

        { id:"rooseveltislandtram", emoji:"🚡", place:"Roosevelt Island Tramway", type:"Scenic Tram Ride", desc:"$2.90 each way on the MetroCard. Best views of Midtown Manhattan from the air.", booking:null, maps:"Roosevelt+Island+Tramway+NYC", reviews:8451, price:"Free", reservable:false, stars:4.7 },

        { id:"greenacrepark", emoji:"🌊", place:"Greenacre Park", type:"Waterfall Park", desc:"A hidden pocket park with a 25-foot waterfall on 51st St. Almost nobody knows it exists.", booking:null, maps:"Greenacre+Park+Midtown+NYC", reviews:1598, price:"Free", reservable:false, stars:4.8 },

        { id:"hudsonyardsplaza", emoji:"🏙️", place:"Hudson Yards Public Square", type:"Outdoor Plaza", desc:"The Vessel, The Shed, great skyline views. Completely free to walk and explore.", booking:null, maps:"Hudson+Yards+Public+Square+NYC", reviews:184, price:"Free", reservable:false, stars:4.8 },

        { place:"SUMMIT One Vanderbilt", type:"Bar", desc:"SUMMIT One Vanderbilt", booking:"https://summitov.com/", maps:"SUMMIT+One+Vanderbilt+Midtown+Manhattan", reviews:33385, price:"$$", reservable:false, stars:4.7 },

        { id:"swingersnomd", emoji:"⛳", place:"Swingers NoMad", type:"crazy golf + bar", desc:"Immersive crazy golf with cocktails. One of the best date activities in Midtown.", booking:"https://www.swingersusa.com/", maps:"Swingers+NoMad+Midtown+NYC", reviews:1257, price:"$$", reservable:true, stars:4.4 },

        ],
      outside: [],
      creative: [
        { id:"potterystudi", emoji:"🎨", place:"Pottery Studio 1 Midtown East", type:"creative", subtype:"pottery class", desc:"5.0★ · pottery class", booking:"https://pottery-brooklyn.com/", maps:"Pottery+Studio+1+Midtown+East+NYC", reviews:719, price:"$$", reservable:false, stars:5.0 },
        { id:"potterynyc", emoji:"🎨", place:"Pottery NYC", type:"creative", subtype:"pottery class", desc:"4.9★ · pottery class", booking:"http://www.potterynyc.net/", maps:"Pottery+NYC+NYC", reviews:52, price:"$$", reservable:false, stars:4.9 },
        { id:"themetropoli", emoji:"🎨", place:"The Metropolitan Museum of Art", type:"creative", subtype:"museum", desc:"A grand setting for one of the world's greatest collections of art, from ancient to contemporary.", booking:"https://www.metmuseum.org/", maps:"The+Metropolitan+Museum+of+Art+NYC", reviews:92647, price:"$$", reservable:false, stars:4.8 },
        { id:"thefrickcoll", emoji:"🎨", place:"The Frick Collection", type:"creative", subtype:"museum", desc:"4.6★ · museum", booking:"https://www.frick.org/", maps:"The+Frick+Collection+NYC", reviews:4630, price:"$$", reservable:false, stars:4.6 },
        { id:"themuseumofm", emoji:"🎨", place:"The Museum of Modern Art", type:"creative", subtype:"museum", desc:"Works from van Gogh to Warhol & beyond plus a sculpture garden, 2 cafes & The Modern restaurant.", booking:"https://www.moma.org/", maps:"The+Museum+of+Modern+Art+NYC", reviews:58996, price:"$$", reservable:false, stars:4.6 },
        { id:"museumofsex", emoji:"🎨", place:"Museum of Sex", type:"creative", subtype:"museum", desc:"Intimate museum chronicling the evolution of human sexuality in ever-changing exhibits.", booking:"https://www.museumofsex.com/?y_source=1_MTA4NDAxMzM2Ny03MTUtbG9jYXRpb24ud2Vic2l0ZQ%3D%3D", maps:"Museum+of+Sex+NYC", reviews:5982, price:"$$", reservable:false, stars:4.4 },
        ],
      competitive: [
        { id:"escapetheroo", emoji:"🎯", place:"Escape the Room NYC", type:"competitive", subtype:"escape room", desc:"4.9★ · escape room", booking:"https://escapetheroom.com/new-york/", maps:"Escape+the+Room+NYC+NYC", reviews:10931, price:"$$", reservable:false, stars:4.9 },
        { id:"igolfbyspace", emoji:"🎯", place:"iGolf By Space NYC | Trackman & Golf VX Simulators", type:"competitive", subtype:"golf simulator", desc:"4.9★ · golf simulator", booking:"https://igolf32.com/", maps:"iGolf+By+Space+NYC++Trackman++Golf+VX+Simulators+NYC", reviews:66, price:"$$", reservable:false, stars:4.9 },
        { id:"konnectgolf", emoji:"🎯", place:"Konnectgolf", type:"competitive", subtype:"golf simulator", desc:"4.9★ · golf simulator", booking:"https://konnectgolf.com/", maps:"Konnectgolf+NYC", reviews:138, price:"$$", reservable:false, stars:4.9 },
        { id:"liveaxe", emoji:"🎯", place:"Live Axe", type:"competitive", subtype:"axe throwing", desc:"Axe throwing sessions in a Viking-themed lounge, plus craft beers, cocktails & bar snacks.", booking:"https://liveaxe.com/", maps:"Live+Axe+NYC", reviews:3355, price:"$$", reservable:false, stars:4.8 },
        { id:"escaperoomny", emoji:"🎯", place:"Escape Room NYC - Mission Escape Games", type:"competitive", subtype:"escape room", desc:"4.8★ · escape room", booking:"https://missionescapegames.com/nyc/", maps:"Escape+Room+NYC++Mission+Escape+Games+NYC", reviews:1647, price:"$$", reservable:false, stars:4.8 },
        { id:"exitescapero", emoji:"🎯", place:"Exit Escape Room NYC", type:"competitive", subtype:"escape room", desc:"Themed escape games with 60-minute scenarios, including a runaway train & a gold bullion heist.", booking:"https://www.exitescaperoomnyc.com/", maps:"Exit+Escape+Room+NYC+NYC", reviews:1254, price:"$$", reservable:false, stars:4.8 },
        { id:"spacekaraoke", emoji:"🎯", place:"Space Karaoke Bar & Lounge | Koreatown NYC", type:"competitive", subtype:"karaoke", desc:"Snacks & cocktails in a sleek, colorfully lit bar with 10 private rooms for group karaoke.", booking:"https://spacekaraoke.com/", maps:"Space+Karaoke+Bar++Lounge++Koreatown+NYC+NYC", reviews:3220, price:"$$", reservable:false, stars:4.8 },
        { id:"karaokek", emoji:"🎯", place:"Karaoke K", type:"competitive", subtype:"karaoke", desc:"4.6★ · karaoke", booking:"https://karaokek.com/", maps:"Karaoke+K+NYC", reviews:453, price:"$$", reservable:false, stars:4.6 },
        { id:"wowkaraoke", emoji:"🎯", place:"WOW Karaoke", type:"competitive", subtype:"karaoke", desc:"4.6★ · karaoke", booking:"https://www.wownyny.com/reservations", maps:"WOW+Karaoke+NYC", reviews:549, price:"$$", reservable:false, stars:4.6 },
        { id:"mskimslounge", emoji:"🎯", place:"MS. KIM'S Lounge & Private Karaoke", type:"competitive", subtype:"karaoke", desc:"Korean & Japanese nibbles & fancy cocktails in a cool, brick-lined bar with karaoke rooms.", booking:"http://mskims.co/", maps:"MS+KIMS+Lounge++Private+Karaoke+NYC", reviews:218, price:"$$", reservable:false, stars:4.5 },
        ],
      shows: [],
      active: [
        { id:"throwbackfit", emoji:"💪", place:"Throwback Fitness", type:"active", subtype:"fitness class", desc:"Upbeat gym featuring unique fitness classes for adults based on classic playground games.", booking:"https://throwbackfit.com/", maps:"Throwback+Fitness+NYC", reviews:362, price:"$$", reservable:false, stars:5.0 },
        { id:"thestrengthc", emoji:"💪", place:"The Strength Club NYC", type:"active", subtype:"fitness class", desc:"5.0★ · fitness class", booking:"https://www.thestrengthclub.com/", maps:"The+Strength+Club+NYC+NYC", reviews:118, price:"$$", reservable:false, stars:5.0 },
        { id:"form50fitnes", emoji:"💪", place:"FORM50 Fitness Midtown East", type:"active", subtype:"fitness class", desc:"4.9★ · fitness class", booking:"https://form50fitness.com/?utm_campaign=gmbMidtown", maps:"FORM50+Fitness+Midtown+East+NYC", reviews:249, price:"$$", reservable:false, stars:4.9 },
        { id:"thetrainingl", emoji:"💪", place:"The Training Lab", type:"active", subtype:"fitness class", desc:"4.9★ · fitness class", booking:"https://traininglabnyc.com/", maps:"The+Training+Lab+NYC", reviews:122, price:"$$", reservable:false, stars:4.9 },
        { id:"tonehouse", emoji:"💪", place:"Tone House", type:"active", subtype:"fitness class", desc:"4.7★ · fitness class", booking:"http://www.tonehouse.com/", maps:"Tone+House+NYC", reviews:182, price:"$$", reservable:false, stars:4.7 },
        ],
      paid: [],
    },
    happyHour: [
          { place:"Jimmy's Corner", latenight:true, type:"Dive Bar", desc:"Under $4 drinks all day in the heart of Times Square. NYC's best kept secret.", deal:"$3.50 wells all day", hours:"Daily 11:30am–close", booking:null, maps:"Jimmys+Corner+Bar+Times+Square+NYC", reviews:2200, price:"$", reservable:false, stars:4.3 },
          { place:"Lodi at Rockefeller", type:"Italian Cafe", desc:"Aperitivo hour at Rock Center. Spritzes and Italian snacks.", deal:"$12 spritzes + $10 wine", hours:"Mon–Fri 4–6pm", booking:"lodirestaurant.com", maps:"Lodi+Restaurant+Rockefeller+Center+NYC", reviews:2400, price:"$$", reservable:true, stars:4.5 },
          { place:"Valerie", type:"Gin Library Bar", desc:"70+ gins and happy hour deals in a stunning Manhattan Golden Age room.", deal:"$12 cocktails + $8 beer", hours:"Mon–Fri 4–7pm", booking:"valerienewyork.com", maps:"Valerie+Bar+Midtown+NYC", reviews:2213, price:"$$", reservable:true, stars:4.4 },
          { place:"Tanner Smith's", type:"Prohibition Lounge", desc:"Pre-theater cocktail hour in the Theater District.", deal:"$12 cocktails + $6 beer", hours:"Mon–Fri 4–7pm", booking:"tannersmiths.com", maps:"Tanner+Smiths+Theater+District+NYC", reviews:1800, price:"$$", reservable:true, stars:4.4 },
          { place:"Albert's Bar", type:"Hidden Hotel Bar", desc:"Tucked inside the Marriott on 45th. Almost nobody knows it exists.", deal:"$9 beers + $11 cocktails", hours:"Mon–Fri 4–7pm", booking:null, maps:"Alberts+Bar+Midtown+NYC", reviews:493, price:"$$", reservable:false, stars:4.5 },
          { place:"The Rum House", latenight:true, type:"Jazz Saloon", desc:"Nightly live jazz in a dark Edison Hotel saloon. Pre-theater gem.", deal:"$10 cocktails + $6 beer", hours:"Daily 4–7pm", booking:null, maps:"The+Rum+House+Edison+Hotel+NYC", reviews:620, price:"$$", reservable:false, stars:4.3 },
        ],
  },
  lic: {
    bars: {
      cocktails: [
          
          { place:"Drinkology NYC", type:"Bar", desc:"Drinkology NYC", booking:"https://www.drinkologynyc.com/", maps:"Drinkology+NYC+Long+Island+City+Queens", reviews:429, price:"$$", reservable:true, stars:4.8 },
          { place:"The Beast Next Door", type:"Bar", desc:"The Beast Next Door", booking:"http://thebeastnextdoor.com/", maps:"The+Beast+Next+Door+Long+Island+City+Queens", reviews:787, price:"$$", reservable:true, stars:4.6 },
          { place:"The Infamous", type:"Bar", desc:"The Infamous", booking:"https://infamousbar.com/", maps:"The+Infamous+Long+Island+City+Queens", reviews:279, price:"$$", reservable:true, stars:4.7 },
          { place:"The Newsroom", type:"Bar", desc:"The Newsroom", booking:"https://newsroomny.com/", maps:"The+Newsroom+Long+Island+City+Queens", reviews:1312, price:"$$", reservable:true, stars:4.9 },
          { place:"The Last Word", type:"Bar", desc:"The Last Word", booking:"http://tlwcocktailbar.com/", maps:"The+Last+Word+Long+Island+City+Queens", reviews:684, price:"$$$", reservable:true, stars:4.7 },
          { place:"Dutch Kills", latenight:true, type:"Bar", desc:"Dutch Kills", booking:"https://www.dutchkillsbar.com/", maps:"Dutch+Kills+Long+Island+City+Queens", reviews:1299, price:"$$", reservable:false, stars:4.4 },
          { place:"Blend on the Water", type:"Bar", desc:"Blend on the Water", booking:"http://www.blendonthewater.com/", maps:"Blend+on+the+Water+Long+Island+City+Queens", reviews:5904, price:"$$", reservable:true, stars:4.2 },
          { place:"Café Henri", type:"Bar", desc:"Café Henri", booking:"https://cafehenrilic.com/", maps:"Café+Henri+Long+Island+City+Queens", reviews:1114, price:"$$", reservable:true, stars:4.4 },
          { place:"Casa Enrique", type:"Bar", desc:"Casa Enrique", booking:"https://casaenriquelic.com/", maps:"Casa+Enrique+Long+Island+City+Queens", reviews:3017, price:"$$", reservable:true, stars:4.5 },
        
        { id:"easternnight", emoji:"🍸", place:"Eastern Nights", type:"late night bar", desc:"Open until 5:00am.", booking:"https://easternnightshooka.wixsite.com/sahars", maps:"Eastern+Nights+NYC", reviews:305, price:"$$", reservable:false, stars:4.8, latenight:true },
        { id:"lostinparadi", emoji:"🍸", place:"Lost in Paradise Rooftop", type:"late night bar", desc:"Open until 4:00am.", booking:"https://www.lostinparadiserooftop.com/", maps:"Lost+in+Paradise+Rooftop+NYC", reviews:6621, price:"$$", reservable:false, stars:4.7, latenight:true },
        { id:"dominieshoek", emoji:"🍸", place:"Dominie's Hoek", type:"late night bar", desc:"Neighborhood barroom offering sandwiches, small plates & weekend brunch plus a back garden. Open until 4:00am.", booking:"https://www.facebook.com/pages/Dominies-Hoek/146214362065532", maps:"Dominies+Hoek+NYC", reviews:348, price:"$", reservable:false, stars:4.4, latenight:true },
        { id:"dutchkills", emoji:"🍸", place:"Dutch Kills", type:"late night bar", desc:"Classic & newly invented craft cocktails served with hand-cut ice in a dark, throwback-style space. Open until 2:00am.", booking:"https://www.dutchkillsbar.com/", maps:"Dutch+Kills+NYC", reviews:1302, price:"$$", reservable:false, stars:4.4, latenight:true },
        { id:"divebarlic", emoji:"🍸", place:"Dive Bar LIC", type:"late night bar", desc:"Laid-back hangout whipping up finger foods, burgers & pizza, plus cocktails & happy-hour specials. Open until 2:00am.", booking:"http://www.divebarlic.com/", maps:"Dive+Bar+LIC+NYC", reviews:473, price:"$$", reservable:false, stars:4.3, latenight:true },
        { id:"gantrybar", emoji:"🍸", place:"Gantry Bar", type:"late night bar", desc:"Hip bar & eatery offering small plates, sandwiches & brunch, plus craft beers & cocktails. Open until 2:00am.", booking:null, maps:"Gantry+Bar+NYC", reviews:289, price:"$$", reservable:false, stars:4.3, latenight:true },
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
      
        { id:"zenastoria", emoji:"🥢", place:"Zen Astoria", type:"chinese", desc:"4.6★ · chinese", booking:"https://glockenspiel-begonia-beep.squarespace.com/config/pages", maps:"Zen+Astoria+NYC", reviews:558, price:"$$", reservable:true, stars:4.6 },
        { id:"shi", emoji:"🥢", place:"SHI", type:"chinese", desc:"Upscale Pan-Asian eatery in a high-rise restaurant with Manhattan skyline views and modern look.", booking:"http://shilic.com/", maps:"SHI+NYC", reviews:1478, price:"$$", reservable:true, stars:4.3 },
      
        { id:"primeno7", emoji:"🥩", place:"Prime No 7", type:"korean", desc:"4.9★ · korean", booking:"https://primeno7nyc.com/", maps:"Prime+No+7+NYC", reviews:1777, price:"$$", reservable:true, stars:4.9 },
        { id:"bonchonlongi", emoji:"🥩", place:"Bonchon Long Island City - Jackson Ave", type:"korean", desc:"Casual chain serving cooked-to-order Korean fried chicken, plus other traditional eats.", booking:"https://restaurants.bonchon.com/locations/ny/long-island-city/2501-jackson-ave-one-court-square", maps:"Bonchon+Long+Island+City++Jackson+Ave+NYC", reviews:325, price:"$$", reservable:false, stars:4.7 },
        { id:"naro", emoji:"🥩", place:"NARO", type:"korean", desc:"4.5★ · korean", booking:"https://www.naronyc.com/", maps:"NARO+NYC", reviews:613, price:"$$", reservable:true, stars:4.5 },
        { id:"kukukoreancu", emoji:"🥩", place:"Kuku Korean Cuisine LIC", type:"korean", desc:"Fried chicken tenders, wings & burgers, plus Korean classics served in a stylish setting.", booking:"https://eatkuku.com/", maps:"Kuku+Korean+Cuisine+LIC+NYC", reviews:339, price:"$$", reservable:true, stars:4.5 },
        { id:"littlebancha", emoji:"🥩", place:"Little Banchan Shop", type:"korean", desc:"4.5★ · korean", booking:"http://littlebanchanshop.com/", maps:"Little+Banchan+Shop+NYC", reviews:173, price:"$$", reservable:false, stars:4.5 },
        { id:"moono", emoji:"🥩", place:"Moono", type:"korean", desc:"4.4★ · korean", booking:"http://www.moononyc.com/", maps:"Moono+NYC", reviews:481, price:"$$", reservable:true, stars:4.4 },
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
      mediterranean: [
        { id:"blendlic", emoji:"🌮", place:"Blend LIC", type:"mexican", desc:"Casual cafe & lounge serving dishes from various Latin cuisines along with cocktails.", booking:"https://www.blendlic.com/", maps:"Blend+LIC+NYC", reviews:1844, price:"$$", reservable:true, stars:4.5 },
        { id:"jora", emoji:"🌮", place:"Jora", type:"mexican", desc:"Eatery and cocktail spot with elegant decor specializing in Peruvian dishes and pisco cocktails.", booking:"http://www.jorany.com/", maps:"Jora+NYC", reviews:2083, price:"$$", reservable:true, stars:4.5 },
      ],
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
      coffee: [
        { id:"maikomatchac", emoji:"☕", place:"Maiko Matcha Cafe", type:"coffee", subtype:"coffee", desc:"4.8★ · coffee", booking:"https://www.instagram.com/maikomatchanyc?igsh=MXJlZGpjM2d5OGluMQ==&utm_source=qr", maps:"Maiko+Matcha+Cafe+NYC", reviews:363, price:"$$", reservable:false, stars:4.8 },
        { id:"theivorypeac", emoji:"☕", place:"The Ivory Peacock", type:"coffee", subtype:"coffee", desc:"4.7★ · coffee", booking:"http://www.theivorypeacock.com/", maps:"The+Ivory+Peacock+NYC", reviews:1477, price:"$$", reservable:false, stars:4.7 },
        { id:"chachamatcha", emoji:"☕", place:"Cha Cha Matcha (MADISON)", type:"coffee", subtype:"coffee", desc:"4.6★ · coffee", booking:"https://chachamatcha.com/", maps:"Cha+Cha+Matcha+MADISON+NYC", reviews:357, price:"$$", reservable:false, stars:4.6 },
        { id:"matchafulcle", emoji:"☕", place:"Matchaful @ Clean Market", type:"coffee", subtype:"coffee", desc:"4.6★ · coffee", booking:"http://bematchaful.com/", maps:"Matchaful++Clean+Market+NYC", reviews:232, price:"$$", reservable:false, stars:4.6 },
        { id:"refineryroof", emoji:"☕", place:"Refinery Rooftop", type:"coffee", subtype:"coffee", desc:"Industrial-chic rooftop spot in the Refinery Hotel featuring cocktails, light fare, and dramatic views.", booking:"https://refineryrooftop.com/", maps:"Refinery+Rooftop+NYC", reviews:4274, price:"$$$", reservable:false, stars:4.5 },
        { id:"chachamatcha", emoji:"☕", place:"Cha Cha Matcha (NoMad)", type:"coffee", subtype:"coffee", desc:"Matcha drinks & frozen yogurt turned out in a hip, pink-&-green accented cafe with tropical flair.", booking:"http://chachamatcha.com/", maps:"Cha+Cha+Matcha+NoMad+NYC", reviews:1260, price:"$$", reservable:false, stars:4.4 },
        { id:"ladyblue", emoji:"☕", place:"Lady Blue", type:"coffee", subtype:"coffee", desc:"4.4★ · coffee", booking:"https://www.ladybluenyc.com/", maps:"Lady+Blue+NYC", reviews:268, price:"$$", reservable:false, stars:4.4 },
        { id:"lilliesvicto", emoji:"☕", place:"Lillie's Victorian Establishment", type:"coffee", subtype:"coffee", desc:"Easygoing spot offering classic pub grub & a full bar in a whimsical setting with Victorian details.", booking:"http://www.lilliesnyc.com/", maps:"Lillies+Victorian+Establishment+NYC", reviews:3680, price:"$$", reservable:false, stars:4.3 },
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
      
        { id:"essenceresta", emoji:"🌙", place:"Essence Restaurant", type:"late night food", desc:"Open until 2:00am.", booking:"http://www.essencelic.com/", maps:"Essence+Restaurant+NYC", reviews:144, price:"$$", reservable:false, stars:4.8, latenight:true },
      ],
    },
    activities: {
      free: [],
      outside: [],
      creative: [
        { id:"culturelabli", emoji:"🎨", place:"Culture Lab LIC", type:"creative", subtype:"museum", desc:"4.7★ · museum", booking:"https://www.culturelablic.org/", maps:"Culture+Lab+LIC+NYC", reviews:474, price:"$$", reservable:false, stars:4.7 },
        { id:"sculpturespa", emoji:"🎨", place:"Sculpture Space NYC", type:"creative", subtype:"art class", desc:"4.7★ · art class", booking:"http://www.sculpturespacenyc.com/", maps:"Sculpture+Space+NYC+NYC", reviews:32, price:"$$", reservable:false, stars:4.7 },
        { id:"museumofthem", emoji:"🎨", place:"Museum of the Moving Image", type:"creative", subtype:"museum", desc:"The history of film, television & digital media told via interactive displays, plus screenings.", booking:"https://movingimage.org/", maps:"Museum+of+the+Moving+Image+NYC", reviews:4268, price:"$$", reservable:false, stars:4.6 },
        { id:"brickhousece", emoji:"🎨", place:"BrickHouse Ceramic Art Center", type:"creative", subtype:"art class", desc:"4.6★ · art class", booking:"http://brickhouseny.com/", maps:"BrickHouse+Ceramic+Art+Center+NYC", reviews:31, price:"$$", reservable:false, stars:4.6 },
        { id:"momaps1", emoji:"🎨", place:"MoMA PS1", type:"creative", subtype:"museum", desc:"Museum of Modern Art-run venue for experimental & contemporary art & events, set in an old school.", booking:"https://www.momaps1.org/", maps:"MoMA+PS1+NYC", reviews:3259, price:"$$", reservable:false, stars:4.4 },
        ],
      competitive: [
        { id:"thegreatesca", emoji:"🎯", place:"The Great Escape Room Queens", type:"competitive", subtype:"escape room", desc:"5.0★ · escape room", booking:"https://thegreatescaperoom.com/queens", maps:"The+Great+Escape+Room+Queens+NYC", reviews:2741, price:"$$", reservable:false, stars:5.0 },
        { id:"gamingcity", emoji:"🎯", place:"Gaming City", type:"competitive", subtype:"escape room", desc:"4.9★ · escape room", booking:"https://www.gamingcityusa.com/", maps:"Gaming+City+NYC", reviews:2770, price:"$$", reservable:false, stars:4.9 },
        { id:"themulligans", emoji:"🎯", place:"The Mulligans Golf Club", type:"competitive", subtype:"golf simulator", desc:"4.9★ · golf simulator", booking:"https://www.themulligansgolfclub.com/", maps:"The+Mulligans+Golf+Club+NYC", reviews:168, price:"$$", reservable:false, stars:4.9 },
        { id:"thegutterbar", emoji:"🎯", place:"The Gutter Bar LIC", type:"competitive", subtype:"bowling", desc:"Old-school bowling alley with an attached barroom that offers craft beer & hot dogs.", booking:"https://www.thegutterlic.com/", maps:"The+Gutter+Bar+LIC+NYC", reviews:678, price:"$$", reservable:false, stars:4.3 },
        ],
      shows: [],
      active: [
        { id:"thetrinityny", emoji:"💪", place:"The Trinity NYC", type:"active", subtype:"fitness class", desc:"5.0★ · fitness class", booking:"https://www.thetrinitynyc.com/", maps:"The+Trinity+NYC+NYC", reviews:173, price:"$$", reservable:false, stars:5.0 },
        { id:"fitnessloung", emoji:"💪", place:"Fitness Lounge", type:"active", subtype:"fitness class", desc:"4.9★ · fitness class", booking:"https://www.fitnessloungenyc.com/", maps:"Fitness+Lounge+NYC", reviews:60, price:"$$", reservable:false, stars:4.9 },
        { id:"barre3", emoji:"💪", place:"barre3", type:"active", subtype:"fitness class", desc:"4.9★ · fitness class", booking:"https://online.barre3.com/studio-locations/lic", maps:"barre3+NYC", reviews:553, price:"$$", reservable:false, stars:4.9 },
        { id:"f45trainingl", emoji:"💪", place:"F45 Training Long Island City", type:"active", subtype:"fitness class", desc:"4.8★ · fitness class", booking:"https://f45training.com/studio/longislandcity/", maps:"F45+Training+Long+Island+City+NYC", reviews:44, price:"$$", reservable:false, stars:4.8 },
        ],
      paid: [],
    },
    happyHour: [
          { place:"Dutch Kills", type:"Cocktail Bar", desc:"Best value craft cocktails in all of Queens. Early hour specials.", deal:"$12 cocktails", hours:"Tue–Fri 5–7pm", booking:null, maps:"Dutch+Kills+Bar+Long+Island+City+Queens", reviews:1299, price:"$$", reservable:false, stars:4.4 , latenight:true},
          { place:"American Brass", type:"Waterfront Bar", desc:"Oysters and discounted drinks with the Manhattan skyline as your backdrop.", deal:"$1.50 oysters + $8 wine", hours:"Mon–Fri 5–6:30pm", booking:"americanbrass.com", maps:"American+Brass+Long+Island+City+Queens", reviews:2200, price:"$$", reservable:true, stars:4.3 },
          { place:"LIC Bar", type:"Neighborhood Bar", desc:"Cheap beers in the backyard garden. Most relaxed happy hour in LIC.", deal:"$5 beers + $6 wells", hours:"Daily 4–7pm", booking:null, maps:"LIC+Bar+Long+Island+City+Queens", reviews:1400, price:"$", reservable:false, stars:4.2 },
          { place:"The Beast Next Door", type:"Wine + Cocktail Bar", desc:"Charcuterie and discounted drinks on Vernon Blvd.", deal:"$8 wines + $10 cocktails", hours:"Mon–Fri 4–7pm", booking:null, maps:"The+Beast+Next+Door+Long+Island+City+Queens", reviews:787, price:"$$", reservable:true, stars:4.6 },
        ],
  },

  bushwick: {
    bars: {
      cocktails: [
        { id:"witchinghour", emoji:"🍸", place:"Witching Hour", type:"cocktails", desc:"4.8★ · cocktails", booking:"https://witchinghourbk.com/", maps:"Witching+Hour+NYC", reviews:202, price:"$$", reservable:false, stars:4.8 },
        { id:"orionbar", emoji:"🍸", place:"Orion Bar", type:"cocktails", desc:"4.8★ · cocktails", booking:"https://www.orion-bar.com/", maps:"Orion+Bar+NYC", reviews:86, price:"$$", reservable:false, stars:4.8 },
        { id:"jukebar", emoji:"🍸", place:"Juke Bar", type:"bar", desc:"4.8★ · bar", booking:"http://bk.jukebarnyc.com/", maps:"Juke+Bar+NYC", reviews:80, price:"$$", reservable:true, stars:4.8 },
        { id:"yourssincere", emoji:"🍸", place:"Yours Sincerely", type:"cocktails", desc:"Handsome hangout with a marble bar for on-tap cocktails, beers & wines.", booking:"http://www.yourssincerely.co/", maps:"Yours+Sincerely+NYC", reviews:347, price:"$$", reservable:false, stars:4.7 },
        { id:"sleepwalk", emoji:"🍸", place:"Sleepwalk", type:"cocktails", desc:"4.7★ · cocktails", booking:"http://www.sleepwalk.nyc/", maps:"Sleepwalk+NYC", reviews:205, price:"$$", reservable:true, stars:4.7 },
        { id:"cherryontop", emoji:"🍸", place:"Cherry on Top", type:"cocktails", desc:"4.6★ · cocktails", booking:"http://cherryontopnyc.com/", maps:"Cherry+on+Top+NYC", reviews:128, price:"$$", reservable:true, stars:4.6 },
        { id:"lefthandpath", emoji:"🍸", place:"Left Hand Path", type:"late night bar", desc:"Laid-back bar with a sizable outdoor area, draft beers & quirky touches like personal USB ports.", booking:"http://www.bushwick.bar/", maps:"Left+Hand+Path+NYC", reviews:349, price:"$$", reservable:false, stars:4.6 },
        { id:"dangerdanger", emoji:"🍸", place:"Danger Danger", type:"late night bar", desc:"4.5★ · late night bar", booking:"http://dangerdangerbar.com/", maps:"Danger+Danger+NYC", reviews:93, price:"$$", reservable:false, stars:4.5 },
        { id:"thetenbellsb", emoji:"🍸", place:"The Ten Bells Brooklyn", type:"bar", desc:"Tapas, natural wine & cocktails offered in an old-school pub setup with a happening vibe.", booking:"https://www.tenbellsbk.com/", maps:"The+Ten+Bells+Brooklyn+NYC", reviews:336, price:"$$", reservable:true, stars:4.4 },
        { id:"birdys", emoji:"🍸", place:"Birdy's", type:"late night bar", desc:"Funky, compact dive bar with a throwback punk-rock vibe, pinball machines & a photo booth.", booking:"https://m.facebook.com/birdysbushwick/", maps:"Birdys+NYC", reviews:522, price:"$", reservable:false, stars:4.4 },
      ],
      beer: [],
      wine: [
        { id:"korkscrewbis", emoji:"🍷", place:"Korkscrew Bistro", type:"wine bar", desc:"4.9★ · wine bar", booking:"https://korkscrewbistro.com/", maps:"Korkscrew+Bistro+NYC", reviews:309, price:"$$", reservable:true, stars:4.9 },
        { id:"marcelas", emoji:"🍷", place:"Marcela's", type:"wine bar", desc:"4.7★ · wine bar", booking:"http://marcelasnyc.com/", maps:"Marcelas+NYC", reviews:255, price:"$$", reservable:true, stars:4.7 },
        { id:"tabarbushwic", emoji:"🍷", place:"Tabaré Bushwick", type:"wine bar", desc:"4.7★ · wine bar", booking:"https://www.tabarenyc.com/", maps:"Tabar+Bushwick+NYC", reviews:542, price:"$$", reservable:true, stars:4.7 },
        { id:"palmetto", emoji:"🍷", place:"Palmetto", type:"wine bar", desc:"4.5★ · wine bar", booking:"http://www.palmettobushwick.com/", maps:"Palmetto+NYC", reviews:295, price:"$$", reservable:false, stars:4.5 },
      ],
      experimental: [],
      speakeasy: [],
    },
    food: {
      japanese: [],
      pasta: [
        { id:"carmentas", emoji:"🍝", place:"Carmenta’s", type:"italian dinner", desc:"4.7★ · italian dinner", booking:"http://www.carmentasnyc.com/", maps:"Carmentas+NYC", reviews:530, price:"$$", reservable:false, stars:4.7 },
        { id:"concretesici", emoji:"🍝", place:"Concrete Sicilian Eatery", type:"italian dinner", desc:"4.7★ · italian dinner", booking:"http://concrete-brooklyn.com/", maps:"Concrete+Sicilian+Eatery+NYC", reviews:585, price:"$$$", reservable:true, stars:4.7 },
        { id:"santapanza", emoji:"🍝", place:"Santa Panza", type:"italian dinner", desc:"Cozy trattoria featuring gourmet pizzas, pastas & Italian mains, plus outdoor seats.", booking:"https://www.santapanza.com/", maps:"Santa+Panza+NYC", reviews:781, price:"$$", reservable:true, stars:4.6 },
        { id:"ops", emoji:"🍝", place:"Ops", type:"italian dinner", desc:"Comfy pizzeria serving wood-fired pies with a sourdough crust, plus natural wines & cocktails.", booking:"http://www.opsbk.com/", maps:"Ops+NYC", reviews:864, price:"$$", reservable:true, stars:4.6 },
      ],
      pizza: [],
      mediterranean: [
        { id:"aniximediter", emoji:"🥙", place:"Anixi Mediterranean Vegan Restaurant", type:"vegan", desc:"4.5★ · vegan", booking:"https://www.anixinyc.com/", maps:"Anixi+Mediterranean+Vegan+Restaurant+NYC", reviews:1158, price:"$$", reservable:true, stars:4.5 },
        { id:"bunnacafe", emoji:"🥙", place:"Bunna Cafe", type:"vegan", desc:"Bustling outpost provides Ethiopian vegan fare, cocktails & regular events in a low-lit dining room.", booking:"https://bunnaethiopia.net/", maps:"Bunna+Cafe+NYC", reviews:1952, price:"$$", reservable:true, stars:4.7 },
        { id:"amaranto", emoji:"🥙", place:"Amaranto", type:"mexican", desc:"Relaxed, family-run joint offering a creative spin on Mexican classics, plus sangria & cocktails.", booking:"http://www.amarantobklyn.com/", maps:"Amaranto+NYC", reviews:640, price:"$$", reservable:true, stars:4.6 },
      ],
      american: [
        { id:"fridasbushwi", emoji:"🥩", place:"FRIDA’S BUSHWICK", type:"american dinner", desc:"4.9★ · american dinner", booking:null, maps:"FRIDAS+BUSHWICK+NYC", reviews:78, price:"$$", reservable:false, stars:4.9 },
        { id:"otis", emoji:"🥩", place:"Otis", type:"american dinner", desc:"Eatery in a former tailor shop serving an eclectic menu paired with cocktails, wine & local brews.", booking:"http://www.otisbk.com/", maps:"Otis+NYC", reviews:1059, price:"$$", reservable:true, stars:4.8 },
        { id:"toranyc", emoji:"🥩", place:"TORA NYC", type:"american dinner", desc:"4.8★ · american dinner", booking:"https://www.instagram.com/tora_nyc?igsh=ZmtqYnNxYXBsM2Ew&utm_source=qr", maps:"TORA+NYC+NYC", reviews:259, price:"$$", reservable:true, stars:4.8 },
      ],
      brunch: [
        { id:"tlacuallibre", emoji:"🥐", place:"Tlacualli Breakfast", type:"brunch", desc:"4.9★ · brunch", booking:"https://tlacuallibrooklyn.com/", maps:"Tlacualli+Breakfast+NYC", reviews:192, price:"$$", reservable:false, stars:4.9 },
        { id:"herebk", emoji:"🥐", place:"Here Bk", type:"brunch", desc:"4.8★ · brunch", booking:"https://herebk.com/", maps:"Here+Bk+NYC", reviews:163, price:"$$", reservable:false, stars:4.8 },
        { id:"lacantine", emoji:"🥐", place:"La Cantine", type:"brunch", desc:"This fashionable, French-inspired lunch spot morphs into a wine bar with small plates at night.", booking:"https://lacantinebushwick.com/", maps:"La+Cantine+NYC", reviews:427, price:"$$", reservable:true, stars:4.6 },
        { id:"cafeteriabkl", emoji:"🥐", place:"Cafeteria Bklyn", type:"brunch", desc:"4.5★ · brunch", booking:"https://lacafeteriabk.com/", maps:"Cafeteria+Bklyn+NYC", reviews:237, price:"$", reservable:false, stars:4.5 },
      ],
      coffee: [
        { id:"787coffee", emoji:"☕", place:"787 Coffee", type:"coffee", subtype:"coffee", desc:"4.9★ · coffee", booking:"http://www.787coffee.com/", maps:"787+Coffee+NYC", reviews:2389, price:"$$", reservable:false, stars:4.9 },
        { id:"greenlanecof", emoji:"☕", place:"Green Lane Coffee", type:"coffee", subtype:"coffee", desc:"4.7★ · coffee", booking:"https://www.greenlane.coffee/", maps:"Green+Lane+Coffee+NYC", reviews:163, price:"$$", reservable:false, stars:4.7 },
        { id:"dearcoffee", emoji:"☕", place:"Dear Coffee", type:"coffee", subtype:"coffee", desc:"4.7★ · coffee", booking:"https://www.dearcoffeenyc.com/", maps:"Dear+Coffee+NYC", reviews:303, price:"$$", reservable:false, stars:4.7 },
        { id:"madamebontca", emoji:"☕", place:"Madame Bonté Café", type:"coffee", subtype:"coffee", desc:"4.4★ · coffee", booking:"http://www.madamebonte.com/", maps:"Madame+Bont+Caf+NYC", reviews:349, price:"$$", reservable:false, stars:4.4 },
      ],
      latenight: [],
    },
    activities: {
      free: [],
      outside: [],
      creative: [
        { id:"bushwickgall", emoji:"🎨", place:"Bushwick Gallery", type:"creative", subtype:"museum", desc:"5.0★ · museum", booking:"https://bushwickgallery.com/", maps:"Bushwick+Gallery+NYC", reviews:41, price:"$$", reservable:false, stars:5.0 },
        { id:"thegeckogall", emoji:"🎨", place:"The Gecko Gallery NYC", type:"creative", subtype:"museum", desc:"5.0★ · museum", booking:"https://www.thegeckogallerynyc.com/", maps:"The+Gecko+Gallery+NYC+NYC", reviews:137, price:"$$", reservable:false, stars:5.0 },
        { id:"dirtbagartha", emoji:"🎨", place:"Dirtbag ArtHaus - Ceramics & Painting in Bushwick", type:"creative", subtype:"art class", desc:"5.0★ · art class", booking:"http://dirtbagarthaus.com/", maps:"Dirtbag+ArtHaus++Ceramics++Painting+in+Bushwick+NYC", reviews:45, price:"$$", reservable:false, stars:5.0 },
        { id:"barro", emoji:"🎨", place:"Barro", type:"creative", subtype:"art class", desc:"4.8★ · art class", booking:"http://barrobk.com/", maps:"Barro+NYC", reviews:142, price:"$$", reservable:false, stars:4.8 },
        { id:"thebushwickc", emoji:"🎨", place:"The Bushwick Collective", type:"creative", subtype:"museum", desc:"4.7★ · museum", booking:null, maps:"The+Bushwick+Collective+NYC", reviews:238, price:"$$", reservable:false, stars:4.7 },
        { id:"thelivinggal", emoji:"🎨", place:"The Living Gallery", type:"creative", subtype:"museum", desc:"Modern space dedicated to the arts with rotating exhibits, live music & classes for kids & adults.", booking:"http://www.the-living-gallery.com/", maps:"The+Living+Gallery+NYC", reviews:150, price:"$$", reservable:false, stars:4.5 },
        ],
      competitive: [
        { id:"gothamarcher", emoji:"🎯", place:"Gotham Archery - Brooklyn", type:"competitive", subtype:"axe throwing", desc:"4.9★ · axe throwing", booking:"http://www.got-archery.com/", maps:"Gotham+Archery++Brooklyn+NYC", reviews:706, price:"$$", reservable:false, stars:4.9 },
        ],
      shows: [],
      active: [],
      paid: [],
    },
    happyHour: [
        { id:"thethreediam", emoji:"🎉", place:"The Three Diamond Door", type:"happy hour", desc:"Unpretentious, cozy bar with leather booths offering beers on draft, cocktails & shot specials.", booking:null, maps:"The+Three+Diamond+Door+NYC", reviews:630, price:"$", reservable:false, stars:4.4, deal:"Happy Hour specials", hours:"Check venue for hours" },
        { id:"thenarrows", emoji:"🎉", place:"The Narrows", type:"happy hour", desc:"Art deco cocktail bar with muted lighting, craft beer & a late-night menu of upscale eats.", booking:null, maps:"The+Narrows+NYC", reviews:333, price:"$$", reservable:false, stars:4.4, deal:"Happy Hour specials", hours:"Check venue for hours" },
        ],
  },
  fidi: {
    bars: {
      cocktails: [
        { id:"quicketernit", emoji:"🍸", place:"Quick Eternity", type:"cocktails", desc:"4.9★ · cocktails", booking:"https://www.quicketernity.nyc/", maps:"Quick+Eternity+NYC", reviews:79, price:"$$", reservable:true, stars:4.9 },
        { id:"londonmartin", emoji:"🍸", place:"London & Martin Co.", type:"cocktails", desc:"4.8★ · cocktails", booking:"http://www.londonmartinco.com/", maps:"London++Martin+Co+NYC", reviews:1199, price:"$$", reservable:true, stars:4.8 },
        { id:"thedeadrabbi", emoji:"🍸", place:"The Dead Rabbit", type:"cocktails", desc:"This 2-story spot combines a lunch taproom with a parlor serving small plates & vintage cocktails.", booking:"https://thedeadrabbit.com/?utm_source=google_business_profile&utm_medium=gbp_view_website&utm_campaign=google_business_profile", maps:"The+Dead+Rabbit+NYC", reviews:8313, price:"$$", reservable:true, stars:4.7 },
        { id:"thebedfordst", emoji:"🍸", place:"The Bedford Stone Street", type:"cocktails", desc:"4.6★ · cocktails", booking:"https://thebedford.nyc/?utm_source=google_business_profile&utm_medium=gbp_view_website", maps:"The+Bedford+Stone+Street+NYC", reviews:73, price:"$$", reservable:true, stars:4.6 },
        { id:"recreation", emoji:"🍸", place:"Recreation", type:"late night bar", desc:"This hip bar with cocktails on tap, light fare, games & a vintage vibe is a co-working space by day.", booking:"https://www.recreationbar.com/", maps:"Recreation+NYC", reviews:338, price:"$$", reservable:true, stars:4.4 },
      ],
      beer: [],
      wine: [
        { id:"warrenpeace", emoji:"🍷", place:"WarrenPeace", type:"wine bar", desc:"4.8★ · wine bar", booking:"https://warrenpeaceny.com/", maps:"WarrenPeace+NYC", reviews:540, price:"$$", reservable:true, stars:4.8 },
        { id:"chambers", emoji:"🍷", place:"Chambers", type:"wine bar", desc:"4.7★ · wine bar", booking:"http://chambers.nyc/", maps:"Chambers+NYC", reviews:354, price:"$$", reservable:true, stars:4.7 },
        { id:"ziziwinebar", emoji:"🍷", place:"Zizi Wine Bar", type:"wine bar", desc:"4.6★ · wine bar", booking:"https://ziziwinebarnyc.com/", maps:"Zizi+Wine+Bar+NYC", reviews:95, price:"$$", reservable:true, stars:4.6 },
        { id:"overstory", emoji:"🍷", place:"Overstory", type:"wine bar", desc:"Creative cocktails, wine & snacks in a retro-chic bar with a 64th-floor deck for panoramic views.", booking:"https://www.overstory-nyc.com/", maps:"Overstory+NYC", reviews:722, price:"$$", reservable:true, stars:4.3 },
      ],
      experimental: [
        { id:"hiderooftop", emoji:"🌆", place:"Hide Rooftop", type:"cocktails", desc:"4.7★ · cocktails", booking:"https://www.hiderooftop.com/", maps:"Hide+Rooftop+NYC", reviews:223, price:"$$", reservable:true, stars:4.7 },
        { id:"highwaterroo", emoji:"🌆", place:"Highwater Rooftop", type:"rooftop", desc:"4.4★ · rooftop", booking:"https://www.highwaterrooftop.com/", maps:"Highwater+Rooftop+NYC", reviews:310, price:"$$", reservable:true, stars:4.4 },
        { id:"one40rooftop", emoji:"🌆", place:"One40 Rooftop Restaurant & Bar", type:"rooftop", desc:"4.3★ · rooftop", booking:"https://www.one40rooftop.com/", maps:"One40+Rooftop+Restaurant++Bar+NYC", reviews:288, price:"$$", reservable:true, stars:4.3 },
      ],
      speakeasy: [
        { id:"thelittlesho", emoji:"🕯️", place:"The Little Shop", type:"speakeasy", desc:"Intimate, narrow eatery serving breakfast by day, plus spirits & innovative cocktails by night.", booking:"http://thelittleshopny.com/", maps:"The+Little+Shop+NYC", reviews:273, price:"$$", reservable:true, stars:4.6 },
        { id:"cedarlocal", emoji:"🕯️", place:"Cedar Local", type:"speakeasy", desc:"Warmly lit bar with creative cocktails plus craft beer, happy hour & bar bites.", booking:"https://www.cedarlocal.com/", maps:"Cedar+Local+NYC", reviews:387, price:"$$$", reservable:true, stars:4.5 },
      ],
    },
    food: {
      japanese: [
        { id:"mikadosushi", emoji:"🥢", place:"Mikado Sushi", type:"japanese", desc:"4.7★ · japanese", booking:"http://www.newmikadonyc.com/", maps:"Mikado+Sushi+NYC", reviews:1018, price:"$$", reservable:true, stars:4.7 },
        { id:"otani", emoji:"🥢", place:"Otani", type:"japanese", desc:"4.7★ · japanese", booking:"http://otaniatnassau.com/", maps:"Otani+NYC", reviews:682, price:"$$", reservable:true, stars:4.7 },
        { id:"koreatgo", emoji:"🥢", place:"KOREATGO", type:"korean", desc:"4.7★ · korean", booking:null, maps:"KOREATGO+NYC", reviews:151, price:"$$", reservable:false, stars:4.7 },
        { id:"suteishijapa", emoji:"🥢", place:"SUteiShi Japanese Restaurant", type:"japanese", desc:"Low-key sushi & Japanese restaurant with outdoor seating in the Seaport District.", booking:"http://www.suteishi.com/", maps:"SUteiShi+Japanese+Restaurant+NYC", reviews:727, price:"$$", reservable:true, stars:4.6 },
        { id:"sushico", emoji:"🥢", place:"Sushi & Co", type:"japanese", desc:"Black rice sushi, ramen & bento boxes in a streamlined restaurant offering take-out & delivery.", booking:"http://www.sushinco.com/", maps:"Sushi++Co+NYC", reviews:715, price:"$$", reservable:true, stars:4.6 },
        { id:"gunbae", emoji:"🥢", place:"Gunbae", type:"korean", desc:"Buzzy hangout featuring Korean BBQ at table grills, plus colorfully lit karaoke rooms.", booking:"http://www.gunbaetribeca.com/", maps:"Gunbae+NYC", reviews:1568, price:"$$", reservable:true, stars:4.6 },
        { id:"blueribbonsu", emoji:"🥢", place:"Blue Ribbon Sushi Bar & Grill - Financial District", type:"japanese", desc:"Japanese seafood, hot entrees & signature fried chicken plated in a sophisticated atmosphere.", booking:"https://www.blueribbonsushibarandgrilldowntown.com/", maps:"Blue+Ribbon+Sushi+Bar++Grill++Financial+District+NYC", reviews:608, price:"$$", reservable:true, stars:4.5 },
        { id:"kobakoreanbb", emoji:"🥢", place:"KOBA Korean BBQ", type:"korean", desc:"4.5★ · korean", booking:"http://www.kobakoreanbbq.com/", maps:"KOBA+Korean+BBQ+NYC", reviews:227, price:"$$", reservable:false, stars:4.5 },
      ],
      pasta: [
        { id:"serafinafina", emoji:"🍝", place:"Serafina Financial District", type:"italian dinner", desc:"4.6★ · italian dinner", booking:"https://serafinarestaurant.com/", maps:"Serafina+Financial+District+NYC", reviews:1055, price:"$$", reservable:true, stars:4.6 },
        { id:"daclaudionyc", emoji:"🍝", place:"Da Claudio NYC Ristorante", type:"italian dinner", desc:"This white-tiled Italian bar offers small plates & higher-end entrees to go with wine & cocktails.", booking:"http://www.daclaudionyc.com/", maps:"Da+Claudio+NYC+Ristorante+NYC", reviews:947, price:"$$", reservable:true, stars:4.5 },
        { id:"felice15gold", emoji:"🍝", place:"Felice 15 Gold", type:"italian dinner", desc:"Sleek outpost with warm leather & wood decor offering Tuscan fare & a long list of Italian wines.", booking:"https://www.felicerestaurants.com/felice-15-gold-street/", maps:"Felice+15+Gold+NYC", reviews:1089, price:"$$", reservable:true, stars:4.5 },
        { id:"ilbrigante", emoji:"🍝", place:"Il Brigante", type:"italian dinner", desc:"Southern Italian cuisine & wine served in a cozy space with exposed brick walls & sidewalk seating.", booking:"https://www.ilbrigantenyc.com/", maps:"Il+Brigante+NYC", reviews:1160, price:"$$", reservable:true, stars:4.4 },
      ],
      pizza: [],
      mediterranean: [
        { id:"gitanonyc", emoji:"🥙", place:"Gitano NYC", type:"mexican", desc:"4.6★ · mexican", booking:"https://www.gitano.com/nyc/?utm_source=google&utm_medium=cpc&utm_campaign=gitano-nyc-business-profile", maps:"Gitano+NYC+NYC", reviews:1051, price:"$$", reservable:true, stars:4.6 },
        { id:"mayamezcal", emoji:"🥙", place:"Mayamezcal", type:"mexican", desc:"4.7★ · mexican", booking:"http://mayamezcal.com/", maps:"Mayamezcal+NYC", reviews:2445, price:"$$", reservable:true, stars:4.7 },
      ],
      american: [
        { id:"palmstreet", emoji:"🥩", place:"Palm Street", type:"american dinner", desc:"4.8★ · american dinner", booking:"https://www.sevenrooms.com/explore/palmstreet/reservations/create/search/", maps:"Palm+Street+NYC", reviews:978, price:"$$", reservable:true, stars:4.8 },
      ],
      brunch: [
        { id:"regularnyc", emoji:"🥐", place:"REGULAR NYC", type:"brunch", desc:"4.9★ · brunch", booking:"https://www.regular.nyc/", maps:"REGULAR+NYC+NYC", reviews:653, price:"$$", reservable:false, stars:4.9 },
        { id:"themalthouse", emoji:"🥐", place:"The Malt House", type:"brunch", desc:"Craft beer, classic cocktails, and American fare served in a swanky, industrial-chic tavern.", booking:"http://www.themalthousefidi.com/", maps:"The+Malt+House+NYC", reviews:2218, price:"$$", reservable:true, stars:4.3 },
      ],
      coffee: [
        { id:"sipsteriauws", emoji:"☕", place:"Sipsteria UWS", type:"coffee", subtype:"coffee", desc:"4.9★ · coffee", booking:"http://www.sipsteria.com/", maps:"Sipsteria+UWS+NYC", reviews:241, price:"$$", reservable:false, stars:4.9 },
        { id:"sotecoffeero", emoji:"☕", place:"Sote Coffee Roasters", type:"coffee", subtype:"coffee", desc:"4.8★ · coffee", booking:"https://sotecoffeeroasters.com/", maps:"Sote+Coffee+Roasters+NYC", reviews:387, price:"$$", reservable:false, stars:4.8 },
        { id:"qahwahhouseb", emoji:"☕", place:"Qahwah House - Broadway", type:"coffee", subtype:"coffee", desc:"4.8★ · coffee", booking:"https://www.qahwahhouse.com/", maps:"Qahwah+House++Broadway+NYC", reviews:600, price:"$$", reservable:false, stars:4.8 },
      ],
      latenight: [],
    },
    activities: {
      free: [],
      outside: [],
      creative: [
        { id:"frauncestave", emoji:"🎨", place:"Fraunces Tavern Museum", type:"creative", subtype:"museum", desc:"4.7★ · museum", booking:"https://www.frauncestavernmuseum.org/", maps:"Fraunces+Tavern+Museum+NYC", reviews:133, price:"$$", reservable:false, stars:4.7 },
        { id:"halldeslumir", emoji:"🎨", place:"Hall des Lumières", type:"creative", subtype:"museum", desc:"4.5★ · museum", booking:"https://www.halldeslumieres.com/en/events-offerings?_gl=1%2A1sw73l0%2A_up%2AMQ..%2A_gs%2AMQ..&gbraid=0AAAAA9kRWJms0KtHpmDwKOGS3vEtK74fE&gclid=EAIaIQobChMIk7uR0tWTigMVAzIIBR149hYFEAAYASAAEgJq1_D_BwE", maps:"Hall+des+Lumires+NYC", reviews:617, price:"$$", reservable:false, stars:4.5 },
        ],
      competitive: [
        { id:"fiveirongolf", emoji:"🎯", place:"Five Iron Golf", type:"competitive", subtype:"golf simulator", desc:"4.8★ · golf simulator", booking:"https://fiveirongolf.com/locations/nyc-fidi/?utm_source=local&utm_medium=organic&utm_campaign=ny&utm_content=nyc-fidi", maps:"Five+Iron+Golf+NYC", reviews:310, price:"$$", reservable:false, stars:4.8 },
        ],
      shows: [],
      active: [],
      paid: [],
    },
    happyHour: [],
  },
  upper_east: {
    bars: {
      cocktails: [
        { id:"barvivant", emoji:"🍸", place:"Bar Vivant", type:"cocktails", desc:"5.0★ · cocktails", booking:"https://www.barvivant.net/", maps:"Bar+Vivant+NYC", reviews:50, price:"$$", reservable:false, stars:5.0 },
        { id:"edselbowroom", emoji:"🍸", place:"Ed’s Elbow Room", type:"cocktails", desc:"4.9★ · cocktails", booking:"http://www.heidishouseny.com/", maps:"Eds+Elbow+Room+NYC", reviews:36, price:"$$", reservable:true, stars:4.9 },
        { id:"shakennotsti", emoji:"🍸", place:"Shaken Not Stirred", type:"cocktails", desc:"4.8★ · cocktails", booking:"http://shakennotstirrednyc.com/", maps:"Shaken+Not+Stirred+NYC", reviews:579, price:"$$", reservable:true, stars:4.8 },
        { id:"avoca", emoji:"🍸", place:"Avoca", type:"cocktails", desc:"Lively, brick-walled pub pairing draft beer with hearty fare, plus brunch, happy hours & a patio.", booking:"https://avoca-nyc.com/", maps:"Avoca+NYC", reviews:1770, price:"$$", reservable:true, stars:4.8 },
        { id:"sojournsocia", emoji:"🍸", place:"Sojourn Social", type:"cocktails", desc:"4.7★ · cocktails", booking:"https://sojournsocial.com/", maps:"Sojourn+Social+NYC", reviews:609, price:"$$", reservable:true, stars:4.7 },
      ],
      beer: [],
      wine: [
        { id:"vanguardwine", emoji:"🍷", place:"Vanguard Wine Bar (Upper East Side)", type:"wine bar", desc:"4.6★ · wine bar", booking:"http://www.vanguard-nyc.com/", maps:"Vanguard+Wine+Bar+Upper+East+Side+NYC", reviews:159, price:"$$", reservable:false, stars:4.6 },
        { id:"felice64", emoji:"🍷", place:"Felice 64", type:"wine bar", desc:"Stylish wine bar supplying Italian vintages & fare in a rustic, date-friendly setting.", booking:"https://www.felicerestaurants.com/felice-64/", maps:"Felice+64+NYC", reviews:653, price:"$$", reservable:true, stars:4.5 },
        { id:"pilpil", emoji:"🍷", place:"Pil Pil", type:"wine bar", desc:"Brick walls, tree branches on the ceiling & colored bottles set the scene for Spanish tapas & wine.", booking:"http://pilpilnyc.com/", maps:"Pil+Pil+NYC", reviews:1378, price:"$$", reservable:true, stars:4.4 },
      ],
      experimental: [],
      speakeasy: [
        { id:"zofiashideou", emoji:"🕯️", place:"Zofia's Hideout", type:"speakeasy", desc:"4.9★ · speakeasy", booking:null, maps:"Zofias+Hideout+NYC", reviews:56, price:"$$", reservable:true, stars:4.9 },
      ],
    },
    food: {
      japanese: [
        { id:"zensushiomak", emoji:"🥢", place:"Zen Sushi Omakase", type:"japanese", desc:"The high-end sushi spot occupies a simple setting & offers a chef's choice or a la carte menu.", booking:"http://zensushiomakase.com/", maps:"Zen+Sushi+Omakase+NYC", reviews:194, price:"$$$$", reservable:true, stars:4.5 },
        { id:"upthai", emoji:"🥢", place:"Up Thai", type:"japanese", desc:"Stylish restaurant & bar serving upscale Thai street food in a low-lit space with colorful lanterns.", booking:"http://www.upthainyc.com/", maps:"Up+Thai+NYC", reviews:7909, price:"$$", reservable:true, stars:4.8 },
        { id:"sushiishikaw", emoji:"🥢", place:"Sushi Ishikawa", type:"japanese", desc:"Omakase-only spot serving progressive courses of sushi & Japanese bites in a brick-walled space.", booking:"http://www.ishikawanyc.com/", maps:"Sushi+Ishikawa+NYC", reviews:460, price:"$$$$", reservable:true, stars:4.7 },
        { id:"nr", emoji:"🥢", place:"NR", type:"japanese", desc:"Meiji-era-inspired ramen bar serving Japanese fare plus craft cocktails in antique drinking vessels", booking:"http://nr-nyc.com/", maps:"NR+NYC", reviews:844, price:"$$", reservable:true, stars:4.6 },
      ],
      pasta: [
        { id:"supperclubby", emoji:"🍝", place:"Supper Club By Le Petit Parisien", type:"french", desc:"4.9★ · french", booking:"https://supperclublpp.com/", maps:"Supper+Club+By+Le+Petit+Parisien+NYC", reviews:102, price:"$$", reservable:true, stars:4.9 },
        { id:"lapecorabian", emoji:"🍝", place:"La Pecora Bianca UES", type:"italian dinner", desc:"Stylish, bright eatery featuring market-driven Italian cuisine, regional wines & apéritifs.", booking:"https://www.lapecorabianca.com/", maps:"La+Pecora+Bianca+UES+NYC", reviews:2580, price:"$$", reservable:true, stars:4.8 },
        { id:"lincontrobyr", emoji:"🍝", place:"L’incontro by Rocco", type:"italian dinner", desc:"Upscale Italian restaurant with a special-occasion setting & a long list of specials.", booking:"https://www.lincontrobyrocco.com/", maps:"Lincontro+by+Rocco+NYC", reviews:1488, price:"$$$", reservable:true, stars:4.7 },
        { id:"losteria", emoji:"🍝", place:"L'Osteria", type:"italian dinner", desc:"4.7★ · italian dinner", booking:"http://www.losterianyc.com/", maps:"LOsteria+NYC", reviews:375, price:"$$$", reservable:true, stars:4.7 },
        { id:"cafedalsace", emoji:"🍝", place:"Cafe d’Alsace", type:"french", desc:"Alsatian eats & a popular brunch along with a beer list that's curated by a beer sommelier.", booking:"https://cafedalsace.com/", maps:"Cafe+dAlsace+NYC", reviews:2851, price:"$$", reservable:true, stars:4.7 },
        { id:"majorelle", emoji:"🍝", place:"Majorelle", type:"french", desc:"Place for elegant French fare with a Moroccan touch in The Lowell hotel, with a bar & skylit garden.", booking:"https://www.lowellhotel.com/restaurants-and-bar/majorelle/57-1/", maps:"Majorelle+NYC", reviews:274, price:"$$$", reservable:true, stars:4.6 },
        { id:"jacquesbrass", emoji:"🍝", place:"Jacques Brasserie", type:"french", desc:"French bistro fare served in a typical brasserie atmosphere of dark wood & vintage posters.", booking:"http://www.jacquesbrasserie.com/", maps:"Jacques+Brasserie+NYC", reviews:696, price:"$$", reservable:true, stars:4.5 },
        { id:"pascalou", emoji:"🍝", place:"Pascalou", type:"french", desc:"French specialties, desserts & a variety of wines & ports are served in a small split-level space.", booking:"http://www.pascalou.info/", maps:"Pascalou+NYC", reviews:480, price:"$$", reservable:true, stars:4.4 },
      ],
      pizza: [],
      mediterranean: [
        { id:"seasaltnyc", emoji:"🥙", place:"Sea Salt NYC", type:"mediterranean", desc:"Relaxed eatery with outdoor tables, serving mezze, kebabs, baklava & other Mediterranean classics.", booking:"https://www.seasaltrestaurantnyc.com/", maps:"Sea+Salt+NYC+NYC", reviews:1095, price:"$$", reservable:true, stars:4.7 },
        { id:"koraliestiat", emoji:"🥙", place:"Korali Estiatorio", type:"mediterranean", desc:"Upbeat Greek eatery serving an array of fish dishes & small plates in sleek digs with stone arches.", booking:"http://www.nyckorali.com/", maps:"Korali+Estiatorio+NYC", reviews:544, price:"$$$", reservable:true, stars:4.5 },
        { id:"yefsiestiato", emoji:"🥙", place:"Yefsi Estiatorio", type:"mediterranean", desc:"Charming Athenian-style Greek eatery with a focus on elevated, appetizer-size meze dishes.", booking:"http://yefsiestiatorio.com/", maps:"Yefsi+Estiatorio+NYC", reviews:452, price:"$$", reservable:true, stars:4.4 },
      ],
      american: [
        { id:"dearmargo", emoji:"🥩", place:"Dear Margo", type:"american dinner", desc:"5.0★ · american dinner", booking:"https://dearmargo.com/", maps:"Dear+Margo+NYC", reviews:66, price:"$$", reservable:false, stars:5.0 },
        { id:"adria", emoji:"🥩", place:"Adria", type:"american dinner", desc:"4.8★ · american dinner", booking:"https://www.adrianyc.com/", maps:"Adria+NYC", reviews:92, price:"$$", reservable:true, stars:4.8 },
        { id:"waterwheatup", emoji:"🥩", place:"Water & Wheat Upper East", type:"american dinner", desc:"4.7★ · american dinner", booking:"http://www.waterandwheatnyc.com/", maps:"Water++Wheat+Upper+East+NYC", reviews:398, price:"$$", reservable:true, stars:4.7 },
        { id:"lavoglianyc", emoji:"🥩", place:"La Voglia NYC", type:"american dinner", desc:"4.7★ · american dinner", booking:"https://www.lavoglianyc.com/", maps:"La+Voglia+NYC+NYC", reviews:1017, price:"$$$", reservable:true, stars:4.7 },
      ],
      brunch: [
        { id:"zoimediterra", emoji:"🥐", place:"ZOI MEDITERRANEAN UES", type:"brunch", desc:"4.6★ · brunch", booking:"https://www.zoiues.com/", maps:"ZOI+MEDITERRANEAN+UES+NYC", reviews:1811, price:"$$", reservable:true, stars:4.6 },
        { id:"greenkitchen", emoji:"🥐", place:"Green Kitchen 70th Street", type:"brunch", desc:"4.5★ · brunch", booking:"https://www.greenkitchennyc.com/", maps:"Green+Kitchen+70th+Street+NYC", reviews:522, price:"$$", reservable:true, stars:4.5 },
        { id:"cafmaud", emoji:"🥐", place:"Café Maud", type:"brunch", desc:"4.3★ · brunch", booking:"https://www.cafemaud.com/ues", maps:"Caf+Maud+NYC", reviews:214, price:"$$", reservable:true, stars:4.3 },
      ],
      coffee: [
        { id:"aokomatcha", emoji:"☕", place:"Aoko Matcha", type:"coffee", subtype:"coffee", desc:"4.7★ · coffee", booking:"https://www.aokomatcha.com/", maps:"Aoko+Matcha+NYC", reviews:330, price:"$$", reservable:false, stars:4.7 },
        { id:"teabowl", emoji:"☕", place:"Teabowl", type:"coffee", subtype:"coffee", desc:"4.5★ · coffee", booking:null, maps:"Teabowl+NYC", reviews:44, price:"$$", reservable:false, stars:4.5 },
        { id:"matchaful", emoji:"☕", place:"Matchaful", type:"coffee", subtype:"coffee", desc:"4.3★ · coffee", booking:"https://www.bematchaful.com/", maps:"Matchaful+NYC", reviews:189, price:"$$", reservable:false, stars:4.3 },
      ],
      latenight: [],
    },
    activities: {
      free: [],
      outside: [],
      creative: [
        { id:"neuegalerien", emoji:"🎨", place:"Neue Galerie New York", type:"creative", subtype:"museum", desc:"Refined museum dedicated to German & Austrian art & design with a focus on the early 20th century.", booking:"http://www.neuegalerie.org/", maps:"Neue+Galerie+New+York+NYC", reviews:3122, price:"$$$", reservable:false, stars:4.4 },
        { id:"thejewishmus", emoji:"🎨", place:"The Jewish Museum", type:"creative", subtype:"museum", desc:"Contemporary gift shop for handcrafted Jewish ceremonial objects & traditional marriage contracts.", booking:"https://thejewishmuseum.org/", maps:"The+Jewish+Museum+NYC", reviews:1844, price:"$$", reservable:false, stars:4.4 },
        { id:"solomonrgugg", emoji:"🎨", place:"Solomon R. Guggenheim Museum", type:"creative", subtype:"museum", desc:"Frank Lloyd Wright–designed modern art museum with an architecturally significant spiral rotunda.", booking:"https://www.guggenheim.org/", maps:"Solomon+R+Guggenheim+Museum+NYC", reviews:26170, price:"$$", reservable:false, stars:4.3 },
        ],
      competitive: [],
      shows: [],
      active: [
        { id:"activestudio", emoji:"💪", place:"Active Studios NYC", type:"active", subtype:"fitness class", desc:"5.0★ · fitness class", booking:"http://www.activestudiosnyc.com/", maps:"Active+Studios+NYC+NYC", reviews:41, price:"$$", reservable:false, stars:5.0 },
        { id:"thefortnyc", emoji:"💪", place:"The Fort NYC", type:"active", subtype:"fitness class", desc:"4.9★ · fitness class", booking:"https://thefortnyc.com/", maps:"The+Fort+NYC+NYC", reviews:41, price:"$$", reservable:false, stars:4.9 },
        { id:"elementsbarr", emoji:"💪", place:"Elements Barre Fit, Upper East Side", type:"active", subtype:"fitness class", desc:"4.8★ · fitness class", booking:"https://elementsbarrefit.com/upper-east-side-elements-barre/", maps:"Elements+Barre+Fit+Upper+East+Side+NYC", reviews:29, price:"$$", reservable:false, stars:4.8 },
        { id:"physique57ba", emoji:"💪", place:"Physique 57 Barre 60th & 5th Studio | Upper East Side", type:"active", subtype:"fitness class", desc:"Beginner & advanced barre workouts in a swanky, modern fitness studio with large windows.", booking:"http://physique57.com/nyc/uptown-barre-studio", maps:"Physique+57+Barre+60th++5th+Studio++Upper+East+Side+NYC", reviews:173, price:"$$", reservable:false, stars:4.8 },
        { id:"pushlabfitne", emoji:"💪", place:"PushLab Fitness", type:"active", subtype:"fitness class", desc:"HIIT group classes are the specialty of this intimate, gym also offering personal training.", booking:"https://pushlabfitness.com/", maps:"PushLab+Fitness+NYC", reviews:36, price:"$$", reservable:false, stars:4.7 },
        ],
      paid: [],
    },
    happyHour: [
        { id:"cravefishbar", emoji:"🎉", place:"Crave Fishbar Upper East Side", type:"happy hour", desc:"4.8★ · happy hour", booking:"https://www.cravefishbar.com/", maps:"Crave+Fishbar+Upper+East+Side+NYC", reviews:89, price:"$$", reservable:true, stars:4.8, deal:"Happy Hour specials", hours:"Check venue for hours" },
        ],
  },
  upper_west: {
    bars: {
      cocktails: [
        { id:"theowlstail", emoji:"🍸", place:"The Owl's Tail", type:"cocktails", desc:"This cool hot spot with a cozy retro vibe showcases  inventive cocktails & global small plates.", booking:"https://www.owlstail.com/", maps:"The+Owls+Tail+NYC", reviews:362, price:"$$", reservable:true, stars:4.7 },
        { id:"thewallacelo", emoji:"🍸", place:"The Wallace Lounge", type:"cocktails", desc:"4.6★ · cocktails", booking:"https://thewallace.com/lounge", maps:"The+Wallace+Lounge+NYC", reviews:107, price:"$$", reservable:true, stars:4.6 },
        { id:"scarletloung", emoji:"🍸", place:"Scarlet Lounge", type:"cocktails", desc:"4.6★ · cocktails", booking:"https://scarletloungenyc.com/", maps:"Scarlet+Lounge+NYC", reviews:104, price:"$$", reservable:false, stars:4.6 },
        { id:"prohibition", emoji:"🍸", place:"Prohibition", type:"cocktails", desc:"Supper club with Jazz Age-themed decor, a long cocktail list & nightly live music performances.", booking:"http://prohibition.net/", maps:"Prohibition+NYC", reviews:1035, price:"$$", reservable:true, stars:4.5 },
        { id:"allurecockta", emoji:"🍸", place:"Allure Cocktail Lounge", type:"cocktails", desc:"4.5★ · cocktails", booking:"https://www.hotelbelleclaire.com/eat-drink/allure", maps:"Allure+Cocktail+Lounge+NYC", reviews:84, price:"$$", reservable:false, stars:4.5 },
      ],
      beer: [],
      wine: [
        { id:"sipsteriauws", emoji:"🍷", place:"Sipsteria UWS", type:"wine bar", desc:"4.9★ · wine bar", booking:"http://www.sipsteria.com/", maps:"Sipsteria+UWS+NYC", reviews:240, price:"$$", reservable:true, stars:4.9 },
        { id:"vanguardwine", emoji:"🍷", place:"Vanguard Wine Bar (Upper West Side)", type:"wine bar", desc:"Neighborhood spot offering French wine & small plates amid marble-topped tables & subway tiles.", booking:"http://vanguard-nyc.com/", maps:"Vanguard+Wine+Bar+Upper+West+Side+NYC", reviews:491, price:"$$", reservable:false, stars:4.6 },
        { id:"eliswinebarr", emoji:"🍷", place:"ELIS WINE BAR & RESTAURANT", type:"wine bar", desc:"Homey haunt for Mediterranean-style small plates & mains paired with a global wine list.", booking:"http://www.eliswinebar.com/", maps:"ELIS+WINE+BAR++RESTAURANT+NYC", reviews:332, price:"$$", reservable:true, stars:4.6 },
        { id:"amlieupperwe", emoji:"🍷", place:"Amélie Upper West Side Bistro & Wine Bar", type:"wine bar", desc:"Serene joint with a classy vibe offering small plates & full meals with matching wines.", booking:"http://ameliewinebar.com/", maps:"Amlie+Upper+West+Side+Bistro++Wine+Bar+NYC", reviews:591, price:"$$", reservable:true, stars:4.5 },
      ],
      experimental: [],
      speakeasy: [],
    },
    food: {
      japanese: [
        { id:"sushikoya", emoji:"🥢", place:"Sushi Koya", type:"japanese", desc:"4.8★ · japanese", booking:"https://resy.com/cities/new-york-ny/venues/sushi-koya", maps:"Sushi+Koya+NYC", reviews:221, price:"$$", reservable:true, stars:4.8 },
        { id:"bondisushi", emoji:"🥢", place:"Bondi Sushi", type:"japanese", desc:"4.3★ · japanese", booking:"http://www.bondisushi.com/", maps:"Bondi+Sushi+NYC", reviews:194, price:"$$", reservable:true, stars:4.3 },
      ],
      pasta: [
        { id:"lapecorabian", emoji:"🍝", place:"La Pecora Bianca UWS", type:"italian dinner", desc:"Stylish, bright eatery featuring market-driven Italian cuisine, regional wines & apéritifs.", booking:"https://www.lapecorabianca.com/", maps:"La+Pecora+Bianca+UWS+NYC", reviews:2974, price:"$$", reservable:true, stars:4.8 },
        { id:"lucciola", emoji:"🍝", place:"Lucciola", type:"italian dinner", desc:"Refined eatery offering classic Italian dishes, seafood & steak, plus a robust wine list.", booking:"http://www.lucciolanyc.com/?utm_campaign=gmb", maps:"Lucciola+NYC", reviews:1544, price:"$$", reservable:true, stars:4.8 },
        { id:"celeste", emoji:"🍝", place:"Celeste", type:"italian dinner", desc:"Satisfying Neapolitan Italian fare plus brick-oven pizza brings crowds to this neighborhood hangout.", booking:"https://celesterestaurantny.com/?utm_source=google", maps:"Celeste+NYC", reviews:3747, price:"$$", reservable:true, stars:4.8 },
        { id:"essentialbyc", emoji:"🍝", place:"Essential by Christophe", type:"french", desc:"4.8★ · french", booking:"https://www.essentialbychristophe.com/", maps:"Essential+by+Christophe+NYC", reviews:433, price:"$$", reservable:true, stars:4.8 },
        { id:"lemonde", emoji:"🍝", place:"Le Monde", type:"french", desc:"Wine & cuisine from France's Loire Valley region  in a bistro-style space with patio seating.", booking:"https://lemondenyc.com/", maps:"Le+Monde+NYC", reviews:3172, price:"$$", reservable:true, stars:4.8 },
        { id:"osteriaaccad", emoji:"🍝", place:"Osteria Accademia", type:"italian dinner", desc:"4.7★ · italian dinner", booking:"https://accademianyc.com/", maps:"Osteria+Accademia+NYC", reviews:351, price:"$$", reservable:true, stars:4.7 },
        { id:"lasirne", emoji:"🍝", place:"La Sirène", type:"french", desc:"4.5★ · french", booking:"http://lasirenenyc.com/", maps:"La+Sirne+NYC", reviews:443, price:"$$", reservable:true, stars:4.5 },
        { id:"nicematin", emoji:"🍝", place:"Nice Matin", type:"french", desc:"Bustling French eatery with a Riviera vibe, outdoor seating, and a curated wine list.", booking:"https://nicematinnyc.com/", maps:"Nice+Matin+NYC", reviews:2345, price:"$$$", reservable:true, stars:4.5 },
      ],
      pizza: [],
      mediterranean: [
        { id:"elea", emoji:"🥙", place:"Elea", type:"mediterranean", desc:"Bi-level eatery with Greek Island vibes, exposed beam wood ceilings, & seafood-forward menu.", booking:"http://www.eleanyc.com/", maps:"Elea+NYC", reviews:1103, price:"$$", reservable:true, stars:4.6 },
        { id:"leyla", emoji:"🥙", place:"Leyla", type:"mediterranean", desc:"Cozy Turkish eatery serving wood-fired flat breads, seafood, and meat plates, plus wine and cocktails.", booking:"https://www.leylanyc.com/", maps:"Leyla+NYC", reviews:871, price:"$$", reservable:true, stars:4.5 },
        { id:"marlowbistro", emoji:"🥙", place:"Marlow Bistro", type:"mediterranean", desc:"Refined restaurant with outdoor seating serving thoughtfully sourced Mediterranean dishes.", booking:"https://www.marlowbistro.com/", maps:"Marlow+Bistro+NYC", reviews:1031, price:"$$", reservable:true, stars:4.5 },
        { id:"shalel", emoji:"🥙", place:"Shalel", type:"mediterranean", desc:"Underground lounge where dark nooks & a waterfall lend a romantic, intimate vibe.", booking:"https://shalel.kitchen/", maps:"Shalel+NYC", reviews:721, price:"$$", reservable:true, stars:4.4 },
        { id:"tessa", emoji:"🥙", place:"TESSA", type:"mediterranean", desc:"Diverse mix of modern Mediterranean dishes in a stylish brick-&-wood space with a 1st-floor bar.", booking:"http://tessarestaurant.com/?utm_source=google&utm_medium=wix_google_business_profile&utm_campaign=16860188624335479115", maps:"TESSA+NYC", reviews:982, price:"$$$", reservable:true, stars:4.4 },
      ],
      american: [
        { id:"florentin", emoji:"🥩", place:"Florentin", type:"american dinner", desc:"4.9★ · american dinner", booking:"https://florentinbistro.com/", maps:"Florentin+NYC", reviews:321, price:"$$", reservable:true, stars:4.9 },
        { id:"pigandkhaouw", emoji:"🥩", place:"Pig and Khao - UWS", type:"american dinner", desc:"4.8★ · american dinner", booking:"https://www.pigandkhao.com/uws", maps:"Pig+and+Khao++UWS+NYC", reviews:1319, price:"$$", reservable:true, stars:4.8 },
        { id:"cantoupperwe", emoji:"🥩", place:"Canto Upper West Side", type:"american dinner", desc:"4.7★ · american dinner", booking:"https://www.cantonyc.com/", maps:"Canto+Upper+West+Side+NYC", reviews:910, price:"$$", reservable:true, stars:4.7 },
        { id:"tascanyc", emoji:"🥩", place:"Tasca NYC", type:"american dinner", desc:"Genteel tavern with a patio offering a fusion of Spanish & Caribbean cuisine, plus cocktails.", booking:"http://www.tasca-nyc.com/", maps:"Tasca+NYC+NYC", reviews:449, price:"$$$", reservable:true, stars:4.7 },
        { id:"themillingro", emoji:"🥩", place:"The Milling Room", type:"american dinner", desc:"Large restaurant with romantic lighting serving American fare with subtle Italian influences.", booking:"https://cometenyc.com/menus", maps:"The+Milling+Room+NYC", reviews:1074, price:"$$$", reservable:true, stars:4.4 },
      ],
      brunch: [
        { id:"thewolfe", emoji:"🥐", place:"The Wolfe", type:"brunch", desc:"4.6★ · brunch", booking:"https://www.thewolfenyc.com/", maps:"The+Wolfe+NYC", reviews:223, price:"$$", reservable:true, stars:4.6 },
        { id:"jacobspickle", emoji:"🥐", place:"Jacob's Pickles", type:"brunch", desc:"Southern eatery and bar offering fried chicken biscuit sandwiches, housemade pickles, and beers.", booking:"https://www.jacobspickles.com/", maps:"Jacobs+Pickles+NYC", reviews:7325, price:"$$", reservable:true, stars:4.5 },
        { id:"friendofafar", emoji:"🥐", place:"Friend of a Farmer", type:"brunch", desc:"4.4★ · brunch", booking:"https://www.friendofafarmer.com/", maps:"Friend+of+a+Farmer+NYC", reviews:308, price:"$$", reservable:true, stars:4.4 },
      ],
      coffee: [
        { id:"bluebrowncaf", emoji:"☕", place:"Blue Brown Cafe", type:"coffee", subtype:"coffee", desc:"4.9★ · coffee", booking:"http://www.bluebrowncafe.com/", maps:"Blue+Brown+Cafe+NYC", reviews:292, price:"$", reservable:false, stars:4.9 },
        { id:"landtosea", emoji:"☕", place:"Land to Sea", type:"coffee", subtype:"coffee", desc:"4.9★ · coffee", booking:"http://landtoseanyc.com/", maps:"Land+to+Sea+NYC", reviews:442, price:"$", reservable:false, stars:4.9 },
        { id:"1111cafe", emoji:"☕", place:"11:11 Cafe", type:"coffee", subtype:"coffee", desc:"4.9★ · coffee", booking:"https://drive.google.com/file/d/1_ARHaVra8DH2JDSjx_q7GccY3vEWE8OD/view?usp=drivesdk", maps:"1111+Cafe+NYC", reviews:294, price:"$$", reservable:false, stars:4.9 },
        { id:"cafmiguel", emoji:"☕", place:"Café Miguel", type:"coffee", subtype:"coffee", desc:"4.9★ · coffee", booking:null, maps:"Caf+Miguel+NYC", reviews:413, price:"$", reservable:false, stars:4.9 },
        { id:"hiddenground", emoji:"☕", place:"Hidden Grounds Chai & Coffee House", type:"coffee", subtype:"coffee", desc:"4.8★ · coffee", booking:"http://www.thehiddengrounds.com/", maps:"Hidden+Grounds+Chai++Coffee+House+NYC", reviews:165, price:"$$", reservable:false, stars:4.8 },
        { id:"asyoulike", emoji:"☕", place:"As you like", type:"coffee", subtype:"coffee", desc:"4.8★ · coffee", booking:"https://www.asyoulike.nyc/", maps:"As+you+like+NYC", reviews:114, price:"$$", reservable:false, stars:4.8 },
        { id:"herebk", emoji:"☕", place:"Here Bk", type:"coffee", subtype:"coffee", desc:"4.8★ · coffee", booking:"https://herebk.com/", maps:"Here+Bk+NYC", reviews:163, price:"$$", reservable:false, stars:4.8 },
      ],
      latenight: [],
    },
    activities: {
      free: [],
      outside: [],
      creative: [
        { id:"gildercenter", emoji:"🎨", place:"Gilder Center for Science, Education, and Innovation", type:"creative", subtype:"museum", desc:"4.8★ · museum", booking:"https://www.amnh.org/exhibitions/permanent/gilder-center", maps:"Gilder+Center+for+Science+Education+and+Innovation+NYC", reviews:457, price:"$$", reservable:false, stars:4.8 },
        { id:"americanmuse", emoji:"🎨", place:"American Museum of Natural History", type:"creative", subtype:"museum", desc:"From dinosaurs to outer space & everything in between, this huge museum showcases natural wonders.", booking:"https://www.amnh.org/", maps:"American+Museum+of+Natural+History+NYC", reviews:24208, price:"$$", reservable:false, stars:4.6 },
        ],
      competitive: [],
      shows: [],
      active: [
        { id:"grassrootsfi", emoji:"💪", place:"Grassroots Fitness Project", type:"active", subtype:"fitness class", desc:"Gym offering personalized programs for adults & kids, plus group interval training & yoga.", booking:"http://grassrootsfitnessproject.com/", maps:"Grassroots+Fitness+Project+NYC", reviews:117, price:"$$", reservable:false, stars:5.0 },
        { id:"rx30", emoji:"💪", place:"RX30", type:"active", subtype:"fitness class", desc:"4.9★ · fitness class", booking:"http://rx30fit.com/", maps:"RX30+NYC", reviews:255, price:"$$", reservable:false, stars:4.9 },
        { id:"fhittingroom", emoji:"💪", place:"Fhitting Room- Upper West Side", type:"active", subtype:"fitness class", desc:"4.8★ · fitness class", booking:"https://www.fhittingroom.com/", maps:"Fhitting+Room+Upper+West+Side+NYC", reviews:105, price:"$$", reservable:false, stars:4.8 },
        { id:"momentumfitn", emoji:"💪", place:"Momentum Fitness", type:"active", subtype:"fitness class", desc:"Movement-based fitness studio with personal training, plus kettlebell, Pilates & yoga classes.", booking:"https://www.momentumfitnessnyc.com/", maps:"Momentum+Fitness+NYC", reviews:33, price:"$$", reservable:false, stars:4.8 },
        ],
      paid: [],
    },
    happyHour: [
        { id:"bodega88", emoji:"🎉", place:"Bodega 88", type:"happy hour", desc:"Urban sports pub offering Latin-inspired small plates & weekend brunch along with sangria & mojitos.", booking:"http://www.bodega88nyc.com/", maps:"Bodega+88+NYC", reviews:679, price:"$$", reservable:false, stars:4.5, deal:"Happy Hour specials", hours:"Check venue for hours" },
        { id:"esbar", emoji:"🎉", place:"e's BAR", type:"happy hour", desc:"Pub with rotating drink specials and diverse eats in laid-back digs with big windows & board games.", booking:"https://e-barnyc.com/", maps:"es+BAR+NYC", reviews:989, price:"$$", reservable:true, stars:4.4, deal:"Happy Hour specials", hours:"Check venue for hours" },
        ],
  },
};


const getQuestion = (a) => {
  if (!a.neighborhood) return { id:"neighborhood", special:"neighborhood" };
  if (a.focus === "ourpick") return null;

  // Time of day comes right after neighborhood
  if (!a.timeOfDay) return { id:"timeOfDay", emoji:"🕐", q:"When are you going?", opts:[
    {l:"Daytime",v:"day",i:"☀️"},{l:"Evening",v:"evening",i:"🌆"},{l:"Late Night",v:"late",i:"🌙"}
  ]};

  if (!a.budget) return { id:"budget", emoji:"💰", q:"What's the budget?", opts:[
    {l:"Free ($0)",v:"free",i:"🌿"},
    {l:"Below $100",v:"under100",i:"💵"},
    {l:"$100+",v:"splurge",i:"💎"}
  ]};
  if (!a.dateType) return { id:"dateType", emoji:"💬", q:"First date or you two?", opts:[
    {l:"First date",v:"first",i:"🦋"},{l:"We're together",v:"couple",i:"🔥"}
  ]};
  if (a.budget === "free") return null;

  // Focus options filtered by time of day — no dead ends
  if (!a.focus) {
    const isDay  = a.timeOfDay === "day";
    const isLate = a.timeOfDay === "late";
    const opts = isDay ? [
      {l:"Brunch",v:"brunch",i:"🥐"},
      {l:"Coffee & Matcha",v:"coffee",i:"☕"},
      {l:"Activity",v:"activity",i:"🎯"},
      {l:"Our Pick",v:"ourpick",i:"⭐"},
    ] : isLate ? [
      {l:"Food",v:"food",i:"🍽️"},
      {l:"Drinks",v:"drinks",i:"🍸"},
      {l:"Our Pick",v:"ourpick",i:"⭐"},
    ] : [
      {l:"Food",v:"food",i:"🍽️"},
      {l:"Drinks",v:"drinks",i:"🍸"},
      {l:"Food & Drinks",v:"fooddrinks",i:"🥂"},
      {l:"Activity",v:"activity",i:"🎯"},
      {l:"Happy Hour",v:"happyhour",i:"🎉"},
      {l:"Our Pick",v:"ourpick",i:"⭐"},
    ];
    return { id:"focus", emoji:"✨", q:"What's the plan?", opts };
  }

  if (a.focus === "brunch")     return null; // daytime brunch = go straight to results
  if (a.focus === "ourpick")    return null;
  if (a.focus === "drinks"     && !a.drinkType)     return { id:"drinkType",     emoji:"🍹", q:"What are you drinking?",  opts:DRINK_OPTS };
  if (a.focus === "food" && !a.foodType) {
    const nb = DB[a.neighborhood] || {};
    const food = nb.food || {};
    const filteredOpts = FOOD_OPTS.filter(o => {
      if (o.v === "brunch") return (food.brunch||[]).length > 0;
      if (o.v === "coffee") return (food.coffee||[]).length > 0;
      if (o.v === "korean" || o.v === "chinese") return (food.japanese||[]).some(s => String(s.type||"").toLowerCase().includes(o.v));
      if (o.v === "mexican" || o.v === "vegan") return (food.mediterranean||[]).some(s => String(s.type||"").toLowerCase().includes(o.v));
      if (o.v === "latenight") return (food.latenight||[]).length > 0;
      return (food[o.v]||[]).length > 0;
    });
    return { id:"foodType", emoji:"🍽️", q:"What are you feeling?", opts:filteredOpts };
  }
  if (a.focus === "fooddrinks" && !a.foodDrinkType)  return { id:"foodDrinkType", emoji:"🥂", q:"What kind of combo?",      opts:FOOD_DRINK_OPTS };
  if (a.focus === "activity" && !a.activityType) {
    const nb = DB[a.neighborhood] || {};
    const acts = nb.activities || {};
    const opts = [
      {l:"🌿 Outside",v:"outside",i:"🌿"},
      {l:"🎨 Creative",v:"creative",i:"🎨"},
      {l:"🎯 Competitive",v:"competitive",i:"🎯"},
      {l:"🎭 Shows",v:"shows",i:"🎭"},
      {l:"💪 Active",v:"active",i:"💪"},
    ].filter(o => o.v === "outside" ? (acts.free||[]).length > 0 : (acts[o.v]||[]).length > 0);
    return { id:"activityType", emoji:"🌟", q:"What kind of adventure?", opts };
  }
  return null;
};

const getSpots = (a) => {
  if (a.budget === "free") return (DB[a.neighborhood]?.activities?.free || []).slice(0, 6);
  const nb = DB[a.neighborhood] || DB.williamsburg;

  // Date type review filter — applied everywhere
  const dateOk = (spot) => {
    if (!spot.reviews) return true;
    const type = String(spot.type||spot.subtype||"").toLowerCase();
    const isCafe = type.includes("coffee") || type.includes("matcha") || type.includes("cafe") || type.includes("café");
    const isActivity = ["creative","competitive","active","shows","outside"].includes(type);
    if (a.dateType === "first")  return isCafe || isActivity ? spot.reviews >= 50 : spot.reviews >= 500;
    if (a.dateType === "couple") return spot.reviews <= 2000;
    return true;
  };

  // Happy hour — filter by date type
  if (a.focus === "happyhour") {
    let pool = [...(nb.happyHour || [])].filter(s => !s.stars || s.stars >= 4.0);
    if (a.dateType === "first") {
      const filtered = pool.filter(s => (!s.reviews || s.reviews >= 800) && (!s.stars || s.stars >= 4.3));
      if (filtered.length >= 2) pool = filtered;
    } else if (a.dateType === "couple") {
      const filtered = pool.filter(s => !s.reviews || s.reviews <= 1000);
      if (filtered.length >= 2) pool = filtered;
      else {
        // not enough hidden gems, take lowest review count spots
        pool = pool.sort((a,b) => (a.reviews||9999)-(b.reviews||9999));
      }
    }
    const _seen = new Set(); pool = pool.filter(s => { if (_seen.has(s.place)) return false; _seen.add(s.place); return true; }); return pool.slice(0, 6);
  }

  // ── BRUNCH SHORTCUT (daytime pick) — moved to after priceOk is defined below
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
    if (a.budget === "under100") return p === "$" || p === "$$";
    return true;
  };

  // ── BRUNCH SHORTCUT (daytime) ────────────────────────────────────────────────
  if (a.focus === "brunch") {
    let pool = [...(nb.food.brunch || nb.food.american || [])];
    const filtered = pool.filter(s => priceOk(s) && dateOk(s));
    if (filtered.length >= 2) pool = filtered;
    const _seen = new Set(); pool = pool.filter(s => { if (_seen.has(s.place)) return false; _seen.add(s.place); return true; }); return pool.slice(0, 6);
  }

  // ── COFFEE & MATCHA SHORTCUT ─────────────────────────────────────────────────
  if (a.focus === "coffee") {
    let pool = [...(nb.food.coffee || [])];
    const filtered = pool.filter(s => priceOk(s));
    if (filtered.length >= 1) pool = filtered;
    const _seen = new Set(); pool = pool.filter(s => { if (_seen.has(s.place)) return false; _seen.add(s.place); return true; }); return pool.slice(0, 6);
  }

  let pool = [];

  if (a.focus === "drinks") {
    pool = [...(nb.bars[a.drinkType] || nb.bars.cocktails)];
    if (a.vibe === "quiet") pool.sort((x,y) => gemScore(y.reviews) - gemScore(x.reviews));
    else pool.sort(() => Math.random() - 0.5);
  }

  if (a.focus === "food") {
    let key;
    const specificCuisine = ["korean","chinese","mexican","vegan","coffee"].includes(a.foodType);
    if (specificCuisine) {
      // Specific cuisine always goes to its bucket regardless of time
      if (a.foodType === "korean" || a.foodType === "chinese") key = "japanese";
      else if (a.foodType === "coffee") key = "coffee";
      else key = "mediterranean";
    } else if (a.foodType === "brunch" || a.timeOfDay === "day") {
      key = "brunch";
    } else if (a.timeOfDay === "late") {
      key = "latenight";
    } else {
      key = a.foodType || "american";
    }
    pool = [...(nb.food[key] || nb.food.american || [])];

    // Late night: filter ALL food pools to verified late spots only
    if (a.timeOfDay === "late") {
      const strictLate = pool.filter(s => {
        const t = String(s.type||"").toLowerCase();
        const d = String(s.desc||"").toLowerCase();
        return t.includes("late") || d.includes("late") || d.includes("2am") || d.includes("3am") || d.includes("4am") || d.includes("24") || s.latenight === true;
      });
      if (strictLate.length >= 1) pool = strictLate;
    }

    // Filter to matching cuisine type within the bucket
    if (["korean","chinese","mexican","vegan"].includes(a.foodType)) {
      const typed = pool.filter(s => {
        const t = String(s.type||"").toLowerCase();
        const n = String(s.place||"").toLowerCase();
        const combined = t + " " + n;
        if (a.foodType === "korean")  return combined.includes("korean") || combined.includes("kbbq");
        if (a.foodType === "chinese") return combined.includes("chinese") || combined.includes("sichuan") || combined.includes("dim sum") || combined.includes("cantonese") || combined.includes("szechuan");
        if (a.foodType === "mexican") return combined.includes("mexican") || combined.includes("taqueria") || combined.includes("mezcal") || combined.includes("taco") || combined.includes("latin");
        if (a.foodType === "vegan")   return combined.includes("vegan") || combined.includes("plant") || combined.includes("vegetarian");
        if (a.foodType === "coffee")  return combined.includes("coffee") || combined.includes("matcha") || combined.includes("cafe") || combined.includes("café");
        return true;
      });
      if (typed.length >= 2) pool = typed;
    }

    // If evening, exclude brunch-only spots
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
    const vibe = a.activityType;
    if (vibe === "outside") {
      pool = [...(nb.activities.free || [])];
    } else if (nb.activities[vibe]) {
      pool = [...(nb.activities[vibe] || [])];
    } else {
      pool = [...(nb.activities.paid || [])];
    }
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

  const _seen = new Set(); pool = pool.filter(s => { if (_seen.has(s.place)) return false; _seen.add(s.place); return true; }); return pool.slice(0, 6);
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
  bushwick: () => (
    <svg viewBox="0 0 240 60" style={{width:"100%",height:"52px",display:"block"}}>
      <defs><linearGradient id="bwbg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#e85d75" stopOpacity="1"/><stop offset="100%" stopColor="#c9a96e" stopOpacity="0.5"/></linearGradient><filter id="bwbf"><feGaussianBlur stdDeviation="0.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g fill="url(#bwbg)" filter="url(#bwbf)">
        <rect x="4" y="40" width="16" height="20"/><rect x="6" y="34" width="12" height="8"/>
        <rect x="24" y="30" width="18" height="30"/><rect x="26" y="22" width="14" height="10"/>
        <rect x="46" y="38" width="14" height="22"/><rect x="64" y="26" width="20" height="34"/>
        <rect x="66" y="18" width="16" height="10"/><rect x="88" y="42" width="12" height="18"/>
        <rect x="104" y="32" width="18" height="28"/><rect x="106" y="24" width="14" height="10"/>
        <rect x="126" y="44" width="12" height="16"/><rect x="142" y="28" width="20" height="32"/>
        <rect x="144" y="20" width="16" height="10"/><rect x="166" y="36" width="16" height="24"/>
        <rect x="186" y="24" width="18" height="36"/><rect x="188" y="16" width="14" height="10"/>
        <rect x="208" y="40" width="14" height="20"/><rect x="226" y="32" width="12" height="28"/>
      </g>
    </svg>
  ),
  fidi: () => (
    <svg viewBox="0 0 240 60" style={{width:"100%",height:"52px",display:"block"}}>
      <defs><linearGradient id="fidbg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#6b8bbd" stopOpacity="1"/><stop offset="100%" stopColor="#c9a96e" stopOpacity="0.5"/></linearGradient><filter id="fidbf"><feGaussianBlur stdDeviation="0.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g fill="url(#fidbg)" filter="url(#fidbf)">
        <rect x="4" y="32" width="16" height="28"/><rect x="6" y="24" width="12" height="10"/>
        <rect x="24" y="18" width="20" height="42"/><rect x="26" y="10" width="16" height="10"/><rect x="30" y="4" width="8" height="8"/>
        <rect x="48" y="28" width="16" height="32"/><rect x="68" y="14" width="22" height="46"/>
        <rect x="70" y="6" width="18" height="10"/><rect x="74" y="0" width="10" height="8"/>
        <rect x="94" y="24" width="16" height="36"/><rect x="114" y="16" width="20" height="44"/>
        <rect x="116" y="8" width="16" height="10"/><rect x="138" y="30" width="16" height="30"/>
        <rect x="158" y="12" width="22" height="48"/><rect x="160" y="4" width="18" height="10"/>
        <rect x="184" y="22" width="16" height="38"/><rect x="204" y="10" width="20" height="50"/>
        <rect x="206" y="2" width="16" height="10"/><rect x="228" y="28" width="10" height="32"/>
      </g>
    </svg>
  ),
  upper_east: () => (
    <svg viewBox="0 0 240 60" style={{width:"100%",height:"52px",display:"block"}}>
      <defs><linearGradient id="uebg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#9b6b9b" stopOpacity="1"/><stop offset="100%" stopColor="#c9a96e" stopOpacity="0.5"/></linearGradient><filter id="uebf"><feGaussianBlur stdDeviation="0.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g fill="url(#uebg)" filter="url(#uebf)">
        {[0,1,2,3,4,5,6,7,8,9].map(i => {
          const x=4+i*24, h=[24,28,22,30,26,24,28,22,26,24][i], w=18;
          return <g key={i}>
            <rect x={x} y={60-h} width={w} height={h}/>
            <rect x={x+2} y={60-h-6} width={w-4} height={6}/>
          </g>;
        })}
      </g>
    </svg>
  ),
  upper_west: () => (
    <svg viewBox="0 0 240 60" style={{width:"100%",height:"52px",display:"block"}}>
      <defs><linearGradient id="uwbg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#6b9b8b" stopOpacity="1"/><stop offset="100%" stopColor="#c9a96e" stopOpacity="0.5"/></linearGradient><filter id="uwbf"><feGaussianBlur stdDeviation="0.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g fill="url(#uwbg)" filter="url(#uwbf)">
        {[0,1,2,3,4,5,6,7,8,9].map(i => {
          const x=4+i*24, h=[22,26,24,28,22,26,24,28,22,26][i], w=18;
          return <g key={i}>
            <path d={`M${x},60 L${x},${60-h} Q${x+w/2},${60-h-5} ${x+w},${60-h} L${x+w},60 Z`}/>
          </g>;
        })}
        <rect x="0" y="52" width="240" height="4" opacity="0.2"/>
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
  food: { brunch:"🥐", coffee:"☕", japanese:"🍣", korean:"🥩", chinese:"🥢", pasta:"🍝", pizza:"🍕", mediterranean:"🥙", mexican:"🌮", vegan:"🌿", american:"🥩", latenight:"🌙", default:"🍽️" },
  drinks: { cocktails:"🍸", beer:"🍺", wine:"🍷", experimental:"🧪", speakeasy:"🕯️", default:"🥂" },
  fooddrinks: { dinner_cocktails:"🍸", wine_plates:"🍷", brunch_drinks:"🥂", late_bites:"🌙", default:"🥂" },
  activity: { outside:"🌿", creative:"🎨", competitive:"🎯", shows:"🎭", active:"💪", default:"✨" },
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
  const nbAccent = {williamsburg:"#c9a96e",east_village:"#9b6b9b",west_village:"#6b9b8b",midtown:"#ff8c42",lic:"#c9a96e",bushwick:"#e85d75",fidi:"#6b8bbd",upper_east:"#9b6b9b",upper_west:"#6b9b8b"}[neighborhood] || T.accent;

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
                {idx === 0 ? "Plan Our Night ✦" : `Pick ${idx + 1} of ${spots.length}`}
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
            {idx === 0 ? "Plan Our Night ✦" : `Pick ${idx + 1} of ${spots.length}`}
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
            {idx === 0 ? "Plan Our Night ✦" : `Pick ${idx + 1} of ${spots.length}`}
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
    if (answers.budget === "free") return answers.dateType === "first" ? "Free First Date Ideas" : "Free Date Ideas";
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
              Party of<br/>
              <span style={{background:`linear-gradient(135deg,${T.accent},${T.accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Two</span>
            </h1>
            <div style={{width:"36px",height:"1px",background:`linear-gradient(90deg,${T.accent},${T.accent2})`,margin:"14px auto"}}/>
            <p style={{color:T.sub,fontSize:"13px",lineHeight:1.7,fontFamily:"sans-serif",marginBottom:"16px",opacity:0.85}}>The right place.<br/>Tonight.</p>
            <a href="https://instagram.com/partyof2nyc" target="_blank" rel="noopener noreferrer"
              style={{display:"inline-block",fontSize:"11px",color:T.accent,fontFamily:"sans-serif",letterSpacing:"1px",textDecoration:"none",marginBottom:"24px",opacity:0.7,transition:"opacity 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity="1"}
              onMouseLeave={e=>e.currentTarget.style.opacity="0.7"}>
              @partyof2nyc
            </a>
            <button onClick={()=>{setScreen("quiz");setCurrentQ(getQuestion({}));}}
              style={{background:`linear-gradient(135deg,${T.accent},${T.accent2})`,border:"none",color:T.bg,padding:"14px 42px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"800",letterSpacing:"3px",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px",transition:"all 0.2s",display:"block",margin:"0 auto"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow=`0 10px 36px ${T.accent}44`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="none";}}>
              Plan Our Night
            </button>
            <button onClick={()=>{setAnswers({focus:"ourpick",timeOfDay:"evening"});setCurrentQ({id:"neighborhood",special:"neighborhood"});setScreen("quiz");}}
              style={{background:"transparent",border:`1px solid ${T.accent}44`,color:T.accent,padding:"11px 28px",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"600",letterSpacing:"2.5px",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px",transition:"all 0.2s",display:"block",margin:"12px auto 0"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.background=`${T.accent}11`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=`${T.accent}44`;e.currentTarget.style.background="transparent";}}>
              ⭐ Tonight's Pick
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
                  {NEIGHBORHOODS.slice(0,8).map(nb=>{
                    const SilSvg = NB_SILHOUETTES[nb.id];
                    const acc = {williamsburg:"#c9a96e",east_village:"#9b6b9b",west_village:"#6b9b8b",midtown:"#ff8c42",lic:"#c9a96e",bushwick:"#e85d75",fidi:"#6b8bbd",upper_east:"#9b6b9b",upper_west:"#6b9b8b"}[nb.id]||T.accent;
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
                    const nb = NEIGHBORHOODS[8];
                    const SilSvg = NB_SILHOUETTES[nb.id];
                    const acc = {williamsburg:"#c9a96e",east_village:"#9b6b9b",west_village:"#6b9b8b",midtown:"#ff8c42",lic:"#c9a96e",bushwick:"#e85d75",fidi:"#6b8bbd",upper_east:"#9b6b9b",upper_west:"#6b9b8b"}[nb.id] || "#c9a96e";
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
              {questionHistory.length > 0 && (
              <button onClick={goBack}
                style={{background:"transparent",border:"none",color:T.accent,fontSize:"11px",fontFamily:"sans-serif",cursor:"pointer",letterSpacing:"1px",transition:"opacity 0.15s",padding:"0",opacity:0.85}}
                onMouseEnter={e=>e.currentTarget.style.opacity="1"}
                onMouseLeave={e=>e.currentTarget.style.opacity="0.85"}>
                ← back
              </button>
              )}
              <button onClick={reset}
                style={{background:"transparent",border:"none",color:T.accent,fontSize:"10px",fontFamily:"sans-serif",cursor:"pointer",letterSpacing:"1px",transition:"opacity 0.15s",padding:"0",opacity:0.85}}
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
            <div style={{fontSize:"11px",letterSpacing:"4px",textTransform:"uppercase",color:T.accent,fontFamily:"sans-serif"}}>Finding your spot...</div>
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
                onClick={()=>{
                  const url = "https://partyof2nyc.com";
                  const text = `Tonight's pick in ${nbLabel}: ${results[0]?.place || "a great spot"} 🍽️`;
                  if (navigator.share) {
                    navigator.share({title:"Plan Our Night", text, url}).catch(()=>{});
                  } else {
                    try { navigator.clipboard.writeText(url); alert("Link copied! Paste into your Instagram story."); }
                    catch(e) { alert("Share link: " + url); }
                  }
                }}>
                📲 Share
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
