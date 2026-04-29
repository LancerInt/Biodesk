"""
Replace generic crop recommendations with unique per-crop packages.
Each crop gets 2-3 packages (Pest Pressure / Vigor / Disease where relevant).
Packages are 2-product bundles with crop-specific names and reasoning.
The engine is updated separately to prefer cropOnly entries when no
pest/disease filter is selected.

Run: python BioDesk/scripts/update_crop_recs.py
"""
import json
import os

PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'constants', 'data', 'solutions-recommendations.json')


def role(role_text, product_id):
    return {'role': role_text, 'productId': product_id}


# Per-crop packages: list of (suffix, pkgName, pkgObjective, [(role,prod),(role,prod)], reason)
CROP_PACKAGES = {
    'crop_rice': [
        ('pest', 'Rice Pest Pressure Package', 'Manage stem borer, BPH, and leaf folder in rice',
         [('Concentrated spinosad for borer/BPH', 'prod_spindura_pro'),
          ('Beauveria for hopper nymph suppression', 'prod_mycova')],
         'Rice faces overlapping pressure from stem borer, brown planthopper, and leaf folder. Concentrated spinosad delivers rapid knockdown across all three and Beauveria provides residual microbial suppression on next-generation hoppers.'),
        ('vigor', 'Rice Tillering & Grain Package', 'Maximize tillering and grain filling in rice',
         [('Nitrogen-fixing microbes for tillers', 'prod_igreen_n'),
          ('Potassium for grain filling', 'prod_igreen_k')],
         'Productive tillers and grain weight set during distinct windows. N-fixing microbes sustain tillering nitrogen and K-mobilizing microbes deliver potassium for grain filling and test weight.'),
        ('disease', 'Rice Foliar Disease Package', 'Suppress blast, sheath blight, and bacterial leaf blight',
         [('Bacillus subtilis antagonist', 'prod_subtilix'),
          ('Pseudomonas root and foliar protection', 'prod_neuvita')],
         'Rice diseases build under humid Kharif conditions. Bacillus subtilis produces antifungal lipopeptides and Pseudomonas fluorescens protects both root zone and foliage with antimicrobial metabolites.'),
    ],
    'crop_cotton': [
        ('pest', 'Cotton Bollworm & Sucking Pest Package', 'Manage bollworm and jassid pressure in cotton',
         [('Spinosad larvicide for bollworm', 'prod_spindura_plus'),
          ('Azadirachtin for jassid nymphs', 'prod_ecoza_pro')],
         'Cotton faces lepidopteran bollworms and sap-sucking jassids simultaneously. Spinosad targets early bollworm instars before pod entry and azadirachtin disrupts jassid nymph development.'),
        ('vigor', 'Cotton Boll & Branching Package', 'Sustain boll filling and branching in cotton',
         [('Potassium for boll filling', 'prod_igreen_k'),
          ('Amino acid branching primer', 'prod_zenita')],
         'Cotton yield depends on branching and boll retention. K-mobilizing microbes ensure potassium supply during peak boll fill and amino acid complex stimulates lateral branching for additional reproductive sites.'),
    ],
    'crop_wheat': [
        ('pest', 'Wheat Aphid & Termite Package', 'Manage wheat aphid and termite pressure',
         [('Lecanicillium for aphid mycosis', 'prod_seira'),
          ('Metarhizium for termite control', 'prod_rexora')],
         'Wheat aphids and termites pressure both foliage and roots. Lecanicillium kills aphids through cuticle penetration and Metarhizium provides specialist soil-borne termite control.'),
        ('vigor', 'Wheat Grain Fill Package', 'Maximize wheat grain weight and quality',
         [('Potassium for grain filling', 'prod_igreen_k'),
          ('Amino acid for grain protein', 'prod_zenita')],
         'Wheat grain weight and protein content peak during the flag-leaf to milk-stage window. K microbes deliver potassium for sugar loading and amino-acid complex enhances grain protein deposition.'),
    ],
    'crop_tomato': [
        ('pest', 'Tomato Fruit Borer & Whitefly Package', 'Manage fruit borer and whitefly virus vector',
         [('Spinosad for fruit borer L1', 'prod_spindura_plus'),
          ('Lecanicillium for whitefly mycosis', 'prod_seira')],
         'Tomato fruit borer (Helicoverpa) and whitefly (begomovirus vector) cause both direct yield loss and indirect virus transmission. Spinosad targets borer L1 before fruit entry and Lecanicillium kills whitefly nymphs.'),
        ('vigor', 'Tomato Flowering & Fruiting Package', 'Sustain flowering and fruit sizing in tomato',
         [('Seaweed for flower retention', 'prod_blooma'),
          ('Potassium for fruit sizing', 'prod_igreen_k')],
         'Tomato fruiting requires sustained flower retention and potassium-driven fruit sizing. Seaweed extract reduces flower drop through cytokinins and K microbes deliver potassium during peak fruit-fill demand.'),
        ('disease', 'Tomato Wilt & Blight Package', 'Suppress fusarium wilt and late blight in tomato',
         [('Trichoderma viride wilt suppression', 'prod_biota_v'),
          ('Bacillus amyloliquefaciens foliar antagonist', 'prod_elixora')],
         'Fusarium wilt and late blight are major tomato yield-limiters. Trichoderma viride colonizes the root zone and competes with wilt pathogens, while Bacillus amyloliquefaciens delivers foliar disease antagonism.'),
    ],
    'crop_brinjal': [
        ('pest', 'Brinjal Shoot/Fruit Borer & Jassid Package', 'Manage shoot borer and jassid in brinjal',
         [('Concentrated spinosad for shoot borer', 'prod_spindura_pro'),
          ('Azadirachtin for jassid nymphs', 'prod_ecoza_pro')],
         'Brinjal suffers from shoot and fruit borer (Leucinodes) and jassid sap loss together. Concentrated spinosad reaches borer larvae before stem entry and azadirachtin disrupts jassid nymph populations.'),
        ('vigor', 'Brinjal Branching & Fruiting Package', 'Sustain branching and fruit set in brinjal',
         [('Amino acid branching primer', 'prod_zenita'),
          ('Potassium for fruit set', 'prod_igreen_k')],
         'Brinjal yield depends on lateral branching and sustained fruit set. Amino acid complex stimulates new meristem activity and K microbes support potassium supply through extended fruiting.'),
    ],
    'crop_chilli': [
        ('pest', 'Chilli Thrips & Mite Package', 'Manage thrips virus vectors and broad mite in chilli',
         [('Spinosad for thrips knockdown', 'prod_spindura_plus'),
          ('Garlic oil acaricide for mites', 'prod_admira_adrlic')],
         'Chilli yield collapses under thrips (virus vectors) and broad mite (leaf curl) pressure. Spinosad delivers fast thrips kill and garlic oil provides botanical mite control with no chemical cross-resistance.'),
        ('vigor', 'Chilli Flowering & Fruit Package', 'Support chilli flowering and fruit retention',
         [('Seaweed for flower retention', 'prod_blooma'),
          ('Phosphorus for flowering', 'prod_igreen_p')],
         'Chilli flowering and fruit retention drive marketable yield. Seaweed extract delivers natural cytokinins for flower retention and P-solubilizing microbes ensure phosphorus supply at the reproductive switch.'),
        ('disease', 'Chilli Anthracnose & Wilt Package', 'Manage anthracnose and wilt complex in chilli',
         [('Trichoderma harzianum root protection', 'prod_biota_h'),
          ('Pseudomonas foliar protection', 'prod_neuvita')],
         'Chilli anthracnose and wilt complex destroy fruits and entire plants. Trichoderma harzianum colonizes the rhizosphere against soil-borne wilt pathogens and Pseudomonas protects foliage and fruit surfaces.'),
    ],
    'crop_cabbage': [
        ('pest', 'Cabbage DBM & Aphid Package', 'Manage diamondback moth and aphid in cole crops',
         [('Spinosad for DBM (resistance-managed)', 'prod_spindura_plus'),
          ('Lecanicillium for aphid mycosis', 'prod_seira')],
         'Cabbage suffers from resistance-prone diamondback moth and aphid colonies on leaf undersides. Spinosad remains effective on DBM where chemicals fail and Lecanicillium provides microbial aphid mortality.'),
        ('vigor', 'Cabbage Head Formation Package', 'Sustain head density and quality',
         [('NPK microbial consortium', 'prod_igreen_npk'),
          ('Humic-amino tissue support', 'prod_envicta')],
         'Cabbage head formation requires balanced N-P-K and tissue-density support. NPK microbial consortium delivers all three macronutrients and humic-amino complex enhances cellular thickness for compact heads.'),
    ],
    'crop_maize': [
        ('pest', 'Maize Spodoptera & Grub Package', 'Manage fall armyworm and root grub in maize',
         [('Spinosad larvicide into whorl', 'prod_spindura_plus'),
          ('Metarhizium for soil grubs', 'prod_rexora')],
         'Maize faces fall armyworm (Spodoptera frugiperda) in whorls and root grubs in soil. Spinosad directed into whorls catches L1-L3 larvae and Metarhizium provides specialist soil grub mycosis.'),
        ('vigor', 'Maize Vegetative & Grain Package', 'Drive vegetative growth and grain fill in maize',
         [('NPK microbial consortium', 'prod_igreen_npk'),
          ('Amino acid grain protein', 'prod_zenita')],
         'Maize is a heavy feeder requiring strong vegetative biomass and grain fill. NPK microbial consortium meets bulk nutrient demand and amino acid complex supports cob fill and grain protein.'),
    ],
    'crop_soybean': [
        ('pest', 'Soybean Helicoverpa & Semilooper Package', 'Manage pod borer and semilooper in soybean',
         [('Spinosad larvicide at egg threshold', 'prod_spindura_plus'),
          ('Neem-spinosad combo for sustained pressure', 'prod_margospin')],
         'Soybean faces Helicoverpa pod borer and Bihar hairy caterpillar / semilooper defoliation. Spinosad timed at peak egg-hatch combined with neem-spinosad combo sustains pressure across overlapping flights.'),
        ('vigor', 'Soybean Pod Fill & Flowering Package', 'Sustain flowering and pod-fill in soybean',
         [('Phosphorus for flowering', 'prod_igreen_p'),
          ('Seaweed for pod retention', 'prod_blooma')],
         'Soybean yield depends on flower set and pod retention. P-solubilizing microbes deliver phosphorus at flowering and seaweed extract reduces flower and pod drop through natural growth regulators.'),
    ],
    'crop_okra': [
        ('pest', 'Okra Jassid & Fruit Borer Package', 'Manage jassid and shoot/fruit borer in okra',
         [('Azadirachtin for jassid nymphs', 'prod_ecoza_pro'),
          ('Spinosad for fruit/shoot borer', 'prod_spindura_plus')],
         'Okra suffers hopper-burn from jassid and fruit destruction from shoot/fruit borer. Azadirachtin disrupts jassid nymph development and spinosad targets borer larvae before fruit entry.'),
        ('vigor', 'Okra Flowering & Fruiting Package', 'Sustain flowering and fruit retention in okra',
         [('Seaweed for flower retention', 'prod_blooma'),
          ('Potassium for fruit fill', 'prod_igreen_k')],
         'Okra produces continuously, demanding sustained flower retention and fruit fill. Seaweed extract supports flower retention and K microbes deliver potassium across the long picking window.'),
    ],
    'crop_mustard': [
        ('pest', 'Mustard Aphid & Painted Bug Package', 'Manage mustard aphid and painted bug at seedling',
         [('Lecanicillium for aphid mycosis', 'prod_seira'),
          ('Clove oil for painted bug control', 'prod_admira_adove')],
         'Mustard faces mustard aphid colonies at flowering and painted bug aggregations at seedling. Lecanicillium delivers specialist aphid mycosis and clove oil repels and kills painted bug at cotyledon stage.'),
        ('vigor', 'Mustard Oilseed Development Package', 'Support oilseed fill and quality in mustard',
         [('Sulfur-oxidizing microbes', 'prod_igreen_s'),
          ('Humic-amino tissue support', 'prod_envicta')],
         'Mustard oil content depends on sulfur availability and tissue metabolism. Sulfur-oxidizing microbes release plant-available sulfate and humic-amino complex enhances cellular oil-seed deposition.'),
    ],
    'crop_sugarcane': [
        ('pest', 'Sugarcane Shoot Borer & Termite Package', 'Manage shoot borer and termite in sugarcane',
         [('Concentrated spinosad for shoot borer', 'prod_spindura_pro'),
          ('Metarhizium for termite control', 'prod_rexora')],
         'Sugarcane setts and tillers face shoot borer attack and subterranean termite damage. Concentrated spinosad reaches early borer larvae and Metarhizium provides soil-borne termite mycosis with colony spread.'),
        ('vigor', 'Sugarcane Tillering & Cane Package', 'Maximize tillering and cane weight in sugarcane',
         [('Nitrogen-fixing microbes for tillers', 'prod_igreen_n'),
          ('Potassium for cane sucrose', 'prod_igreen_k')],
         'Sugarcane yield builds through tiller count and cane sucrose. N-fixing microbes maintain nitrogen for tillering and K microbes deliver potassium for sucrose accumulation and cane weight.'),
    ],
    'crop_groundnut': [
        ('pest', 'Groundnut White Grub & Thrips Package', 'Manage white grub and thrips in groundnut',
         [('Metarhizium for soil grubs', 'prod_rexora'),
          ('Spinosad for thrips', 'prod_spindura_plus')],
         'Groundnut faces destructive root-feeding white grubs in soil and thrips on foliage during flowering. Metarhizium provides specialist scarab grub mycosis and spinosad delivers fast thrips kill.'),
        ('vigor', 'Groundnut Pegging & Pod Fill Package', 'Support pegging and pod development in groundnut',
         [('Seaweed for pegging vigor', 'prod_blooma'),
          ('Potassium for pod fill', 'prod_igreen_k')],
         'Groundnut pod yield depends on pegging success and pod fill. Seaweed extract supports peg penetration into soil and K microbes deliver potassium during the pod-fill phase.'),
    ],
    'crop_mango': [
        ('pest', 'Mango Fruit Fly & Scale Package', 'Manage fruit fly and scale insects on mango',
         [('Clove oil fruit fly repellent', 'prod_admira_adove'),
          ('Neem oil for scale smothering', 'prod_margoshine')],
         'Mango fruit yield is hit by tephritid fruit fly oviposition and scale insect colonies on branches. Clove oil eugenol repels fruit flies and neem oil smothers wax-protected scales.'),
        ('vigor', 'Mango Flowering & Fruit Package', 'Support flowering and fruit set in mango',
         [('Seaweed for flower retention', 'prod_blooma'),
          ('Organic acid for fruit metabolism', 'prod_orgocare')],
         'Mango flowering and early fruit set determine yield. Seaweed extract supports panicle retention and organic acid complex sustains cellular metabolism through the fruit set phase.'),
    ],
    'crop_banana': [
        ('pest', 'Banana Weevil & Aphid Package', 'Manage banana pseudostem weevil and aphid',
         [('Karanjin for weevil antifeedant', 'prod_k_guard'),
          ('Lecanicillium for aphid mycosis', 'prod_seira')],
         'Banana suffers structural damage from pseudostem weevil and virus transmission from aphid colonies. Karanjin disrupts weevil feeding and Lecanicillium kills aphids through cuticle penetration.'),
        ('vigor', 'Banana Bunching & Fruit Package', 'Support bunching and finger development',
         [('Potassium for fruit fill', 'prod_igreen_k'),
          ('Seaweed for finger development', 'prod_blooma')],
         'Banana bunch weight and finger size depend on potassium and growth regulator supply. K microbes deliver potassium and seaweed extract supports finger elongation through cytokinin-auxin balance.'),
    ],
    'crop_citrus': [
        ('pest', 'Citrus Scale & Leaf Miner Package', 'Manage citrus scale and leaf miner damage',
         [('Neem oil for scale smothering', 'prod_margoshine'),
          ('Lemongrass oil for leaf miner', 'prod_admira_admon')],
         'Citrus is hit by scale colonies on bark and leaf miner tunnels in young flush. Neem oil smothers scales and lemongrass oil delivers translaminar action against mining larvae.'),
        ('vigor', 'Citrus Fruit Set & Flush Package', 'Support fruit set and new flush development',
         [('Seaweed for flush vigor', 'prod_blooma'),
          ('Potassium for fruit sizing', 'prod_igreen_k')],
         'Citrus yield builds through new flush growth and sustained fruit sizing. Seaweed extract drives new flush and K microbes deliver potassium for fruit fill.'),
    ],
    'crop_grapes': [
        ('pest', 'Grape Thrips & Mealybug Package', 'Manage thrips and mealybug colonies on grapes',
         [('Spinosad for thrips knockdown', 'prod_spindura_plus'),
          ('Karanjin wax penetration on mealybug', 'prod_k_guard')],
         'Grape suffers from thrips (which scar berry skin) and mealybug colonies (which exude honeydew). Spinosad kills thrips actives quickly and karanjin penetrates the mealybug wax coating.'),
        ('vigor', 'Grape Berry Set & Sizing Package', 'Support berry set and sizing in grapes',
         [('Potassium for berry sizing', 'prod_igreen_k'),
          ('Organic acid for berry quality', 'prod_orgocare')],
         'Grape berry size and sugar content depend on potassium and metabolic acid balance. K microbes deliver potassium for sugar loading and organic acid complex supports berry quality.'),
        ('disease', 'Grape Mildew Resistance Package', 'Manage powdery and downy mildew resistance',
         [('Bacillus subtilis for powdery mildew', 'prod_subtilix'),
          ('Bacillus amyloliquefaciens for downy mildew', 'prod_elixora')],
         'Grape mildews develop resistance to chemical fungicides quickly. Bacillus subtilis lipopeptides target powdery mildew and Bacillus amyloliquefaciens provides downy mildew antagonism.'),
    ],
    'crop_pomegranate': [
        ('pest', 'Pomegranate Fruit Borer & Thrips Package', 'Manage anar butterfly and thrips on pomegranate',
         [('Spinosad for fruit borer L1', 'prod_spindura_plus'),
          ('Azadirachtin for thrips eggs', 'prod_ecoza_pro')],
         'Pomegranate fruit borer (anar butterfly) and thrips both damage developing fruits. Spinosad targets borer L1 before fruit entry and azadirachtin suppresses thrips egg viability.'),
        ('vigor', 'Pomegranate Fruit Set & Sizing Package', 'Support fruit set and sizing in pomegranate',
         [('Potassium for fruit sizing', 'prod_igreen_k'),
          ('Seaweed for flower retention', 'prod_blooma')],
         'Pomegranate marketable yield depends on fruit retention and arils-fill. K microbes deliver potassium for sizing and seaweed extract supports flower retention through critical fruit-set window.'),
    ],
    'crop_onion': [
        ('pest', 'Onion Thrips & Maggot Package', 'Manage onion thrips and onion fly maggot',
         [('Spinosad for thrips active stages', 'prod_spindura_plus'),
          ('Thyme oil for fly oviposition deterrence', 'prod_admira_adyme')],
         'Onion suffers thrips feeding on leaf surfaces and maggot damage at the bulb. Spinosad delivers fast thrips kill and thyme oil deters adult fly oviposition near the basal plate.'),
        ('vigor', 'Onion Bulb Development Package', 'Support bulb sizing and storage quality',
         [('Phosphorus for bulb initiation', 'prod_igreen_p'),
          ('Potassium for bulb storage', 'prod_igreen_k')],
         'Onion bulb size and storage life depend on phosphorus at initiation and potassium during sizing. P and K microbes deliver both nutrients at the right windows.'),
    ],
    'crop_potato': [
        ('pest', 'Potato Cutworm & Aphid Package', 'Manage cutworm at seedling and aphid virus vectors',
         [('Spinosad WP for cutworm soil drench', 'prod_spindura_rix'),
          ('Lecanicillium for aphid mycosis', 'prod_seira')],
         'Potato faces cutworm damage at emergence and virus-transmitting aphid colonies later. Spinosad WP soil drench targets nocturnal cutworm larvae and Lecanicillium delivers aphid mycosis.'),
        ('vigor', 'Potato Tuberization Package', 'Support tuberization and bulking',
         [('Potassium for tuber bulking', 'prod_igreen_k'),
          ('Seaweed for tuberization vigor', 'prod_blooma')],
         'Potato tuber yield depends on tuberization signal and potassium for bulking. Seaweed extract triggers tuber initiation and K microbes deliver potassium for tuber sizing.'),
        ('disease', 'Potato Late Blight & Scab Package', 'Suppress late blight and common scab in potato',
         [('Trichoderma viride soil colonization', 'prod_biota_v'),
          ('Bacillus amyloliquefaciens foliar antagonist', 'prod_elixora')],
         'Late blight (Phytophthora) destroys potato canopies and common scab disfigures tubers. Trichoderma viride colonizes the seed-piece and soil zone, while Bacillus amyloliquefaciens delivers foliar disease antagonism.'),
    ],
    'crop_tea': [
        ('pest', 'Tea Mite & Thrips Package', 'Manage tea mite and thrips on tea bushes',
         [('Garlic oil acaricide for mites', 'prod_admira_adrlic'),
          ('Spinosad for thrips', 'prod_spindura_plus')],
         'Tea quality is destroyed by red spider mite stippling and thrips damage on tender shoots. Garlic oil delivers botanical acaricide action and spinosad provides fast thrips knockdown.'),
        ('vigor', 'Tea Flush & Quality Package', 'Support new flush and leaf quality in tea',
         [('Amino acid for flush quality', 'prod_zenita'),
          ('Seaweed for flush vigor', 'prod_blooma')],
         'Tea quality depends on tender flush and amino-acid content of new leaves. Amino acid complex enhances cellular metabolism and seaweed extract drives new flush emergence.'),
    ],
    'crop_coffee': [
        ('pest', 'Coffee Berry Borer & Scale Package', 'Manage berry borer and scale insects on coffee',
         [('Karanjin antifeedant for berry borer', 'prod_k_guard'),
          ('Neem oil for scale smothering', 'prod_margoshine')],
         'Coffee berry borer tunnels into beans and scale insects colonize branches. Karanjin disrupts berry borer feeding and neem oil smothers scale colonies on woody parts.'),
        ('vigor', 'Coffee Bean Development Package', 'Support bean fill and quality in coffee',
         [('Potassium for bean development', 'prod_igreen_k'),
          ('Organic acid for cup quality', 'prod_orgocare')],
         'Coffee bean size and cup quality depend on potassium availability and metabolic acid balance. K microbes deliver potassium during bean fill and organic acid complex supports cup-quality compounds.'),
    ],
    'crop_garlic': [
        ('pest', 'Garlic Thrips & Onion Fly Package', 'Manage thrips and onion fly in garlic',
         [('Spinosad for thrips active stages', 'prod_spindura_plus'),
          ('Thyme oil for fly oviposition deterrence', 'prod_admira_adyme')],
         'Garlic thrips colonize leaf folds and onion fly maggots damage developing bulbs. Spinosad kills thrips actives and thyme oil deters adult fly oviposition.'),
        ('vigor', 'Garlic Bulb & Clove Package', 'Support bulb formation and clove quality',
         [('Phosphorus for bulb initiation', 'prod_igreen_p'),
          ('Amino acid for clove quality', 'prod_zenita')],
         'Garlic bulb size and clove count depend on phosphorus and amino-acid metabolism. P microbes deliver phosphorus and amino acid complex supports clove tissue density.'),
    ],
    'crop_chickpea': [
        ('pest', 'Chickpea Pod Borer Package', 'Manage Helicoverpa pod borer in chickpea',
         [('Spinosad larvicide at egg threshold', 'prod_spindura_plus'),
          ('Combination neem-spinosad for sustained pressure', 'prod_margospin')],
         'Chickpea Helicoverpa pod borer is the primary yield-limiter. Spinosad timed at peak egg-hatch combined with neem-spinosad combo sustains pressure across the flowering and pod-fill window.'),
        ('vigor', 'Chickpea Pod Fill Package', 'Support pod fill and protein content',
         [('Phosphorus for pod fill', 'prod_igreen_p'),
          ('Seaweed for pod retention', 'prod_blooma')],
         'Chickpea pod yield depends on pod retention and phosphorus-driven seed fill. P microbes deliver phosphorus at flowering and seaweed extract reduces pod abortion.'),
    ],
    'crop_pulses': [
        ('pest', 'Pulses Pod Borer Package', 'Manage pod borer complex across pulses',
         [('Spinosad for pod borer L1', 'prod_spindura_plus'),
          ('Combination neem-spinosad for sustained pressure', 'prod_margospin')],
         'Pulses across pigeonpea, blackgram, and greengram suffer from pod borer complex. Spinosad targets early instars and neem-spinosad combo sustains pressure across overlapping flights.'),
        ('vigor', 'Pulses Pod Development Package', 'Support pod development across pulses',
         [('Phosphorus for pod fill', 'prod_igreen_p'),
          ('Seaweed for pod retention', 'prod_blooma')],
         'Pulse pod yield is set by flowering retention and pod-fill. P microbes deliver phosphorus and seaweed extract reduces flower and pod abscission.'),
    ],
    'crop_oilseeds': [
        ('pest', 'Oilseeds Aphid & Painted Bug Package', 'Manage aphid and painted bug across oilseeds',
         [('Lecanicillium for aphid mycosis', 'prod_seira'),
          ('Clove oil for painted bug', 'prod_admira_adove')],
         'Oilseeds across mustard, sesamum, and sunflower suffer from aphid colonies and painted bug at seedling. Lecanicillium provides aphid mycosis and clove oil targets painted bug aggregations.'),
        ('vigor', 'Oilseeds Seed Fill Package', 'Support oil content and seed fill',
         [('Sulfur-oxidizing microbes', 'prod_igreen_s'),
          ('Humic-amino tissue support', 'prod_envicta')],
         'Oilseed crops require sulfur for oil synthesis and tissue metabolism for seed fill. S-oxidizing microbes release sulfate and humic-amino complex enhances cellular oil-seed deposition.'),
    ],
    'crop_cauliflower': [
        ('pest', 'Cauliflower DBM & Aphid Package', 'Manage DBM and aphid in cauliflower',
         [('Spinosad for DBM (resistance-managed)', 'prod_spindura_plus'),
          ('Lecanicillium for aphid mycosis', 'prod_seira')],
         'Cauliflower suffers resistance-prone diamondback moth larvae and aphid colonies on undersides. Spinosad remains effective on DBM where chemicals fail and Lecanicillium delivers microbial aphid kill.'),
        ('vigor', 'Cauliflower Curd Formation Package', 'Sustain curd formation and quality',
         [('NPK microbial consortium', 'prod_igreen_npk'),
          ('Humic-amino tissue support', 'prod_envicta')],
         'Cauliflower curd density depends on balanced N-P-K and tissue support. NPK microbial consortium and humic-amino complex together drive compact, marketable curd development.'),
    ],
}


