import { useState, useRef } from "react";

const T = { bg:"#07070f", accent:"#c9a96e", accent2:"#9b6b9b", text:"#f0ece3", sub:"#6a5f52", border:"rgba(255,255,255,0.07)", card:"rgba(255,255,255,0.025)" };
const accentAt = (i) => [T.accent, T.accent2, "#6b9b8b", "#ff8c42", "#ff6b6b"][i % 5];

// Hidden gem score: <100 reviews = 10, <500 = 8, <2000 = 6, <5000 = 4, 5000+ = 2
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

// ─── SPOT DATABASE ────────────────────────────────────────────────────────────
// reviews = approximate Google Maps review count (used for gem score)
// booking = reservation URL (if exists) — maps link always shown too
// closed spots removed: Pegu Club, Spotted Pig, Slowly Shirley, Extra Fancy,
//   Spritzenhaus, Fatty Cue, Back Forty, Pouring Ribbons, Mayahuel, DBGB,
//   Resto, Hearth, Sik Gaek, Radegast Hall, Whiskey Brooklyn

const DB = {
  williamsburg: {
    bars: {
      cocktails: [
        { id:"wc1", emoji:"🍸", place:"Maison Premiere", type:"New Orleans Cocktail Bar", desc:"Candlelit, oysters, absinthe. The best date bar in Brooklyn, full stop.", booking:"maisonpremiere.com", maps:"Maison+Premiere+Williamsburg+Brooklyn", reviews:4800 },
        { id:"wc2", emoji:"🔪", place:"Fresh Kills Bar", type:"No-Menu Cocktail Bar", desc:"Bartender builds something bespoke after asking a few questions. No menu, all vibes.", booking:null, maps:"Fresh+Kills+Bar+Williamsburg+Brooklyn", reviews:620 },
        { id:"wc3", emoji:"🐈", place:"Deux Chats", type:"French Cocktail Bar", desc:"Oysters, martinis, dark wood, emerald tiles. Quiet and sophisticated.", booking:null, maps:"Deux+Chats+Williamsburg+Brooklyn", reviews:380 },
        { id:"wc4", emoji:"🌊", place:"The Hidden Pearl", type:"Japanese Speakeasy", desc:"Hidden behind a ramen shop. Navy blue, brass fixtures, yuzu cocktails, 20 guests max.", booking:null, maps:"The+Hidden+Pearl+Williamsburg+Brooklyn", reviews:210 },
      ],
      beer: [
        { id:"wb1", emoji:"🍺", place:"Turkey's Nest", type:"Dive Bar", desc:"Margaritas in Styrofoam cups, cash only, fiercely local. A true Williamsburg relic.", booking:null, maps:"Turkeys+Nest+Williamsburg+Brooklyn", reviews:1800 },
        { id:"wb2", emoji:"🎸", place:"Skinny Dennis", type:"Honky-Tonk Bar", desc:"Country music, frozen coffee in Greek cups, happy hour noon to 7pm daily.", booking:null, maps:"Skinny+Dennis+Williamsburg+Brooklyn", reviews:1400 },
        { id:"wb3", emoji:"🎱", place:"The Commodore", type:"Dive Bar", desc:"Frozen pina coladas, pinball, fried chicken sandwich. The Brooklyn dive experience.", booking:null, maps:"The+Commodore+Williamsburg+Brooklyn", reviews:2200 },
        { id:"wb4", emoji:"🎤", place:"Pete's Candy Store", type:"Dive + Live Music", desc:"Classic dive with a back room for comedy and live music. Cash, cheap, classic.", booking:null, maps:"Petes+Candy+Store+Williamsburg+Brooklyn", reviews:1600 },
      ],
      wine: [
        { id:"ww1", emoji:"🍷", place:"Four Horsemen", type:"Natural Wine Bar", desc:"James Murphy's place. Incredible list, sounds like a good record collection.", booking:"fourhorsemenbk.com", maps:"Four+Horsemen+Williamsburg+Brooklyn", reviews:1900 },
        { id:"ww2", emoji:"🫙", place:"Sauced", type:"No-Menu Wine Bar", desc:"Tell them what you like, they bring something delicious. No menu, all trust.", booking:null, maps:"Sauced+Wine+Bar+Williamsburg+Brooklyn", reviews:290 },
        { id:"ww3", emoji:"🌿", place:"Bar Blondeau", type:"French Wine Bar", desc:"Sixth floor of the Wythe Hotel. Natural wine, Manhattan views, green velvet banquettes.", booking:"barblondeau.com", maps:"Bar+Blondeau+Wythe+Hotel+Williamsburg+Brooklyn", reviews:1100 },
        { id:"ww4", emoji:"🎵", place:"Nightmoves", type:"Wine + Dance Bar", desc:"From the Four Horsemen team. Great wine, actual dancefloor. Instant hit.", booking:null, maps:"Nightmoves+Bar+Williamsburg+Brooklyn", reviews:480 },
      ],
      experimental: [
        { id:"we1", emoji:"🌴", place:"Layla", type:"Tropical Cocktail Bar", desc:"Every table is a date. Order the Layla's Juice. Backyard is the move.", booking:null, maps:"Layla+Bar+Williamsburg+Brooklyn", reviews:680 },
        { id:"we2", emoji:"🌿", place:"Brooklyn Greens", type:"Golf Simulator + Bar", desc:"Part golf sim, part coffee, part pub. Plant-filled oasis with immaculate vibes.", booking:"brooklyngreens.com", maps:"Brooklyn+Greens+Williamsburg+Brooklyn", reviews:340 },
        { id:"we3", emoji:"🌮", place:"320 Club", type:"Hidden Speakeasy", desc:"Hidden behind Super Burrito. 70s-inspired, Mexican cocktails, order a Paloma with your quesadilla.", booking:null, maps:"320+Club+Williamsburg+Brooklyn", reviews:180 },
        { id:"we4", emoji:"🍹", place:"Milagro", type:"Agave Cocktail Bar", desc:"New and already packed. Mezcal negronis, tequila old fashioneds, great margaritas.", booking:null, maps:"Milagro+Bar+Williamsburg+Brooklyn", reviews:220 },
      ],
      speakeasy: [
        { id:"ws1", emoji:"🕯️", place:"The Hidden Pearl", type:"Japanese Hidden Bar", desc:"No sign. Enter through the back of a ramen restaurant. The real deal.", booking:null, maps:"The+Hidden+Pearl+Williamsburg+Brooklyn", reviews:210 },
        { id:"ws2", emoji:"🌮", place:"320 Club", type:"Speakeasy Behind a Burrito Shop", desc:"The secret bar behind Super Burrito on Bedford. Order fast food with your cocktail.", booking:null, maps:"320+Club+Williamsburg+Brooklyn", reviews:180 },
        { id:"ws3", emoji:"🎷", place:"Lucey's Lounge", type:"Hidden Jazz Bar", desc:"Blink and miss the entrance. Late-night jazz, zero tourists.", booking:null, maps:"Luceys+Lounge+Williamsburg+Brooklyn", reviews:88 },
        { id:"ws4", emoji:"🍸", place:"Fresh Kills Bar", type:"No-Menu Secret Bar", desc:"On a quiet stretch of Grand St. No sign, no menu, bespoke drinks only.", booking:null, maps:"Fresh+Kills+Bar+Williamsburg+Brooklyn", reviews:620 },
      ],
    },
    food: {
      japanese: [
        { id:"wj1", emoji:"🍣", place:"Zizi Limona", type:"Japanese-Israeli Fusion", desc:"Hummus meets yakitori. One of Williamsburg's best kept secrets.", booking:null, maps:"Zizi+Limona+Williamsburg+Brooklyn", reviews:290 },
        { id:"wj2", emoji:"🍜", place:"Kru", type:"Modern Thai", desc:"Century-old Thai recipes reinterpreted. The beef tongue curry is a revelation.", booking:"krubk.com", maps:"Kru+Restaurant+Williamsburg+Brooklyn", reviews:680 },
        { id:"wj3", emoji:"🥢", place:"Okonomi", type:"Japanese Counter", desc:"12-seat counter, donburi and seasonal Japanese. Quiet and perfect.", booking:null, maps:"Okonomi+Williamsburg+Brooklyn", reviews:620 },
        { id:"wj4", emoji:"🌿", place:"Ren", type:"Modern Sichuan", desc:"Cozy minimalist spot, well-priced dim sum and chili-slicked dishes.", booking:null, maps:"Ren+Restaurant+Williamsburg+Brooklyn", reviews:340 },
      ],
      pasta: [
        { id:"wp1", emoji:"🍝", place:"Lilia", type:"Italian", desc:"Missy Robbins' masterpiece. The malfadine with pink peppercorns.", booking:"lilianewyork.com", maps:"Lilia+Williamsburg+Brooklyn", reviews:6200 },
        { id:"wp2", emoji:"🦆", place:"I Cavallini", type:"Italian", desc:"Nearly impossible to get into. Duck-focused, Michelin-starred. Worth the wait.", booking:"icavallini.com", maps:"I+Cavallini+Williamsburg+Brooklyn", reviews:820 },
        { id:"wp3", emoji:"🌿", place:"Allegretto", type:"Neapolitan", desc:"New from the Francie team. Wood-fired oven, fried bucatini, Southern Italian snacks.", booking:null, maps:"Allegretto+Williamsburg+Brooklyn", reviews:180 },
        { id:"wp4", emoji:"🥂", place:"Le Crocodile", type:"French Bistro", desc:"In the Wythe Hotel. Steak frites and martinis in a beautiful room.", booking:"lecrocodilenyc.com", maps:"Le+Crocodile+Wythe+Hotel+Williamsburg+Brooklyn", reviews:2800 },
      ],
      pizza: [
        { id:"wpz1", emoji:"🍕", place:"L'Industrie", type:"Roman Slice", desc:"Incredibly thin crust, Italian-imported toppings, long-fermented dough. New standard.", booking:null, maps:"LIndustrie+Pizzeria+Williamsburg+Brooklyn", reviews:3200 },
        { id:"wpz2", emoji:"🔥", place:"Roberta's", type:"Wood-Fired Pizza", desc:"Legendary converted warehouse pizza. Always fun, always good.", booking:"robertaspizza.com", maps:"Robertas+Pizza+Williamsburg+Brooklyn", reviews:9400 },
        { id:"wpz3", emoji:"🫙", place:"Paulie Gee's", type:"Wood-Fired Pizza", desc:"The Hellboy with honey and hot sausage is the only order.", booking:"pauliegee.com", maps:"Paulie+Gees+Williamsburg+Brooklyn", reviews:3800 },
        { id:"wpz4", emoji:"🌿", place:"Emmy Squared", type:"Detroit-Style Pizza", desc:"The Detroit-style flagship. Long lines for a reason.", booking:"emmysquaredpizza.com", maps:"Emmy+Squared+Williamsburg+Brooklyn", reviews:4100 },
      ],
      mediterranean: [
        { id:"wme1", emoji:"🐟", place:"Psaraki", type:"Greek Seafood", desc:"Seaside taverna vibes with Williamsburg Bridge views. Little fish, big flavors.", booking:"psarakinyc.com", maps:"Psaraki+Williamsburg+Brooklyn", reviews:480 },
        { id:"wme2", emoji:"🌺", place:"Llama Inn", type:"Peruvian", desc:"Plant-filled room, creative Peruvian, great cocktails. The ceviche is outstanding.", booking:"llamainnnyc.com", maps:"Llama+Inn+Williamsburg+Brooklyn", reviews:2400 },
        { id:"wme3", emoji:"🌿", place:"Fandi Mata", type:"Mediterranean-Mezcaleria", desc:"Global Mediterranean cuisine meets artisanal mezcal. Warm and escapist.", booking:"fandimata.com", maps:"Fandi+Mata+Williamsburg+Brooklyn", reviews:620 },
        { id:"wme4", emoji:"🥬", place:"The Butcher's Daughter", type:"Vegetarian", desc:"Plant-forward all-day cafe near Domino Park. Fresh, seasonal, great natural wine.", booking:null, maps:"The+Butchers+Daughter+Williamsburg+Brooklyn", reviews:3800 },
      ],
      american: [
        { id:"wa1", emoji:"🥩", place:"St. Anselm", type:"Steakhouse", desc:"Hanger steak in a wood-paneled room. Best steak-for-price in Brooklyn.", booking:"stanselmbk.com", maps:"St+Anselm+Williamsburg+Brooklyn", reviews:3800 },
        { id:"wa2", emoji:"🍖", place:"Fette Sau", type:"BBQ", desc:"Central Texas meets NYC. Peppery brisket, half-sour pickles, picnic tables.", booking:null, maps:"Fette+Sau+BBQ+Williamsburg+Brooklyn", reviews:4200 },
        { id:"wa3", emoji:"🌊", place:"The Sparrow", type:"Throwback Brasserie", desc:"Historic building near the bridge. Dress up, get the shrimp cocktail and steak frites.", booking:"thesparrowbk.com", maps:"The+Sparrow+Williamsburg+Brooklyn", reviews:580 },
        { id:"wa4", emoji:"🥜", place:"Marlow and Sons", type:"Seasonal American", desc:"Oyster bar up front, great pasta back. One of Brooklyn's finest rooms.", booking:"marlowandsons.com", maps:"Marlow+and+Sons+Williamsburg+Brooklyn", reviews:1600 },
      ],
      brunch: [
        { id:"wbr1", emoji:"🥞", place:"Sunday in Brooklyn", type:"Brunch", desc:"Three-story stunner. The malted pancakes are everything they say they are.", booking:"sundayinbrooklyn.com", maps:"Sunday+in+Brooklyn+Williamsburg", reviews:2600 },
        { id:"wbr2", emoji:"🥚", place:"Egg", type:"Southern Brunch", desc:"The Williamsburg brunch institution. Farm-to-table, always a line, always worth it.", booking:null, maps:"Egg+Restaurant+Williamsburg+Brooklyn", reviews:3200 },
        { id:"wbr3", emoji:"🌺", place:"Isla and Co", type:"All-Day Australian Brunch", desc:"New all-day brunch on Grand St. Kimchi scramble, pulled pork hash, great coffee.", booking:"islaandco.com", maps:"Isla+and+Co+Williamsburg+Brooklyn", reviews:280 },
        { id:"wbr4", emoji:"🥐", place:"Reynard", type:"Hotel Brunch", desc:"Weekend brunch at the Wythe. Beautiful room, unhurried, no reason to leave.", booking:"reynardnyc.com", maps:"Reynard+Restaurant+Wythe+Hotel+Brooklyn", reviews:2100 },
      ],
      latenight: [
        { id:"wln1", emoji:"🥟", place:"Veselka Williamsburg", type:"24hr Ukrainian Diner", desc:"The EV institution now in Williamsburg. Pierogies and borscht at 3am.", booking:null, maps:"Veselka+Williamsburg+Brooklyn", reviews:680 },
        { id:"wln2", emoji:"🍕", place:"L'Industrie Late", type:"Late Night Slice", desc:"Open late. Best slice in the neighborhood, period.", booking:null, maps:"LIndustrie+Pizzeria+Williamsburg+Brooklyn", reviews:3200 },
        { id:"wln3", emoji:"🫕", place:"St. Anselm Late", type:"Late Night Steak", desc:"Late seatings on weekends. Hanger steak at midnight hits different.", booking:"stanselmbk.com", maps:"St+Anselm+Williamsburg+Brooklyn", reviews:3800 },
        { id:"wln4", emoji:"🌮", place:"Birria-Landia", type:"Late Night Tacos", desc:"The birria taco truck. Bring cash, join the line, zero regrets.", booking:null, maps:"Birria+Landia+Williamsburg+Brooklyn", reviews:2800 },
      ],
    },
    activities: {
      free: [
        { id:"waf1", emoji:"🌊", place:"East River State Park", type:"Waterfront", desc:"Sit on the rocks with Manhattan glowing across the water. Completely free.", maps:"East+River+State+Park+Williamsburg+Brooklyn", reviews:3800 },
        { id:"waf2", emoji:"🌅", place:"Domino Park", type:"Waterfront Walk", desc:"Walk the waterfront with incredible skyline views. Best people watching in Brooklyn.", maps:"Domino+Park+Williamsburg+Brooklyn", reviews:6800 },
        { id:"waf3", emoji:"🎨", place:"Williamsburg Mural Walk", type:"Street Art", desc:"Some of NYC's best murals. Walk and discover together.", maps:"Williamsburg+Brooklyn+Murals", reviews:null },
        { id:"waf4", emoji:"🌉", place:"Williamsburg Bridge Walk", type:"Night Walk", desc:"Walk the bridge at night for epic Manhattan views. Go slow.", maps:"Williamsburg+Bridge+Brooklyn", reviews:5200 },
      ],
      paid: [
        { id:"wap1", emoji:"🎳", place:"Brooklyn Bowl", type:"Bowling + Live Music", desc:"Lanes, food, drinks, live music all in one. The easiest yes for any date.", booking:"brooklynbowl.com", maps:"Brooklyn+Bowl+Williamsburg", reviews:5200 },
        { id:"wap2", emoji:"📽️", place:"Nitehawk Cinema", type:"Dine-in Movie", desc:"Order cocktails and food to your seat. Takes all first-date pressure off.", booking:"nitehawkcinema.com", maps:"Nitehawk+Cinema+Williamsburg+Brooklyn", reviews:3600 },
        { id:"wap3", emoji:"⛳", place:"Brooklyn Greens", type:"Golf Simulator", desc:"Golf sim, cocktails, plant-filled space. Surprisingly great date activity.", booking:"brooklyngreens.com", maps:"Brooklyn+Greens+Williamsburg+Brooklyn", reviews:340 },
        { id:"wap4", emoji:"🎪", place:"House of Yes", type:"Themed Experience", desc:"Circus performers, themed nights. Nothing else like it in NYC.", booking:"houseofyes.org", maps:"House+of+Yes+Williamsburg+Brooklyn", reviews:4100 },
      ],
    },
    happyHour: [
      { id:"whh1", emoji:"🍺", place:"Skinny Dennis", type:"Honky-Tonk Bar", desc:"Happy hour noon to 7pm daily. $6 beers, frozen drinks in Greek cups.", deal:"$6 beers + frozen drinks", hours:"Daily noon-7pm", booking:null, maps:"Skinny+Dennis+Williamsburg+Brooklyn", reviews:1400 },
      { id:"whh2", emoji:"🍷", place:"Marlow and Sons", type:"Wine Bar", desc:"$1 oysters and $8 wines. Go early, seats fill fast.", deal:"$1 oysters + $8 wine", hours:"Mon-Fri 5-6pm", booking:null, maps:"Marlow+and+Sons+Williamsburg+Brooklyn", reviews:1600 },
      { id:"whh3", emoji:"🍸", place:"Hotel Delmano", type:"Cocktail Bar", desc:"$10 cocktails and $6 beers in Williamsburg's most atmospheric bar.", deal:"$10 cocktails + $6 beer", hours:"Tue-Fri 5-7pm", booking:null, maps:"Hotel+Delmano+Williamsburg+Brooklyn", reviews:1100 },
      { id:"whh4", emoji:"🌿", place:"Four Horsemen", type:"Natural Wine Bar", desc:"$10 wines by the glass during early hours. Get there before it fills up.", deal:"$10 wine by glass", hours:"Tue-Thu 5-6pm", booking:"fourhorsemenbk.com", maps:"Four+Horsemen+Williamsburg+Brooklyn", reviews:1900 },
    ],
  },
  west_village: {
    bars: {
      cocktails: [
        { id:"wvc1", emoji:"🍸", place:"Little Branch", type:"Speakeasy", desc:"Unmarked door on 7th Ave South. Underground jazz, pitch-black, perfect cocktails. First come, first served.", booking:null, maps:"Little+Branch+West+Village+NYC", reviews:1800 },
        { id:"wvc2", emoji:"🌿", place:"Katana Kitten", type:"Japanese Cocktail Bar", desc:"World-ranked Japanese bar. Salted plum, pandan, matcha cocktails. Shiso-lined gin and tonic is the move.", booking:"katanakittennyc.com", maps:"Katana+Kitten+West+Village+NYC", reviews:2400 },
        { id:"wvc3", emoji:"🌶️", place:"Mace", type:"Spice-Forward Bar", desc:"World's 50 Best Bars for 6 years running. Every drink built around a specific herb or spice. Bohemian and brilliant.", booking:"macenewyork.com", maps:"Mace+Bar+West+Village+NYC", reviews:680 },
        { id:"wvc4", emoji:"🌺", place:"Donna", type:"Latin Cocktail Bar", desc:"Worker-owned, tropical, White brick walls, pink banquettes. Best frozen piña colada in the neighborhood.", booking:null, maps:"Donna+Bar+West+Village+NYC", reviews:420 },
      ],
      beer: [
        { id:"wvb1", emoji:"🍺", place:"Corner Bistro", type:"Dive Bar", desc:"Open since the '60s. $5 beers, the most debated burger in NYC. Cash only, always packed.", booking:null, maps:"Corner+Bistro+West+Village+NYC", reviews:4200 },
        { id:"wvb2", emoji:"🐎", place:"White Horse Tavern", type:"Historic Pub", desc:"Second-oldest pub in NYC. Dylan Thomas, Kerouac, Baldwin all drank here. Still a neighborhood bar.", booking:null, maps:"White+Horse+Tavern+West+Village+NYC", reviews:3800 },
        { id:"wvb3", emoji:"🌿", place:"Blind Tiger", type:"Craft Beer Bar", desc:"Bleecker St craft beer institution. Rotating taps, mostly NY and New England breweries.", booking:null, maps:"Blind+Tiger+West+Village+NYC", reviews:2200 },
        { id:"wvb4", emoji:"📚", place:"Hudson Bar and Books", type:"Cigar & Whiskey Bar", desc:"Dark bookshelves, copper bar, 1930s vibe. Whiskey, cigars, zero pretension. Civilized drinking.", booking:null, maps:"Hudson+Bar+and+Books+West+Village+NYC", reviews:680 },
      ],
      wine: [
        { id:"wvw1", emoji:"🍷", place:"Amelie Wine Bar", type:"French Wine Bar", desc:"Parisian candlelit cellar. Extensive list, rustic decor, perfect for lingering over a bottle.", booking:"amelienyc.com", maps:"Amelie+Wine+Bar+West+Village+NYC", reviews:1400 },
        { id:"wvw2", emoji:"🌿", place:"St. Jardim", type:"Natural Wine Bar", desc:"Your living room — magazine rack, record player, walls of low-intervention wine. No attitude.", booking:null, maps:"St+Jardim+West+Village+NYC", reviews:380 },
        { id:"wvw3", emoji:"🫙", place:"Binx", type:"Natural Wine Bar", desc:"Newest and cutest. Pastel murals, fuzzy bar stools, disco ball. French, Italian, and wild-card pours.", booking:null, maps:"Binx+Wine+Bar+West+Village+NYC", reviews:290 },
        { id:"wvw4", emoji:"🇵🇹", place:"Leitao", type:"Portuguese Wine Bar", desc:"Cervejaria-style with a concise, well-chosen wine list. Tiger shrimp, bacalhau, pastel de nata.", booking:"leitaonyc.com", maps:"Leitao+West+Village+NYC", reviews:520 },
      ],
      experimental: [
        { id:"wve1", emoji:"🎬", place:"The Garret West", type:"Hidden Bar Above Five Guys", desc:"Walk through Five Guys, climb the stairs. Fireplace, skylights, booths. One of NYC's best hidden bars.", booking:null, maps:"The+Garret+West+Village+NYC", reviews:1100 },
        { id:"wve2", emoji:"🍣", place:"Sip & Guzzle", type:"Bi-Level Japanese Cocktail Bar", desc:"Upstairs lounge (Sip) + casual bar (Guzzle). Shochu-yogurt drinks, cheese mochi fries, wagyu sando.", booking:"sipandguzzle.com", maps:"Sip+and+Guzzle+West+Village+NYC", reviews:580 },
        { id:"wve3", emoji:"🚂", place:"Orient Express Bar", type:"Vintage Train Cocktail Bar", desc:"Beech wood panels, faux train windows, brass luggage racks. Bartenders in vests. Deeply romantic.", booking:"orientexpressbar.com", maps:"Orient+Express+Bar+West+Village+NYC", reviews:640 },
        { id:"wve4", emoji:"🌿", place:"Angel's Share", type:"Japanese Speakeasy", desc:"Grove Street descendant of the EV original. Ornate wallpaper, whisky with coconut water and curry powder.", booking:null, maps:"Angels+Share+West+Village+NYC", reviews:480 },
      ],
      speakeasy: [
        { id:"wvs1", emoji:"🕯️", place:"Little Branch", type:"Underground Speakeasy", desc:"Unmarked door, stairs down, jazz, darkness, perfect drinks. The real deal. First come, first served.", booking:null, maps:"Little+Branch+West+Village+NYC", reviews:1800 },
        { id:"wvs2", emoji:"🚂", place:"Orient Express Bar", type:"Hidden Train Bar", desc:"No obvious sign. Enter through a door on a quiet block and step onto the Orient Express.", booking:"orientexpressbar.com", maps:"Orient+Express+Bar+West+Village+NYC", reviews:640 },
        { id:"wvs3", emoji:"🍔", place:"The Garret West", type:"Hidden Bar Above Burger Joint", desc:"Access through Five Guys. Fireplace, cozy booths, skylights. A secret hiding in plain sight.", booking:null, maps:"The+Garret+West+Village+NYC", reviews:1100 },
        { id:"wvs4", emoji:"🌿", place:"Angel's Share", type:"Japanese Hidden Bar", desc:"Quiet Grove St entrance. No bar-only seating — you must be seated. Elegant and worth the rules.", booking:null, maps:"Angels+Share+West+Village+NYC", reviews:480 },
      ],
    },
    food: {
      japanese: [
        { id:"wvj1", emoji:"🍣", place:"Sushi Nakazawa", type:"Omakase", desc:"Four-star NYT review. 20-piece nigiri omakase. One of the best sushi experiences in the city.", booking:"sushinakazawa.com", maps:"Sushi+Nakazawa+West+Village+NYC", reviews:2800 },
        { id:"wvj2", emoji:"🍜", place:"Sép", type:"Isan Thai", desc:"Electric Isan Thai on 14th St. Duck laarb, wing zaab, fiery skewers. Neon lights and mirrored ceiling.", booking:"sepnyc.com", maps:"Sep+Restaurant+West+Village+NYC", reviews:480 },
        { id:"wvj3", emoji:"🍺", place:"Moody Tongue Sushi", type:"Beer-Paired Sushi", desc:"High-end craft beers paired with excellent sushi. Large bar, usually seats available. Genuinely unique.", booking:"moodytongue.com", maps:"Moody+Tongue+Sushi+West+Village+NYC", reviews:340 },
        { id:"wvj4", emoji:"🌊", place:"Fish Cheeks", type:"Thai Seafood", desc:"Modern Thai seafood. Coconut crab curry and Bangkok wings are the moves. Always packed.", booking:"fishcheeksnyc.com", maps:"Fish+Cheeks+West+Village+NYC", reviews:3200 },
      ],
      pasta: [
        { id:"wvp1", emoji:"🍝", place:"I Sodi", type:"Tuscan Italian", desc:"Impossible to get into for good reason. Pappardelle al limone in a faux-farmhouse room. Bar walk-ins available.", booking:"isodinyc.com", maps:"I+Sodi+West+Village+NYC", reviews:1800 },
        { id:"wvp2", emoji:"🥩", place:"Don Angie", type:"Italian-American", desc:"Rolled lasagna for two, provolone gnocchi, garlic flatbread. One of NYC's top Italian restaurants.", booking:"donangie.com", maps:"Don+Angie+West+Village+NYC", reviews:3400 },
        { id:"wvp3", emoji:"🌿", place:"Malaparte", type:"Italian", desc:"Dark brick, 100-year-old floors, walk-in friendly. Rigatoni, prosciutto pizza, grilled branzino.", booking:null, maps:"Malaparte+West+Village+NYC", reviews:820 },
        { id:"wvp4", emoji:"🕯️", place:"Palma", type:"Organic Italian", desc:"Hidden garden and 200-year-old carriage house. Family recipes, housemade pasta, ivy-covered walls.", booking:"palmanyc.com", maps:"Palma+Restaurant+West+Village+NYC", reviews:1100 },
      ],
      pizza: [
        { id:"wvpz1", emoji:"🍕", place:"Joe's Pizza", type:"NY Slice", desc:"The most famous slice in the Village. $3, perfect fold, non-negotiable.", booking:null, maps:"Joes+Pizza+West+Village+NYC", reviews:8400 },
        { id:"wvpz2", emoji:"🌿", place:"Malaparte", type:"Wood-Fired Pizza", desc:"Prosciutto pizza in a dark, romantic room on Washington St. Reservations for two accepted.", booking:null, maps:"Malaparte+West+Village+NYC", reviews:820 },
        { id:"wvpz3", emoji:"🫙", place:"Moustache Pitza", type:"Middle Eastern Pitza", desc:"Cult status since the '80s. Fresh pita topped with spiced lamb, ten dips, warm plant-filled room.", booking:null, maps:"Moustache+Pitza+West+Village+NYC", reviews:2600 },
        { id:"wvpz4", emoji:"🔥", place:"Kesté", type:"Neapolitan Pizza", desc:"Authentic Neapolitan, wood oven, great buffalo mozzarella. One of the best pies in Manhattan.", booking:"kestepizzeria.com", maps:"Keste+Pizza+West+Village+NYC", reviews:3800 },
      ],
      mediterranean: [
        { id:"wvme1", emoji:"🌊", place:"Jeffrey's Grocery", type:"Seafood", desc:"Oysters always, lobster roll or lobster spaghetti. Buzzy corner spot on Waverly Place.", booking:"jeffreysgrocery.com", maps:"Jeffreys+Grocery+West+Village+NYC", reviews:2200 },
        { id:"wvme2", emoji:"🫒", place:"Via Carota", type:"Italian Trattoria", desc:"The West Village rite of passage. Insalata verde and cacio e pepe. Line out the door for a reason.", booking:null, maps:"Via+Carota+West+Village+NYC", reviews:6800 },
        { id:"wvme3", emoji:"🇬🇪", place:"Cafe Ubani", type:"Georgian Restaurant", desc:"New to the neighborhood. Khachapuri and khinkali in a cozy cafe-to-dinner setting. Under the radar.", booking:null, maps:"Cafe+Ubani+West+Village+NYC", reviews:180 },
        { id:"wvme4", emoji:"🐟", place:"San Sabino", type:"Italian Seafood", desc:"From the Don Angie team. Seafood-focused, deeply romantic room. Already one of the WV's best.", booking:"sansabinonyc.com", maps:"San+Sabino+West+Village+NYC", reviews:680 },
      ],
      american: [
        { id:"wva1", emoji:"🕯️", place:"Waverly Inn", type:"American Classic", desc:"Candlelit townhouse, celebrity clientele, no-photos policy. Complimentary biscuits, red leather banquettes.", booking:"waverlyinnnyc.com", maps:"Waverly+Inn+West+Village+NYC", reviews:1400 },
        { id:"wva2", emoji:"🦞", place:"Jeffrey's Grocery", type:"Seafood American", desc:"Oysters, lobster roll, strong cocktails. Buzzy without being loud. A WV anchor.", booking:"jeffreysgrocery.com", maps:"Jeffreys+Grocery+West+Village+NYC", reviews:2200 },
        { id:"wva3", emoji:"🥬", place:"Fairfax", type:"All-Day Cafe + Bar", desc:"By day a cozy cafe, by night a quirky restaurant. The burger with smoked cheddar is cult-level.", booking:null, maps:"Fairfax+West+Village+NYC", reviews:620 },
        { id:"wva4", emoji:"🦉", place:"Little Owl", type:"Mediterranean American", desc:"In the Friends building. Gravy meatball sliders and pork chop are the signatures. Book 14 days ahead.", booking:"thelittleowlnyc.com", maps:"Little+Owl+West+Village+NYC", reviews:2800 },
      ],
      brunch: [
        { id:"wvbr1", emoji:"🥐", place:"Café Cluny", type:"French-American Brunch", desc:"The West Village's most beloved brunch. Corn-and-crab fritters, perfect burger. Celebrity regulars.", booking:"cafecluny.com", maps:"Cafe+Cluny+West+Village+NYC", reviews:2600 },
        { id:"wvbr2", emoji:"🥚", place:"Buvette", type:"French Bistro Brunch", desc:"Tiny, packed, Parisian. Croque madame, coq au vin, fluffy scrambled eggs. Come early or wait.", booking:"ilovebuvette.com", maps:"Buvette+West+Village+NYC", reviews:4200 },
        { id:"wvbr3", emoji:"🌿", place:"Café Ubani", type:"Georgian Brunch", desc:"New and unhyped. Khachapuri egg boat is extraordinary. Under 200 reviews — get there now.", booking:null, maps:"Cafe+Ubani+West+Village+NYC", reviews:180 },
        { id:"wvbr4", emoji:"🦞", place:"Jeffrey's Grocery", type:"Seafood Brunch", desc:"Oysters and Bloody Marys on Waverly Place. The ideal West Village Sunday.", booking:"jeffreysgrocery.com", maps:"Jeffreys+Grocery+West+Village+NYC", reviews:2200 },
      ],
      latenight: [
        { id:"wvln1", emoji:"🍕", place:"Joe's Pizza", type:"Late Night Slice", desc:"Open till 5am on weekends. The only slice worth getting at 3am in the Village.", booking:null, maps:"Joes+Pizza+West+Village+NYC", reviews:8400 },
        { id:"wvln2", emoji:"🍔", place:"Corner Bistro", type:"Late Night Burger", desc:"Open till 3:30am. $12 bacon cheeseburger, $5 beer. The best late-night deal in Manhattan.", booking:null, maps:"Corner+Bistro+West+Village+NYC", reviews:4200 },
        { id:"wvln3", emoji:"🌿", place:"Fairfax", type:"Late Night Bar + Food", desc:"Open till midnight. Burgers, Old Bay tots, and good cocktails when everything else is closed.", booking:null, maps:"Fairfax+West+Village+NYC", reviews:620 },
        { id:"wvln4", emoji:"🫒", place:"Via Carota", type:"Late Night Italian", desc:"Takes walk-ins late. Cacio e pepe and insalata verde at 11pm is the West Village dream.", booking:null, maps:"Via+Carota+West+Village+NYC", reviews:6800 },
      ],
    },
    activities: {
      free: [
        { id:"wvaf1", emoji:"🌸", place:"Perry Street Walk", type:"Architecture Walk", desc:"The most beautiful residential block in NYC. Brownstones, cobblestones, total romance.", maps:"Perry+Street+West+Village+NYC", reviews:null },
        { id:"wvaf2", emoji:"🌊", place:"Hudson River Park Pier 45", type:"Waterfront", desc:"Sit on the grass with the river and sunset. The best free view in the Village.", maps:"Pier+45+Hudson+River+Park+West+Village+NYC", reviews:4800 },
        { id:"wvaf3", emoji:"🎵", place:"Bleecker Street Record Shops", type:"Music Culture", desc:"Wander the remaining record shops on Bleecker. A disappearing piece of NYC history.", maps:"Bleecker+Street+West+Village+NYC", reviews:null },
        { id:"wvaf4", emoji:"🌳", place:"Christopher Street Stroll", type:"Neighborhood Walk", desc:"From the river to 7th Ave. The heartbeat of the Village — bookshops, cafes, history on every corner.", maps:"Christopher+Street+West+Village+NYC", reviews:null },
      ],
      paid: [
        { id:"wvap1", emoji:"🎭", place:"Cherry Lane Theatre", type:"Off-Broadway", desc:"The oldest continuously operating Off-Broadway theater in NYC. Intimate, historic, unforgettable.", booking:"cherrylanetheatre.org", maps:"Cherry+Lane+Theatre+West+Village+NYC", reviews:680 },
        { id:"wvap2", emoji:"🎵", place:"The Jazz Gallery", type:"Jazz Club", desc:"Serious jazz, serious musicians, intimate room. One of NYC's best jazz venues, no tourists.", booking:"jazzgallery.org", maps:"The+Jazz+Gallery+West+Village+NYC", reviews:480 },
        { id:"wvap3", emoji:"🎨", place:"IFC Center", type:"Arthouse Cinema", desc:"The West Village's indie cinema. Perfect first date — great films, great neighborhood to walk after.", booking:"ifccenter.com", maps:"IFC+Center+West+Village+NYC", reviews:2800 },
        { id:"wvap4", emoji:"🌊", place:"Hudson River Kayaking", type:"Outdoor Activity", desc:"Free kayaking from Pier 26 in summer. Paddle with the Manhattan skyline behind you.", booking:"downtownboathouse.org", maps:"Downtown+Boathouse+Hudson+River+NYC", reviews:1400 },
      ],
    },
    happyHour: [
      { id:"wvhh1", emoji:"🍸", place:"Donna", type:"Latin Cocktail Bar", desc:"Early evening cocktails in the worker-owned West Village gem. Great deals before 7pm.", deal:"HH cocktail specials", hours:"Daily 5-7pm", booking:null, maps:"Donna+Bar+West+Village+NYC", reviews:420 },
      { id:"wvhh2", emoji:"🥂", place:"Jeffrey's Grocery", type:"Oyster Bar", desc:"$1 oysters during happy hour. Get there early — this fills up fast.", deal:"$1 oysters", hours:"Mon-Fri 5-6:30pm", booking:null, maps:"Jeffreys+Grocery+West+Village+NYC", reviews:2200 },
      { id:"wvhh3", emoji:"🍺", place:"Blind Tiger", type:"Craft Beer Bar", desc:"Rotating tap specials and discounted pints. The neighborhood's best beer happy hour.", deal:"Discounted pints", hours:"Mon-Fri 4-7pm", booking:null, maps:"Blind+Tiger+West+Village+NYC", reviews:2200 },
      { id:"wvhh4", emoji:"🍷", place:"Amelie Wine Bar", type:"French Wine Bar", desc:"Half-price bottles on select wines during early hours. Candlelit cellar, best vibe in the Village.", deal:"50% off select bottles", hours:"Tue-Fri 5-7pm", booking:"amelienyc.com", maps:"Amelie+Wine+Bar+West+Village+NYC", reviews:1400 },
    ],
  },
  east_village: {
    bars: {
      cocktails: [
        { id:"evc1", emoji:"🍸", place:"Bar Snack", type:"Cocktail Bar", desc:"Time Out's #1 bar in NYC right now. Matcha frozens, salad negronis, incredible snacks. One year old and already legendary.", booking:null, maps:"Bar+Snack+East+Village+NYC", reviews:680 },
        { id:"evc2", emoji:"🕯️", place:"Madeline's Martini", type:"Martini Bar", desc:"14 martini variations in a candlelit room that feels like Bemelmans below 14th. Ideal first date bar.", booking:null, maps:"Madelines+Martini+East+Village+NYC", reviews:420 },
        { id:"evc3", emoji:"💀", place:"Death & Co", type:"Cocktail Bar", desc:"The bar that started the cocktail renaissance. Over 100 drinks, bartenders with total creative freedom.", booking:"deathandcompany.com", maps:"Death+and+Co+East+Village+NYC", reviews:4800 },
        { id:"evc4", emoji:"🌮", place:"Superbueno", type:"Mexican Cocktail Bar", desc:"Tiny joyful corner bar. Roasted corn sour, mushroom margarita, mole negroni. Industry darling.", booking:null, maps:"Superbueno+East+Village+NYC", reviews:580 },
      ],
      beer: [
        { id:"evb1", emoji:"🍺", place:"Holiday Cocktail Lounge", type:"Dive Bar", desc:"Dark, sticky-floored, open since 1950. St. Marks institution that doesn't get overrun with tourists.", booking:null, maps:"Holiday+Cocktail+Lounge+East+Village+NYC", reviews:1200 },
        { id:"evb2", emoji:"🎸", place:"Niagara Bar", type:"Rock Dive Bar", desc:"Jukebox, pool table, cheap drinks, dark wood. The platonic ideal of an East Village dive.", booking:null, maps:"Niagara+Bar+East+Village+NYC", reviews:980 },
        { id:"evb3", emoji:"🗽", place:"International Bar", type:"Dive Bar", desc:"Twelve stools, cash only, the cheapest beer on the block. Pure old New York.", booking:null, maps:"International+Bar+East+Village+NYC", reviews:760 },
        { id:"evb4", emoji:"📚", place:"KGB Bar", type:"Literary Dive Bar", desc:"Former Soviet social club, now a reading series and cheap drinks. Propaganda posters, brooding regulars.", booking:null, maps:"KGB+Bar+East+Village+NYC", reviews:820 },
      ],
      wine: [
        { id:"evw1", emoji:"🍷", place:"Lovers of Today", type:"Speakeasy Wine Bar", desc:"Hidden behind a gate marked 132½. Cozy booths, neon heart, open till 4am. Happy hour 5-7pm.", booking:null, maps:"Lovers+of+Today+East+Village+NYC", reviews:640 },
        { id:"evw2", emoji:"🌿", place:"Mister Paradise", type:"Natural Wine Bar", desc:"Ambitious cocktails, low-key vibe, unusual ingredients. Order the rosé with ice if you want.", booking:null, maps:"Mister+Paradise+East+Village+NYC", reviews:1100 },
        { id:"evw3", emoji:"🫙", place:"Accidental Bar", type:"Sake Bar", desc:"Changing sake selection with descriptions like 'holy water for the god of sake.' Feels like a party.", booking:null, maps:"Accidental+Bar+East+Village+NYC", reviews:380 },
        { id:"evw4", emoji:"🎭", place:"Joyface", type:"Cocktail Lounge", desc:"No standing room, plaid carpets, fringed lamps, mirrored ceiling. A speakeasy that isn't hidden.", booking:null, maps:"Joyface+East+Village+NYC", reviews:720 },
      ],
      experimental: [
        { id:"eve1", emoji:"🎬", place:"Monsieur", type:"Cinematic Cocktail Bar", desc:"Baz Luhrmann's bar. Gothic grandeur, pink stained glass, stuffed birds, suit of armor. Opens Jan 2025.", booking:"monsieurnyc.com", maps:"Monsieur+Bar+East+Village+NYC", reviews:290 },
        { id:"eve2", emoji:"🐅", place:"Hidden Tiger", type:"Craft Cocktail Lounge", desc:"A genuine hidden gem. Creative cocktails including excellent non-alcoholic options. Undiscovered.", booking:null, maps:"Hidden+Tiger+East+Village+NYC", reviews:140 },
        { id:"eve3", emoji:"🌶️", place:"Ding-A-Ling", type:"Dive + Craft Cocktail", desc:"$7 mixed drinks daily 4-7pm happy hour. Unpretentious craft cocktails in a dive setting.", booking:null, maps:"Ding+A+Ling+Bar+East+Village+NYC", reviews:480 },
        { id:"eve4", emoji:"🍸", place:"Bar Snack", type:"Modern Cocktail Bar", desc:"The city's best new bar. Snack bag cocktail, fresh-from-the-bag chips, bathroom worth the visit alone.", booking:null, maps:"Bar+Snack+East+Village+NYC", reviews:680 },
      ],
      speakeasy: [
        { id:"evs1", emoji:"☎️", place:"Please Don't Tell (PDT)", type:"Phone Booth Speakeasy", desc:"Enter through a payphone in Crif Dogs. Bacon-infused bourbon old fashioned. World famous.", booking:"pdtnyc.com", maps:"Please+Don't+Tell+PDT+East+Village+NYC", reviews:3800 },
        { id:"evs2", emoji:"🗝️", place:"Lovers of Today", type:"Hidden Cocktail Bar", desc:"Walk through the gate marked 132½. Cushioned booths, alcoves, cocktails named after love songs.", booking:null, maps:"Lovers+of+Today+East+Village+NYC", reviews:640 },
        { id:"evs3", emoji:"🎬", place:"Monsieur", type:"Hidden Cinema Bar", desc:"No obvious signage. Baz Luhrmann's newest project. Gothic medieval fantasy room behind a quiet door.", booking:"monsieurnyc.com", maps:"Monsieur+Bar+East+Village+NYC", reviews:290 },
        { id:"evs4", emoji:"🐅", place:"Hidden Tiger", type:"Unmarked Lounge", desc:"No sign outside. Ring the bell. One of the EV's best kept secrets with outstanding cocktails.", booking:null, maps:"Hidden+Tiger+East+Village+NYC", reviews:140 },
      ],
    },
    food: {
      japanese: [
        { id:"evj1", emoji:"🍜", place:"Sobaya", type:"Japanese Soba", desc:"Quiet, elegant soba restaurant on 9th St. Handmade noodles, cold sake, zero attitude. A real gem.", booking:null, maps:"Sobaya+East+Village+NYC", reviews:820 },
        { id:"evj2", emoji:"🥢", place:"Mala Project", type:"Sichuan Dry Pot", desc:"Order a dry pot to share. Customizable, fiery, numbing. Best with a group around a table.", booking:"malaproject.com", maps:"Mala+Project+East+Village+NYC", reviews:2400 },
        { id:"evj3", emoji:"🍣", place:"Soothr", type:"Modern Thai Noodle", desc:"Michelin Bib Gourmand. Duck and dry crab noodles are the move. Homey Bangkok-street-food vibes.", booking:null, maps:"Soothr+East+Village+NYC", reviews:1100 },
        { id:"evj4", emoji:"🌿", place:"Tsukimi", type:"Japanese Kaiseki", desc:"Counter-only, 12 seats, seasonal Japanese. The best reviewed restaurant in the East Village right now.", booking:"tsukiminyc.com", maps:"Tsukimi+East+Village+NYC", reviews:580 },
      ],
      pasta: [
        { id:"evp1", emoji:"🍝", place:"Lil' Frankie's", type:"Italian", desc:"Frank Prisinzano's neighborhood gem. Reliable pasta, great pizza, honest Italian. Never disappoints.", booking:null, maps:"Lil+Frankies+East+Village+NYC", reviews:4200 },
        { id:"evp2", emoji:"🕯️", place:"Supper", type:"Italian", desc:"Cash only, always busy. Spaghetti al limone is the order. Cozy like a snowstorm should be.", booking:null, maps:"Supper+Restaurant+East+Village+NYC", reviews:1800 },
        { id:"evp3", emoji:"🌺", place:"Arté Cafe", type:"Northern Italian", desc:"Open since 1990. Fireplace, intimate garden, ravioli aurora. Genuinely timeless and romantic.", booking:"artecafenyc.com", maps:"Arte+Cafe+East+Village+NYC", reviews:680 },
        { id:"evp4", emoji:"🍕", place:"Motorino", type:"Neapolitan Pizza", desc:"Some of the best pizza in Manhattan. Chill spot on 12th St. Charred, blistered, perfect.", booking:"motorinopizza.com", maps:"Motorino+East+Village+NYC", reviews:2600 },
      ],
      pizza: [
        { id:"evpz1", emoji:"🍕", place:"Motorino", type:"Neapolitan", desc:"The East Village's finest pie. Clam pizza is the signature move.", booking:"motorinopizza.com", maps:"Motorino+East+Village+NYC", reviews:2600 },
        { id:"evpz2", emoji:"🔥", place:"Lil' Frankie's", type:"Wood-Fired", desc:"Neighborhood institution. The margherita is perfectly simple.", booking:null, maps:"Lil+Frankies+East+Village+NYC", reviews:4200 },
        { id:"evpz3", emoji:"🌿", place:"San Marzano", type:"Italian Pizza", desc:"Great outdoor seating on 2nd Ave. Lump crab benedict at brunch, wood-fired pies at dinner.", booking:null, maps:"San+Marzano+East+Village+NYC", reviews:1400 },
        { id:"evpz4", emoji:"🫙", place:"Superiority Burger", type:"Vegetarian Burger", desc:"Michelin Bib Gourmand. The burnt broccoli and sloppy joe are revelations. Tiny, cash, genius.", booking:null, maps:"Superiority+Burger+East+Village+NYC", reviews:1900 },
      ],
      mediterranean: [
        { id:"evme1", emoji:"🌺", place:"Shaw-Nae's House", type:"Caribbean", desc:"NYT 2025 top 10. Goat curry, cobia fish, cassava dumplings. Feels like a secret despite the praise.", booking:null, maps:"Shaw+Naes+House+East+Village+NYC", reviews:480 },
        { id:"evme2", emoji:"🫒", place:"Via della Pace", type:"Italian Mediterranean", desc:"Garden seating, fireplace in winter. The meatballs and flatbreads are a love language.", booking:null, maps:"Via+della+Pace+East+Village+NYC", reviews:820 },
        { id:"evme3", emoji:"🌿", place:"Café Mogador", type:"Moroccan", desc:"The East Village institution since 1983. Tagines, halloumi eggs, Turkish espresso martini.", booking:"cafemogador.com", maps:"Cafe+Mogador+East+Village+NYC", reviews:3800 },
        { id:"evme4", emoji:"🐟", place:"Pylos", type:"Greek", desc:"Suspended clay pots on the ceiling, warm room, excellent grilled fish and mezze.", booking:"pylosrestaurant.com", maps:"Pylos+Restaurant+East+Village+NYC", reviews:1200 },
      ],
      american: [
        { id:"eva1", emoji:"🥩", place:"The Smith", type:"American Brasserie", desc:"Solid all-day brasserie. Great for a classic NYC date — cocktails, steak, no fuss.", booking:"thesmithrestaurant.com", maps:"The+Smith+East+Village+NYC", reviews:5800 },
        { id:"eva2", emoji:"🍗", place:"Root & Bone", type:"Southern Fried Chicken", desc:"Fried chicken on a biscuit, on waffles, or plain with honey tabasco. Always right.", booking:null, maps:"Root+and+Bone+East+Village+NYC", reviews:1600 },
        { id:"eva3", emoji:"🌿", place:"Hearth", type:"Upscale American", desc:"The most grown-up room in the East Village. Polenta and sausage, kale ragu with eggs.", booking:"restauranthearth.com", maps:"Hearth+Restaurant+East+Village+NYC", reviews:1400 },
        { id:"eva4", emoji:"🥬", place:"Superiority Burger", type:"Vegetarian", desc:"Michelin Bib Gourmand. Sloppy joe and burnt broccoli are the only orders. Tiny genius spot.", booking:null, maps:"Superiority+Burger+East+Village+NYC", reviews:1900 },
      ],
      brunch: [
        { id:"evbr1", emoji:"🥚", place:"Veselka", type:"24hr Ukrainian Diner", desc:"Open since 1954. Brunch pierogi with bacon and cheddar. Challah French toast. A NYC rite of passage.", booking:null, maps:"Veselka+East+Village+NYC", reviews:6200 },
        { id:"evbr2", emoji:"🥐", place:"David's Cafe", type:"French-American Diner", desc:"St. Marks people-watching from the window. Run by two Daniel Boulud alums. Quietly exceptional.", booking:null, maps:"Davids+Cafe+East+Village+NYC", reviews:380 },
        { id:"evbr3", emoji:"🌺", place:"Café Mogador", type:"Moroccan Brunch", desc:"Halloumi eggs, lamb tagine, Turkish espresso martini with mint. A neighborhood anchor since 1983.", booking:"cafemogador.com", maps:"Cafe+Mogador+East+Village+NYC", reviews:3800 },
        { id:"evbr4", emoji:"🥞", place:"B&H Dairy", type:"Kosher Dairy Counter", desc:"Open since 1938. 400 square feet of challah french toast, matzoh ball soup, and latkes. Cash only.", booking:null, maps:"B+H+Dairy+East+Village+NYC", reviews:1600 },
      ],
      latenight: [
        { id:"evln1", emoji:"🥟", place:"Veselka", type:"24hr Ukrainian Diner", desc:"The classic. Pierogies and borscht at 3am. Open every night, no exceptions.", booking:null, maps:"Veselka+East+Village+NYC", reviews:6200 },
        { id:"evln2", emoji:"🌭", place:"Crif Dogs", type:"Late Night Hot Dogs", desc:"Open till 2am. Get a deep-fried hot dog. Also the entrance to PDT speakeasy.", booking:null, maps:"Crif+Dogs+East+Village+NYC", reviews:2800 },
        { id:"evln3", emoji:"🍬", place:"Ray's Candy Store", type:"Late Night Sweets", desc:"Open since 1974. Egg creams, fried Oreos, funnel cake. Pure East Village after midnight.", booking:null, maps:"Rays+Candy+Store+East+Village+NYC", reviews:1400 },
        { id:"evln4", emoji:"🍗", place:"Root & Bone", type:"Late Night Fried Chicken", desc:"Open till 1am weekdays, 3am weekends. The best fried chicken in the neighborhood at any hour.", booking:null, maps:"Root+and+Bone+East+Village+NYC", reviews:1600 },
      ],
    },
    activities: {
      free: [
        { id:"evaf1", emoji:"🌳", place:"Tompkins Square Park", type:"Park + People Watching", desc:"The beating heart of the East Village. Sit on a bench, watch the neighborhood unfold.", maps:"Tompkins+Square+Park+East+Village+NYC", reviews:8400 },
        { id:"evaf2", emoji:"🎨", place:"St. Marks Place Walk", type:"Street Culture", desc:"Walk the strip from 3rd Ave to Ave A. Record shops, murals, decades of NYC counterculture.", maps:"St+Marks+Place+East+Village+NYC", reviews:null },
        { id:"evaf3", emoji:"📖", place:"KGB Bar Reading Series", type:"Free Literary Events", desc:"Free readings most nights in a cramped, art-covered former Soviet club. Check calendar first.", maps:"KGB+Bar+East+Village+NYC", reviews:820 },
        { id:"evaf4", emoji:"🌿", place:"Community Garden Crawl", type:"Hidden Gardens", desc:"The EV has over 600 community gardens. Wander 6th St between Aves B and C for the best cluster.", maps:"East+Village+Community+Gardens+NYC", reviews:null },
      ],
      paid: [
        { id:"evap1", emoji:"😂", place:"New York Comedy Club", type:"Comedy Show", desc:"Right next to KGB Bar. Intimate room, strong lineups, great first date energy.", booking:"newyorkcomedyclub.com", maps:"New+York+Comedy+Club+East+Village+NYC", reviews:2800 },
        { id:"evap2", emoji:"🎭", place:"Howl Arts Festival Venue", type:"Performance Space", desc:"Intimate performance space in the EV tradition. Experimental, weird, unforgettable.", booking:null, maps:"East+Village+Performance+Space+NYC", reviews:null },
        { id:"evap3", emoji:"🎵", place:"Nublu", type:"Jazz + Electronic Club", desc:"Small club on Ave C. Jazz to electronic depending on the night. Truly local, zero tourists.", booking:"nublu.net", maps:"Nublu+East+Village+NYC", reviews:680 },
        { id:"evap4", emoji:"🎤", place:"Sake Bar Decibel", type:"Underground Sake Bar", desc:"Basement sake bar, live jazz some nights. 200+ sakes, low ceilings, incredible date energy.", booking:null, maps:"Sake+Bar+Decibel+East+Village+NYC", reviews:1400 },
      ],
    },
    happyHour: [
      { id:"evhh1", emoji:"🍸", place:"Lovers of Today", type:"Speakeasy Bar", desc:"Half price cocktails 5-8pm daily. The most romantic happy hour in the neighborhood.", deal:"50% off cocktails", hours:"Daily 5-8pm", booking:null, maps:"Lovers+of+Today+East+Village+NYC", reviews:640 },
      { id:"evhh2", emoji:"🥂", place:"Alison St. Marks", type:"Oyster Bar", desc:"$1.50 oysters, $9 wine, $9 cocktails Tue-Fri noon-7pm. The best deal in the East Village.", deal:"$1.50 oysters + $9 wine", hours:"Tue-Fri noon-7pm", booking:null, maps:"Alison+St+Marks+East+Village+NYC", reviews:520 },
      { id:"evhh3", emoji:"🌶️", place:"Ding-A-Ling", type:"Dive Bar", desc:"$7 mixed drinks daily 4-7pm. No pretense, great music, best value HH on the block.", deal:"$7 mixed drinks", hours:"Daily 4-7pm", booking:null, maps:"Ding+A+Ling+East+Village+NYC", reviews:480 },
      { id:"evhh4", emoji:"🍺", place:"Skinny Dennis East", type:"Honky-Tonk", desc:"$6 beers and frozen drinks noon-7pm daily. The East Village outpost of the Williamsburg classic.", deal:"$6 beers + frozen drinks", hours:"Daily noon-7pm", booking:null, maps:"Skinny+Dennis+East+Village+NYC", reviews:680 },
    ],
  },
  midtown: {
    bars: {
      cocktails: [
        { id:"mtcc1", emoji:"🏛️", place:"The Campbell", type:"Grand Central Bar", desc:"John W. Campbell's private office, 1920s Florentine ceilings, antique fireplace. Drink in a room, not just at a bar.", booking:null, maps:"The+Campbell+Bar+Grand+Central+Terminal+New+York", reviews:3800 },
        { id:"mtcc2", emoji:"🥊", place:"Jimmy's Corner", type:"Boxing Dive Bar", desc:"Times Square dive — and yet. Muhammad Ali photos, neon jukebox, soul music, $4 beers. The real New York.", booking:null, maps:"Jimmys+Corner+Bar+Times+Square+New+York", reviews:2200 },
        { id:"mtcc3", emoji:"🪨", place:"Pebble Bar", type:"Townhouse Cocktail Bar", desc:"Pete Davidson-backed Rockefeller Center townhouse. Standing bar on 2nd floor, steak tartare on 3rd. $22 mojito but worth it.", booking:"pebblebar.com", maps:"Pebble+Bar+Rockefeller+Center+New+York", reviews:1400 },
        { id:"mtcc4", emoji:"🎭", place:"Tanner Smith's", type:"Prohibition Cocktail Lounge", desc:"Named for a 1900s NYC gangster. Great house cocktails ~$18, rotating craft beer, live music some nights.", booking:"tannersmiths.com", maps:"Tanner+Smiths+Theater+District+New+York", reviews:1800 },
      ],
      beer: [
        { id:"mtcb1", emoji:"🥊", place:"Jimmy's Corner", type:"Dive Bar", desc:"Best-value beer in Midtown. Boxing memorabilia, soul music jukebox, $4 drinks in Times Square. Defies all logic.", booking:null, maps:"Jimmys+Corner+Bar+Times+Square+New+York", reviews:2200 },
        { id:"mtcb2", emoji:"🏠", place:"Tavern 29", type:"Townhouse Beer Garden", desc:"19th-century brownstone, rooftop beer garden with picnic tables, second bar in the back. Happy hour deals.", booking:null, maps:"Tavern+29+Midtown+New+York", reviews:1600 },
        { id:"mtcb3", emoji:"🎭", place:"The Rum House", type:"Hotel Saloon", desc:"Old-timey saloon at the bottom of the Edison Hotel. Live music most nights. Casual Times Square escape.", booking:null, maps:"The+Rum+House+Edison+Hotel+New+York", reviews:2600 },
        { id:"mtcb4", emoji:"🎸", place:"Ragtrader & Bo Peep", type:"Speakeasy Piano Bar", desc:"Garment factory turned bar. Downstairs speakeasy piano bar with live music. Prohibition-era roots.", booking:"ragtradernyc.com", maps:"Ragtrader+Bar+Midtown+New+York", reviews:980 },
      ],
      wine: [
        { id:"mtcw1", emoji:"🌹", place:"Fine & Rare", type:"Rare Spirits Lounge", desc:"Opulent décor, rare spirits, expertly crafted cocktails. Serious collectors and serious drinkers only.", booking:"fineandrarenyc.com", maps:"Fine+and+Rare+Bar+Midtown+New+York", reviews:1200 },
        { id:"mtcw2", emoji:"🎻", place:"Valerie", type:"Gin Library Bar", desc:"Manhattan Golden Age interiors, 70+ gins, 35 signature cocktails. Beautiful room, serious program.", booking:"valerienewyork.com", maps:"Valerie+Bar+Midtown+New+York", reviews:1400 },
        { id:"mtcw3", emoji:"🏛️", place:"The Campbell", type:"Grand Central Bar", desc:"Order wine in the Jazz Age office of a Gilded Age magnate. Grand Central's most beautiful secret.", booking:null, maps:"The+Campbell+Bar+Grand+Central+Terminal+New+York", reviews:3800 },
        { id:"mtcw4", emoji:"🌊", place:"Bar SixtyFive", type:"65th Floor Wine Bar", desc:"Rockefeller Center, 65th floor. Refined wine and cocktail list with the whole city at your feet.", booking:"rainbowroom.com", maps:"Bar+SixtyFive+Rockefeller+Center+New+York", reviews:3200 },
      ],
      experimental: [
        { id:"mtce1", emoji:"🔔", place:"Raines Law Room at The William", type:"Speakeasy", desc:"Ring the doorbell to enter. Prohibition-era plush couches, velvet curtains, intimate booths. No standing.", booking:"raineslawroom.com", maps:"Raines+Law+Room+The+William+Midtown+New+York", reviews:1600 },
        { id:"mtce2", emoji:"🎸", place:"Ragtrader & Bo Peep", type:"Piano Speakeasy", desc:"Through the garment factory, down the stairs. Live piano, prohibition cocktails. Genuinely fun.", booking:"ragtradernyc.com", maps:"Ragtrader+Bar+Midtown+New+York", reviews:980 },
        { id:"mtce3", emoji:"🌆", place:"Dear Irving on Hudson", type:"40th Floor Rooftop Bar", desc:"Manhattan's highest open-air hotel bar. 40th and 41st floors, multiple balconies, skyline views.", booking:"dearirving.com", maps:"Dear+Irving+on+Hudson+Aliz+Hotel+New+York", reviews:2800 },
        { id:"mtce4", emoji:"🎷", place:"The Rum House", type:"Live Music Saloon", desc:"Nightly live jazz and swing in a dark saloon. Best combination of atmosphere and music in Midtown.", booking:null, maps:"The+Rum+House+Edison+Hotel+New+York", reviews:2600 },
      ],
      speakeasy: [
        { id:"mtcs1", emoji:"🔔", place:"Raines Law Room at The William", type:"Doorbell Speakeasy", desc:"Ring a doorbell on a townhouse on W 39th. Plush seating, bespoke cocktails, no standing at the bar allowed.", booking:"raineslawroom.com", maps:"Raines+Law+Room+The+William+Midtown+New+York", reviews:1600 },
        { id:"mtcs2", emoji:"🎸", place:"Bo Peep at Ragtrader", type:"Basement Piano Bar", desc:"Hidden below a garment-district bar. Prohibition cocktails and a live piano player in a cave.", booking:"ragtradernyc.com", maps:"Ragtrader+Bar+Midtown+New+York", reviews:980 },
        { id:"mtcs3", emoji:"🧳", place:"The Boardroom at The Hugh", type:"Food Hall Speakeasy", desc:"Hidden inside a Midtown food hall at 601 Lexington. Private meeting room by day, speakeasy by night.", booking:null, maps:"The+Hugh+Food+Hall+601+Lexington+New+York", reviews:540 },
        { id:"mtcs4", emoji:"🥊", place:"Jimmy's Corner", type:"Local Secret", desc:"In the heart of Times Square — but tourists never find it. The city's most improbable dive bar.", booking:null, maps:"Jimmys+Corner+Bar+Times+Square+New+York", reviews:2200 },
      ],
    },
    food: {
      japanese: [
        { id:"mtj1", emoji:"⚗️", place:"Atomix", type:"Korean Tasting Counter", desc:"Two Michelin stars. 14 seats at a U-shaped counter, chef Park oversees every dish. The most ambitious meal in Midtown.", booking:"atomixnyc.com", maps:"Atomix+Restaurant+Midtown+New+York", reviews:1800 },
        { id:"mtj2", emoji:"🍣", place:"Sushi Yasaka", type:"Omakase", desc:"Midtown omakase that overdelivers. Serious fish, intimate counter, fraction of the price of the downtown spots.", booking:null, maps:"Sushi+Yasaka+Midtown+New+York", reviews:620 },
        { id:"mtj3", emoji:"🔥", place:"Yakitori Totto", type:"Yakitori", desc:"Smoky, intimate yakitori izakaya on 55th St. Skewers and sake in a low-lit, no-nonsense Japanese room.", booking:"totto.com", maps:"Yakitori+Totto+Midtown+New+York", reviews:2400 },
        { id:"mtj4", emoji:"🌿", place:"Pure Thai Cookhouse", type:"Thai", desc:"Hell's Kitchen Thai that locals love. Fresh, uncompromising flavors and low prices. Pre-theater gem.", booking:null, maps:"Pure+Thai+Cookhouse+Hell's+Kitchen+New+York", reviews:2800 },
      ],
      pasta: [
        { id:"mtp1", emoji:"🕯️", place:"Le Veau d'Or", type:"French Bistro", desc:"Opened 1937, run by the Frenchette team. $135 prix fixe, side-by-side two-tops, mirror maps of France. Old Manhattan at its best.", booking:"levaudor.com", maps:"Le+Veau+dOr+Restaurant+New+York", reviews:1200 },
        { id:"mtp2", emoji:"🪵", place:"Keens Steakhouse", type:"1885 Chophouse", desc:"Since 1885. 90,000 clay pipes on the ceiling, mutton chop of legend, dark wood paneling. Living history.", booking:"keens.com", maps:"Keens+Steakhouse+Midtown+New+York", reviews:6200 },
        { id:"mtp3", emoji:"🎭", place:"Boucherie Midtown", type:"French Brasserie", desc:"Stunning heated alley between two buildings. French cuisine, signature cocktails, the best outdoor room in Midtown.", booking:"boucherieus.com", maps:"Boucherie+Midtown+New+York", reviews:2800 },
        { id:"mtp4", emoji:"🍋", place:"Le Rock", type:"Art Deco French", desc:"Crown jewel of Rockefeller Plaza. Michelin-listed, celebrity crowd, Art Deco interiors, serious wine list.", booking:"lerocknvc.com", maps:"Le+Rock+Restaurant+Rockefeller+Center+New+York", reviews:3400 },
      ],
      pizza: [
        { id:"mtpz1", emoji:"🏒", place:"Ace's Pizza", type:"Detroit-Style Pizza", desc:"30 Rockefeller Plaza. Detroit-style pies at Rock Center, including vegan options. Fluffy crust, generous toppings.", booking:null, maps:"Aces+Pizza+Rockefeller+Center+New+York", reviews:1200 },
        { id:"mtpz2", emoji:"🌶️", place:"Szechuan Gourmet", type:"Sichuan Chinese", desc:"W 56th St. Serious Sichuan in Midtown. Mapo tofu, dry-fried string beans, the real thing not the tourist version.", booking:null, maps:"Szechuan+Gourmet+Midtown+New+York", reviews:2400 },
        { id:"mtpz3", emoji:"🧄", place:"Patsy's Italian", type:"Red Sauce Italian Since 1944", desc:"Family-run since 1944. Sinatra's table. The upstairs cocktail bar (2nd Floor Bar & Essen) runs late on weekends.", booking:"patsys.com", maps:"Patsys+Italian+Restaurant+Midtown+New+York", reviews:3200 },
        { id:"mtpz4", emoji:"🌮", place:"Margon", type:"Cuban Counter", desc:"Tiny Cuban counter on W 46th. Roast pork, rice and beans, zero pretense. Where office workers actually eat.", booking:null, maps:"Margon+Restaurant+Midtown+New+York", reviews:1800 },
      ],
      mediterranean: [
        { id:"mtme1", emoji:"🥩", place:"Keens Steakhouse", type:"Historic Steakhouse", desc:"The legendary mutton chop. Dark wood, clay pipe ceiling, Gilded Age atmosphere. One of NYC's great rooms.", booking:"keens.com", maps:"Keens+Steakhouse+Midtown+New+York", reviews:6200 },
        { id:"mtme2", emoji:"🎻", place:"Le Rock", type:"Michelin French", desc:"Art Deco Rockefeller Plaza brasserie. Dimly lit, celebrity crowd, consistently excellent food and wine.", booking:"lerocknvc.com", maps:"Le+Rock+Restaurant+Rockefeller+Center+New+York", reviews:3400 },
        { id:"mtme3", emoji:"🕯️", place:"Boucherie Midtown", type:"French Brasserie Alley", desc:"Eat in a heated alley between skyscrapers. French onion soup, steak frites, craft cocktails. Only in New York.", booking:"boucherieus.com", maps:"Boucherie+Midtown+New+York", reviews:2800 },
        { id:"mtme4", emoji:"🌿", place:"Chola", type:"Indian", desc:"E 58th St. Underrated, authentic Indian — biryanis and curries that outclass the price point. A Midtown secret.", booking:"cholanyc.com", maps:"Chola+Restaurant+Midtown+New+York", reviews:1600 },
      ],
      american: [
        { id:"mta1", emoji:"🥩", place:"Keens Steakhouse", type:"1885 Chophouse", desc:"The mutton chop is iconic. 90,000 clay pipes on the ceiling, Lincoln's wanted poster on the wall.", booking:"keens.com", maps:"Keens+Steakhouse+Midtown+New+York", reviews:6200 },
        { id:"mta2", emoji:"🏛️", place:"Le Veau d'Or", type:"French Bistro", desc:"Opened 1937, Frenchette team. $135 prix fixe, side-by-side two-tops. The most romantic small room in Midtown.", booking:"levaudor.com", maps:"Le+Veau+dOr+Restaurant+New+York", reviews:1200 },
        { id:"mta3", emoji:"🥪", place:"Katz's Deli at Midtown (Pastrami Queen)", type:"Jewish Deli", desc:"The real-deal Jewish deli in Midtown. Pastrami, brisket, matzo ball soup. Don't skip the 2nd Floor Bar & Essen upstairs.", booking:null, maps:"Pastrami+Queen+Midtown+New+York", reviews:1800 },
        { id:"mta4", emoji:"🍔", place:"Pebble Bar Dining Room", type:"American", desc:"3rd floor of Pebble Bar. Steak tartare with truffle aioli, intimate room, great wine. Rockefeller Center hidden floor.", booking:"pebblebar.com", maps:"Pebble+Bar+Rockefeller+Center+New+York", reviews:1400 },
      ],
      brunch: [
        { id:"mtbr1", emoji:"🎭", place:"Tanner Smith's Bootleg Brunch", type:"Bottomless Brunch", desc:"Prohibition-themed bottomless brunch Thu-Sun. American classics, cocktails, live music atmosphere.", booking:"tannersmiths.com", maps:"Tanner+Smiths+Theater+District+New+York", reviews:1800 },
        { id:"mtbr2", emoji:"🌞", place:"Lodi at Rockefeller", type:"Italian Café Brunch", desc:"Aperitivo-inspired brunch at Rock Center. Leisurely Italian café culture in the middle of Midtown.", booking:"lodirestaurant.com", maps:"Lodi+Restaurant+Rockefeller+Center+New+York", reviews:2400 },
        { id:"mtbr3", emoji:"🥞", place:"Boucherie Midtown", type:"French Brunch", desc:"Heated outdoor alley brunch. French onion soup, croque monsieur, proper cocktails in a stunning setting.", booking:"boucherieus.com", maps:"Boucherie+Midtown+New+York", reviews:2800 },
        { id:"mtbr4", emoji:"🍋", place:"Le Rock Weekend Brunch", type:"French Brasserie", desc:"Michelin-adjacent, Art Deco, Rockefeller Plaza. The most glamorous brunch room in Midtown Manhattan.", booking:"lerocknvc.com", maps:"Le+Rock+Restaurant+Rockefeller+Center+New+York", reviews:3400 },
      ],
      latenight: [
        { id:"mtln1", emoji:"🥨", place:"Patsy's 2nd Floor Bar & Essen", type:"Late Night Bar", desc:"Hidden upstairs at Patsy's Italian. Runs late on weekends, cocktail bar separate from the dining room.", booking:null, maps:"Patsys+Italian+Restaurant+Midtown+New+York", reviews:3200 },
        { id:"mtln2", emoji:"🥊", place:"Jimmy's Corner Late", type:"Dive Bar", desc:"Open till 4am on Fridays and Saturdays. Best late-night spot in Times Square by a mile.", booking:null, maps:"Jimmys+Corner+Bar+Times+Square+New+York", reviews:2200 },
        { id:"mtln3", emoji:"🎷", place:"The Rum House", type:"Late Jazz Saloon", desc:"Live music and cocktails late into the night in the Edison Hotel. Nightly jazz keeps it going.", booking:null, maps:"The+Rum+House+Edison+Hotel+New+York", reviews:2600 },
        { id:"mtln4", emoji:"🌮", place:"Urban Hawker Food Hall", type:"Late Night Food Hall", desc:"Singapore hawker-style food hall. Multiple vendors, late hours, best cheap late-night eating in Midtown.", booking:null, maps:"Urban+Hawker+Food+Hall+Midtown+New+York", reviews:3200 },
      ],
    },
    activities: {
      free: [
        { id:"mtaf1", emoji:"🏛️", place:"Grand Central Terminal", type:"Architectural Wonder", desc:"Free to wander. The Whispering Gallery, the Oyster Bar, the Campbell. One of the great buildings on earth.", maps:"Grand+Central+Terminal+New+York", reviews:42000 },
        { id:"mtaf2", emoji:"🌳", place:"Bryant Park", type:"Park + Events", desc:"Free movies in summer, ice skating in winter, chess tables all year. The best public park in Midtown.", maps:"Bryant+Park+New+York", reviews:38000 },
        { id:"mtaf3", emoji:"🏙️", place:"Top of the Rock Observation Deck", type:"Skyline Views", desc:"Paid admission but bookable. Rockefeller Center's 70th floor. Better views of the Empire State Building than the ESB itself.", maps:"Top+of+the+Rock+Rockefeller+Center+New+York", reviews:62000 },
        { id:"mtaf4", emoji:"🎨", place:"MoMA", type:"World-Class Art Museum", desc:"Suggested admission. Picasso, Matisse, Warhol. One of the top five art museums on the planet.", maps:"MoMA+Museum+Modern+Art+New+York", reviews:58000 },
      ],
      paid: [
        { id:"mtap1", emoji:"🎭", place:"Broadway Show", type:"Theater", desc:"The obvious answer done right. Get lottery or rush tickets same-day for half price. Life-changing on a budget.", booking:"luckyseat.com", maps:"Broadway+Theater+District+New+York", reviews:null },
        { id:"mtap2", emoji:"🎶", place:"Carnegie Hall Rush Tickets", type:"Concert Hall", desc:"$20 rush tickets available day-of at the box office. World's greatest musicians in the world's most famous hall.", booking:"carnegiehall.org", maps:"Carnegie+Hall+New+York", reviews:22000 },
        { id:"mtap3", emoji:"🎳", place:"RPM Underground", type:"Themed Karaoke", desc:"18 themed karaoke rooms — Avengers room, Sunset Blvd room, vinyl shop, two bars. Pure commitment.", booking:"rpmunderground.com", maps:"RPM+Underground+Midtown+New+York", reviews:1800 },
        { id:"mtap4", emoji:"🌆", place:"Dear Irving on Hudson", type:"Rooftop Bar Experience", desc:"40th + 41st floors of Aliz Hotel. Seating stations for two, multiple open-air balconies, city-wide views.", booking:"dearirving.com", maps:"Dear+Irving+on+Hudson+Aliz+Hotel+New+York", reviews:2800 },
      ],
    },
    happyHour: [
      { id:"mthh1", emoji:"🥊", place:"Jimmy's Corner", type:"Dive Bar", desc:"Under $4 for most drinks all day, every day. The best happy hour deal within 10 blocks of Times Square.", deal:"$3.50 wells all day", hours:"Daily 11:30am-close", booking:null, maps:"Jimmys+Corner+Bar+Times+Square+New+York", reviews:2200 },
      { id:"mthh2", emoji:"🏠", place:"Tavern 29", type:"Townhouse Bar", desc:"Rooftop beer garden happy hour with picnic tables and good deals. The neighborhood feel Midtown never has.", deal:"$6 beers + $9 cocktails", hours:"Mon-Fri 4-7pm", booking:null, maps:"Tavern+29+Midtown+New+York", reviews:1600 },
      { id:"mthh3", emoji:"🌞", place:"Lodi at Rockefeller", type:"Italian Café", desc:"Aperitivo hour at Rock Center. Italian wine, spritzes, snacks — the only genuinely European happy hour in Midtown.", deal:"$12 spritzes + $10 wine", hours:"Mon-Fri 4-6pm", booking:"lodirestaurant.com", maps:"Lodi+Restaurant+Rockefeller+Center+New+York", reviews:2400 },
      { id:"mthh4", emoji:"🎭", place:"Tanner Smith's", type:"Cocktail Lounge", desc:"Pre-theater happy hour with well-made $12 cocktails. The best deal if you're catching a show nearby.", deal:"$12 cocktails + $6 beer", hours:"Mon-Fri 4-7pm", booking:"tannersmiths.com", maps:"Tanner+Smiths+Theater+District+New+York", reviews:1800 },
    ],
  },
  lic: {
    bars: {
      cocktails: [
        { id:"lcc1", emoji:"🔴", place:"Dutch Kills", type:"Speakeasy Cocktail Bar", desc:"Small red neon sign, dark wood booths, hand-cut ice. From the Milk & Honey team. LIC's best bar.", booking:null, maps:"Dutch+Kills+Bar+Long+Island+City+Queens", reviews:1200 },
        { id:"lcc2", emoji:"🗞️", place:"The Newsroom", type:"Hidden Speakeasy", desc:"Basement bar in a former hotel. Enter through the 90s subway station — open the Snapple fridge.", booking:null, maps:"The+Newsroom+Bar+Long+Island+City+Queens", reviews:380 },
        { id:"lcc3", emoji:"🎵", place:"Record Room", type:"Listening Bar", desc:"Red-lit, luxe, hi-fi sound system. Espresso martini with coconut foam and hot chicken sandwiches.", booking:null, maps:"Record+Room+LIC+Long+Island+City+Queens", reviews:480 },
        { id:"lcc4", emoji:"🐯", place:"The Huntress", type:"Whiskey Bar", desc:"Dim lighting, rustic decor, knowledgeable staff. The best whiskey selection in Long Island City.", booking:null, maps:"The+Huntress+Bar+Long+Island+City+Queens", reviews:320 },
      ],
      beer: [
        { id:"lcb1", emoji:"🍺", place:"LIC Bar", type:"Neighborhood Bar", desc:"Brick, wood, tin ceilings, backyard patio. The quintessential LIC neighborhood hangout.", booking:null, maps:"LIC+Bar+Long+Island+City+Queens", reviews:1400 },
        { id:"lcb2", emoji:"🌿", place:"Alewife LIC", type:"Craft Beer Hall", desc:"28 taps of rotating craft beer in a bi-level space. Reliably excellent, easy to get a seat.", booking:null, maps:"Alewife+LIC+Long+Island+City+Queens", reviews:980 },
        { id:"lcb3", emoji:"😂", place:"The Creek and the Cave", type:"Comedy Bar", desc:"Free comedy shows weekdays, $5 weekends, no drink minimum. Mexican food next door is genuinely good.", booking:"creeknyc.com", maps:"The+Creek+and+the+Cave+Long+Island+City+Queens", reviews:1100 },
        { id:"lcb4", emoji:"🏠", place:"Jackson's Eatery Bar", type:"Neighborhood Bar", desc:"Local ingredients, warm staff, great for a casual date. LIC's hidden gem for a low-key evening.", booking:null, maps:"Jacksons+Eatery+Bar+Long+Island+City+Queens", reviews:480 },
      ],
      wine: [
        { id:"lcw1", emoji:"🌊", place:"On The 7 Wine Bar", type:"Wine Bar", desc:"Named for the 7 train. Natural wine and occasional M. Wells pop-ups. Neighborhood anchor.", booking:null, maps:"On+The+7+Wine+Bar+Long+Island+City+Queens", reviews:420 },
        { id:"lcw2", emoji:"🏙️", place:"The Waterfront Club", type:"Waterfront Wine Bar", desc:"Vintage furniture, chandeliers, faces Gantry Plaza. The most atmospheric bar in LIC.", booking:null, maps:"The+Waterfront+Club+Long+Island+City+Queens", reviews:180 },
        { id:"lcw3", emoji:"🎸", place:"The Beast Next Door", type:"Wine + Cocktail Bar", desc:"Brick and wood, charcuterie boards, signature cocktails, craft beer. Cozy and undiscovered.", booking:null, maps:"The+Beast+Next+Door+Long+Island+City+Queens", reviews:240 },
        { id:"lcw4", emoji:"🌅", place:"Vista Sky Lounge", type:"Rooftop Bar", desc:"Rooftop with Manhattan skyline and bridge views. Best outdoor date bar in the borough.", booking:null, maps:"Vista+Sky+Lounge+Long+Island+City+Queens", reviews:680 },
      ],
      experimental: [
        { id:"lce1", emoji:"🎵", place:"Record Room", type:"Hi-Fi Listening Bar", desc:"The coolest concept in LIC. Audiophile sound system, red lighting, great snacks. No talking during sets.", booking:null, maps:"Record+Room+LIC+Long+Island+City+Queens", reviews:480 },
        { id:"lce2", emoji:"🗞️", place:"The Newsroom", type:"Hidden Hotel Bar", desc:"Find the Snapple fridge, open it. 1990s subway entrance, swank bar inside. Dealer's choice cocktails.", booking:null, maps:"The+Newsroom+Bar+Long+Island+City+Queens", reviews:380 },
        { id:"lce3", emoji:"🌅", place:"Vista Sky Lounge", type:"Rooftop Skyline Bar", desc:"Breathtaking Midtown views from a rooftop lounge. Starlit cocktails above the 7 train.", booking:null, maps:"Vista+Sky+Lounge+Long+Island+City+Queens", reviews:680 },
        { id:"lce4", emoji:"🎷", place:"Dutch Kills Upstairs", type:"Live Music Loft", desc:"Cozy upstairs space at Dutch Kills with live music some nights. Check schedule before going.", booking:null, maps:"Dutch+Kills+Bar+Long+Island+City+Queens", reviews:1200 },
      ],
      speakeasy: [
        { id:"lcs1", emoji:"🗞️", place:"The Newsroom", type:"Fridge Door Speakeasy", desc:"Enter through a Snapple fridge in a fake 90s subway station. One of NYC's most creative entrances.", booking:null, maps:"The+Newsroom+Bar+Long+Island+City+Queens", reviews:380 },
        { id:"lcs2", emoji:"🔴", place:"Dutch Kills", type:"Unmarked Speakeasy", desc:"Just a small red neon sign from outside. Inside: dark wood, handcut ice, flawless classic cocktails.", booking:null, maps:"Dutch+Kills+Bar+Long+Island+City+Queens", reviews:1200 },
        { id:"lcs3", emoji:"🐯", place:"The Huntress", type:"Hidden Whiskey Bar", desc:"Easy to walk past. Dim inside, serious whiskey list, knowledgeable bartenders who mean it.", booking:null, maps:"The+Huntress+Bar+Long+Island+City+Queens", reviews:320 },
        { id:"lcs4", emoji:"🎵", place:"Record Room", type:"Underground Listening Bar", desc:"Below street level. No sign. Ring the bell. Hi-fi sound system and serious cocktails inside.", booking:null, maps:"Record+Room+LIC+Long+Island+City+Queens", reviews:480 },
      ],
    },
    food: {
      japanese: [
        { id:"lcj1", emoji:"🍣", place:"Meju", type:"Korean Fermentation Counter", desc:"Michelin-starred, 8 seats, hidden inside the Little Banchan Shop. Korean fermentation tasting menu.", booking:"mejunyc.com", maps:"Meju+Restaurant+Long+Island+City+Queens", reviews:380 },
        { id:"lcj2", emoji:"🥢", place:"SHI", type:"Pan-Asian Waterfront", desc:"Floor-to-ceiling windows, full Manhattan skyline. Japanese and Chinese with a full sushi bar.", booking:"shilic.com", maps:"SHI+Restaurant+Long+Island+City+Queens", reviews:820 },
        { id:"lcj3", emoji:"🎋", place:"56709", type:"Asian Pop Music Bar", desc:"First-date gold. Sister to bar 929. Japanese, Cantonese, Mandarin pop. Intimate and sceney.", booking:null, maps:"56709+Bar+Long+Island+City+Queens", reviews:480 },
        { id:"lcj4", emoji:"🌿", place:"Soothr LIC", type:"Modern Thai", desc:"Massive LIC outpost of the EV institution. 15 exclusive dishes, whole dungeness crab curry.", booking:"soothrlicnyc.com", maps:"Soothr+LIC+Long+Island+City+Queens", reviews:680 },
      ],
      pasta: [
        { id:"lcp1", emoji:"🍝", place:"Maiella", type:"Italian-Argentinian", desc:"Fresh pasta meets Argentine grill. Great tiramisu. Consistently one of the best rooms in LIC.", booking:"maiellanyc.com", maps:"Maiella+Long+Island+City+Queens", reviews:1600 },
        { id:"lcp2", emoji:"🫙", place:"Terrone", type:"Italian Farm to Table", desc:"Farm-to-table Italian, seasonal menu. Warm room, neighborhood crowd, no pretension.", booking:"terronelic.com", maps:"Terrone+Long+Island+City+Queens", reviews:920 },
        { id:"lcp3", emoji:"🌊", place:"American Brass", type:"American Waterfront", desc:"Waterfront seating, solid burger, seafood platter, mac and cheese. Sit outside always.", booking:"americanbrass.com", maps:"American+Brass+Long+Island+City+Queens", reviews:2200 },
        { id:"lcp4", emoji:"🧡", place:"4747 LIC", type:"New American", desc:"Vernon Blvd neighborhood gem. Small, intimate, great cocktails. The kind of place you return to.", booking:"4747lic.com", maps:"4747+LIC+Long+Island+City+Queens", reviews:340 },
      ],
      pizza: [
        { id:"lcpz1", emoji:"🍕", place:"Traze Pizza", type:"Creative Pizza", desc:"Inventive pies you won't find anywhere else in the city. Including some designed for breakfast.", booking:null, maps:"Traze+Pizza+Long+Island+City+Queens", reviews:580 },
        { id:"lcpz2", emoji:"🔥", place:"JACX & Co Food Hall", type:"Food Hall", desc:"Queens' answer to Chelsea Market. Crif Dogs, Taim falafel, multiple vendors in one building.", booking:null, maps:"JACX+Food+Hall+Long+Island+City+Queens", reviews:1400 },
        { id:"lcpz3", emoji:"🥩", place:"John Brown BBQ", type:"Kansas City BBQ", desc:"Genuine Kansas City-style BBQ, not a Brooklyn facsimile. Great brisket, cold beer.", booking:null, maps:"John+Brown+BBQ+Long+Island+City+Queens", reviews:1800 },
        { id:"lcpz4", emoji:"🌮", place:"Casa Enrique", type:"Mexican", desc:"LIC's Michelin-starred Mexican institution. Fish tacos, mole de Piaxtla, watermelon margaritas.", booking:"enriquerestaurant.com", maps:"Casa+Enrique+Long+Island+City+Queens", reviews:2800 },
      ],
      mediterranean: [
        { id:"lcme1", emoji:"🥩", place:"R40", type:"Argentinian BBQ", desc:"Romantic upscale Argentinian. Parrillada for two, great non-grilled dishes. The best date spot in LIC.", booking:"r40nyc.com", maps:"R40+Restaurant+Long+Island+City+Queens", reviews:680 },
        { id:"lcme2", emoji:"🌶️", place:"Casa Enrique", type:"Michelin Mexican", desc:"Intimate, Michelin-starred, impeccable. The guacamole with fresh totopos and lengua tacos.", booking:"enriquerestaurant.com", maps:"Casa+Enrique+Long+Island+City+Queens", reviews:2800 },
        { id:"lcme3", emoji:"🌿", place:"Hupo", type:"Sichuan Chinese", desc:"Hanging lanterns, cumin lamb, mala dry pots, mapo tofu. Extensive Sichuan menu, full bar.", booking:null, maps:"Hupo+Restaurant+Long+Island+City+Queens", reviews:780 },
        { id:"lcme4", emoji:"🐟", place:"SHI Waterfront", type:"Pan-Asian Waterfront", desc:"Floor-to-ceiling windows over the East River. Skyline views, sake list, date-night energy.", booking:"shilic.com", maps:"SHI+Restaurant+Long+Island+City+Queens", reviews:820 },
      ],
      american: [
        { id:"lca1", emoji:"🌊", place:"American Brass", type:"American Waterfront", desc:"Burger, oysters, mac and cheese on the waterfront. Sit outside for Midtown skyline views.", booking:"americanbrass.com", maps:"American+Brass+Long+Island+City+Queens", reviews:2200 },
        { id:"lca2", emoji:"🥩", place:"R40", type:"Argentinian Steakhouse", desc:"Special occasion dinner. The $120 parrillada for two, fancy-getaway-house atmosphere.", booking:"r40nyc.com", maps:"R40+Restaurant+Long+Island+City+Queens", reviews:680 },
        { id:"lca3", emoji:"🌮", place:"Chinelos Birria", type:"Birria Taco Truck", desc:"The original LIC birria truck, right by Gantry Plaza. Three sopping tacos for $14. Cash only.", booking:null, maps:"Chinelos+Birria+Long+Island+City+Queens", reviews:1200 },
        { id:"lca4", emoji:"🍔", place:"4747 LIC", type:"New American", desc:"Neighborhood spot on Vernon Blvd. Seasonal menu, warm room, excellent cocktails.", booking:"4747lic.com", maps:"4747+LIC+Long+Island+City+Queens", reviews:340 },
      ],
      brunch: [
        { id:"lcbr1", emoji:"🌅", place:"Blend on the Water", type:"Waterfront Brunch", desc:"Sat outside on a nice day and watched sunset on Manhattan. The view is the experience.", booking:"blendlic.com", maps:"Blend+on+the+Water+Long+Island+City+Queens", reviews:1800 },
        { id:"lcbr2", emoji:"🥚", place:"Court Square Diner", type:"24hr Diner", desc:"Open 24 hours. Pancakes and chicken parm at 4pm or 4am. Pure Queens diner, no pretense.", booking:null, maps:"Court+Square+Diner+Long+Island+City+Queens", reviews:1600 },
        { id:"lcbr3", emoji:"🌮", place:"Casa Enrique", type:"Mexican Brunch", desc:"Watermelon margaritas and ceviche around a big bar watching soccer. Casual and perfect.", booking:"enriquerestaurant.com", maps:"Casa+Enrique+Long+Island+City+Queens", reviews:2800 },
        { id:"lcbr4", emoji:"🥞", place:"Terrone", type:"Italian Brunch", desc:"Farm-to-table Italian brunch. Pork chop with hot cherry peppers is a standout weekend order.", booking:"terronelic.com", maps:"Terrone+Long+Island+City+Queens", reviews:920 },
      ],
      latenight: [
        { id:"lcln1", emoji:"🥚", place:"Court Square Diner", type:"24hr Diner", desc:"The only 24-hour spot in LIC. Pancakes, chicken parm, and honest diner food at any hour.", booking:null, maps:"Court+Square+Diner+Long+Island+City+Queens", reviews:1600 },
        { id:"lcln2", emoji:"🌮", place:"Chinelos Birria Truck", type:"Late Night Taco Truck", desc:"Parked near Gantry Plaza late into the night. Three birria tacos for $14. The real deal.", booking:null, maps:"Chinelos+Birria+Long+Island+City+Queens", reviews:1200 },
        { id:"lcln3", emoji:"🍔", place:"JACX & Co Late", type:"Food Hall Late Night", desc:"Several vendors open late. Crif Dogs and other options after the kitchen closes elsewhere.", booking:null, maps:"JACX+Food+Hall+Long+Island+City+Queens", reviews:1400 },
        { id:"lcln4", emoji:"🔴", place:"Dutch Kills Late", type:"Late Night Cocktails", desc:"Open till 2am on weekends. Best cocktails in Queens to close out a night in LIC.", booking:null, maps:"Dutch+Kills+Bar+Long+Island+City+Queens", reviews:1200 },
      ],
    },
    activities: {
      free: [
        { id:"lcaf1", emoji:"🌅", place:"Gantry Plaza State Park", type:"Waterfront Park", desc:"Midtown skyline straight ahead, famous Pepsi-Cola sign to the north. Best sunset in Queens.", maps:"Gantry+Plaza+State+Park+Long+Island+City+Queens", reviews:8200 },
        { id:"lcaf2", emoji:"🌉", place:"Queensbridge Park", type:"Bridge & Skyline Views", desc:"Under the Queensboro Bridge, Roosevelt Island Tram overhead, west-facing sunset views. Locals only.", maps:"Queensbridge+Park+Long+Island+City+Queens", reviews:3400 },
        { id:"lcaf3", emoji:"🎨", place:"MoMA PS1", type:"Contemporary Art", desc:"Suggested admission. World-class contemporary art in an LIC institution. Summer Warm Up is legendary.", maps:"MoMA+PS1+Long+Island+City+Queens", reviews:6800 },
        { id:"lcaf4", emoji:"🚲", place:"Vernon Blvd Street Art Walk", type:"Street Art", desc:"Walk Vernon Blvd north from the waterfront. Murals, galleries, and the Pepsi-Cola sign landmark.", maps:"Vernon+Blvd+Long+Island+City+Queens", reviews:null },
      ],
      paid: [
        { id:"lcap1", emoji:"⛴️", place:"NYC Ferry Sunset Ride", type:"Ferry Ride", desc:"$2.75 each way. Board at Gantry Plaza, ride to Manhattan at sunset. Best cheap date in the city.", booking:"ferry.nyc", maps:"Gantry+Plaza+Ferry+Long+Island+City+Queens", reviews:4200 },
        { id:"lcap2", emoji:"🎨", place:"SculptureCenter", type:"Art Gallery", desc:"Cutting-edge contemporary sculpture in a converted trolley repair shop. Intimate and fascinating.", booking:"sculpture-center.org", maps:"SculptureCenter+Long+Island+City+Queens", reviews:1200 },
        { id:"lcap3", emoji:"😂", place:"The Creek and the Cave", type:"Comedy Club", desc:"Free weekdays, $5 weekends, no drink minimum. Intimate room, good Mexican food next door.", booking:"creeknyc.com", maps:"The+Creek+and+the+Cave+Long+Island+City+Queens", reviews:1100 },
        { id:"lcap4", emoji:"🏐", place:"Hunter's Point South Park", type:"Waterfront Park", desc:"Long stretch of waterfront lawn with Midtown views. Kayaking and events in summer.", booking:null, maps:"Hunters+Point+South+Park+Long+Island+City+Queens", reviews:5600 },
      ],
    },
    happyHour: [
      { id:"lchh1", emoji:"🍸", place:"Dutch Kills", type:"Cocktail Bar", desc:"Early hour specials on classic cocktails. Best value for quality drinks in all of Queens.", deal:"$12 cocktails", hours:"Tue-Fri 5-7pm", booking:null, maps:"Dutch+Kills+Bar+Long+Island+City+Queens", reviews:1200 },
      { id:"lchh2", emoji:"🌮", place:"Dive Bar LIC", type:"Dive Bar", desc:"$8 margaritas and $5 beers Mon-Fri 5-8pm with tacos and sliders. The neighborhood after-work spot.", deal:"$8 margaritas + $5 beer", hours:"Mon-Fri 5-8pm", booking:null, maps:"Dive+Bar+LIC+Long+Island+City+Queens", reviews:980 },
      { id:"lchh3", emoji:"🥂", place:"American Brass", type:"Waterfront Bar", desc:"Oysters and discounted drinks early evening with the Manhattan skyline as your backdrop.", deal:"$1.50 oysters + $8 wine", hours:"Mon-Fri 5-6:30pm", booking:"americanbrass.com", maps:"American+Brass+Long+Island+City+Queens", reviews:2200 },
      { id:"lchh4", emoji:"🍺", place:"LIC Bar", type:"Neighborhood Bar", desc:"Cheap beers in the backyard garden. The most relaxed happy hour in the neighborhood.", deal:"$5 beers + $6 wells", hours:"Daily 4-7pm", booking:null, maps:"LIC+Bar+Long+Island+City+Queens", reviews:1400 },
    ],
  },
};

