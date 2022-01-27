import axios from "axios";
import queryString from "query-string";

let api;

if (!import.meta.env.MODE || import.meta.env.MODE === "development") {
  api = axios.create({
    baseURL: "/api",
  });
} else {
  api = axios.create({
    baseURL: "/api",
  });
}

const ProjectTypes = {
  FS: "Fish Stocking",
  IA: "Index Adult/Juvenile",
  IE: "Index Eggs",
  IL: "Index Larvae",
  IS: "Index Spawners",
  IM: "Index Migrants",
  SA: "Sport Activity",
  SD: "Sport Diary",
  SC: "Sport Creel",
  SF: "Sport Fish",
  SM: "Sport Mail",
  CH: "Commercial Harvest",
  CF: "Commercial Fish On-board catching sampling",
  CD: "Commercial Fish Dockside sampling",
  CP: "Commercial Fish Plant Sampling",
  TR: "Tag Report",
  TS: "Tag Summary",
  CC: "Contaminant Collections",
};

const spc_names = {
  "000": "multiple species",
  "010": "LAMPREYS",
  "011": "American brook lamprey",
  "012": "northern brook lamprey",
  "013": "silver lamprey",
  "014": "sea lamprey",
  "016": "chestnut lamprey",
  "020": "PADDLEFISHES",
  "021": "paddlefish",
  "030": "STURGEONS",
  "031": "lake sturgeon",
  "032": "caviar",
  "040": "GARS",
  "041": "longnose gar",
  "042": "spotted gar",
  "043": "gar",
  "044": "florida gar",
  "050": "BOWFINS",
  "051": "bowfin",
  "060": "HERRINGS",
  "061": "alewife",
  "062": "American shad",
  "063": "gizzard shad",
  "065": "blueback herring",
  "066": "skipback herring",
  "070": "SALMON and TROUT subfamily",
  "071": "pink salmon",
  "072": "chum salmon",
  "073": "coho salmon",
  "074": "sockeye salmon",
  "075": "chinook salmon",
  "076": "rainbow trout",
  "077": "Atlantic salmon",
  "078": "brown trout",
  "079": "Arctic char",
  "080": "brook trout",
  "081": "lake trout",
  "082": "splake",
  "083": "Aurora trout",
  "084": "Oncorhynchus sp.",
  "085": "Salmo sp.",
  "086": "lake trout / splake",
  "087": "lake trout backcross",
  "090": "WHITEFISH subfamily",
  "091": "lake whitefish",
  "092": "longjaw cisco",
  "093": "lake herring(cisco)",
  "094": "bloater",
  "095": "deepwater cisco",
  "096": "kiyi",
  "097": "blackfin cisco",
  "098": "Nipigon cisco",
  "099": "shortnose cisco",
  100: "shortjaw cisco",
  101: "pygmy whitefish",
  102: "round whitefish",
  103: "chub(deepwater chub)",
  106: "Coregonus sp.",
  107: "Prosopium sp.",
  110: "GRAYLING subfamily",
  111: "Arctic grayling",
  120: "SMELTS",
  121: "rainbow smelt",
  130: "PIKES",
  131: "northern pike",
  132: "muskellunge",
  133: "grass pickerel",
  134: "Esox sp.",
  135: "chain pickerel",
  140: "MUDMINNOWS",
  141: "central mudminnow",
  150: "MOONEYES",
  151: "goldeye",
  152: "mooneye",
  160: "SUCKERS",
  161: "quillback",
  162: "longnose sucker",
  163: "white sucker",
  164: "lake chubsucker",
  165: "northern hog sucker",
  166: "bigmouth buffalo",
  167: "spotted sucker",
  168: "silver redhorse",
  169: "black redhorse",
  170: "golden redhorse",
  171: "shorthead redhorse",
  172: "greater redhorse",
  173: "river redhorse",
  174: "black buffalo",
  175: "smallmouth buffalo",
  176: "Suckers sp.",
  177: "redhorse suckers",
  178: "buffalo sucker",
  180: "CARPS and MINNOWS",
  181: "goldfish",
  182: "northern redbelly dace",
  183: "finescale dace",
  184: "redside dace",
  185: "lake chub",
  186: "common carp",
  187: "gravel chub",
  188: "cutlips minnow",
  189: "brassy minnow",
  190: "eastern silvery minnow",
  191: "silver chub",
  192: "hornyhead chub",
  193: "river chub",
  194: "golden shiner",
  195: "pugnose shiner",
  196: "emerald shiner",
  197: "bridle shiner",
  198: "common shiner",
  199: "blackchin shiner",
  200: "blacknose shiner",
  201: "spottail shiner",
  202: "rosyface shiner",
  203: "spotfin shiner",
  204: "sand shiner",
  205: "redfin shiner",
  206: "mimic shiner",
  207: "pugnose minnow",
  208: "bluntnose minnow",
  209: "fathead minnow",
  210: "blacknose dace",
  211: "longnose dace",
  212: "creek chub",
  213: "fallfish",
  214: "pearl dace",
  215: "silver shiner",
  216: "central stoneroller",
  217: "striped shiner",
  218: "ghost shiner",
  219: "grass carp",
  220: "rudd",
  230: "CATFISHES",
  231: "black bullhead",
  232: "yellow bullhead",
  233: "brown bullhead",
  234: "channel catfish",
  235: "stonecat",
  236: "tadpole madtom",
  237: "brindled madtom",
  238: "margined madtom",
  239: "flathead catfish",
  243: "BULLHEADS",
  244: "northern madtom",
  250: "FRESHWATER EELS",
  251: "American eel",
  260: "KILLIFISHES",
  261: "banded killifish",
  262: "blackstripe topminnow",
  270: "CODS",
  271: "burbot",
  280: "STICKLEBACKS",
  281: "brook stickleback",
  282: "threespine stickleback",
  283: "ninespine stickleback",
  284: "fourspine stickleback",
  290: "TROUT - PERCHES",
  291: "trout - perch",
  300: "TEMPERATE BASSES",
  301: "white perch",
  302: "white bass",
  304: "striped bass",
  310: "SUNFISHES",
  311: "rock bass",
  312: "green sunfish",
  313: "pumpkinseed",
  314: "bluegill",
  315: "longear sunfish",
  316: "smallmouth bass",
  317: "largemouth bass",
  318: "white crappie",
  319: "black crappie",
  320: "SUNFISH",
  321: "Micropterus sp.",
  322: "CRAPPIE",
  323: "warmouth",
  324: "orangespotted sunfish",
  330: "PERCHES",
  331: "yellow perch",
  332: "sauger",
  333: "blue pike",
  334: "walleye",
  335: "eastern sand darter",
  336: "greenside darter",
  337: "rainbow darter",
  338: "Iowa darter",
  339: "fantail darter",
  340: "least darter",
  341: "johnny darter",
  342: "logperch",
  343: "channel darter",
  344: "blackside darter",
  345: "river darter",
  346: "tessellated darter",
  350: "ruffe",
  351: "johnny darter",
  360: "SILVERSIDES",
  361: "brook silverside",
  365: "GOBIES",
  366: "round goby",
  367: "tubenose goby",
  370: "DRUMS",
  371: "freshwater drum",
  380: "SCULPINS",
  381: "mottled sculpin",
  382: "slimy sculpin",
  383: "spoonhead sculpin",
  384: "deepwater sculpin",
  387: "fourhorn sculpin",
  390: "LUMPFISHES",
  391: "lumpfish",
  400: "SALMON hybrids",
  420: "SALMON and TROUT hybrids",
  450: "WHITEFISH hybrids",
  460: "red - bellied pacu",
  471: "royal panaque",
  472: "amazon sailfish catfish",
  473: "pterygoplichthys sp.",
  480: "Cichlidae sp.",
  481: "oscar",
  482: "jaguar guapote",
  500: "PIKE hybrids",
  550: "SUCKER hybrids",
  600: "CARP and MINNOW hybrids",
  630: "western blacknose dace",
  631: "silver carp",
  632: "bighead carp",
  633: "black carp",
  650: "CATFISH hybrids",
  700: "SUNFISH hybrids",
  750: "PERCH hybrids",
  751: "saugeye",
  800: "SCULPIN hybrids",
};