def main():
    with open(PATH, 'r', encoding='utf-8') as f:
        d = json.load(f)

    # ── Build packages ───────────────────────────────────────────
    new_packages = []
    new_recs = []
    for crop_id, packages in CROP_PACKAGES.items():
        for suffix, pkg_name, pkg_obj, role_list, reason in packages:
            pkg_id = f'pkg_{crop_id}_{suffix}'
            new_packages.append({
                'id': pkg_id,
                'name': pkg_name,
                'objective': pkg_obj,
                'productRoles': [role(r, p) for r, p in role_list],
            })
            new_recs.append({
                'id': f'rec_{crop_id}_{suffix}_general',
                'cropId': crop_id,
                'priority': 1,
                'recommendationType': 'package',
                'packageId': pkg_id,
                'recommendationReason': reason,
            })

    pkgs = d.get('packageTemplates', [])
    pkgs = [p for p in pkgs if not p.get('id', '').startswith('pkg_crop_')]
    pkgs.extend(new_packages)
    d['packageTemplates'] = pkgs

    ex = d['exactRecommendations']
    ex = [r for r in ex if not (r.get('id', '').startswith('rec_crop_') and r.get('id', '').endswith('_general'))]
    ex.extend(new_recs)
    d['exactRecommendations'] = ex
    d['lastUpdated'] = '2026-04-29'

    with open(PATH, 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2, ensure_ascii=False)
        f.write('\n')

    print(f'Created {len(new_packages)} crop-specific packages across {len(CROP_PACKAGES)} crops')
    print(f'Created {len(new_recs)} crop-only recommendations')


if __name__ == '__main__':
    main()