// ─── FLOW LOGIC ───────────────────────────────────────────────────────────────
// Flow: neighborhood → budget → dateType → focus → [drinkType|foodType|activityType] → [vibe] → timeOfDay → results
// "Both date types" always reach food/drinks questions equally
// "daytime" added as last question before results for drinks, food, activity

const getQuestion = (a) => {
  if (!a.neighborhood) return { id:"neighborhood", special:"neighborhood" };
  if (!a.budget) return { id:"budget", emoji:"💰", q:"What's the budget?", opts:[
    {l:"Free ($0)",v:"free",i:"🌿"},{l:"Under $50",v:"under50",i:"🪙"},
    {l:"$50–$150",v:"mid",i:"💵"},{l:"$150+",v:"splurge",i:"💎"}
  ]};
  if (!a.dateType) return { id:"dateType", emoji:"💬", q:"First date or you two?", opts:[
    {l:"First date",v:"first",i:"🦋"},{l:"We're together",v:"couple",i:"🔥"}
  ]};
  if (!a.focus) return { id:"focus", emoji:"✨", q:"What's the plan?", opts:[
    {l:"Drinks",v:"drinks",i:"🍸"},{l:"Food",v:"food",i:"🍽️"},
    {l:"Activity",v:"activity",i:"🎯"},{l:"Happy Hour",v:"happyhour",i:"🎉"}
  ]};
  if (a.focus === "drinks" && !a.drinkType) return { id:"drinkType", emoji:"🍹", q:"What are you drinking?", opts:DRINK_OPTS };
  if (a.focus === "food"   && !a.foodType)  return { id:"foodType",  emoji:"🍽️", q:"What are you feeling?",  opts:FOOD_OPTS };
  if (a.focus === "activity" && !a.activityType) return { id:"activityType", emoji:"🌟", q:"Activity type?", opts:[
    {l:"Free ($0)",v:"free",i:"🌿"},{l:"Paid",v:"paid",i:"🎟️"}
  ]};
  if ((a.focus === "drinks" || (a.focus === "food" && a.foodType !== "brunch")) && !a.vibe) return { id:"vibe", emoji:"🌡️", q:"What's the energy?", opts:[
    {l:"Lively & buzzing",v:"lively",i:"⚡"},{l:"Quiet & intimate",v:"quiet",i:"🕯️"}
  ]};
  // Time-of-day question — for drinks, food, activity (not happyhour)
  if (a.focus !== "happyhour" && !a.timeOfDay) return { id:"timeOfDay", emoji:"🕐", q:"When are you going?", opts:[
    {l:"Daytime",v:"day",i:"☀️"},{l:"Evening",v:"evening",i:"🌆"},{l:"Late Night",v:"late",i:"🌙"}
  ]};
  return null;
};

