# GSI hospital pages: what's missing (T10)

Nov 7, 2026. Generated from `data/gsi-hospitals.csv` and `data/gsi-programs/*.json`.

## The indexing rule

`scripts/build-gsi.py`, `profile_page()`: a hospital page is `index,follow` only when its `data/gsi-programs/<file>.json` has a `group` block (the hospital's own published resident disability benefit) or a `specific` block (something specific to that program, like Cooper's flyer naming Jay). Every other page is built with the same Guardian GSI facts and stays `noindex,follow`, because 21 near-identical pages would look like doorway pages to Google. The program file is matched to the hospital by its `hospital` field, which is the hospital's `name` in the CSV.

To unlock a page: add `data/gsi-programs/<slug>.json` with a `group` block (rows plus a source), run `bash scripts/build-all.sh`, and it moves into the sitemap and llms.txt on its own.

Rules for the data (from the task file and Jay's GSI agreement):

- Only what the hospital's own source says: benefit percent, monthly cap, when it starts, definition of disability, portability. Leave a field out rather than guess, and never borrow from another hospital.
- Don't name the insurance company behind the hospital's group plan. Jay's agreement says not to mention other carriers. (Dartmouth, UAMS and UVA did; fixed in 5530b7b.)
- Source URL and the date it was checked. Jay reviews before the page goes live.

## Status

16 indexed, 21 noindex, 37 total.

| # | Hospital | Page | Status | Has | Missing | Source already found |
|---|---|---|---|---|---|---|
| 1 | Mayo Clinic (priority 1) | `/gsi/mayo-clinic/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 2 | Johns Hopkins Medicine (priority 2) | `/gsi/johns-hopkins-medicine/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 3 | Mass General Brigham (priority 3) | `/gsi/mass-general-brigham/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 4 | University of Pennsylvania (Penn) (priority 4) | `/gsi/university-of-pennsylvania-penn/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 5 | NYU Langone Health (priority 5) | `/gsi/nyu-langone-health/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 6 | Jefferson Health (priority 6) | `/gsi/jefferson-health/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 7 | Temple University (priority 7) | `/gsi/temple-university/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 8 | Hospital for Special Surgery (HSS) (priority 8) | `/gsi/hospital-for-special-surgery-hss/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 9 | Geisinger (priority 9) | `/gsi/geisinger/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 10 | Georgetown University (priority 10) | `/gsi/georgetown-university/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 11 | ChristianaCare | `/gsi/christianacare/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 12 | Einstein Healthcare Network (Philadelphia) | `/gsi/einstein-healthcare-network-philadelphia/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 13 | Inspira Health Network | `/gsi/inspira-health-network/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 14 | Lehigh Valley Health Network | `/gsi/lehigh-valley-health-network/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 15 | NewYork-Presbyterian Queens | `/gsi/newyork-presbyterian-queens/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 16 | Philadelphia College of Osteopathic Medicine (PCOM) | `/gsi/philadelphia-college-of-osteopathic-medicine-pcom/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 17 | Reading Hospital | `/gsi/reading-hospital/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 18 | Rutgers Health | `/gsi/rutgers-health/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 19 | St. Luke's University Health Network | `/gsi/st-lukes-university-health-network/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 20 | University of Cincinnati | `/gsi/university-of-cincinnati/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 21 | Virginia Health Sciences at Old Dominion University | `/gsi/virginia-health-sciences-at-old-dominion-university/` | noindex | nothing specific | group benefit or program-specific content; city | none yet |
| 22 | Albany Medical College | `/gsi/albany-medical-college/` | indexed | group benefit, city | - | https://www.amc.edu/wp-content/uploads/sites/3/2025/09/Housestaff-Appointment-Contract_protected.pdf |
| 23 | Baylor College of Medicine | `/gsi/baylor-college-of-medicine/` | indexed | group benefit, city | - | https://www.bcm.edu/education/school-of-medicine/graduate-medical-education/current-trainee-resources/stipends-and-benefits |
| 24 | Cooper University Hospital | `/gsi/cooper-university-hospital/` | indexed | program-specific, city | - | https://blogs.cooperhealth.org/lifeatthecoop/files/2023/09/Cooper-GSI.pdf |
| 25 | Corewell Health | `/gsi/corewell-health/` | indexed | group benefit, city | - | https://corewellhealth.org/graduate-medical-education/southeast-michigan/information-for-applicants/salary-and-benefits |
| 26 | Dartmouth Health | `/gsi/dartmouth-health/` | indexed | group benefit, city | - | https://www.dartmouth-health.org/graduate-medical-education/benefits/resident-fellow-benefits |
| 27 | Medical College of Wisconsin | `/gsi/medical-college-of-wisconsin/` | indexed | group benefit, city | - | https://www.mcw.edu/education/graduate-medical-education/mcwah-gme-residency-and-fellowship-programs/benefits-conditions-and-terms-of-employment |
| 28 | NewYork-Presbyterian / Columbia | `/gsi/newyork-presbyterian-columbia/` | indexed | group benefit, city | - | https://psychiatry.weill.cornell.edu/sites/default/files/2022_benefits_overview_nyp_hospital_gme_staff.pdf |
| 29 | NewYork-Presbyterian / Weill Cornell | `/gsi/newyork-presbyterian-weill-cornell/` | indexed | group benefit, city | - | https://psychiatry.weill.cornell.edu/sites/default/files/2022_benefits_overview_nyp_hospital_gme_staff.pdf |
| 30 | NewYork-Presbyterian Morgan Stanley Children's Hospital | `/gsi/newyork-presbyterian-morgan-stanley-childrens-hospital/` | indexed | group benefit, city | - | https://psychiatry.weill.cornell.edu/sites/default/files/2022_benefits_overview_nyp_hospital_gme_staff.pdf |
| 31 | Rush University | `/gsi/rush-university/` | indexed | group benefit, city | - | https://www.rushu.rush.edu/sites/default/files/2025-07/2025-26_House%20Staff%20Benefits%20Overview_GME_FINAL.pdf |
| 32 | University of Arkansas for Medical Sciences (UAMS) | `/gsi/university-of-arkansas-for-medical-sciences-uams/` | indexed | group benefit, city | - | https://hr.uams.edu/benefits/wp-content/uploads/sites/5/2021/10/Housestaff-Benefit-Summary-April-2026.pdf |
| 33 | University of Chicago | `/gsi/university-of-chicago/` | indexed | group benefit, city | - | https://gme.uchicago.edu/current-gme-handbook/long-and-short-term-disability-coverage-required |
| 34 | University of Rochester | `/gsi/university-of-rochester/` | indexed | group benefit, city | - | https://www.urmc.rochester.edu/education/graduate-medical-education/benefits-table |
| 35 | University of Virginia (UVA) | `/gsi/university-of-virginia-uva/` | indexed | group benefit, city | - | https://hr.virginia.edu/sites/default/files/PDFs/Leave/UNUM%20-%20353431%20-%20Housestaff%20LTD%20benefit%20summary%20eq.pdf.pdf |
| 36 | University of Wisconsin | `/gsi/university-of-wisconsin/` | indexed | group benefit, city | - | https://www.med.wisc.edu/education/graduate-medical-education/compensation-and-benefits/ |
| 37 | Washington University in St. Louis | `/gsi/washington-university-in-st-louis/` | indexed | group benefit, city | - | https://gme.wustl.edu/app/uploads/2026/02/Overview-of-Residency-Training-Programs-Final-BJH.SLCH_.MBMC-updated-policies-2026.pdf |

## Next (T11)

Research the noindex hospitals in priority order: Mayo Clinic, Johns Hopkins, Mass General Brigham, Penn, NYU Langone, Jefferson, Temple, HSS, Geisinger, Georgetown, then the rest. For each, look for the hospital's public GME benefits page or housestaff benefits PDF, record only what it says, and list the source. Pages stay noindex until Jay OKs the facts.

The other route to unlocking a page is something only Jay knows: does he lecture there, has he placed residents there, is there anything specific about the program. That's the `specific` block, and it's a question for Jay, not research.