export async function getProjects(source, filters) {
  const data = api
    .get(`/${source}/projects/`, {
      params: filters,
      paramsSerializer: (params) =>
        queryString.stringify(params, { arrayFormat: "comma" }),
    })

    .then((response) => response.data);

  return data;
}

export const getFN011Filters = (source) => {
  return api.get(`/${source}/project_filters/`).then((res) => {
    const { fof, project_types, suffixes, years } = res.data;

    const _fof = fof.map((x) => ({ value: x, label: `${x}_*` }));
    const _project_types = project_types.map((x) => ({
      value: x,
      label: ProjectTypes[x] ? `${ProjectTypes[x]} (${x})` : `Other (${x})`,
    }));
    const _suffixes = suffixes.map((x) => ({ value: x, label: `*_${x}` }));

    const _years = years.map((x) => ({
      value: x,
      label: parseInt(x) < 50 ? "20" + x : "19" + x,
    }));

    _years.sort((a, b) => a.label - b.label);

    return {
      fof: _fof,
      project_type: _project_types,
      prj_cd_suffix: _suffixes,
      years: _years,
    };
  });
};

export const getProjectDetail = (source, project_code) =>
  api.get(`/${source}/project_detail/${project_code}/`).then((res) => res.data);

export const get_fn_data = (source, project_code, table, filters) =>
  api
    .get(`/${source}/${project_code}/${table}/`, {
      params: filters,
      paramsSerializer: (params) =>
        queryString.stringify(params, { arrayFormat: "comma" }),
    })
    .then((res) => res.data);

