"""
Replace generic stage and abiotic-stress recommendations with unique packages.
Each growth stage / abiotic stress gets:
  - A new packageTemplates entry with a tailored 2-product bundle.
  - A recommendation entry referencing that package, with a stage- or
    stress-specific reason.
Dosage / stage / season / region / compliance fields are intentionally omitted.

Run: python BioDesk/scripts/update_stage_stress_recs.py
"""
import json
import os

PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'constants', 'data', 'solutions-recommendations.json')


def role(role_text, product_id):
    return {'role': role_text, 'productId': product_id}


STAGE_PACKAGES = {
    'stage_nursery': {
        'pkgName': 'Nursery Establishment Package',
        'pkgObjective': 'Strong root development and disease-free seedling raising in nursery beds',
        'roles': [
            role('Mycorrhizal root colonization', 'prod_enrhize'),
            role('Seedling vigor (Seaweed Extract)', 'prod_blooma'),
        ],
        'reason': 'Nursery seedlings need rapid root colonization and protection from soil-borne pathogens. Mycorrhiza forms a symbiotic root network and seaweed extract triggers early shoot vigor for healthy transplants.',
    },
    'stage_germination': {
        'pkgName': 'Germination & Emergence Package',
        'pkgObjective': 'Protect emerging seedlings from damping-off and soil-borne fungi',
        'roles': [
            role('Trichoderma viride seed/soil protection', 'prod_biota_v'),
            role('Bacillus subtilis antagonistic coat', 'prod_subtilix'),
        ],
        'reason': 'Germination is the most disease-vulnerable phase. Trichoderma colonizes the seed surface and rhizosphere while Bacillus subtilis produces antifungal metabolites against damping-off, root rot, and pre-emergence pathogens.',
    },
    'stage_seedling': {
        'pkgName': 'Seedling Vigor Package',
        'pkgObjective': 'Build seedling vigor and stress tolerance through transplanting',
        'roles': [
            role('Seaweed Extract vigor primer', 'prod_blooma'),
            role('Humic + Fulvic + Amino tissue support', 'prod_envicta'),
        ],
        'reason': 'Young seedlings need cytokinin, auxin, and amino-acid building blocks for rapid foliage development. Seaweed extract delivers natural growth promoters while humic-fulvic-amino complex enhances cellular metabolism.',
    },
    'stage_vegetative': {
        'pkgName': 'Vegetative Growth Package',
        'pkgObjective': 'Drive balanced canopy development through nutrient mobilization',
        'roles': [
            role('NPK Microbial consortium', 'prod_igreen_npk'),
            role('Foliar growth support (Humic-Amino)', 'prod_envicta'),
        ],
        'reason': 'Vegetative growth demands balanced N-P-K supply. NPK microbial consortium fixes atmospheric nitrogen, solubilizes phosphorus, and mobilizes potassium, while humic-amino complex boosts foliar metabolism.',
    },
    'stage_tillering': {
        'pkgName': 'Tillering Booster Package',
        'pkgObjective': 'Maximize productive tiller count in cereals and grasses',
        'roles': [
            role('Nitrogen-fixing microbes', 'prod_igreen_n'),
            role('Tiller initiation support (Seaweed)', 'prod_blooma'),
        ],
        'reason': 'Productive tiller count is set during the tillering window. Nitrogen-fixing microbes ensure sustained N supply at the critical phase while seaweed cytokinins trigger lateral bud break and additional tillers.',
    },
    'stage_branching': {
        'pkgName': 'Branching Stimulation Package',
        'pkgObjective': 'Promote lateral shoot development in cotton, pulses, and oilseeds',
        'roles': [
            role('Amino acid branching primer', 'prod_zenita'),
            role('Foliar mineral support', 'prod_envicta'),
        ],
        'reason': 'Lateral branching determines reproductive site count. Amino acid complex provides building blocks for new meristem activity and humic-fulvic complex sustains foliar mineral availability through active growth.',
    },
    'stage_flowering': {
        'pkgName': 'Flowering Induction Package',
        'pkgObjective': 'Support bud-set, pollen viability, and flower retention',
        'roles': [
            role('Phosphorus-solubilizing microbes', 'prod_igreen_p'),
            role('Flower induction (Seaweed Extract)', 'prod_blooma'),
        ],
        'reason': 'Flowering demands phosphorus for energy transfer and seaweed-derived growth regulators for bud differentiation. P-solubilizing microbes release locked soil phosphorus while seaweed cytokinins reduce flower drop.',
    },
    'stage_boll_development': {
        'pkgName': 'Boll Development Package',
        'pkgObjective': 'Sustain cotton boll filling and prevent boll-shedding',
        'roles': [
            role('Potassium-mobilizing microbes', 'prod_igreen_k'),
            role('Boll-vigor recovery support', 'prod_orgocare'),
        ],
        'reason': 'Cotton boll filling requires sustained potassium for sugar translocation. K-mobilizing microbes maintain plant K supply through canopy peak demand while organic acid complex supports boll metabolism and reduces shedding.',
    },
    'stage_fruiting': {
        'pkgName': 'Fruiting & Sizing Package',
        'pkgObjective': 'Improve fruit set, sizing, and quality in vegetables and fruit crops',
        'roles': [
            role('Potassium-mobilizing microbes', 'prod_igreen_k'),
            role('Fruit metabolism support (Organic Acids)', 'prod_orgocare'),
        ],
        'reason': 'Fruit sizing is potassium-driven and metabolism-intensive. K-mobilizing microbes ensure nutrient supply at peak demand and organic acid complex supports cellular respiration during the rapid sink-filling phase.',
    },
    'stage_grain_filling': {
        'pkgName': 'Grain Filling Package',
        'pkgObjective': 'Maximize grain weight and quality in cereals and pulses',
        'roles': [
            role('Potassium-mobilizing microbes', 'prod_igreen_k'),
            role('Amino acid grain protein support', 'prod_zenita'),
        ],
        'reason': 'Grain filling demands sustained potassium for sugar loading and amino acids for protein deposition. K microbes maintain K supply at flag-leaf stage and amino-acid complex enhances grain protein content and test weight.',
    },
}


