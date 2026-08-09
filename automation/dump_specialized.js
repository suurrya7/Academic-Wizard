import { countrySubjects, countryCities } from '../src/data/specializedPages.js';
import fs from 'fs';

const data = { countrySubjects, countryCities };
fs.writeFileSync('automation/specialized.json', JSON.stringify(data, null, 2));
