"""
Replace generic pest recommendations with 30 pest-specific PACKAGES.
Each pest gets:
  - A new packageTemplates entry with a tailored 2-product bundle.
  - An exactRecommendations entry referencing that package, with pest-specific
    reason text. Dosage / stage / season / region / compliance fields are
    intentionally omitted so the card stays compact.
Products may repeat across pests where biology calls for the same active.

Run: python BioDesk/scripts/update_pest_recs.py
"""
import json
import os

PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'constants', 'data', 'solutions-recommendations.json')


def role(role_text, product_id):
    return {'role': role_text, 'productId': product_id}


PEST_PACKAGES = {
    'pest_aphid': {
        'pkgName': 'Aphid Suppression Package',
        'pkgObjective': 'Manage aphid colonies on field crops, vegetables, and pulses',
        'roles': [
            role('Microbial aphid kill (Lecanicillium lecanii)', 'prod_seira'),
            role('Botanical antifeedant knockdown', 'prod_ecoza_pro'),
        ],
        'reason': 'Aphid colonies build rapidly through parthenogenetic reproduction on cotton, mustard, and pulses. This package combines entomopathogenic fungal infection of soft-bodied stages with azadirachtin antifeedant action.',
    },
    'pest_brown_planthopper': {
        'pkgName': 'Brown Planthopper Outbreak Package',
        'pkgObjective': 'Suppress BPH outbreaks at rice tillering and booting stages',
        'roles': [
            role('Outbreak knockdown at stem base (Spinosad concentrate)', 'prod_spindura_pro'),
            role('Beauveria residual nymph suppression', 'prod_mycova'),
        ],
        'reason': 'BPH causes catastrophic hopper-burn through phloem feeding at the rice stem base. Concentrated spinosad delivers rapid adult and nymph mortality, while Beauveria provides sustained microbial pressure on next-generation nymphs.',
    },
    'pest_beetle': {
        'pkgName': 'Beetle Defoliator Package',
        'pkgObjective': 'Manage hard-bodied beetle pests across field crops',
        'roles': [
            role('Karanjin antifeedant primary', 'prod_k_guard'),
            role('Metarhizium for soil-pupating stages', 'prod_rexora'),
        ],
        'reason': 'Hard-bodied beetles resist contact insecticides through their sclerotized cuticle. Karanjin disrupts digestive enzymes in feeding adults while Metarhizium attacks soil-pupating larval stages -- breaking the generation cycle.',
    },
    'pest_caterpillar': {
        'pkgName': 'Generalist Caterpillar Package',
        'pkgObjective': 'Larvicidal control of armyworms, loopers, and webworms',
        'roles': [
            role('Spinosad larvicide (primary)', 'prod_spindura_plus'),
            role('Azadirachtin IGR layer', 'prod_ecoza_ace'),
        ],
        'reason': 'Generalist caterpillars feed extensively on foliage causing economic defoliation. Spinosad delivers rapid stomach-poison action while azadirachtin disrupts the molting cycle and reduces oviposition.',
    },
    'pest_cutworm': {
        'pkgName': 'Cutworm Seedling Protection Package',
        'pkgObjective': 'Soil-surface cutworm control at seedling stage',
        'roles': [
            role('Spinosad WP soil drench', 'prod_spindura_rix'),
            role('Metarhizium for pupating larvae', 'prod_rexora'),
        ],
        'reason': 'Cutworm larvae feed at night on stem bases and shelter in soil during the day. Spinosad WP soil drench targets daytime soil-resting larvae and Metarhizium attacks pupae for generational suppression.',
    },
    'pest_diamondback_moth': {
        'pkgName': 'DBM Resistance-Management Package',
        'pkgObjective': 'Resistance-managed control for cabbage and cauliflower DBM',
        'roles': [
            role('Spinosad larvicide (primary)', 'prod_spindura_plus'),
            role('Clove oil oviposition deterrent', 'prod_admira_adove'),
        ],
        'reason': 'DBM populations across cole crops have developed resistance to many synthetics. Spinosad larvicide combined with clove oil oviposition deterrence reduces selection pressure and slows resistance development.',
    },
    'pest_fruit_borer': {
        'pkgName': 'Fruit Borer Pre-Entry Package',
        'pkgObjective': 'Stop fruit borers at egg-hatch and L1 stage before fruit entry',
        'roles': [
            role('Spinosad larvicide at L1 emergence', 'prod_spindura_plus'),
            role('Azadirachtin oviposition deterrence', 'prod_ecoza_ace'),
        ],
        'reason': 'Helicoverpa armigera and Earias spp. become impossible to control once larvae enter fruits. This package targets eggs (azadirachtin) and L1 emergence (spinosad) before tunnel-feeding establishes.',
    },
    'pest_fruit_fly': {
        'pkgName': 'Fruit Fly Repellent Package',
        'pkgObjective': 'Repel and disrupt tephritid fruit flies on fruit crops',
        'roles': [
            role('Clove oil repellent (eugenol)', 'prod_admira_adove'),
            role('Neem oil ovicidal layer', 'prod_margoshine'),
        ],
        'reason': 'Tephritid fruit flies cause economic damage by ovipositing in developing fruits. Clove oil repels female adults from landing on fruits and neem oil provides ovicidal coverage of egg-laden surfaces.',
    },
    'pest_grasshopper': {
        'pkgName': 'Grasshopper Antifeedant Package',
        'pkgObjective': 'Manage grasshopper nymphs and adults in dryland field crops',
        'roles': [
            role('Karanjin antifeedant', 'prod_k_guard'),
            role('Granular azadirachtin for egg pods', 'prod_ecoza_rix'),
        ],
        'reason': 'Grasshopper outbreaks in dryland regions cause patchy defoliation. Karanjin disrupts adult and nymph feeding while granular azadirachtin attacks soil-stage egg pods.',
    },
    'pest_helicoverpa': {
        'pkgName': 'Helicoverpa Pod Borer Package',
        'pkgObjective': 'Pulse and cotton flowering protection from Helicoverpa armigera',
        'roles': [
            role('Spinosad larvicide at egg threshold', 'prod_spindura_plus'),
            role('Combination neem-spinosad for high pressure', 'prod_margospin'),
        ],
        'reason': 'Helicoverpa armigera larvae bore into pods and fruits where contact insecticides cannot reach. Spinosad timed at peak egg-hatch combined with neem-spinosad combination chemistry sustains pressure across overlapping flights.',
    },
    'pest_jassid': {
        'pkgName': 'Jassid Hopper-Burn Package',
        'pkgObjective': 'Manage cotton, okra, and brinjal jassid hopper-burn',
        'roles': [
            role('Azadirachtin primary on nymphs', 'prod_ecoza_pro'),
            role('Lecanicillium soft-body kill', 'prod_seira'),
        ],
        'reason': 'Jassid phytotoxic saliva causes hopper-burn on leaf undersides. Azadirachtin disrupts nymph development as IGR while Lecanicillium kills soft-bodied life stages through fungal mycosis.',
    },
    'pest_leaf_folder': {
        'pkgName': 'Leaf Folder Penetration Package',
        'pkgObjective': 'Rice leaf folder larval control inside folded leaves',
        'roles': [
            role('Concentrated spinosad penetrant', 'prod_spindura_pro'),
            role('Azadirachtin adult moth suppression', 'prod_ecoza_max'),
        ],
        'reason': 'Leaf folder larvae feed inside folded leaves where contact insecticides fail. Concentrated spinosad penetrates the leaf fold and azadirachtin suppresses adult moth oviposition for next-generation control.',
    },
    'pest_leaf_miner': {
        'pkgName': 'Leaf Miner Translaminar Package',
        'pkgObjective': 'Vegetable and citrus leaf miner control',
        'roles': [
            role('Lemongrass oil translaminar action', 'prod_admira_admon'),
            role('Lecanicillium adult fly control', 'prod_seira'),
        ],
        'reason': 'Leaf miner larvae feed inside leaf tissue, protected from contact sprays. Lemongrass oil delivers translaminar penetration to mining larvae and Lecanicillium kills emerging adult flies before re-infestation.',
    },
    'pest_mealybug': {
        'pkgName': 'Mealybug Wax-Penetration Package',
        'pkgObjective': 'Penetrate wax-coated mealybug colonies on cotton, citrus, mango',
        'roles': [
            role('Karanjin wax penetration', 'prod_k_guard'),
            role('Lecanicillium crawler-stage kill', 'prod_seira'),
        ],
        'reason': 'Mealybug colonies are protected by waxy coatings that block contact insecticides. Karanjin EC penetrates the wax to contact the soft body and Lecanicillium kills exposed crawlers during emergence.',
    },
    'pest_mite': {
        'pkgName': 'Mite Acaricidal Essential Oil Package',
        'pkgObjective': 'Essential oil acaricidal program with rotation chemistry',
        'roles': [
            role('Garlic oil acaricide primary', 'prod_admira_adrlic'),
            role('Thyme oil rotation partner', 'prod_admira_adyme'),
        ],
        'reason': 'Agricultural mites develop rapid resistance to chemical acaricides. Rotating garlic oil and thyme oil with different modes of action prevents cross-resistance and maintains efficacy across the mite population.',
    },
    'pest_nematode': {
        'pkgName': 'Nematode Soil-Bio Package',
        'pkgObjective': 'Root-knot nematode soil management',
        'roles': [
            role('Paecilomyces parasitic on nematode eggs', 'prod_encilo'),
            role('Pseudomonas root-zone protection', 'prod_neuvita'),
        ],
        'reason': 'Root-knot nematodes parasitize root systems and reduce yields. Paecilomyces parasitizes nematode eggs and females in soil while Pseudomonas protects the root zone from secondary infections.',
    },
    'pest_painted_bug': {
        'pkgName': 'Painted Bug Seedling Defense Package',
        'pkgObjective': 'Cotyledon-stage Bagrada hilaris control',
        'roles': [
            role('Clove oil contact toxicant + repellent', 'prod_admira_adove'),
            role('Karanjin antifeedant during peak activity', 'prod_k_guard'),
        ],
        'reason': 'Painted bug aggregates on cotyledons of late Rabi-sown oilseeds and cole crops. Clove oil repels adult feeding aggregations and karanjin disrupts feeding during peak activity windows.',
    },
    'pest_red_spider_mite': {
        'pkgName': 'Red Spider Mite Resistance-Management Package',
        'pkgObjective': 'Resistance-managed mite control for tea, brinjal, papaya',
        'roles': [
            role('Garlic oil primary acaricide', 'prod_admira_adrlic'),
            role('Thyme oil rotation against resistance', 'prod_admira_adyme'),
        ],
        'reason': 'Tetranychus urticae develops cross-resistance to chemical acaricides rapidly. Botanical garlic and thyme oils provide alternative modes of action with no cross-resistance to chemical miticides.',
    },
    'pest_root_grub': {
        'pkgName': 'Root Grub Soil Microbial Package',
        'pkgObjective': 'Scarab beetle larval control in soil for sugarcane and groundnut',
        'roles': [
            role('Metarhizium grub specialist (primary)', 'prod_rexora'),
            role('Beauveria for adult beetle stages', 'prod_mycova'),
        ],
        'reason': 'Root grubs feed on roots in soil. Metarhizium specializes in scarab grub mycosis with proven field efficacy and Beauveria targets above-ground adult beetles -- breaking the egg-larva-adult cycle.',
    },
    'pest_scale_insect': {
        'pkgName': 'Scale Smothering Package',
        'pkgObjective': 'Wax scale insect management for citrus, mango, ornamentals',
        'roles': [
            role('Neem oil smothering primary', 'prod_margoshine'),
            role('Lecanicillium crawler control', 'prod_seira'),
        ],
        'reason': 'Scale insects protect themselves with wax shields that block contact sprays. Neem oil smothers scales by physical coating and spiracular blockage, while Lecanicillium kills emerging crawlers during their vulnerable stage.',
    },
    'pest_semilooper': {
        'pkgName': 'Semilooper Defoliator Package',
        'pkgObjective': 'Castor and pulse semilooper control through ingestion-based larvicide',
        'roles': [
            role('Spinosad larvicide at early instars', 'prod_spindura_plus'),
            role('Azadirachtin oviposition deterrence', 'prod_ecoza_max'),
        ],
        'reason': 'Semilooper larvae cause severe defoliation in castor and pulses. Spinosad targets early instars by ingestion before mature defoliating stages and azadirachtin disrupts adult oviposition.',
    },
    'pest_shoot_borer': {
        'pkgName': 'Shoot Borer Penetration Package',
        'pkgObjective': 'Sugarcane and brinjal shoot borer control before tunnel-feeding',
        'roles': [
            role('Concentrated spinosad at growing point', 'prod_spindura_pro'),
            role('Granular azadirachtin for soil-pupating stages', 'prod_ecoza_rix'),
        ],
        'reason': 'Shoot borer larvae enter soft growing shoots and feed internally. Concentrated spinosad timed at egg-hatch catches L1 before stem entry and granular azadirachtin attacks soil-pupating stages.',
    },
    'pest_spider_mite': {
        'pkgName': 'Spider Mite Webbing Breakdown Package',
        'pkgObjective': 'Two-spotted spider mite control with webbing disruption',
        'roles': [
            role('Garlic oil contact + webbing breakdown', 'prod_admira_adrlic'),
            role('Beauveria sustained suppression', 'prod_mycova'),
        ],
        'reason': 'Spider mites build dense webbing that protects colonies from contact sprays. Garlic oil breaks webbing and contacts active stages while Beauveria provides sustained microbial kill across the egg-to-adult cycle.',
    },
    'pest_spodoptera': {
        'pkgName': 'Spodoptera Whorl Package',
        'pkgObjective': 'Maize armyworm control before larvae enter protected whorls',
        'roles': [
            role('Spinosad larvicide directed into whorl', 'prod_spindura_plus'),
            role('Neem-spinosad combo for resistance management', 'prod_margospin'),
        ],
        'reason': 'Spodoptera frugiperda and S. litura larvae enter maize whorls within days of hatching. Spinosad directed into the whorl at L1-L3 followed by neem-spinosad combo rotation manages resistance while sustaining pressure.',
    },
    'pest_stem_borer': {
        'pkgName': 'Stem Borer Internode Package',
        'pkgObjective': 'Rice stem borer dead-heart and white-ear prevention',
        'roles': [
            role('Spinosad WP stem-base treatment', 'prod_spindura_rix'),
            role('Granular azadirachtin sustained release', 'prod_ecoza_rix'),
        ],
        'reason': 'Yellow stem borer and pink stem borer cause dead-heart and white-ear in rice. Spinosad WP at stem base catches larvae before they tunnel into internodes and granular azadirachtin provides sustained release across the tillering window.',
    },
    'pest_termite': {
        'pkgName': 'Termite Subterranean Package',
        'pkgObjective': 'Soil-borne termite control for sugarcane and standing crops',
        'roles': [
            role('Metarhizium spore-spread (primary)', 'prod_rexora'),
            role('Karanjin granular surface deterrence', 'prod_k_guard'),
        ],
        'reason': 'Subterranean termites attack sugarcane setts, groundnut pods, and crop bases. Metarhizium spores spread by termite-to-termite contact within colonies, providing colony-wide kill, while karanjin granular deters surface foraging.',
    },
    'pest_thrips': {
        'pkgName': 'Thrips Vector Package',
        'pkgObjective': 'Thrips and tospovirus management on flowering crops',
        'roles': [
            role('Spinosad rapid kill on active stages', 'prod_spindura_plus'),
            role('Azadirachtin egg suppression', 'prod_ecoza_pro'),
        ],
        'reason': 'Thrips cause direct feeding damage and transmit tospoviruses. Spinosad delivers fast kill of active stages on leaf undersides and within flower whorls, while azadirachtin suppresses egg viability for next-generation control.',
    },
    'pest_weevil': {
        'pkgName': 'Weevil Antifeedant Package',
        'pkgObjective': 'Pulse pod weevil, sweet potato weevil, banana weevil control',
        'roles': [
            role('Karanjin antifeedant + contact toxicant', 'prod_k_guard'),
            role('Metarhizium for soil-pupating stages', 'prod_rexora'),
        ],
        'reason': 'Weevils cause structural damage through adult and larval feeding on pods, tubers, and stems. Karanjin disrupts adult feeding and digestion while Metarhizium attacks soil-pupating life stages to break the generation cycle.',
    },
    'pest_white_grub': {
        'pkgName': 'White Grub Soil Mycosis Package',
        'pkgObjective': 'Scarab grub control in roots of sugarcane and groundnut',
        'roles': [
            role('Metarhizium soil mycosis (primary)', 'prod_rexora'),
            role('Beauveria adult beetle control', 'prod_mycova'),
        ],
        'reason': 'White grub larvae devour roots and reduce stand density. Metarhizium spores germinate on grub cuticle in moist soil and cause systemic mycosis, while Beauveria targets emerging adult beetles for generational control.',
    },
    'pest_whitefly': {
        'pkgName': 'Whitefly Mycosis Package',
        'pkgObjective': 'Bemisia tabaci suppression and tospovirus prevention',
        'roles': [
            role('Lecanicillium specialist mycosis', 'prod_seira'),
            role('Neem oil ovicidal layer', 'prod_margoshine'),
        ],
        'reason': 'Whiteflies cause direct sap-loss damage and transmit begomoviruses. Lecanicillium specializes in whitefly mycosis through cuticle penetration and neem oil provides ovicidal coverage on egg-laden leaf undersides.',
    },
}