const getSpots = (a) => {
  if (a.budget === "free") {
    const pool = DB[a.neighborhood]?.activities?.free || [];
    return pool.slice(0, 6);
  }
  const nb = DB[a.neighborhood] || DB.williamsburg;
  if (a.focus === "happyhour") return (nb.happyHour || []).slice(0, 6);

  let pool = [];
  if (a.focus === "drinks") {
    pool = nb.bars[a.drinkType] || nb.bars.cocktails;
    if (a.vibe === "quiet") pool = [...pool].sort((x,y) => gemScore(y.reviews) - gemScore(x.reviews));
    else pool = [...pool].sort(() => Math.random() - 0.5);
  }
  if (a.focus === "food") {
    let key;
    if (a.foodType === "brunch" || a.timeOfDay === "day") {
      key = "brunch";
    } else if (a.timeOfDay === "late") {
      key = "latenight";
    } else {
      key = a.foodType || "american";
    }
    pool = [...(nb.food[key] || nb.food.american || [])];
  }
  if (a.focus === "activity") {
    pool = [...(a.activityType === "free" ? nb.activities.free : nb.activities.paid) || []];
  }
  return pool.slice(0, 6);
};

// ─── SKYLINE SVG ──────────────────────────────────────────────────────────────
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

// ─── RESULTS LAYOUT: Best Pick + 2 Backups ────────────────────────────────────
const ResultCards = ({ spots, mode }) => {
  const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${q}`;
  if (!spots || !spots.length) return (
    <div style={{textAlign:"center",color:T.sub,padding:"32px",fontFamily:"sans-serif"}}>No spots found for this selection.</div>
  );

  const best = spots[0];
  const backups = spots.slice(1, 3);

  const GemBadge = ({ spot }) => {
    const gem = gemScore(spot.reviews);
    if (gem >= 8) return <span style={{fontSize:"9px",background:`${T.accent}22`,color:T.accent,padding:"2px 7px",borderRadius:"10px",fontFamily:"sans-serif",letterSpacing:"0.5px"}}>💎 Hidden {gem}/10</span>;
    if (gem >= 5) return <span style={{fontSize:"9px",color:T.sub,fontFamily:"sans-serif"}}>💎 {gem}/10</span>;
    return <span style={{fontSize:"9px",color:T.sub+"66",fontFamily:"sans-serif",opacity:0.6}}>📍 Well-known</span>;
  };

  const Links = ({ spot, compact }) => (
    <div style={{display:"flex",gap:"10px",flexWrap:"wrap",marginTop: compact ? "6px" : "12px"}}>
      {spot.booking && (
        <a href={`https://${spot.booking}`} target="_blank" rel="noopener noreferrer"
          style={{fontSize:"10px",fontFamily:"sans-serif",letterSpacing:"1.5px",textTransform:"uppercase",color:T.accent,textDecoration:"none",borderBottom:`1px solid ${T.accent}44`,paddingBottom:"1px"}}>
          📅 Reserve
        </a>
      )}
      <a href={mapsUrl(spot.maps)} target="_blank" rel="noopener noreferrer"
        style={{fontSize:"10px",fontFamily:"sans-serif",letterSpacing:"1.5px",textTransform:"uppercase",color:T.sub,textDecoration:"none",borderBottom:`1px solid ${T.sub}44`,paddingBottom:"1px"}}>
        🗺️ Maps
      </a>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
      {/* BEST PICK */}
      <div style={{
        background:"rgba(15,13,22,0.97)",
        border:`1px solid ${T.accent}55`,
        borderLeft:`3px solid ${T.accent}`,
        borderRadius:"6px",
        padding:"22px 20px",
        position:"relative",
        boxShadow:`0 20px 50px rgba(0,0,0,0.5), 0 0 40px ${T.accent}12`
      }}>
        <div style={{position:"absolute",top:"12px",right:"14px"}}>
          <span style={{fontSize:"9px",background:`linear-gradient(135deg,${T.accent},${T.accent2})`,color:T.bg,padding:"3px 9px",borderRadius:"10px",fontFamily:"sans-serif",fontWeight:"800",letterSpacing:"1.5px",textTransform:"uppercase"}}>
            Best Pick
          </span>
        </div>
        <div style={{fontSize:"9px",color:T.accent,fontFamily:"sans-serif",letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:"4px"}}>{best.type}</div>
        <div style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
          <span style={{fontSize:"30px",flexShrink:0}}>{best.emoji}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:"20px",marginBottom:"2px",lineHeight:1.15}}>{best.place}</div>
            <div style={{marginBottom:"8px"}}><GemBadge spot={best}/></div>
            <p style={{fontSize:"13px",color:T.sub,fontFamily:"sans-serif",lineHeight:1.65,margin:"0 0 4px"}}>{best.desc}</p>
            {mode === "happyhour" && best.deal && (
              <div style={{fontSize:"12px",color:T.accent,fontFamily:"sans-serif",fontWeight:"700",marginBottom:"4px"}}>🎉 {best.deal} · {best.hours}</div>
            )}
            <Links spot={best} compact={false}/>
          </div>
        </div>
      </div>

      {/* ALSO CONSIDER label */}
      {backups.length > 0 && (
        <div style={{fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",color:T.sub,fontFamily:"sans-serif",textAlign:"center",marginTop:"4px",opacity:0.7}}>
          Also consider
        </div>
      )}

      {/* BACKUP CARDS */}
      {backups.map((spot, i) => {
        const color = accentAt(i + 1);
        return (
          <div key={spot.id} style={{
            background:T.card,
            border:`1px solid ${T.border}`,
            borderLeft:`2px solid ${color}66`,
            borderRadius:"5px",
            padding:"14px 16px",
          }}>
            <div style={{fontSize:"9px",color:color,fontFamily:"sans-serif",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"6px",opacity:0.8}}>{spot.type}</div>
            <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
              <span style={{fontSize:"22px",flexShrink:0}}>{spot.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:"15px",marginBottom:"3px"}}>{spot.place}</div>
                <p style={{fontSize:"12px",color:T.sub,fontFamily:"sans-serif",lineHeight:1.5,margin:"0 0 2px"}}>{spot.desc}</p>
                {mode === "happyhour" && spot.deal && (
                  <div style={{fontSize:"11px",color:color,fontFamily:"sans-serif",fontWeight:"700"}}>🎉 {spot.deal} · {spot.hours}</div>
                )}
                <Links spot={spot} compact={true}/>
              </div>
            </div>
          </div>
        );
      })}

      {/* Closed spot note */}
      <div style={{
        marginTop:"6px",
        padding:"10px 14px",
        background:"rgba(255,255,255,0.02)",
        border:`1px solid ${T.border}`,
        borderRadius:"4px",
        fontSize:"10px",
        color:T.sub+"88",
        fontFamily:"sans-serif",
        lineHeight:1.6,
        textAlign:"center"
      }}>
        🔍 Always verify on Google Maps before you go — NYC restaurants close unexpectedly.
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("intro");
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(null);
  const [results, setResults] = useState(null);
  const [hoverNb, setHoverNb] = useState(null);

  const totalSteps = 6;
  const progress = Math.min((Object.keys(answers).length / totalSteps) * 100, 95);

  const advance = (key, val) => {
    const next = { ...answers, [key]: val };
    setAnswers(next);
    const q = getQuestion(next);
    if (q) { setCurrentQ(q); setScreen("quiz"); }
    else { setScreen("loading"); setTimeout(() => { setResults(getSpots(next)); setScreen("result"); }, 1000); }
  };

  const reset = () => { setScreen("intro"); setAnswers({}); setCurrentQ(null); setResults(null); setHoverNb(null); };

  const resultTitle = () => {
    if (answers.budget === "free") return "Free Tonight";
    const timeLabel = answers.timeOfDay === "day" ? "Daytime" : answers.timeOfDay === "late" ? "Late Night" : "Tonight's";
    const focusMap = {
      drinks: `${timeLabel} Bar`,
      food: answers.timeOfDay === "day" ? "Brunch Picks" : `${timeLabel} Table`,
      activity: answers.activityType === "free" ? "Free Activities" : `${timeLabel} Activity`,
      happyhour: "Best Happy Hours"
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

        {/* ── INTRO ── */}
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
              style={{background:`linear-gradient(135deg,${T.accent},${T.accent2})`,border:"none",color:T.bg,padding:"14px 42px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"800",letterSpacing:"3px",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow=`0 10px 36px ${T.accent}44`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="none";}}>
              Plan Our Date →
            </button>
          </div>
        )}

        {/* ── QUIZ ── */}
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
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                  {NEIGHBORHOODS.slice(0,4).map(nb=>(
                    <button key={nb.id} onClick={()=>advance("neighborhood",nb.id)}
                      style={{background:hoverNb===nb.id?`linear-gradient(135deg,${T.accent}18,${T.accent2}18)`:T.card,border:hoverNb===nb.id?`1px solid ${T.accent}`:`1px solid ${T.border}`,color:T.text,padding:"20px 14px",cursor:"pointer",borderRadius:"4px",transition:"all 0.2s",display:"flex",flexDirection:"column",alignItems:"center",gap:"8px"}}
                      onMouseEnter={()=>setHoverNb(nb.id)}
                      onMouseLeave={()=>setHoverNb(null)}>
                      <span style={{fontSize:"26px"}}>{nb.emoji}</span>
                      <span style={{fontSize:"13px",fontFamily:"sans-serif",fontWeight:"700"}}>{nb.label}</span>
                      <span style={{fontSize:"11px",color:T.sub,fontFamily:"sans-serif"}}>{nb.sub}</span>
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",justifyContent:"center",marginTop:"10px"}}>
                  <button onClick={()=>advance("neighborhood",NEIGHBORHOODS[4].id)}
                    style={{background:hoverNb===NEIGHBORHOODS[4].id?`linear-gradient(135deg,${T.accent}18,${T.accent2}18)`:T.card,border:hoverNb===NEIGHBORHOODS[4].id?`1px solid ${T.accent}`:`1px solid ${T.border}`,color:T.text,padding:"20px 14px",cursor:"pointer",borderRadius:"4px",transition:"all 0.2s",display:"flex",flexDirection:"column",alignItems:"center",gap:"8px",width:"calc(50% - 5px)"}}
                    onMouseEnter={()=>setHoverNb(NEIGHBORHOODS[4].id)}
                    onMouseLeave={()=>setHoverNb(null)}>
                    <span style={{fontSize:"26px"}}>{NEIGHBORHOODS[4].emoji}</span>
                    <span style={{fontSize:"13px",fontFamily:"sans-serif",fontWeight:"700"}}>{NEIGHBORHOODS[4].label}</span>
                    <span style={{fontSize:"11px",color:T.sub,fontFamily:"sans-serif"}}>{NEIGHBORHOODS[4].sub}</span>
                  </button>
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
            {Object.keys(answers).length > 0 && (
              <button onClick={reset} style={{marginTop:"20px",background:"transparent",border:"none",color:T.sub,fontSize:"11px",fontFamily:"sans-serif",cursor:"pointer",display:"block",margin:"20px auto 0"}}>← start over</button>
            )}
          </div>
        )}

        {/* ── LOADING ── */}
        {screen === "loading" && (
          <div style={{textAlign:"center",animation:"fadeUp 0.4s ease"}}>
            <div style={{fontSize:"40px",marginBottom:"16px",animation:"pulse 1s ease infinite"}}>🗽</div>
            <div style={{fontSize:"11px",letterSpacing:"4px",textTransform:"uppercase",color:T.accent,fontFamily:"sans-serif"}}>Finding your spots...</div>
            <div style={{marginTop:"16px",display:"flex",gap:"7px",justifyContent:"center"}}>
              {[0,1,2].map(i=><div key={i} style={{width:"5px",height:"5px",borderRadius:"50%",background:T.accent,animation:`bounce 0.9s ease ${i*0.2}s infinite`}}/>)}
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {screen === "result" && results && (
          <div style={{animation:"fadeUp 0.5s ease"}}>
            <div style={{textAlign:"center",marginBottom:"20px"}}>
              <div style={{fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",color:T.accent,fontFamily:"sans-serif",marginBottom:"5px"}}>{nbLabel}</div>
              <h2 style={{fontSize:"clamp(20px,5vw,26px)",fontWeight:"normal",marginBottom:"4px"}}>{resultTitle()}</h2>
              <div style={{width:"32px",height:"1px",background:T.accent,margin:"8px auto",opacity:0.4}}/>
            </div>

            <ResultCards spots={results} mode={answers.focus}/>

            <div style={{display:"flex",gap:"10px",marginTop:"20px"}}>
              <button onClick={reset}
                style={{flex:1,background:"transparent",border:`1px solid ${T.border}`,color:T.sub,padding:"12px",cursor:"pointer",fontFamily:"sans-serif",fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",borderRadius:"2px",transition:"all 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.color=T.accent;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.sub;}}>
                ↺ Start Over
              </button>
              <button
                style={{flex:2,background:`linear-gradient(135deg,${T.accent},${T.accent2})`,border:"none",color:T.bg,padding:"12px",cursor:"pointer",fontFamily:"sans-serif",fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",fontWeight:"800",borderRadius:"2px"}}
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
