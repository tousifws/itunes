import { generateApiClient } from '@utils/apiUtils';
const itunesApi = generateApiClient('itunes');

export const getTracks = searchTerm => itunesApi.get(`/search?term=${searchTerm}`);