export const getFN121Filters = (source, project_code) =>
  api.get(`/${source}/${project_code}/fn121/choices/`).then((res) => {
    const { stratum, fn022, fn026, fn028 } = res.data;

    const stratum__in = stratum.map((x) => ({
      value: x.STRATUM || "",
      label: x.STRATUM,
    }));

    const ssn = fn022.map((x) => ({
      value: x.SSN || "",
      label: `${x.SSN_DES} (${x.SSN})`,
    }));
    const space = fn026.map((x) => ({
      value: x.SPACE || "",
      label: `${x.SPACE_DES} (${x.SPACE})`,
    }));

    const mode = fn028.map((x) => ({
      value: x.MODE || "",
      label: `${x.MODE_DES} (${x.MODE})`,
    }));

    return { stratum__in, ssn, space, mode };
  });

export const getFN123Filters = (source, project_code) =>
  api.get(`/${source}/${project_code}/fn123/choices/`).then((res) => {
    const { sams, effs, species, grps, stratum, fn022, fn026, fn028 } =
      res.data;

    const sam = sams.map((x) => ({ value: x || "", label: x }));
    const eff = effs.map((x) => ({ value: x || "", label: x }));
    const grp = grps.map((x) => ({ value: x || "", label: x || "Unknown" }));
    const spc = species.map((x) => ({
      value: x || "",
      label: spc_names[x] ? `${spc_names[x]} (${x})` : `${x}`,
    }));

    const stratum__in = stratum.map((x) => ({
      value: x.STRATUM || "",
      label: x.STRATUM,
    }));

    const ssn = fn022.map((x) => ({
      value: x.SSN || "",
      label: `${x.SSN_DES} (${x.SSN})`,
    }));
    const space = fn026.map((x) => ({
      value: x.SPACE || "",
      label: `${x.SPACE_DES} (${x.SPACE})`,
    }));

    const mode = fn028.map((x) => ({
      value: x.MODE || "",
      label: `${x.MODE_DES} (${x.MODE})`,
    }));

    return { sam, eff, spc, grp, stratum__in, ssn, space, mode };
  });

export const getFN125Filters = (source, project_code) =>
  api.get(`/${source}/${project_code}/fn125/choices/`).then((res) => {
    const { sams, effs, species, grps, stratum, fn022, fn026, fn028 } =
      res.data;

    const sam = sams.map((x) => ({ value: x || "", label: x }));
    const eff = effs.map((x) => ({ value: x || "", label: x }));
    const grp = grps.map((x) => ({ value: x || "", label: x || "Unknown" }));
    const spc = species.map((x) => ({
      value: x || "",
      label: spc_names[x] ? `${spc_names[x]} (${x})` : `${x}`,
    }));

    const stratum__in = stratum.map((x) => ({
      value: x.STRATUM || "",
      label: x.STRATUM,
    }));

    const ssn = fn022.map((x) => ({
      value: x.SSN || "",
      label: `${x.SSN_DES} (${x.SSN})`,
    }));
    const space = fn026.map((x) => ({
      value: x.SPACE || "",
      label: `${x.SPACE_DES} (${x.SPACE})`,
    }));

    const mode = fn028.map((x) => ({
      value: x.MODE || "",
      label: `${x.MODE_DES} (${x.MODE})`,
    }));

    return { sam, eff, spc, grp, stratum__in, ssn, space, mode };
  });

//===================================================
// field stats:

export const getTables = (projectType) =>
  api.get(`/${projectType}/tables`).then((res) => res.data);

export const getTableFields = (projectType, tablename) =>
  api.get(`/${projectType}/${tablename}/fields`).then((res) => res.data);

export const getFieldStats = (projectType, tablename, fieldname) =>
  api
    .get(`/field_stats/${projectType}/${tablename}/${fieldname}/`)
    .then((res) => res.data);