STRESS_PACKAGES = {
    'stress_cold': {
        'pkgName': 'Cold Stress Recovery Package',
        'pkgObjective': 'Protect cellular membranes and support recovery under cold stress',
        'roles': [
            role('Cell-membrane protection (Organic Acids)', 'prod_orgocare'),
            role('Amino-acid cryoprotection', 'prod_zenita'),
        ],
        'reason': 'Cold stress damages cell membranes and disrupts enzyme function. Organic acid complex stabilizes membrane integrity and free amino acids act as natural cryoprotectants supporting cellular function below optimal temperatures.',
    },
    'stress_drought': {
        'pkgName': 'Drought Tolerance Package',
        'pkgObjective': 'Improve water-use efficiency and recovery under drought',
        'roles': [
            role('Drought-tolerance complex (Humic + Amino)', 'prod_envicta'),
            role('Stomatal regulation support', 'prod_orgocare'),
        ],
        'reason': 'Drought triggers stomatal closure and oxidative stress. Humic-fulvic-amino complex improves root water uptake and water-use efficiency while organic acid complex supports stomatal recovery and protects against oxidative damage.',
    },
    'stress_heat': {
        'pkgName': 'Heat Stress Resilience Package',
        'pkgObjective': 'Activate heat-shock response and antioxidant defense',
        'roles': [
            role('Heat-shock response support', 'prod_orgocare'),
            role('Antioxidant boost (Seaweed Extract)', 'prod_blooma'),
        ],
        'reason': 'Heat stress denatures proteins and generates reactive oxygen species. Organic acid complex supports heat-shock protein induction and seaweed extract delivers natural antioxidants that neutralize ROS during thermal extremes.',
    },
    'stress_salinity': {
        'pkgName': 'Salinity Stress Package',
        'pkgObjective': 'Manage osmotic and ionic stress under saline conditions',
        'roles': [
            role('Osmotic balance (Organic Acid Complex)', 'prod_orgocare'),
            role('Soil aggregation + Na exclusion', 'prod_envicta'),
        ],
        'reason': 'Salinity creates osmotic stress and sodium toxicity. Organic acid complex helps cellular osmoregulation and humic-fulvic-amino complex improves soil structure and supports selective root sodium exclusion.',
    },
    'stress_transplant_shock': {
        'pkgName': 'Transplant Shock Recovery Package',
        'pkgObjective': 'Rapid root re-establishment and shoot recovery after transplanting',
        'roles': [
            role('Mycorrhizal root colonization', 'prod_enrhize'),
            role('Transplant vigor (Seaweed Extract)', 'prod_blooma'),
        ],
        'reason': 'Transplant shock breaks fine roots and disrupts water uptake. Mycorrhiza extends the effective root surface within days and seaweed extract triggers shoot recovery through natural cytokinin-auxin balance.',
    },
    'stress_waterlogging': {
        'pkgName': 'Waterlogging Recovery Package',
        'pkgObjective': 'Protect roots and recover from anaerobic soil conditions',
        'roles': [
            role('Pseudomonas root protection', 'prod_neuvita'),
            role('Hypoxia recovery support', 'prod_orgocare'),
        ],
        'reason': 'Waterlogged soil becomes anaerobic and triggers root rot pathogens. Pseudomonas fluorescens protects the root zone with antimicrobial metabolites while organic acid complex supports cellular respiration through low-oxygen episodes.',
    },
}