def main():
    with open(PATH, 'r', encoding='utf-8') as f:
        d = json.load(f)

    new_packages = []
    for pest_id, info in PEST_PACKAGES.items():
        new_packages.append({
            'id': f'pkg_{pest_id}',
            'name': info['pkgName'],
            'objective': info['pkgObjective'],
            'productRoles': info['roles'],
        })

    pkgs = d.get('packageTemplates', [])
    pkgs = [p for p in pkgs if not p.get('id', '').startswith('pkg_pest_')]
    pkgs.extend(new_packages)
    d['packageTemplates'] = pkgs

    new_recs = []
    for pest_id, info in PEST_PACKAGES.items():
        new_recs.append({
            'id': f'rec_general_{pest_id}',
            'pestId': pest_id,
            'priority': 1,
            'recommendationType': 'package',
            'packageId': f'pkg_{pest_id}',
            'recommendationReason': info['reason'],
        })

    ex = d['exactRecommendations']
    ex = [r for r in ex if not r.get('id', '').startswith('rec_general_pest_')]
    ex.extend(new_recs)
    d['exactRecommendations'] = ex
    d['lastUpdated'] = '2026-04-28'

    with open(PATH, 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2, ensure_ascii=False)
        f.write('\n')

    print(f'Updated {len(new_packages)} pest-specific packages (2 products each)')
    print(f'Updated {len(new_recs)} pest-specific recommendations')


if __name__ == '__main__':
    main()