def main():
    with open(PATH, 'r', encoding='utf-8') as f:
        d = json.load(f)

    # ── Build packages ───────────────────────────────────────────
    new_packages = []
    for stage_id, info in STAGE_PACKAGES.items():
        new_packages.append({
            'id': f'pkg_{stage_id}',
            'name': info['pkgName'],
            'objective': info['pkgObjective'],
            'productRoles': info['roles'],
        })
    for stress_id, info in STRESS_PACKAGES.items():
        new_packages.append({
            'id': f'pkg_{stress_id}',
            'name': info['pkgName'],
            'objective': info['pkgObjective'],
            'productRoles': info['roles'],
        })

    pkgs = d.get('packageTemplates', [])
    pkgs = [p for p in pkgs if not (p.get('id', '').startswith('pkg_stage_') or p.get('id', '').startswith('pkg_stress_'))]
    pkgs.extend(new_packages)
    d['packageTemplates'] = pkgs

    # ── Build stage recommendations (replace existing) ───────────
    stage_recs = []
    for stage_id, info in STAGE_PACKAGES.items():
        stage_recs.append({
            'id': f'rec_{stage_id}',
            'growthStageId': stage_id,
            'priority': 1,
            'recommendationType': 'package',
            'packageId': f'pkg_{stage_id}',
            'recommendationReason': info['reason'],
        })
    d['stageRecommendations'] = stage_recs

    # ── Build stress recommendations (replace existing) ──────────
    stress_recs = []
    for stress_id, info in STRESS_PACKAGES.items():
        stress_recs.append({
            'id': f'rec_{stress_id}',
            'abioticStressId': stress_id,
            'priority': 1,
            'recommendationType': 'package',
            'packageId': f'pkg_{stress_id}',
            'recommendationReason': info['reason'],
        })
    d['stressRecommendations'] = stress_recs

    d['lastUpdated'] = '2026-04-29'

    with open(PATH, 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2, ensure_ascii=False)
        f.write('\n')

    print(f'Updated {len(STAGE_PACKAGES)} growth-stage packages')
    print(f'Updated {len(STRESS_PACKAGES)} abiotic-stress packages')
    print(f'Total stage recommendations: {len(stage_recs)}')
    print(f'Total stress recommendations: {len(stress_recs)}')


if __name__ == '__main__':
    main()
